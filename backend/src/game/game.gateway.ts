import { SubscribeMessage, 
  WebSocketGateway, 
  OnGatewayInit, 
  ConnectedSocket, 
  OnGatewayConnection, 
  OnGatewayDisconnect, 
  WebSocketServer
} from '@nestjs/websockets';
import { GameService } from './game.service';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { Ball } from "./classes/ball";
import { User, Player } from "./classes/player";
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtTwoFaStrategy } from 'src/strategy';
import { GAME_INTERVAL, GAME_START_DELAY, HEIGHT, WIDTH, INITIAL_SPEED, gameConfig } from './classes/constants';

@WebSocketGateway({cors: true})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private gameService: GameService) {}

  private logger: Logger = new Logger('GameGateway');

  @WebSocketServer() wss: Server;
  configs: Map<string, gameConfig> = new Map();
  
  afterInit() {
    this.logger.log("Initialized!");
    setInterval(() => {
      this.gameService.games.forEach(async (game) => {
        if (game.gameStart) {
          await this.gameService.gameLoop(this.wss, game.ball, game.player1, game.player2, game.config);
        }
      });
    }, GAME_INTERVAL);
  }
  
  async handleConnection(@ConnectedSocket() client: Socket) {
    this.logger.log(`Client ${client.id} connected`);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.log(`Client ${client.id} disconnected`);
    this.gameService.disconnectPlayer(this.wss, client);
  }

  @SubscribeMessage('create_room')
  createRoom(client: Socket, payload: any)
  {
    this.logger.log(`Client ${client.id} wants to create a room`);
    this.logger.log(payload);
    this.configs.set(client.id, new gameConfig(payload.maxScore, payload.ballSpeed, payload.boost));
    this.gameService.waitingPlayers.push(client);
  }

  @SubscribeMessage('join_room')
  async joinRoom(client :Socket, payload: any) {
    if (this.gameService.waitingPlayers.length > 0) {
      const opponent = this.gameService.waitingPlayers.shift();
      if (opponent) {
        await this.gameService.initGame(this.wss, client, opponent, this.configs.get(opponent.id));
        this.wss.to(client.id).emit('startGame');
        this.wss.to(opponent.id).emit('startGame');
      }
    } else {
      // If there are no players waiting, add the new player to the queue
      this.gameService.waitingPlayers.push(client);
      this.logger.log(`Client ${client.id} added to the waiting queue`);
    }
  }

  @SubscribeMessage('userName')
  async setUser(client: Socket, userName: string) {
    const user = await this.gameService.setUser(client, userName);
    if (user)
      this.wss.to(client.id).emit('userId', user.id);
  }

  @SubscribeMessage('VsComputer')
  VsComputer(client: Socket, payload: any) {
    this.logger.log(`Client ${client.id} wants to play against computer`);
    let player1 = new Player(this.gameService.getUser(client), 10, HEIGHT / 2, 0, client.id);
    let player2 = new Player({id: -1, username: 'Computer', socket: ""}, WIDTH - 30, HEIGHT / 2, 0, client.id);
    let ball = new Ball(WIDTH / 2, HEIGHT / 2, 1, 0, payload.ballSpeed);
    this.wss.to(client.id).emit('initGame', {side: 1, player1: player1, player2: player2, ball: ball});
  }

  @SubscribeMessage('VsComputerGameOver')
  gameOverVsComputer(client: Socket) {
    this.logger.log(`Client ${client.id} Vs Computer game ended`);
    // this.wss.to(client.id).emit('gameOver');
  }

  @SubscribeMessage('1Vs1 on same device')
  oneVsOne(client: Socket, payload: any) {
    this.logger.log(`Client ${client.id} wants to play 1Vs1 on same device`);
    let player1 = new Player(this.gameService.getUser(client), 10, HEIGHT / 2, 0, client.id);
    let player2 = new Player({id: -1, username: "Player2", socket: ""}, WIDTH - 30, HEIGHT / 2, 0, client.id);
    let ball = new Ball(WIDTH / 2, HEIGHT / 2, 1, 0, payload.ballSpeed);
    this.wss.to(client.id).emit('initGame', {side: 1, player1: player1, player2: player2, ball: ball});
  }

  @SubscribeMessage('gameOver')
  gameOverHandler(client: Socket) {
    this.gameService.gameOver(this.wss, client);
  }

  @SubscribeMessage('updateRacket')
  updateRacket(client: Socket, racketY: number) {
    this.gameService.updateRacketPos(client, racketY);
  }

  @SubscribeMessage('ready')
  ready(client: Socket) {
    let player = this.gameService.players.get(client.id);
    if (player) {
      player.ready = true;
      let game = this.gameService.games.get(player.roomName);
      if (game && game.player1.ready && game.player2.ready) {
        this.wss.to(game.player1.user.socket).emit('initGame', {side: 1, player1: game.player1, player2: game.player2, ball: game.ball});
        this.wss.to(game.player2.user.socket).emit('initGame', {side: 2, player1: game.player1, player2: game.player2, ball: game.ball});
        this.wss.to(player.roomName).emit('gameStart');
        setTimeout(() => {
          game.gameStart = true;
          this.logger.log(`Game ${game.player1.user.username} Vs ${game.player2.user.username} started`);
        }, GAME_START_DELAY);
      }
      this.logger.log(`Client ${client.id} is ready`);
    }
  }
}
