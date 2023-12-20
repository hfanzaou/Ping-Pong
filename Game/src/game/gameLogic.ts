import { Ball } from "../classes/ball";
import { Player } from "../classes/player";
import { Socket, Server } from 'socket.io';

const HEIGHT = 450;
const WIDTH = 700;
const RACKET_WIDTH = 15;
const RACKET_HEIGHT = 100;
const MAX_SPEED = 50;
const INITIAL_SPEED = 8;
const MAX_SCORE = 10;
const GAME_START_DELAY = 3000;
const GAME_INTERVAL = 1000/60;
const BALL_DIAMETER = 15;

let goalScored: boolean = false;

export function gameLoop(wss: Server, ball: Ball, player1: Player, player2: Player)
  {
    if (!goalScored) {
      ball = updateBallPos(wss, ball, player1, player2);
      if (ball == null) {
        return 1;
      }
      ball.updatePosition();
      wss.to(player1.roomName).emit('updateBall', {x: ball.x, y: ball.y});
    }
    return 0;
  }

  export function updateBallPos(wss: Server, ball: Ball, player1: Player, player2: Player) 
  {
    const roomName = player1.roomName;
  
    if (checkCollision(ball, player1)) {
      ball.xdir = 1;
      ball.ydir = (ball.y - (player1.racket.y + RACKET_HEIGHT/2)) / RACKET_HEIGHT;
      if (ball.speed < MAX_SPEED)
        ball.speed += 0.5;
    }
    else if (checkCollision(ball, player2)) {
      ball.xdir = -1;
      ball.ydir = (ball.y - (player2.racket.y + RACKET_HEIGHT/2)) / RACKET_HEIGHT;
      if (ball.speed < MAX_SPEED)
        ball.speed += 0.5;
    }
    else if (ball.x > WIDTH || ball.x < (BALL_DIAMETER >> 1)) {
      if (ball.x > WIDTH)
        player1.score += 1;
      else
        player2.score += 1;
      ball.x = WIDTH / 2;
      ball.y = HEIGHT / 2;
      ball.xdir *= -1;
      ball.ydir = 1;
      ball.speed = INITIAL_SPEED;
      wss.to(roomName).emit('updateScore', {player1Score: player1.score, player2Score: player2.score} );
      if (player1.score == MAX_SCORE || player2.score == MAX_SCORE) {
        // End the game
        return null;
      } else {
        goalScored = true;
        wss.to(roomName).emit('updateBall', {x: ball.x, y: ball.y});
        setTimeout(() => {
          goalScored = false;
        }, 500);
      }
    }
    else if (ball.y > HEIGHT - (BALL_DIAMETER >> 1) || ball.y < (BALL_DIAMETER >> 1)) {
      ball.ydir *= -1;
    }
    return ball;
  }

  const BALL_DIAMETER_SQUARED = BALL_DIAMETER * BALL_DIAMETER;

  export function checkCollision(ball: Ball, player: Player) {
    // Find the closest x point from the center of the ball to the racket
    let closestX = clamp(ball.x, player.racket.x, player.racket.x + RACKET_WIDTH);
  
    // Find the closest y point from the center of the ball to the racket
    let closestY = clamp(ball.y, player.racket.y, player.racket.y + RACKET_HEIGHT);
  
    // Calculate the distance between the ball's center and this closest point
    let distanceX = ball.x - closestX;
    let distanceY = ball.y - closestY;
  
    // If the distance is less than the ball's radius, a collision occurred
    let distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);
    return distanceSquared < BALL_DIAMETER_SQUARED;
  }

  function clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(max, value));
  }