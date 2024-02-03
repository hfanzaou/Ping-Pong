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

  @SubscribeMessage('leaveGame')
  leaveGame(client: Socket) {
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
    const player = this.gameService.players.get(client.id);
    if (player)
    {
      const game = this.gameService.games.get(player.roomName);
      if (game) {
        if (game.player1.user.id === player.user.id) {
          this.gameService.players.delete(game.player1.user.socket);
        }
        else {
          this.gameService.players.delete(game.player2.user.socket);
        }
        // this.gameService.players.delete(game.player2.user.socket);
        this.gameService.games.delete(player.roomName);
        this.logger.log(`${player.user.username} canceled game with ${game.player2.user.username}`);
      }
    }
  }

  @SubscribeMessage('join_room')
  async joinRoom(client: Socket) {
    if (this.gameService.waitingPlayers.length > 0) {
      const opponent = this.gameService.waitingPlayers.shift();
      if (opponent && opponent.id !== client.id) {
        const config = this.configs.get(opponent.id);
        await this.gameService.initGame(this.wss, client, opponent, config);
        this.configs.delete(opponent.id);
        this.wss.to(client.id).emit('startGame', config);
        this.wss.to(opponent.id).emit('startGame', config);
      }
    } else {
      this.logger.log(`No games found for ${client.id}`);
      this.wss.emit('NoGames');
    }
  }

  @SubscribeMessage('userName')
  async _setUser(client: Socket, payload: any) {
    this.logger.log(`Client ${client.id} wants to set username to ${payload.username}`);
    const user = await this.gameService.setUser(client, payload.username, false);
    if (user)
      this.wss.to(client.id).emit('userId', user.id);
    else
      this.logger.log(`User ${payload.userName} not found`);
  }

  @SubscribeMessage('createGame')
  async createGame(client: Socket, payload: any) {
    this.logger.log(payload);
    const user1 = await this.gameService.setUser(client, payload.userName, false);
    const user2 = await this.gameService.setUser(client, payload.oppName, true);
    if (user1 && user2) {
      this.logger.log(`${user1.username} (${user1.socket}) Challenges ${user2.username} (${user2.socket})`);
      const sockets = await this.wss.in(user2.socket).fetchSockets();
      let oppSocket: any = null;
      for (const socket of sockets) {
        if (socket.id === user2.socket) {
          oppSocket = socket;
          this.logger.log('socket Found' + oppSocket.id);
        }
      }
      if (oppSocket) {
        await this.gameService.initGame(this.wss, oppSocket, client, payload.config);
      }
      else {
        this.wss.to(client.id).emit('CannotStartGame', 'Opp socket Not found');
      }
    }
    else {
      this.wss.to(client.id).emit('CannotStartGame', 'User Not found');
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
      this.logger.log(`Player ${player.user.username} is ready`);
      player.ready = true;
      let game = this.gameService.games.get(player.roomName);
      if (game && game.player1.ready && game.player2.ready) {
        this.wss.to(game.player1.user.socket).emit('getData', game.player2.user.id, true);
        this.wss.to(game.player2.user.socket).emit('getData', game.player1.user.id, false);
        this.wss.to(game.player1.user.socket).emit('initGame', {side: 1, player1: game.player1, player2: game.player2, ball: game.ball});
        this.wss.to(game.player2.user.socket).emit('initGame', {side: 2, player1: game.player1, player2: game.player2, ball: game.ball});
        this.wss.to(player.roomName).emit('gameStart');
        setTimeout(() => {
          game.gameStart = true;
          this.logger.log(`Game ${game.player1.user.username} Vs ${game.player2.user.username} started`);
        }, GAME_START_DELAY);
      }
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
  async acceptInvite(client: Socket) {
    this.logger.log(`Client ${client.id} accepted invite`);
    let player = this.gameService.players.get(client.id);
    if (player) {
        let game = this.gameService.games.get(player.roomName);
        if (game) {
          this.wss.to(game.player1.user.socket).emit('startGame', game.config);
          this.wss.to(game.player2.user.socket).emit('startGame', game.config);
        }
        else {
          this.wss.to(client.id).emit('CannotStartGame', 'Game Not found');
          this.logger.log('Game Not found');
        }
    }
    else {
        this.wss.to(client.id).emit('CannotStartGame', 'Player Not found');
        this.logger.log('Player Not found');
    }
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
