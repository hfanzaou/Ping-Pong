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
const MAX_SPEED = 50;
const INITIAL_SPEED = 8;
const MAX_SCORE = 3;
const GAME_START_DELAY = 3100;
const GAME_INTERVAL = 1000/60;
const BALL_DIAMETER = 15;

@WebSocketGateway()
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  private logger: Logger = new Logger('GameGateway');

  @WebSocketServer() wss: Server;

  private players: Map<string, Player> = new Map();
  private waitingPlayers: Socket[] = [];
  private intervalIds: Map<string, NodeJS.Timeout> = new Map();
  
  afterInit(server: any) {
    this.logger.log("Initialized!");
  }
  
  handleConnection(@ConnectedSocket() client: Socket) {
    this.logger.log("Client " + client.id + " Connected!");
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.log(`Client ${client.id} disconnected`);
  
    // Find the room that the client is in
    const player = this.players.get(client.id);
    if (player) {
      // Notify the other player in the room that their opponent has disconnected
      this.wss.to(player.roomName).emit('opponentDisconnected');
      
      // Remove the client from the room
      client.leave(player.roomName);
  
      // End the game
      const intervalId = this.intervalIds.get(player.roomName);
      if (intervalId) {
        clearInterval(intervalId);
        this.intervalIds.delete(player.roomName);
      }
      if (player.id === client.id) {
        this.players.delete('computer');
      }
    }
    this.waitingPlayers = this.waitingPlayers.filter(player => player.id !== client.id);
    this.players.delete(client.id);
  }

  
  @SubscribeMessage('join_room')
  async joinRoom(@ConnectedSocket() client: Socket, payload: any) {
    if (this.waitingPlayers.length > 0) {
      // If there are players waiting, match the new player with the first one in the queue
      const opponent = this.waitingPlayers.shift();
      const roomName = `room${client.id}${opponent.id}`; // Create a unique room name
  
      client.join(roomName);
      opponent.join(roomName);
  
      this.logger.log(`Clients ${client.id} and ${opponent.id} joined ${roomName}`);
      
      // Initialize the game for these two players
      this.initGame(opponent, client, roomName);
    } else {
      // If there are no players waiting, add the new player to the queue
      this.waitingPlayers.push(client);
      this.logger.log(`Client ${client.id} added to the waiting queue`);
    }
  }

  @SubscribeMessage('VsComputer')
  VsComputer(client: Socket) {
    const roomName = client.id;
    let player1Obj = new Player(client.id, 10, HEIGHT / 2, 0, roomName);
    let player2Obj = new Player('computer', WIDTH - 30, HEIGHT / 2, 0, roomName);
    let ball = new Ball(WIDTH / 2, HEIGHT / 2, 1, 1, INITIAL_SPEED, BALL_DIAMETER);
    this.players.set(client.id, player1Obj);
    this.players.set('computer', player2Obj);
    setTimeout(() => {
      this.intervalIds.set(roomName, setInterval(() => this.gameStart(ball, player1Obj, player2Obj, roomName), GAME_INTERVAL));
    }, GAME_START_DELAY);
  }

  @SubscribeMessage('updateRacket')
  updateRacketPos(client: Socket, racketY: number) {
    let player = this.players.get(client.id);
    if (player) {
      player.racket.y = racketY;
      if (player.roomName !== client.id)
        client.broadcast.to(player.roomName).emit('updateRacket', racketY);
    }
  }

  @SubscribeMessage('updateRacketVsComputer')
  updateRacketPosVsComputer(client: Socket, racketY: number) {
    let player = this.players.get('computer');
    if (player) {
      player.racket.y = racketY;
    }
  }

  private initGame(player1: Socket, player2: Socket, roomName: string)
  {
    this.waitingPlayers = this.waitingPlayers.filter(player => player.id !== player1.id && player.id !== player2.id);
    this.wss.to(player1.id).emit('player1', 1);
    this.wss.to(player2.id).emit('player2', 2);
    this.wss.to(roomName).emit('gameStart');
    let player1Obj = new Player(player1.id, 10, HEIGHT / 2, 0, roomName);
    let player2Obj = new Player(player2.id, WIDTH - 30, HEIGHT / 2, 0, roomName);
    let ball = new Ball(WIDTH / 2, HEIGHT / 2, 1, 1, INITIAL_SPEED, BALL_DIAMETER);
    this.players.set(player1.id, player1Obj);
    this.players.set(player2.id, player2Obj);
    setTimeout(() => {
      this.intervalIds.set(roomName, setInterval(() => this.gameStart(ball, player1Obj, player2Obj, roomName), GAME_INTERVAL));
    } , GAME_START_DELAY);
  }

  private goalScored = false;

  private gameStart(ball: Ball, player1: Player, player2: Player, roomName: string)
  {
    const playersInGame = [this.players.get(player1.id), this.players.get(player2.id)];
    if (playersInGame.length < 2) {
      // Both players aren't in the game yet, don't start the game
      return;
    }
    ball = this.updateBallPos(ball, playersInGame[0], playersInGame[1], roomName);
    if (this.goalScored) {
      return;
    }
    ball.x += (ball.speed * ball.xdir);
    ball.y += (ball.speed * ball.ydir);
    this.wss.to(roomName).emit('updateBall', { x: ball.x , y: ball.y });
  }

  private updateBallPos(ball: Ball, player1: Player, player2: Player, roomName?: string) 
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
      this.wss.to(roomName).emit('updateScore', {player1Score: player1.score, player2Score: player2.score} );
      if (player1.score == MAX_SCORE || player2.score == MAX_SCORE) {
        this.wss.to(roomName).emit('gameOver');
        // End the game
        const intervalId = this.intervalIds.get(roomName);
        if (intervalId) {
          clearInterval(intervalId);
          this.intervalIds.delete(roomName);
        }
        if (player2.id !== 'computer')
          this.wss.in(roomName).socketsLeave(roomName);
        // Remove the players from the players map
        this.players.delete(player1.id);
        this.players.delete(player2.id);
      } else {
        this.goalScored = true;
        // Delay the re-spawning of the ball by 2 seconds
        this.wss.to(roomName).emit('updateBall', {x: ball.x, y: ball.y});
        setTimeout(() => {
          this.goalScored = false;
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
