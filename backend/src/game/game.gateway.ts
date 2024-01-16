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
import { Prisma } from '@prisma/client';

const HEIGHT = 450;
const WIDTH = 700;
const INITIAL_SPEED = 8;
const GAME_START_DELAY = 3000;
const GAME_INTERVAL = 1000/60;

@WebSocketGateway({cors: true})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private gameService: GameService,
    private userService: UserService,
    private prismaService: PrismaService) {}

  private logger: Logger = new Logger('GameGateway');

  @WebSocketServer() wss: Server;
  users: Map<string, User> = new Map();
  
  afterInit() {
    this.logger.log("Initialized!");
    setInterval(() => {
      this.gameService.games.forEach(async (game) => {
        await this.gameService.gameLoop(this.wss, game.ball, game.player1, game.player2);
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

  @SubscribeMessage('join_room')
  async joinRoom(@ConnectedSocket() client: Socket, payload: any) {
    if (this.gameService.waitingPlayers.length > 0) {
      // Initialize the game for these two players
      this.gameService.initGame(this.wss, client);
    } else {
      // If there are no players waiting, add the new player to the queue
      this.gameService.waitingPlayers.push(client);
      this.logger.log(`Client ${client.id} added to the waiting queue`);
    }
  }

  @SubscribeMessage('userName')
  setUser(client: Socket, userName: string) {
    this.gameService.setUser(client, userName);
  }

  @SubscribeMessage('VsComputer')
  VsComputer(client: Socket) {
    this.logger.log(`Client ${client.id} wants to play against computer`);
    let player1 = new Player(this.gameService.getUser(client), 10, HEIGHT / 2, 0, client.id);
    let player2 = new Player({id: -1, username: 'Computer', socket: ""}, WIDTH - 30, HEIGHT / 2, 0, client.id);
    let ball = new Ball(WIDTH / 2, HEIGHT / 2, 1, 0, INITIAL_SPEED);
    this.wss.to(client.id).emit('initGame', {side: 1, player1: player1, player2: player2, ball: ball});
  }

  @SubscribeMessage('VsComputerGameOver')
  gameOverVsComputer(client: Socket) {
    this.logger.log(`Client ${client.id} Vs Computer game ended`);
    // this.wss.to(client.id).emit('gameOver');
  }

  @SubscribeMessage('1Vs1 on same device')
  oneVsOne(client: Socket) {
    this.logger.log(`Client ${client.id} wants to play 1Vs1 on same device`);
    let player1 = new Player(this.gameService.getUser(client), 10, HEIGHT / 2, 0, client.id);
    let player2 = new Player({id: -1, username: "Player2", socket: ""}, WIDTH - 30, HEIGHT / 2, 0, client.id);
    let ball = new Ball(WIDTH / 2, HEIGHT / 2, 1, 0, INITIAL_SPEED);
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
}
