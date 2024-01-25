import { RACKET_HEIGHT, RACKET_WIDTH } from './constants';
import p5Types from 'p5';

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

  constructor(x: number, y: number, width: number, height: number, forcePushTime: number, forcePush: boolean) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.forcePushTime = forcePushTime;
    this.forcePush = forcePush;
  }

  show (p5: p5Types) {
    if (this.forcePush) {
      p5.fill(240);
    } else {
      p5.fill(255);
    }
    p5.rect(this.x, this.y, this.width, this.height, 5);
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

  constructor(user: User, x: number, y: number, score: number, roomName: string) {
    this.user = user;
    this.racket = new Racket (x, y, RACKET_WIDTH, RACKET_HEIGHT, 0, false);
    this.score = score;
    this.roomName = roomName;
  }

  show(p5: p5Types) {
    this.racket.show(p5);
  }
}