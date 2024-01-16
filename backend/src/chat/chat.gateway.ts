import {
	ConnectedSocket,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatService } from "./chat.service";
import { MESSAGE, NEWCHAT } from "./myTypes";
import { Logger, Req, UseGuards } from "@nestjs/common";
import JwtTwoFaGuard from "src/auth/guard/twoFaAuth.guard";
import { AuthService } from "src/auth/auth.service";
import { notifDto } from "src/auth/dto/notif.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtTwoFaStrategy } from "src/strategy";
import { UserService } from "src/user/user.service";
import { Player } from "src/game/classes/player";
import { Ball } from "src/game/classes/ball";
import { gameLoop } from "src/game/gameLogic";

const HEIGHT = 450;
const WIDTH = 700;
const INITIAL_SPEED = 8;
const GAME_START_DELAY = 3000;
const GAME_INTERVAL = 1000/40;

@WebSocketGateway({ cors: {
	origin: 'http://localhost:3000',
    credentials: true
} })
export class ChatGateway implements
OnGatewayConnection,
OnGatewayDisconnect {
	constructor(private chatService: ChatService, 
				private prisma: PrismaService, 
				private strategy: JwtTwoFaStrategy,
				private user: UserService) {}
	@WebSocketServer() server: Server
	@SubscribeMessage("server")
	async handelMessage(client: Socket, data: MESSAGE) {
		const room = this.chatService.getRoom(data);
		const message = await this.chatService.addMessage(data);
		this.server
		.to(room)
		.emit("client", message);
	}
	@SubscribeMessage("newChat")
	async handelNewChat(client: Socket, data: NEWCHAT) {
		Array
			.from(client.rooms)
			.slice(1)
			.forEach(room => client.leave(room));
		const room = this.chatService.getRoom(data);
		client.join(room);
	}
	@SubscribeMessage("newUser")
	async handelUser(client: Socket, data: string) {
		const recver = await this.chatService.newMessage(data);
		this.server
			.to(recver)
			.emit("newuser");
	}
	handleConnection(client: Socket) {
    this.logger.log("Client " + client.id + " Connected!");
        // console.log("test");
		// console.log(client.handshake.headers.cookie);
	}
	async handleDisconnect(client: Socket) {
		Array
			.from(client.rooms)
			.slice(1)
			.forEach(room => client.leave(room));
        const	user = await this.chatService.dropUser(client);
		// const {username, state} = await this.verifyClient(client);
		if (user)
			client.broadcast.emit("online", {
				username: user.username,
				state: user.state
			});
		    const player = this.players.get(client.id);
    if (player) {
      // Notify the other player in the room that their opponent has disconnected
      this.server.to(player.roomName).emit('opponentDisconnected');
      
      // Remove the clients from the room
      this.server.in(player.roomName).socketsLeave(player.roomName);
      // End the game
      this.games.delete(player.roomName);
    }
    this.waitingPlayers = this.waitingPlayers.filter(player => player.id !== client.id);
    this.players.delete(client.id);		
	}



	////////
	////////
	@SubscribeMessage('addnotification')
	async handleNotification(client: Socket, payload: notifDto) {
		try {	
			const {id} = await this.verifyClient(client);
	  		const reciever = await this.prisma.user.findUnique({
			where: {username: payload.reciever},
			select: {id: true, socket: true}
	  		})
	  		await this.user.addNotification(id, payload);
	  		client.to(reciever.socket).emit('getnotification', 'hello');
		} catch(error)
		{
			client.emit('error');
		}
	}
	@SubscribeMessage("state")
    async handleOnline(client: Socket) {
		try {
			const {username, state} = await this.verifyClient(client);
        	client.broadcast.emit("online", {username, state});
		} catch(error)
		{
			client.emit('error');
		}
    }
	async verifyClient(client: Socket) {
		try {
			const token = client.handshake.headers.cookie.split('jwt=')[1];
			const payload = await this.strategy.verifyToken(token);
			return (await this.strategy.validate(payload));
		}
		catch (error) {
			client.emit('error', 'invalid token');
		}
	}



	//////GAME
	private players: Map<string, Player> = new Map();
  private waitingPlayers: Socket[] = [];
  private games: Map<string, {ball: Ball, player1: Player, player2: Player}> = new Map();
  private logger: Logger = new Logger('GameGateway');

  afterInit() {
    this.logger.log("Initialized!");
    setInterval(() => {
      this.games.forEach((game) => {
        gameLoop(this.server, game.ball, game.player1, game.player2);
      });
    }, GAME_INTERVAL);
  }
  
  async findOpponent(opponent: string)
  {
      const user = await this.prisma.user.findUnique({
        where: {
          socket: opponent
        }
      })
      //console.log(user);
      return user;
  }

  
  @SubscribeMessage('join_room')
  async joinRoom(@ConnectedSocket() client: Socket, payload: any) {
    if (this.waitingPlayers.length > 0) {
      // If there are players waiting, match the new player with the first one in the queue
      const opponent = this.waitingPlayers.shift();
      const roomName = `room${client.id}${opponent.id}`; // Create a unique room name
      
      const {id: clientid} = await this.verifyClient(client);
      const {id: oppid} = await this.findOpponent(opponent.id);
      console.log(oppid);
      this.server.to(client.id).emit("getData", oppid, false);
      this.server.to(opponent.id).emit("getData", clientid, true);
      client.join(roomName);
      opponent.join(roomName);
      
      this.logger.log(`Clients ${client.id} and ${opponent.id} joined ${roomName}`);
      // Initialize the game for these two players
      this.initGame(opponent.id, client.id, roomName, clientid, oppid);
    } else {
      // If there are no players waiting, add the new player to the queue
      this.waitingPlayers.push(client);
      this.logger.log(`Client ${client.id} added to the waiting queue`);
    }
  }

  @SubscribeMessage('VsComputer')
  async VsComputer(client: Socket) {
    this.logger.log(`Client ${client.id} wants to play against computer`);
    const {id} = await this.verifyClient(client);
    let player1 = new Player(client.id, 10, HEIGHT / 2, 0, client.id, id);
    let player2 = new Player('computer', WIDTH - 30, HEIGHT / 2, 0, client.id, id);
    let ball = new Ball(WIDTH / 2, HEIGHT / 2, 1, 0, INITIAL_SPEED);
    this.server.to(client.id).emit('initGame', {side: 1, player1: player1, player2: player2, ball: ball});
  }

  @SubscribeMessage('VsComputerGameOver')
  gameOverVsComputer(client: Socket) {
    this.logger.log(`Client ${client.id} Vs Computer game ended`);
    // this.server.to(client.id).emit('gameOver');
  }

  @SubscribeMessage('1Vs1 on same device')
  async oneVsOne(client: Socket) {
    const {id} = await this.verifyClient(client);
    this.logger.log(`Client ${client.id} wants to play 1Vs1 on same device`);
    let player1 = new Player(client.id, 10, HEIGHT / 2, 0, client.id, id);
    let player2 = new Player(client.id, WIDTH - 30, HEIGHT / 2, 0, client.id, id);
    let ball = new Ball(WIDTH / 2, HEIGHT / 2, 1, 0, INITIAL_SPEED);
    this.server.to(client.id).emit('initGame', {side: 1, player1: player1, player2: player2, ball: ball});
  }

//   async addMatchHistory(client: Socket, game: {
//     ball: Ball,
//     player1: Player,
//     player2: Player,
// }, score)
//  {
//     // if (game.player1.id == client.id && score.score1 > score.score2)
//       console.log("in add match history");
//       const oppenentId = client.id === game.player1.id ? game.player2.id : game.player1.id
//       const {id} = await this.verifyClient(client);
//       const {username} = await this.findOpponent(oppenentId);
//       this.user.addMatchHistory(id, {name: username, 
//         playerScore: Math.max(score.score1, score.score2), 
//         player2Score: Math.min(score.score1, score.score2), 
//       }); 
//  }
  @SubscribeMessage('gameOver')
  async gameOver(client: Socket, score ) {
    const player = this.players.get(client.id);
    if (player) {
      console.log(score);
      const game = this.games.get(player.roomName);
      client.to(player.roomName).emit('gameOver');
      this.logger.log(`Game ${game.player1.id} Vs ${game.player2.id} ended!`);
      if (game) {
        this.games.delete(player.roomName);
        this.players.delete(game.player1.id);
        this.players.delete(game.player2.id);
        this.server.to(player.roomName).socketsLeave(player.roomName);
      }
    }
    else
      this.logger.log(`Client ${client.id} Vs Computer game ended`);
  }


  @SubscribeMessage('updateRacket')
  updateRacketPos(client: Socket, racketY: number) {
    let player = this.players.get(client.id);
    if (player) {
      client.broadcast.to(player.roomName).emit('updateRacket', racketY);
      player.racket.y = racketY;
    }
  }

  @SubscribeMessage('updateBall')
  updateBall(client: Socket, ballPos: any)
  {
    let player = this.players.get(client.id);
    if (player)
      client.to(player.roomName).emit('updateBall', ballPos);
  }

  private initGame(client1Id: string, client2Id: string, roomName: string, clientid: number, oppid: number)
  {
    this.waitingPlayers = this.waitingPlayers.filter(player => {
      player.id !== client1Id && player.id !== client2Id
    });
  
    let player1 = new Player(client1Id, 10, HEIGHT / 2, 0, roomName, clientid);
    let player2 = new Player(client2Id, WIDTH - 30, HEIGHT / 2, 0, roomName, oppid);
    let ball = new Ball(WIDTH / 2, HEIGHT / 2, 1, 0, INITIAL_SPEED);
    
    this.server.to(client1Id).emit('initGame', {side: 1, player1: player1, player2: player2, ball: ball});
    this.server.to(client2Id).emit('initGame', {side: 2, player1: player1, player2: player2, ball: ball});
    this.players.set(client1Id, player1);
    this.players.set(client2Id, player2);
    
    player1 = this.players.get(client1Id);
    player2 = this.players.get(client2Id);
    this.server.to(roomName).emit('gameStart');
    setTimeout(() => {
      this.games.set(roomName, {ball, player1, player2});
    }, GAME_START_DELAY);
  }
}
