import { Ball } from "../classes/ball";
import { Player } from "../classes/player";
import { Spark } from "../classes/Sparks";
import { LightningForge } from "../classes/Forge";
import p5Types from "p5";
import { Socket } from "socket.io-client";
import { startCountdown, gameOver, opponentDisconnect } from "./gameStates";
import { RACKET_DY, RACKET_HEIGHT, RACKET_WIDTH, HEIGHT, WIDTH, BALL_DIAMETER, INITIAL_SPEED, MAX_SPEED, INC_SPEED, BALL_DIAMETER_SQUARED, gameConfig } from "../classes/constants";

let update: boolean = false,
    side: number = 1; // 1: left, 2 :right

export let player1: Player,
  player2: Player,
  ball: Ball,
  sparks: Spark[] = [],
  goalScored: boolean = false,
  forge: LightningForge;


export function  gameLoop(p5: p5Types, socket: Socket, config: gameConfig)
{
  if (!goalScored) {
    updateBallPos(p5, socket, config);
    updatePosition();
  }
}

export function  updatePosition() {
  ball.updatePosition();
}

export function  updateBallPos(p5: p5Types, socket: Socket, config: gameConfig)
{
  if (update) return;
  let nextY = ball.y + (ball.ydir * ball.speed);
  if (nextY + (BALL_DIAMETER >> 1) >= HEIGHT || nextY - (BALL_DIAMETER >> 1) <= 0) {
    ball.ydir *= -1;
  }

  if (checkCollision(player1, ball)) {
    player1.racket.forcePush = true;
    ball.xdir = 1;
    ball.ydir = (ball.y - (player1.racket.y + RACKET_HEIGHT/2)) / RACKET_HEIGHT;
    if (ball.speed < MAX_SPEED && config.boost)
      ball.speed += INC_SPEED;
  }
  else if (checkCollision(player2, ball)) {
    player2.racket.forcePush = true;
    ball.xdir = -1;
    ball.ydir = (ball.y - (player2.racket.y + RACKET_HEIGHT/2)) / RACKET_HEIGHT;
    if (ball.speed < MAX_SPEED && config.boost)
      ball.speed += INC_SPEED;
  }
  else if (ball.x > WIDTH) {
    player1.score += 1;
    ft_goalScored(p5, socket, config);
  }
  else if (ball.x < (BALL_DIAMETER >> 1)) {
    player2.score += 1;
    ft_goalScored(p5, socket, config);
  }
}

function ft_goalScored(p5: p5Types, socket: Socket, config: gameConfig) {
  if (player1.score == config.maxScore || player2.score == config.maxScore) {
    socket.emit('gameOver', { player1Score: player1.score, player2Score: player2.score });
    gameOver(p5, player1, player2);
  }
  else {
    // socket.emit('goalScored', { player1Score: player1.score, player2Score: player2.score });
    goalScored = true;
    var xSpot = ball.x - BALL_DIAMETER/2 < 0 ? 0 : WIDTH;
    shootSparks(xSpot, ball.y, -ball.xdir, p5);
    setTimeout(() => {
      forge.resetLightningForge();
      goalScored = false;
    }, 1000);
    ball.x = WIDTH / 2;
    ball.y = HEIGHT / 2;
    ball.xdir *= -1;
    ball.ydir = 0;
    ball.speed = config.ballSpeed;
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

export function checkKeys(p5: p5Types, socket: Socket, mode: number) {
    
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

export function initGame(p5: p5Types, socket: Socket, config: gameConfig, user: any) {
  player1 = new Player({id: user.id, username: user.username, socket: socket.id || '', level: user.level}, 10, HEIGHT / 2 - RACKET_HEIGHT/2, 0, "");
 player2 = new Player({id: -1, username: 'Computer', socket: socket.id || '', level: user.level}, WIDTH - 30, HEIGHT / 2 - RACKET_HEIGHT/2, 0, "");
  ball = new Ball(WIDTH / 2, HEIGHT / 2, 1, 0, config.ballSpeed, p5);
  forge = new LightningForge();
  startCountdown(p5);
}

export function computerPlayer(difficulty: number) {
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

export function eventListeners(p5: p5Types, socket: Socket, config: gameConfig) {
  socket.on('gameStart', () => {
    p5.removeElements();
    p5.loop();
    startCountdown(p5);
  });

  socket.on('initGame', (data) => {
    side = data.side;
    player1 = new Player(data.player1.user, 10, HEIGHT / 2 - RACKET_HEIGHT/2, 0, "");
    player2 = new Player(data.player2.user, WIDTH - 30, HEIGHT / 2 - RACKET_HEIGHT/2, 0, "");
    ball = new Ball(WIDTH / 2, HEIGHT / 2, 1, 0, config.ballSpeed, p5);
    forge = new LightningForge();
    
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
    ball.xdir = ballPos.xdir;
    ball.ydir = ballPos.ydir;
    ball.speed = ballPos.speed;
    ball.vel.x = (ball.xdir * ball.speed);
    ball.vel.y = (ball.ydir * ball.speed);

    //p5.redraw();
  });

  socket.on('updateScore', (payload) => {
    player1.score = payload.player1Score;
    player2.score = payload.player2Score;
    let xSpot = ball.x - BALL_DIAMETER/2 < 0 ? 0 : WIDTH;
    shootSparks(xSpot, ball.y, -ball.xdir, p5);
    ball.x = WIDTH / 2;
    ball.y = HEIGHT / 2;
    ball.xdir *= -1;
    ball.ydir = 0;
    ball.speed = INITIAL_SPEED;
    goalScored = true;
      setTimeout(() => {
        forge.resetLightningForge();
        goalScored = false;
      }, 1000);
    p5.redraw();
  });
}


function shootSparks(x: number, y: number, xVel: number, p5: p5Types) {
  for (var i = 0; i < 50; i++) {
    var s = new Spark(x, y, xVel, p5);
    sparks.push(s);
 }
}
