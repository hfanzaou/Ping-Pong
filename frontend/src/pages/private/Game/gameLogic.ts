import { Ball } from "./classes/ball";
import { Player } from "./classes/player";
import p5Types from "p5";
import { Socket } from "socket.io-client";
import { startCountdown, gameOver, opponentDisconnect, mode, difficulty } from "./gameStates"


const WIDTH = 700;
const HEIGHT = 450;
const RACKET_HEIGHT = 100;
const RACKET_WIDTH = 15;
const RACKET_DY = 10;
const INITIAL_SPEED = 8;
const MAX_SPEED = 50;
const INC_SPEED = 0.75;
const BALL_DIAMETER = 15;
const BALL_DIAMETER_SQUARED = BALL_DIAMETER * BALL_DIAMETER;
const MAX_SCORE = 10;

let goalScored: boolean = false,
    update: boolean = false,
    waitingForPlayer = false,
    side: number = 1; // 1: left, 2:

export let player1: Player,
    player2: Player,
    ball: Ball;


export function  gameLoop(p5: p5Types, socket: Socket)
{
  if (!goalScored) {
    updateBallPos(p5, socket);
    updatePosition();
  }
}

export function  updatePosition() {
    ball.x += (ball.xdir * ball.speed);
    ball.y += (ball.ydir * ball.speed);
}

export function  updateBallPos(p5: p5Types, socket: Socket)
{
  if (update) return;
  let nextY = ball.y + (ball.ydir * ball.speed);
  if (nextY + (BALL_DIAMETER >> 1) >= HEIGHT || nextY - (BALL_DIAMETER >> 1) <= 0) {
    ball.ydir *= -1;
  }

  if (checkCollision(player1, ball)) {
    ball.xdir = 1;
    ball.ydir = (ball.y - (player1.racket.y + RACKET_HEIGHT/2)) / RACKET_HEIGHT;
    if (ball.speed < MAX_SPEED)
      ball.speed += INC_SPEED;
  }
  else if (checkCollision(player2, ball)) {
    ball.xdir = -1;
    ball.ydir = (ball.y - (player2.racket.y + RACKET_HEIGHT/2)) / RACKET_HEIGHT;
    if (ball.speed < MAX_SPEED)
      ball.speed += INC_SPEED;
  }
  else if (ball.x > WIDTH) {
    player1.score += 1;
    ft_goalScored(p5, socket);
  }
  else if (ball.x < (BALL_DIAMETER >> 1)) {
    player2.score += 1;
    ft_goalScored(p5, socket);
  }
}

function ft_goalScored(p5: p5Types, socket: Socket) {
  ball.x = WIDTH / 2;
  ball.y = HEIGHT / 2;
  ball.xdir *= -1;
  ball.ydir = 0;
  ball.speed = INITIAL_SPEED;
  if (player1.score == MAX_SCORE || player2.score == MAX_SCORE) {
      socket.emit('gameOver', { player1Score: player1.score, player2Score: player2.score });
      gameOver(p5, player1, player2);
  }
  else {
    // socket.emit('goalScored', { player1Score: player1.score, player2Score: player2.score });
    goalScored = true;
    setTimeout(() => {
      goalScored = false;
    }, 500);
  }
}

function checkCollision(player: Player, ball: Ball) {
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

export function checkKeys(p5: p5Types, socket: Socket) {
    
  if (p5.keyIsDown(87) || p5.keyIsDown(p5.UP_ARROW)) {
    if ((side == 2 || (p5.keyIsDown(p5.UP_ARROW) && mode === 2))
      && (player2.racket.y - RACKET_DY > 0)) {
      socket.emit("updateRacket", player2.racket.y - RACKET_DY);
      player2.racket.y -= RACKET_DY;
    }
    else if (side == 1 && (player1.racket.y - RACKET_DY > 0)) {
      socket.emit("updateRacket", player1.racket.y - RACKET_DY);
      player1.racket.y -= RACKET_DY;
    }
  }
  
  else if (p5.keyIsDown(83) || p5.keyIsDown(p5.DOWN_ARROW)) {
    if ((side == 2 || (p5.keyIsDown(p5.DOWN_ARROW) && mode === 2))
      && (player2.racket.y + RACKET_DY < HEIGHT - RACKET_HEIGHT)) {
        socket.emit("updateRacket", player2.racket.y + RACKET_DY);
        player2.racket.y += RACKET_DY;
    }
    else if (side == 1 && (player1.racket.y + RACKET_DY < HEIGHT - RACKET_HEIGHT)) {
      socket.emit("updateRacket", player1.racket.y + RACKET_DY);
      player1.racket.y += RACKET_DY;
    }
  }
}

export function  _mouseDragged(p5: p5Types, socket: Socket)
{
  if (p5.mouseY <= HEIGHT && p5.mouseY >= 0 &&
      p5.mouseX <= WIDTH && p5.mouseX >= 0)
      {
        let direction = (p5.mouseY - player1.racket.y) > 0 ? 1 : -1;
        if ((player1.racket.y + (RACKET_DY * direction) < HEIGHT - RACKET_HEIGHT)
            && (player1.racket.y + (RACKET_DY * direction) > 0)
            && side == 1 ) {
              socket.emit("updateRacket", player1.racket.y + (RACKET_DY * direction));
              player1.racket.y += (RACKET_DY * direction);
        }
        else if ((player2.racket.y + (RACKET_DY * direction) < HEIGHT - RACKET_HEIGHT)
            && (player2.racket.y + (RACKET_DY * direction) > 0)
            && side == 2) {
              socket.emit("updateRacket", player2.racket.y + (RACKET_DY * direction));
              player2.racket.y += (RACKET_DY * direction);
        }
      }
}

export function computerPlayer() {
  let speed = difficulty * 3; // Adjust this multiplier as needed

  if (ball.x > WIDTH / 4) {
    if (ball.y >= player2.racket.y && ball.y <= player2.racket.y + RACKET_HEIGHT) {
      return;
    }

    let diff = player2.racket.y - ball.y;
    if (diff < 0 && player2.racket.y + speed < HEIGHT)
      player2.racket.y += speed;
    else if (diff > 0 && player2.racket.y - speed > 0)
      player2.racket.y -= speed;
  }
}

export function eventListeners(p5: p5Types, socket: Socket) {
  socket.on('gameStart', () => {
    p5.removeElements();
    p5.loop();
    waitingForPlayer = false;
    startCountdown(p5);
  });

  socket.on('initGame', (data) => {
    side = data.side;
    player1 = data.player1;
    player2 = data.player2;
    ball = data.ball;
    
  });
  
  socket.on('gameOver', () => {
    // socket.emit('gameOver', { player1Score: player1.score, player2Score: player2.score });
    gameOver(p5, player1, player2);
  });

  socket.on('opponentDisconnected', () => {
    p5.removeElements();
    opponentDisconnect();
  });

  socket.on('updateRacket', (pos) => {
    if (side == 1) player2.racket.y = pos;
    else player1.racket.y = pos;
  });

  socket.on('updateBall', (ballPos) => {
    ball.x = ballPos.x;
    ball.y = ballPos.y;
    p5.redraw();
  });

  socket.on('updateScore', (payload) => {
    player1.score = payload.player1Score;
    player2.score = payload.player2Score;
    ball.x = WIDTH / 2;
    ball.y = HEIGHT / 2;
    ball.xdir *= -1;
    ball.ydir = 0;
    ball.speed = INITIAL_SPEED;
    goalScored = true;
      setTimeout(() => {
        goalScored = false;
      }, 500);
    p5.redraw();
  });
}