
export class Player {
  racket: { x: number, y: number };
  score: number;

  constructor(x: number, y: number, score: number) {
    this.racket = { x, y };
    this.score = score;
  }
}