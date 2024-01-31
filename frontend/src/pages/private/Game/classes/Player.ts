import { RACKET_HEIGHT, RACKET_WIDTH, HEIGHT, RACKET_DY, WIDTH} from './constants';
import p5Types from 'p5';
import { Socket } from 'socket.io-client';
import { side } from '../components/gameLogic'

export class User {
  id : number;
  username: string;
  socket: string;
  level: number;

  constructor(id : number, username: string, socket: string, level: number) {
    this.id = id;
    this.username = username;
    this.socket = socket;
    this.level = level;
  }

}

class Racket {
  x: number;
  y: number;
  width: number;
  height: number;
  forcePushTime: number;
  forcePush: boolean;

  constructor(x: number, y: number, width: number, height: number, canvasWidth: number, canvasHeight: number) {
    this.x = x * (canvasWidth / WIDTH);
    this.y = y * (canvasHeight / HEIGHT);
    this.width = width * (canvasWidth / WIDTH);
    this.height = height * (canvasHeight / HEIGHT);
    this.forcePushTime = 0;
    this.forcePush = false;
  }

  show (p5: p5Types) {
    if (this.forcePush) {
      p5.fill(255);
    } else {
      p5.fill(240);
    }
    p5.rect(this.x, this.y, this.width, this.height, 5);
  }

  moveUp(socket: Socket, canvasHeight: number) {
    if (this.y - RACKET_DY * (canvasHeight / HEIGHT) > 0) {
      this.y -= RACKET_DY * (canvasHeight / HEIGHT);
      if (socket) {
        socket.emit("updateRacket", { racketY: this.y, canvasHeight: canvasHeight });
      }
    }
  }

  moveDown(socket: Socket, canvasHeight: number) {
    if (this.y + RACKET_DY * (canvasHeight / HEIGHT) < canvasHeight - this.height) {
      this.y += RACKET_DY * (canvasHeight / HEIGHT);
      if (socket) {
        socket.emit("updateRacket", {racketY: this.y, canvasHeight: canvasHeight});
      }
    }
  }

  resize(canvasWidth: number, canvasHeight: number, player: number) {
    this.width = RACKET_WIDTH * (canvasWidth / WIDTH);
    this.height = RACKET_HEIGHT * (canvasHeight / HEIGHT);
  
    if (player === 1) {
    this.x = 10 * (canvasWidth / WIDTH);
    } else {
      this.x = (WIDTH - RACKET_WIDTH - 10) * (canvasWidth / WIDTH);
    }
    this.y = this.y * (canvasHeight / HEIGHT);
  }
  
  forceUpdate() {
    if (this.forcePushTime < 6) {
      this.x -= 1;
      this.width += 2;
      this.y -= 1;
      this.height += 2;
      this.forcePushTime += 1;
    } else if (this.forcePushTime < 12) {
      this.x += 1;
      this.width -= 2;
      this.y += 1;
      this.height -= 2;
      this.forcePushTime += 1;
    } else {
      this.forcePush = false;
      this.forcePushTime = 0;
    }
  }

}

export class Player {
  user: User;
  racket: Racket;
  score: number;
  roomName: string;

  constructor(user: User, x: number, y: number, roomName: string, canvasWidth: number, canvasHeight: number) {
    this.user = user;
    this.racket = new Racket (x, y, RACKET_WIDTH, RACKET_HEIGHT, canvasWidth, canvasHeight);
    this.score = 0;
    this.roomName = roomName;
  }

  show(p5: p5Types) {
    this.racket.show(p5);
  }
}
