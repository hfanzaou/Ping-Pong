import { SubscribeMessage, WebSocketGateway, OnGatewayInit, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { Ball } from "../classes/ball";
import { Player } from "../classes/player";
import { gameLoop, updateBallPos } from './gameLogic';

const HEIGHT = 450;
const WIDTH = 700;
const RACKET_WIDTH = 15;
const RACKET_HEIGHT = 100;
const MAX_SPEED = 50;
const INITIAL_SPEED = 8;
const MAX_SCORE = 10;
const GAME_START_DELAY = 3000;
const GAME_INTERVAL = 1000/60;
const BALL_DIAMETER = 15;

@WebSocketGateway()
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  private logger: Logger = new Logger('GameGateway');

  @WebSocketServer() wss: Server;

  private players: Map<string, Player> = new Map();
  private waitingPlayers: Socket[] = [];
  private games: Map<string, {ball: Ball, player1: Player, player2: Player}> = new Map();
  
  afterInit(server: any) {
    this.logger.log("Initialized!");
    setInterval(() => {
      this.games.forEach((game) => {
        if (gameLoop(this.wss, game.ball, game.player1, game.player2)) {
          this.wss.to(game.player1.roomName).emit('gameOver');
          this.games.delete(game.player1.roomName);
          this.players.delete(game.player1.id);
          this.players.delete(game.player2.id);
        }
      });
    }, GAME_INTERVAL);
  }
  
  handleConnection(@ConnectedSocket() client: Socket) {
    this.logger.log("Client " + client.id + " Connected!");
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.log(`Client ${client.id} disconnected`);

    const player = this.players.get(client.id);
    if (player) {
      // Notify the other player in the room that their opponent has disconnected
      this.wss.to(player.roomName).emit('opponentDisconnected');
      
      // Remove the clients from the room
      this.wss.in(player.roomName).socketsLeave(player.roomName);
      // End the game
      this.games.delete(player.roomName);
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
      this.initGame(opponent.id, client.id, roomName);
    } else {
      // If there are no players waiting, add the new player to the queue
      this.waitingPlayers.push(client);
      this.logger.log(`Client ${client.id} added to the waiting queue`);
    }
  }

  @SubscribeMessage('VsComputer')
  VsComputer(client: Socket) {
    this.logger.log(`Client ${client.id} wants to play against computer`);
  }

  @SubscribeMessage('gameOver')
  gameOver(client: Socket) {
    this.logger.log(`Client ${client.id} Vs Computer game over`);
    this.wss.to(client.id).emit('gameOver');
  }

  @SubscribeMessage('updateRacket')
  updateRacketPos(client: Socket, racketY: number) {
    let player = this.players.get(client.id);
    if (player) {
      client.broadcast.to(player.roomName).emit('updateRacket', racketY);
      player.racket.y = racketY;
    }
  }

  private initGame(client1Id: string, client2Id: string, roomName: string)
  {
    this.waitingPlayers = this.waitingPlayers.filter(player => {
      player.id !== client1Id && player.id !== client2Id
    });
  
    let player1 = new Player(client1Id, 10, HEIGHT / 2, 0, roomName);
    let player2 = new Player(client2Id, WIDTH - 30, HEIGHT / 2, 0, roomName);
    let ball = new Ball(WIDTH / 2, HEIGHT / 2, 1, 1, INITIAL_SPEED);
    
    this.wss.to(client1Id).emit('player1', 1);
    this.wss.to(client2Id).emit('player2', 2);
    this.players.set(client1Id, player1);
    this.players.set(client2Id, player2);
    
    player1 = this.players.get(client1Id);
    player2 = this.players.get(client2Id);
    this.wss.to(roomName).emit('gameStart');
    setTimeout(() => {
      this.games.set(roomName, {ball, player1, player2});
    }, GAME_START_DELAY);
  }
}
