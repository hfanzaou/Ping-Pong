import { SubscribeMessage, WebSocketGateway, OnGatewayInit, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { Ball } from "../classes/ball";
import { Player } from "../classes/player";
import { Round } from "../classes/round";
import { interval, Subscription } from 'rxjs';

const HEIGHT = 450;
const WIDTH = 700;
const RACKET_WIDTH = 15;
const RACKET_HEIGHT = 100;
const MAX_SPEED = 15;
const INITIAL_SPEED = 6;
const MAX_SCORE = 10;
const GAME_START_DELAY = 3100;
const GAME_INTERVAL = 1000/60;
const BALL_DIAMETER = 15;

@WebSocketGateway()
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server;
  private logger: Logger = new Logger('GameGateway');
  private players: Player[] = [];
  private intervalId: any;

  afterInit(server: any) {
    this.logger.log("Initialized!");
  }
  
  handleConnection(@ConnectedSocket() client: Socket) {
    this.logger.log("Client " + client.id + " Connected!");
  }

  handleDisconnect(client: Socket) {
    this.logger.log("Client " + client.id + " Disconnected");
    if (client.rooms['room0']) {
      this.wss.to('room0').emit('playerDisconnect');
      client.leave('room0');
      clearInterval(this.intervalId);
    }
  }
  
  @SubscribeMessage('join_room')
  async joinRoom(client: Socket, payload: any)
  {
    let sockets = await this.wss.in('room0').fetchSockets();
    if (sockets.length == 1) {
      client.join('room0');
      this.logger.log("client " + client.id + " joined room0");
      this.wss.to(client.id).emit('player2', 2);
      this.wss.to('room0').emit("game start", 2);
      let ball = new Ball(WIDTH / 2, HEIGHT / 2, 1, 1, INITIAL_SPEED, BALL_DIAMETER);
      let player1 = new Player(10, HEIGHT / 2, 0);
      let player2 = new Player(WIDTH - 30, HEIGHT / 2, 0);
      this.players.push(player1);
      this.players.push(player2);
      setTimeout(() => {
        this.intervalId = setInterval(() => this.gameStart(ball, player1, player2), GAME_INTERVAL);
      }, GAME_START_DELAY);
    }
    else {
      client.join('room0');
      this.logger.log("Client "+ client.id + " joined room0");
      this.wss.to('room0').emit("player1", 1);
    }
  }

  @SubscribeMessage('VsComputer')
  VsComputer(client: Socket) {
    client.join('room0');
    let player1 = new Player(10, HEIGHT / 2, 0);
    let player2 = new Player(WIDTH - 30, HEIGHT / 2, 0);
    let ball = new Ball(WIDTH / 2, HEIGHT / 2, 1, 1, INITIAL_SPEED, BALL_DIAMETER);
    this.players.push(player1);
    this.players.push(player2);
    setTimeout(() => {
      this.intervalId = setInterval(() => this.gameStart(ball, player1, player2), GAME_INTERVAL);
    }, GAME_START_DELAY);
  }

  @SubscribeMessage('updateRacket')
  updateRacketPos(client: Socket, racketPos: {player: number, y: number}) {
    if (racketPos.player == 1)
      this.players[0].racket.y = racketPos.y;
    else if (racketPos.player == 2)
      this.players[1].racket.y = racketPos.y;
    if (client.rooms['room0'])
      client.broadcast.to('room0').emit('updateRacket', racketPos.y);
  }

  private goalScored = false;

  private gameStart(ball: Ball, player1: Player, player2: Player)
  {
    ball = this.updateBallPos(ball, this.players[0], this.players[1]);
    if (!this.goalScored) {
      ball.x += (ball.speed * ball.xdir);
      ball.y += (ball.speed * ball.ydir);
    }
    this.wss.to('room0').emit('updateBall', ball);
  }

  private updateBallPos(ball: Ball, player1: Player, player2: Player) 
  {
    if (this.checkCollision(ball, player1)) {
      ball.xdir = 1;
      ball.ydir = (ball.y - (player1.racket.y + RACKET_HEIGHT/2)) / RACKET_HEIGHT;
      if (ball.speed < MAX_SPEED)
        ball.speed += 0.5;
    }
    else if (this.checkCollision(ball, player2)) {
      ball.xdir = -1;
      ball.ydir = (ball.y - (player2.racket.y + RACKET_HEIGHT/2)) / RACKET_HEIGHT;
      if (ball.speed < MAX_SPEED)
        ball.speed += 0.5;
    }
    else if (ball.x > WIDTH || ball.x < ball.diam/2) {
      if (ball.x > WIDTH)
        player1.score += 1;
      else
        player2.score += 1;
      ball.x = WIDTH / 2;
      ball.y = HEIGHT / 2;
      ball.xdir *= -1;
      ball.ydir = 1;
      ball.speed = INITIAL_SPEED;
      // ball.speedY = INITIAL_SPEED;
      this.wss.to('room0').emit('updateScore', {player1Score: player1.score, player2Score: player2.score} );
      if (player1.score == MAX_SCORE || player2.score == MAX_SCORE) {
        clearInterval(this.intervalId);
        this.wss.to('room0').emit('gameOver');
        this.wss.in('room0').socketsLeave('room0');
        player1.score = 0;
        player2.score = 0;
      } else {
        this.goalScored = true;
        // Delay the re-spawning of the ball by 2 seconds
        setTimeout(() => {
          this.goalScored = false;
          this.wss.to('room0').emit('updateBall', ball);
        }, 500);
      }
    }
    else if (ball.y > HEIGHT - ball.diam/2 || ball.y < ball.diam/2) {
        ball.ydir *= -1;
    }
    return ball;
  }

  private checkCollision(ball: Ball, player: Player) {
    // Find the closest x point from the center of the ball to the racket
    let closestX = this.clamp(ball.x, player.racket.x, player.racket.x + RACKET_WIDTH);
  
    // Find the closest y point from the center of the ball to the racket
    let closestY = this.clamp(ball.y, player.racket.y, player.racket.y + RACKET_HEIGHT);
  
    // Calculate the distance between the ball's center and this closest point
    let distanceX = ball.x - closestX;
    let distanceY = ball.y - closestY;
  
    // If the distance is less than the ball's radius, a collision occurred
    let distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);
    return distanceSquared < (ball.diam * ball.diam);
  }

  private clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(max, value));
  }
}
