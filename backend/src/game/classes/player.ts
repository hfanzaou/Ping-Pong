
export class User {
  id: number;
  username: string;
  socket: string;

  constructor(id:number, username: string, socket: string) {
    this.id = id;
    this.username = username;
    this.socket = socket;
  }

}

export class Player {
  user: User;
  roomName: string;
  racket: { x: number, y: number };
  score: number;

  constructor(user: User, x: number, y: number, score: number, roomName: string) {
    this.user = user;
    this.racket = { x, y };
    this.score = score;
    this.roomName = roomName;
  }
}