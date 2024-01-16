
export class Player {
  id : string;
  roomName: string;
  racket: { x: number, y: number };
  score: number;

  constructor(id: string, x: number, y: number, score: number, roomName: string) {
    this.id = id;
    this.racket = { x, y };
    this.score = score;
    this.roomName = roomName;

  }
}