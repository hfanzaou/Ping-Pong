import { Injectable, Logger } from "@nestjs/common";
import { UserService } from '../user/user.service';
import { Ball } from "./classes/ball";
import { User, Player } from "./classes/player";
import { Server, Socket } from 'socket.io';
import { PrismaService } from "src/prisma/prisma.service";
import { JwtTwoFaStrategy } from "src/strategy";

const HEIGHT = 450;
const WIDTH = 700;
const RACKET_WIDTH = 15;
const RACKET_HEIGHT = 100;
const MAX_SPEED = 50;
const INITIAL_SPEED = 8;
const INC_SPEED = 0.75;
const MAX_SCORE = 10;
const BALL_DIAMETER = 15;
const BALL_DIAMETER_SQUARED = BALL_DIAMETER * BALL_DIAMETER;
const GAME_START_DELAY = 3000;

let goalScored: boolean = false;

@Injectable()
export class GameService {
  constructor(private userService: UserService,
    private prismaService: PrismaService,
    private strategy: JwtTwoFaStrategy) {}

  private logger: Logger = new Logger('GameService');
  users: Map<string, User> = new Map();
  players: Map<string, Player> = new Map();
  waitingPlayers: Socket[] = [];
  games: Map<string, {ball: Ball, player1: Player, player2: Player}> = new Map();

  async setUser(client: Socket, userName: string) {
    const	userData = await this.prismaService.user.findUnique({
			where: { username: userName }
    });
  
    if (userData) {
      const user = new User(userData.id, userName, client.id);
      this.users.set(client.id, user);
      this.logger.log(`Client ${client.id} set username to ${userName}`);
    }
  }

  getUser(client: Socket) {
    return this.users.get(client.id);
  }

  async verifyClient(wss: Server, client: Socket) {
		try {
			const token = client.handshake.headers.cookie.split('jwt=')[1];
			const payload = await this.strategy.verifyToken(token);
			return (await this.strategy.validate(payload));
		}
		catch (error) {
			wss.to(client.id).emit('error', 'invalid token');
		}
	}
  async findOpponent(wss: Server, SocketId: string)
  {
    try {
        const user = await this.prismaService.user.findUnique({
          where: {socket: SocketId}
        })
        return user;
    } catch(error)
    {
      wss.to(SocketId).emit('error')
    }
  }
  async initGame(wss: Server, client: Socket)
  {
    const opponent = this.waitingPlayers.shift();
    if (opponent.id === client.id) return;
    const roomName = `room${client.id}${opponent.id}`;
    const {id: oppid} = await this.findOpponent(wss, opponent.id);
    const {id: clientid} = await this.verifyClient(wss, client);
    wss.to(client.id).emit("getData", oppid, false);
    wss.to(opponent.id).emit("getData", clientid, true);
     // Create a unique room name
    client.join(roomName);
    opponent.join(roomName);

    this.logger.log(`Clients ${client.id} and ${opponent.id} joined ${roomName}`);

    this.waitingPlayers = this.waitingPlayers.filter(player => {
      player.id !== client.id && player.id !== opponent.id;
    });
  
    let player1 = new Player(this.users.get(opponent.id), 10, HEIGHT / 2, 0, roomName);
    let player2 = new Player(this.users.get(client.id), WIDTH - 30, HEIGHT / 2, 0, roomName);
    let ball = new Ball(WIDTH / 2, HEIGHT / 2, 1, 0, INITIAL_SPEED);
    
    wss.to(opponent.id).emit('initGame', {side: 1, player1: player1, player2: player2, ball: ball});
    wss.to(client.id).emit('initGame', {side: 2, player1: player1, player2: player2, ball: ball});
    this.players.set(opponent.id, player1);
    this.players.set(client.id, player2);
    
    player1 = this.players.get(opponent.id);
    player2 = this.players.get(client.id);
    wss.to(roomName).emit('gameStart');
    setTimeout(() => {
      this.games.set(roomName, {ball, player1, player2});
    }, GAME_START_DELAY);
  }

  disconnectPlayer(wss: Server, client: Socket) {
    const player = this.players.get(client.id);
    if (player) {
      // Notify the other player in the room that their opponent has disconnected
      wss.to(player.roomName).emit('opponentDisconnected');
      // Remove the clients from the room
      wss.in(player.roomName).socketsLeave(player.roomName);
      // End the game
      this.games.delete(player.roomName);
      this.waitingPlayers = this.waitingPlayers.filter(player => player.id !== client.id);
      this.players.delete(client.id);
      this.users.delete(client.id);
    }
  }

  async gameLoop(wss: Server, ball: Ball, player1: Player, player2: Player)
  {
    if (goalScored) return;
    ball = await this.updateBallPos(wss, ball, player1, player2);
    if (ball == null) return;
    ball.updatePosition();
    this.emitUpdate(wss, ball, player1.roomName);
  }

  emitUpdate(wss: Server, ball: Ball, roomName: string) {
    wss.to(roomName).emit('updateBall', ball);
  }

  async updateBallPos(wss: Server, ball: Ball, player1: Player, player2: Player) 
  {
    let nextY = ball.y + (ball.ydir * ball.speed);
    if (nextY + (BALL_DIAMETER >> 1) >= HEIGHT || nextY - (BALL_DIAMETER >> 1) <= 0) {
      ball.ydir *= -1;
    }

    if (this.checkCollision(ball, player1)) {
      ball.xdir = 1;
      ball.ydir = (ball.y - (player1.racket.y + RACKET_HEIGHT/2)) / RACKET_HEIGHT;
      if (ball.speed < MAX_SPEED)
        ball.speed += INC_SPEED;
    }
    else if (this.checkCollision(ball, player2)) {
      ball.xdir = -1;
      ball.ydir = (ball.y - (player2.racket.y + RACKET_HEIGHT/2)) / RACKET_HEIGHT;
      if (ball.speed < MAX_SPEED)
        ball.speed += INC_SPEED;
    }
    else if (ball.x > WIDTH) {
      player1.score += 1;
      ball = await this.ft_goalScored(wss, ball, player1, player2);
    }
    else if (ball.x < (BALL_DIAMETER >> 1)) {
      player2.score += 1;
      ball = await this.ft_goalScored(wss, ball, player1, player2);
    }
    return ball;
  }

  async ft_goalScored(wss: Server, ball: Ball, player1: Player, player2: Player)
  {
    ball.x = WIDTH / 2;
    ball.y = HEIGHT / 2;
    ball.xdir *= -1;
    ball.ydir = 0;
    ball.speed = INITIAL_SPEED;
    wss.to(player1.roomName).emit('updateScore', {player1Score: player1.score, player2Score: player2.score, ball: ball} );
    if (player1.score == MAX_SCORE || player2.score == MAX_SCORE) {
      const winner = player1.score == MAX_SCORE ? player1 : player2;
      const loser = player1.score == MAX_SCORE ? player2 : player1;
      console.log(winner);
      this.userService.addMatchHistory(winner.user.id, {
         name: loser.user.username,
         playerScore: winner.score,
         player2Score: loser.score,
      });
      await this.userService.getMatchHistory(winner.user.id);
      wss.to(player1.roomName).emit('gameOver');
      return null;
    } else {
      goalScored = true;
      setTimeout(() => {
        goalScored = false;
      }, 500);
      return ball;
    }
  }

  checkCollision(ball: Ball, player: Player) {
    // Find the closest x point from the center of the ball to the racket
    let closestX = this.clamp(ball.x, player.racket.x, player.racket.x + RACKET_WIDTH);

    // Find the closest y point from the center of the ball to the racket
    let closestY = this.clamp(ball.y, player.racket.y, player.racket.y + RACKET_HEIGHT);

    // Calculate the distance between the ball's center and this closest point
    let distanceX = ball.x - closestX;
    let distanceY = ball.y - closestY;

    // If the distance is less than the ball's radius, a collision occurred
    let distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);
    return distanceSquared < BALL_DIAMETER_SQUARED;
  }

  clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(max, value));
  }

  updateRacketPos(client: Socket, racketY: number) {
    let player = this.players.get(client.id);
    if (player) {
      client.broadcast.to(player.roomName).emit('updateRacket', racketY);
      player.racket.y = racketY;
    }
  }

  gameOver(wss: Server, client: Socket) {
    const player = this.players.get(client.id);
    if (player) {
      const game = this.games.get(player.roomName);
      client.to(player.roomName).emit('gameOver');
      this.logger.log(`Game ${game.player1.user.socket} Vs ${game.player2.user.socket} ended!`);
      if (game) {
        this.games.delete(player.roomName);
        this.players.delete(game.player1.user.socket);
        this.players.delete(game.player2.user.socket);
        wss.to(player.roomName).socketsLeave(player.roomName);
      }
    }
    else
      this.logger.log(`Client ${client.id} Vs Computer game ended`);
  }

}
