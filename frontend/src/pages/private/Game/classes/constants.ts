import { Ball } from "./ball";
import { Player } from "./player";

export const WIDTH = 700,
             HEIGHT = 450,
             RACKET_HEIGHT = 80,
             RACKET_WIDTH = 15,
             INITIAL_SPEED = 8,
             BALL_DIAMETER = 15,
             MOVE = 200,
             RACKET_DY = 10,
             MAX_SPEED = 50,
             INC_SPEED = 0.75,
             BALL_DIAMETER_SQUARED = BALL_DIAMETER * BALL_DIAMETER,
             MAX_SCORE = 10;

export class gameConfig {
    mode: number;
    maxScore: number;
    ballSpeed: number;
    boost: boolean;
    difficulty: number;
    // player1 : Player;
    // player2 : Player;
    // ball : Ball;
    // side : number;
    constructor( mode: number, 
        maxScore: number, 
        ballSpeed: number, 
        boost: boolean, 
        difficulty: number) {
        // player1: Player, 
        // player2: Player, 
        // ball: Ball, 
        // side: number) {
        this.mode = mode;
        this.maxScore = maxScore;
        this.ballSpeed = ballSpeed;
        this.boost = boost;
        this.difficulty = difficulty;
        // this.player1 = player1;
        // this.player2 = player2;
        // this.ball = ball;
        // this.side = side;
    }
}