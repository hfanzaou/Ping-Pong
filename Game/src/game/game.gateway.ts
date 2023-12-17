import { SubscribeMessage, WebSocketGateway, OnGatewayInit, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { Ball } from "../classes/ball";
import { Player } from "../classes/player";
import { Round } from "../classes/round";

const HEIGHT = 450;
const WIDTH = 700;
const RACKET_WIDTH = 10;
const RACKET_HEIGHT = 100;
const MAX_SPEED = 8;
const INITIAL_SPEED = 6;
const MAX_SCORE = 10;
const GAME_START_DELAY = 3100;
const GAME_INTERVAL = 1000/60;

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
      let ball = new Ball(WIDTH / 2, HEIGHT / 2, 1, 1, INITIAL_SPEED, 10);
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

  // @SubscribeMessage('VsComputer')
  // VsComputer(client: Socket) {
  //   intervalIds.push(setInterval());
  // }

  @SubscribeMessage('updateRacket')
  updateRacketPos(client: Socket, payload: any) {
    if (payload[0] == 1)
      this.players[0].racket.y = payload[1];
    else
      this.players[1].racket.y = payload[1];
    client.broadcast.to('room0').emit('updateRacket', payload[1]);
  }

  @SubscribeMessage('mouseDragged')
  handleMouse(client: Socket, racketPos: number) {
    client.broadcast.to('room0').emit('updateRacket', racketPos);
  }

  private goalScored = false;

  private gameStart(ball: Ball, player1: Player, player2: Player)
  {
    ball = this.calculate(ball, player1, player2);
    if (!this.goalScored) {
      ball.x += (ball.speed * ball.xdir);
      ball.y += (ball.speed * ball.ydir);
    }
    this.wss.to('room0').emit('updateBall', ball);
  }

  private calculate(ball: Ball, player1: Player, player2: Player) 
  {
    if ((ball.x - ball.rad/2 <= player1.racket.x + RACKET_WIDTH) &&
        (ball.x - ball.rad/2 >= player1.racket.x) &&
        (ball.y - ball.rad/2 >= player1.racket.y) &&
        (ball.y + ball.rad/2 <= (player1.racket.y + RACKET_HEIGHT))) {
      ball.xdir = 1;
      ball.ydir = (ball.y - (player1.racket.y + RACKET_HEIGHT/2)) / RACKET_HEIGHT;
      if (ball.speed < MAX_SPEED)
        ball.speed += 0.5;
    }
    else if ((ball.x + ball.rad/2 >= player2.racket.x) &&
            (ball.x + ball.rad/2 <= player2.racket.x + RACKET_WIDTH) &&
            (ball.y + ball.rad/2 >= player2.racket.y) &&
            (ball.y - ball.rad/2 <= player2.racket.y + RACKET_HEIGHT)) {
      ball.xdir = -1;
      ball.ydir = (ball.y - (player2.racket.y + RACKET_HEIGHT/2)) / RACKET_HEIGHT;
      if (ball.speed < MAX_SPEED)
        ball.speed += 0.5;
    }
    else if (ball.x > WIDTH || ball.x < ball.rad) {
      if (ball.x > WIDTH)
        player1.score += 1;
      else
        player2.score += 1;
      ball.x = WIDTH / 2;
      ball.y = HEIGHT / 2;
      ball.xdir *= -1;
      ball.ydir = 1;
      ball.speed = INITIAL_SPEED;
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
    else if (ball.y > HEIGHT - ball.rad/2 || ball.y < ball.rad/2) {
        ball.ydir *= -1;
    }
    return ball;
  }
}
