
export class Player {
  id : string;
  baseId: number;
  roomName: string;
  racket: { x: number, y: number };
  score: number;

  constructor(id: string, x: number, y: number, score: number, roomName: string, baseId: number) {
    this.id = id;
    this.racket = { x, y };
    this.score = score;
    this.roomName = roomName;
    this.baseId = baseId;
  }
}