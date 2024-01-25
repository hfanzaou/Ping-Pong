import { RACKET_HEIGHT, RACKET_WIDTH } from './constants';

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

export class Player {
  user: User;
  racket: { x: number, y: number, width: number, height: number, forcePushTime: number, forcePush: boolean};
  score: number;
  roomName: string;

  constructor(user: User, x: number, y: number, score: number, roomName: string) {
    this.user = user;
    this.racket = { x: x, y: y, width: RACKET_WIDTH, height: RACKET_HEIGHT, forcePushTime: 0, forcePush: false};
    this.score = score;
    this.roomName = roomName;
  }
}