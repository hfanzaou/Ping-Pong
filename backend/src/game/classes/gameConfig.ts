import { WIDTH, HEIGHT } from "./constants";

export class gameConfig {
    canvasWidth: number = WIDTH;
    canvasHeight: number = HEIGHT;
    mode: number;
    maxScore: number;
    ballSpeed: number;
    ballSize: number;
    ballType: string;
    boost: boolean;
    difficulty: number;
    constructor( mode: number, 
        maxScore: number, 
        ballSpeed: number,
        ballSize: string,
        ballType: string, 
        boost: boolean, 
        difficulty: number) {
        this.mode = mode;
        this.maxScore = maxScore;
        this.ballSpeed = ballSpeed;
        if (ballSize === "small") {
            this.ballSize = 10;
        }
        else if (ballSize === "medium") {
            this.ballSize = 20;
        }
        else {
            this.ballSize = 30;
        }
        this.ballType = ballType;
        this.boost = boost;
        this.difficulty = difficulty;
    }
}