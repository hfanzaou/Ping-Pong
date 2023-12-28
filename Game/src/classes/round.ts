import { Ball } from "./ball"
import { Player } from "./player"

export class Round {
    matchId: number;
    roomId: number;
    player1Id: string;
    player2Id: string;
    player1: Player;
    player2: Player;
    ball: Ball;
    player1Score: number = 0;
    player2Score: number = 0;
};