import { Injectable, Logger } from "@nestjs/common";
import { UserService } from '../user/user.service';
import { Ball } from "./classes/Ball";
import { User, Player } from "./classes/Player";
import { Server, Socket } from 'socket.io';
import { PrismaService } from "src/prisma/prisma.service";
import { JwtTwoFaStrategy } from "src/strategy";
import { RACKET_HEIGHT, RACKET_WIDTH, MAX_SPEED, INC_SPEED, HEIGHT, WIDTH } from "./classes/constants";
import { gameConfig } from "./classes/gameConfig";

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
  games: Map<string, {config: gameConfig, ball: Ball, player1: Player, player2: Player, gameStart: boolean}> = new Map();

  async setUser(client: Socket, userName: string, invite: boolean) {

    if (userName && typeof userName === 'string') {
      const userData = await this.prismaService.user.findFirst({
        where: { username: userName }
      });

      if (userData) {
        if (this.users.has(userData.socket)) {
          this.logger.log(`User ${this.users.get(userData.socket).username} already exists!`);
          return this.users.get(userData.socket);
        }
      
        let user: User, socket: string;
        if (invite) {
          socket = userData.socket;
        }
        else {
           socket = client.id;
        }
        user = new User(userData.id, userName, socket);
        this.users.set(socket, user);
        this.logger.log(`${userData.username} (${socket}) added to users map!`);
        this.logger.log(user);
        return user;
      }
    }
    return null;
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

  async initGame(wss: Server, client: Socket, opponent: Socket, config: gameConfig)
  {
    if (!opponent || opponent.id === client.id) return;

    
    
    this.waitingPlayers = this.waitingPlayers.filter(player => {
      player.id !== client.id && player.id !== opponent.id;
    });
    
    const user1 = this.users.get(opponent.id);
    const user2 = this.users.get(client.id);
    if (!user1 || !user2) {
      wss.emit('CannotStartGame', 'User not found');
      return ;
    }
    const roomName = `room${client.id}${opponent.id}`;
    this.logger.log(`Clients ${client.id} and ${opponent.id} joined ${roomName}`);
    client.join(roomName);
    opponent.join(roomName);
    this.logger.log(user1);
    this.logger.log(user2);
    let player1 = new Player(this.users.get(opponent.id), 10, HEIGHT / 2 - RACKET_HEIGHT/2, 0, roomName);
    let player2 = new Player(this.users.get(client.id), WIDTH - 30, HEIGHT/2 - RACKET_HEIGHT/2, 0, roomName);
    let ball = new Ball(config.ballSpeed, config.ballSize, config.ballType);
    
    this.players.set(opponent.id, player1);
    this.players.set(client.id, player2);
    
    player1 = this.players.get(opponent.id);
    player2 = this.players.get(client.id);
    
    if (player1.user.username && player2.user.username) {
      this.games.set(roomName, {config: config, ball: ball, player1: player1, player2: player2, gameStart: false});
      this.logger.log(`Game ${player1.user.username} Vs ${player2.user.username} Initialized!`);
    }
    else {
      wss.to(client.id).emit('CannotCreateGame');
    }
  }

  disconnectPlayer(wss: Server, client: Socket) {
    const player = this.players.get(client.id);
    if (player) {
      const game = this.games.get(player.roomName);
      if (game) {
        // Notify the other player in the room that their opponent has disconnected
        wss.to(player.roomName).emit('opponentDisconnected');
        // Remove the clients from the room
        wss.in(player.roomName).socketsLeave(player.roomName);
        // End the game
        this.games.delete(player.roomName);
        this.waitingPlayers = this.waitingPlayers.filter(player => player.id !== client.id);
        this.players.delete(game.player1.user.socket);   
        this.players.delete(game.player2.user.socket);
        this.users.delete(client.id);
      }
    }
  }

  async gameLoop(wss: Server, ball: Ball, player1: Player, player2: Player, config: gameConfig)
  {
    if (goalScored) return;
    ball = await this.updateBallPos(wss, ball, player1, player2, config);
    if (ball == null) return;
    ball.updatePosition();
    await this.emitUpdate(wss, ball, player1.roomName);
  }

  async emitUpdate(wss: Server, ball: Ball, roomName: string) {
    wss.to(roomName).emit('updateBall', ball);
  }

  async updateBallPos(wss: Server, ball: Ball, player1: Player, player2: Player, config: gameConfig)
  {
    let nextY = ball.y + (ball.ydir * ball.speed);
    if (nextY + (ball.radius >> 1) >= HEIGHT || nextY - (ball.radius >> 1) <= 0) {
      ball.ydir *= -1;
    }

    if (this.checkCollision(ball, player1)) {
      ball.xdir = 1;
      ball.ydir = (ball.y - (player1.racket.y + RACKET_HEIGHT/2)) / RACKET_HEIGHT;
      if (ball.speed < MAX_SPEED && config.boost)
        ball.speed += INC_SPEED;
    }
    else if (this.checkCollision(ball, player2)) {
      ball.xdir = -1;
      ball.ydir = (ball.y - (player2.racket.y + RACKET_HEIGHT/2)) / RACKET_HEIGHT;
      if (ball.speed < MAX_SPEED && config.boost)
        ball.speed += INC_SPEED;
    }
    else if (ball.x > WIDTH) {
      player1.score += 1;
      ball = await this.ft_goalScored(wss, ball, player1, player2, config);
    }
    else if (ball.x < (ball.radius >> 1)) {
      player2.score += 1;
      ball = await this.ft_goalScored(wss, ball, player1, player2, config);
    }
    return ball;
  }

  async ft_goalScored(wss: Server, ball: Ball, player1: Player, player2: Player, config: gameConfig)
  {
    ball.reset(config.ballSpeed);
    wss.to(player1.roomName).emit('updateScore', {player1Score: player1.score, player2Score: player2.score, ball: ball} );
    if (player1.score == config.maxScore || player2.score == config.maxScore) {
      wss.to(player1.roomName).emit('gameOver');
      const winner = player1.score == config.maxScore ? player1 : player2;
      const loser = player1.score == config.maxScore ? player2 : player1;
      console.log(winner);
      await this.userService.addMatchHistory(winner.user.id, {
         name: loser.user.username,
         playerScore: winner.score,
         player2Score: loser.score,
      });
      await this.userService.getMatchHistory(winner.user.id);
      this.games.delete(player1.roomName);
      this.players.delete(player1.user.socket);
      this.players.delete(player2.user.socket);
      return null;
    } else {
      goalScored = true;
      setTimeout(() => {
        goalScored = false;
      }, 2500);
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
    return distanceSquared < (ball.radius * ball.radius);
  }

  clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(max, value));
  }

  updateRacketPos(client: Socket, racketY: number, deviceHeight: number) {
    let player = this.players.get(client.id);
    if (player) {
      let normalizedRacketY = racketY * (HEIGHT / deviceHeight);
      client.broadcast.to(player.roomName).emit('updateRacket', normalizedRacketY);
      player.racket.y = normalizedRacketY;
    }
  }

  gameOver(wss: Server, client: Socket) {
    const player = this.players.get(client.id);
    if (player) {
      const game = this.games.get(player.roomName);
      client.to(player.roomName).emit('gameOver');
      if (game) {
        this.logger.log(`Game ${game.player1.user.socket} Vs ${game.player2.user.socket} ended!`);
        this.games.delete(player.roomName);
        this.players.delete(game.player1.user.socket);
        this.players.delete(game.player2.user.socket);
        wss.to(player.roomName).socketsLeave(player.roomName);
      }
    }
    else
      this.logger.log(`Client ${client.id} Vs Computer game ended`);
  }
  // async inGame()
}
