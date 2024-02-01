import { SubscribeMessage, 
  WebSocketGateway, 
  OnGatewayInit, 
  ConnectedSocket, 
  OnGatewayConnection, 
  OnGatewayDisconnect, 
  WebSocketServer
} from '@nestjs/websockets';
import { GameService } from './game.service';
import { Socket, Server, RemoteSocket} from 'socket.io';
import { Logger } from '@nestjs/common';
import { Ball } from "./classes/Ball";
import { Player } from "./classes/Player";
import { GAME_INTERVAL, GAME_START_DELAY, HEIGHT, WIDTH } from './classes/constants';
import { gameConfig } from './classes/gameConfig';
import { JwtTwoFaStrategy } from 'src/strategy';


@WebSocketGateway({cors: true})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private gameService: GameService, private strategy: JwtTwoFaStrategy) {}

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
    await this.verifyClient(client);
    this.logger.log(`Client ${client.id} connected`);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.log(`Client ${client.id} disconnected`);
    this.gameService.disconnectPlayer(this.wss, client);
  }

  @SubscribeMessage('create_room')
  createRoom(client: Socket, config: gameConfig)
  {
    this.logger.log(`Client ${client.id} wants to create a room`);
    this.logger.log(config);
    this.configs.set(client.id, config);
    this.gameService.waitingPlayers.push(client);
  }

  @SubscribeMessage('cancele')
  cancele(client: Socket) {
    this.configs.delete(client.id);
    this.gameService.waitingPlayers = this.gameService.waitingPlayers.filter((player) => player.id !== client.id);
  }

  @SubscribeMessage('join_room')
  async joinRoom(client: Socket) {
    if (this.gameService.waitingPlayers.length > 0) {
      const opponent = this.gameService.waitingPlayers.shift();
      if (opponent && opponent.id !== client.id) {
        await this.gameService.initGame(this.wss, client, opponent, this.configs.get(opponent.id));
        this.wss.to(client.id).emit('startGame');
        this.wss.to(opponent.id).emit('startGame');
      }
    } else {
      this.logger.log(`No games found for ${client.id}`);
      this.wss.emit('NoGames');
    }
  }

  @SubscribeMessage('userName')
  async setUser(client: Socket, userName: string) {
    const user = await this.gameService.setUser(client, userName);
    if (user)
      this.wss.to(client.id).emit('userId', user.id);
  }

  @SubscribeMessage('createGame')
  async createGame(client: Socket, payload: any) {
    const user1 = await this.gameService.setUser(client, payload.user1);
    const user2 = await this.gameService.setUser(client, payload.user2);
    if (user1 && user2) {
      this.logger.log(`${user1.username} (${user1.socket}) Challenges ${user2.username} (${user2.socket})`);
      this.logger.log(user2.socket);
      const sockets = await this.wss.in(user2.socket).fetchSockets();
      let oppSocket: any;
      for (const socket of sockets) {
        if (socket.id === user2.socket) {
          oppSocket = socket;
          this.logger.log('socket Found');
        }
      }
      if (oppSocket) {
        await this.gameService.initGame(this.wss, client, oppSocket, payload.config);
        this.wss.to(client.id).emit('startGame');
        this.wss.to(oppSocket.id).emit('startGame');
      }
      else {
        this.wss.to(client.id).emit('CannotStartGame');
        this.logger.log('Opp socket Not found');
      }
    }
  }

  @SubscribeMessage('VsComputer')
  VsComputer(client: Socket, payload: any) {
    this.logger.log(`Client ${client.id} wants to play against computer`);
  }

  @SubscribeMessage('VsComputerGameOver')
  gameOverVsComputer(client: Socket) {
    this.logger.log(`Client ${client.id} Vs Computer game ended`);
  }

  @SubscribeMessage('1Vs1 on same device')
  oneVsOne(client: Socket, payload: any) {
    this.logger.log(`Client ${client.id} wants to play 1Vs1 on same device`);
  }

  @SubscribeMessage('gameOver')
  gameOverHandler(client: Socket) {
    this.gameService.gameOver(this.wss, client);
  }

  @SubscribeMessage('updateRacket')
  updateRacket(client: Socket, payload: any) {
    this.gameService.updateRacketPos(client, payload.racketY, payload.canvasHeight);
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
  async verifyClient(client: Socket) {
		try {
			const token = client.handshake.headers.cookie.split('jwt=')[1];
			const payload = await this.strategy.verifyToken(token);
            const user = await this.strategy.validate(payload)
            if (!user)
                throw new Error('invalid token');
			return (user);
		}
		catch (error) {
			client.disconnect();
		}
	}

  @SubscribeMessage('acceptInvite')
  acceptInvite(client: Socket, payload: any) {
    this.logger.log(`Client ${client.id} accepted invite`);
  }

  @SubscribeMessage('windowResized')
  windowResize(client: Socket, payload: any) {
    this.logger.log(`Client ${client.id} resized window`);
    /*let game = this.gameService.games.get(payload.roomName);
    if (game) {
      game.config.canvasWidth = payload.canvasWidth;
      game.config.canvasHeight = payload.canvasHeight;
      game.player2.racket.x = payload.canvasWidth - 30;
    }*/
  }
}
