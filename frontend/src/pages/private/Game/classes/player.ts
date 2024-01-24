
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
  racket: { x: number, y: number };
  score: number;
  roomName: string;

  constructor(user: User, x: number, y: number, score: number, roomName: string) {
    this.user = user;
    this.racket = { x, y };
    this.score = score;
    this.roomName = roomName;
  }
}