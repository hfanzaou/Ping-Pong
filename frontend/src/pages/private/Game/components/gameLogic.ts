import { Ball } from "../classes/Ball";
import { Player } from "../classes/Player";
import { Spark } from "../classes/Sparks";
import { LightningForge } from "../classes/Forge";
import p5Types from "p5";
import { Socket } from "socket.io-client";
import { startCountdown, gameOver, opponentDisconnect } from "./gameStates";
import { RACKET_DY, RACKET_HEIGHT, RACKET_WIDTH, HEIGHT, WIDTH, BALL_DIAMETER, INITIAL_SPEED, MAX_SPEED, INC_SPEED, BALL_DIAMETER_SQUARED} from "../classes/constants";
import { gameConfig } from "../classes/gameConfig";

let update: boolean = false;

export let player1: Player,
          player2: Player,
          ball: Ball,
          sparks: Spark[] = [],
          goalScored: boolean = false,
          forge: LightningForge,
          side: number = 1; // 1: left, 2 :right


export function  gameLoop(p5: p5Types, socket: Socket, config: gameConfig, setGameOver: (v: boolean) => void)
{
  if (!goalScored) {
    updateBallPos(p5, socket, config, setGameOver);
    updatePosition(config);
  }
}

export function  updatePosition(config: gameConfig) {
  ball.updatePosition(config.canvasWidth, config.canvasHeight);
}

export function  updateBallPos(p5: p5Types, socket: Socket, config: gameConfig, setGameOver: (v: boolean) => void)
{
  if (update) return;
  let nextY = ball.y + (ball.ydir * ball.speed);
  if (nextY + (ball.radius >> 1) >= config.canvasHeight || nextY - (ball.radius >> 1) <= 0) {
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
  else if (ball.x > config.canvasWidth) {
    player1.score += 1;
    ft_goalScored(p5, socket, config, setGameOver);
  }
  else if (ball.x < (ball.radius >> 1)) {
    player2.score += 1;
    ft_goalScored(p5, socket, config, setGameOver);
  }
}

function ft_goalScored(p5: p5Types, socket: Socket, config: gameConfig, setGameOver: (v: boolean) => void) {
  var xSpot = ball.x - ball.radius < 0 ? 0 : config.canvasWidth;
  shootSparks(xSpot, ball.y, -ball.xdir, p5);
  if (player1.score == config.maxScore || player2.score == config.maxScore) {
    ball.reset(p5, config);
    goalScored = true;
    setTimeout(() => {
      gameOver(p5, socket, setGameOver);
      goalScored = false;
    }, 1000);
    socket.emit('gameOver', { player1Score: player1.score, player2Score: player2.score });
  }
  else {
    // socket.emit('goalScored', { player1Score: player1.score, player2Score: player2.score });
    goalScored = true;
    setTimeout(() => {
      forge.resetLightningForge(config.canvasWidth, config.canvasHeight);
      goalScored = false;
    }, 1000);
    ball.reset(p5, config);
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

export function checkKeys(p5: p5Types, socket: Socket, config: gameConfig) {
    
  if (p5.keyIsDown(87) || p5.keyIsDown(p5.UP_ARROW)) {
    if (side == 2 || (p5.keyIsDown(p5.UP_ARROW) && config.mode === 2)) {
      player2.racket.moveUp(socket, config.canvasHeight);
    }
    else if (side == 1) {
      player1.racket.moveUp(socket, config.canvasHeight);
    }
  }
  
  else if (p5.keyIsDown(83) || p5.keyIsDown(p5.DOWN_ARROW)) {
    if (side == 2 || (p5.keyIsDown(p5.DOWN_ARROW) && config.mode === 2)) {
        player2.racket.moveDown(socket, config.canvasHeight);
    }
    else if (side == 1) {
      player1.racket.moveDown(socket, config.canvasHeight);
    }
  }
}

export function  _mouseDragged(p5: p5Types, socket: Socket, config: gameConfig)
{
  if (p5.mouseY <= config.canvasHeight && p5.mouseY >= 0 &&
      p5.mouseX <= config.canvasWidth && p5.mouseX >= 0)
      {
        let direction = (p5.mouseY - player1.racket.y) > 0 ? 1 : -1;
        if ((player1.racket.y + (RACKET_DY * direction) < config.canvasHeight - RACKET_HEIGHT)
            && (player1.racket.y + (RACKET_DY * direction) > 0)
            && side == 1 ) {
              socket.emit("updateRacket", { racketY: player1.racket.y + (RACKET_DY * direction), canvasHeight: config.canvasHeight });
              player1.racket.y += (RACKET_DY * direction);
        }
        else if ((player2.racket.y + (RACKET_DY * direction) < config.canvasHeight - RACKET_HEIGHT)
            && (player2.racket.y + (RACKET_DY * direction) > 0)
            && side == 2) {
              socket.emit("updateRacket", { racketY: player2.racket.y + (RACKET_DY * direction), canvasHeight: config.canvasHeight });
              player2.racket.y += (RACKET_DY * direction);
        }
      }
}

export function initGame(p5: p5Types, socket: Socket, config: gameConfig, user: any) {
  p5.removeElements();

  player1 = new Player(
    user, 
    10,
    HEIGHT / 2 - RACKET_HEIGHT/2, 
    "",
    config.canvasWidth,
    config.canvasHeight
  );
  player2 = new Player(
    {
    id: -1, 
    username: 'Computer', 
    socket: socket.id || '', 
    level: config.difficulty
    },
    WIDTH - 30, 
    HEIGHT / 2 - RACKET_HEIGHT/2, 
    "",
    config.canvasWidth,
    config.canvasHeight
  );
  ball = new Ball(
    p5, 
    config);
  forge = new LightningForge(config.canvasWidth, config.canvasHeight);
  startCountdown(p5);
}

export function computerPlayer(difficulty: number, config: gameConfig) {
  let speed = difficulty * 3; // Adjust this multiplier as needed

  if (ball.x > config.canvasWidth / 4) {
    if (ball.y >= player2.racket.y && ball.y <= player2.racket.y + RACKET_HEIGHT) {
      return;
    }

    let diff = player2.racket.y - ball.y;
    if (diff < 0 && player2.racket.y + speed < config.canvasHeight)
      player2.racket.y += speed;
    else if (diff > 0 && player2.racket.y - speed > 0)
      player2.racket.y -= speed;
  }
}

export function eventListeners(p5: p5Types, socket: Socket, config: gameConfig, setGameOver: (v: boolean) => void) {
  socket.on('gameStart', () => {
    p5.removeElements();
    p5.loop();
    startCountdown(p5);
  });

  socket.on('initGame', (data) => {
    side = data.side;
    player1 = new Player(
      data.player1.user, 
      10, 
      HEIGHT / 2 - RACKET_HEIGHT/2, 
      data.player1.roomName, 
      config.canvasWidth, 
      config.canvasHeight
    );
    player2 = new Player(
      data.player2.user,
      WIDTH - 30, 
      HEIGHT / 2 - RACKET_HEIGHT/2,  
      data.player2.roomName,
      config.canvasWidth,
      config.canvasHeight
    );
    ball = new Ball(p5, config);
    forge = new LightningForge(config.canvasWidth, config.canvasHeight);
    
  });
  
  socket.on('gameOver', () => {
    //socket.emit('gameOver', { player1Score: player1.score, player2Score: player2.score });
    gameOver(p5, socket, setGameOver);
  });

  socket.on('opponentDisconnected', () => {
    opponentDisconnect(socket, p5);
  });

  socket.on('updateRacket', (pos) => {
    let adjustedPos = pos * (config.canvasHeight / HEIGHT);
    if (side == 1) player2.racket.y = adjustedPos;
    else player1.racket.y = adjustedPos;
  });

  socket.on('updateBall', (ballPos) => {
    ball.x = ballPos.x * (config.canvasWidth / WIDTH);
    ball.y = ballPos.y * (config.canvasHeight / HEIGHT);
    ball.xdir = ballPos.xdir;
    ball.ydir = ballPos.ydir;
    ball.speed = ballPos.speed;
    ball.vel.x = (ballPos.xdir * ballPos.speed) * (config.canvasWidth / WIDTH);
    ball.vel.y = (ballPos.ydir * ballPos.speed) * (config.canvasHeight / HEIGHT);

    //p5.redraw();
  });

  socket.on('updateScore', (payload) => {
    player1.score = payload.player1Score;
    player2.score = payload.player2Score;
    let xSpot = ball.x - ball.radius/2 < 0 ? 0 :config.canvasWidth;
    shootSparks(xSpot, ball.y, -ball.xdir, p5);
    ball.x =config.canvasWidth / 2;
    ball.y = config.canvasHeight / 2;
    ball.xdir *= -1;
    ball.ydir = 0;
    ball.speed = INITIAL_SPEED;
    goalScored = true;
      setTimeout(() => {
        forge.resetLightningForge(config.canvasWidth, config.canvasHeight);
        goalScored = false;
      }, 1000);
    p5.redraw();
  });
}

export function removeEventListeners(socket: Socket) {
  socket.off('gameStart');
  socket.off('initGame');
  socket.off('gameOver');
  socket.off('opponentDisconnected');
  socket.off('updateRacket');
  socket.off('updateBall');
  socket.off('updateScore');
}


function shootSparks(x: number, y: number, xVel: number, p5: p5Types) {
  for (var i = 0; i < 50; i++) {
    var s = new Spark(x, y, xVel, p5);
    sparks.push(s);
 }
}
