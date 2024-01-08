import { StarBorderPurple500, StarBorderPurple500Outlined } from "@mui/icons-material";
import { Ball } from "./classes/ball";
import { Player } from "./classes/player";
import p5Types from "p5";
import { Socket } from "socket.io-client";
import { canvas } from "./Game";
import { socket } from "./Game";


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

export let play: boolean = false;
export let mode: number = 0; // mode: 1 Vs other player, 2 1Vs1 on one device, 3 VSComputer;

let disconnectMessage: string,
    gameOverMessage: string,
    winnerMessage: string,
    playAgain: boolean = false,
    countdownInterval: NodeJS.Timeout,
    countdown: number = 0,
    goalScored: boolean = false,
    update: boolean = false,
    waitingForPlayer = false,
    difficulty: number = 1, // 1: Easy, 2: Medium, 3: Hard
    side: number = 1; // 1: left, 2:

export let player1: Player,
    player2: Player,
    ball: Ball;


export function  gameLoop(p5: p5Types)
{
  if (!goalScored) {
    updateBallPos(p5);
    updatePosition();
  }
}

export function  updatePosition() {
    ball.x += (ball.xdir * ball.speed);
    ball.y += (ball.ydir * ball.speed);
}

export function  updateBallPos(p5: p5Types)
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
    ft_goalScored(p5);
  }
  else if (ball.x < (BALL_DIAMETER >> 1)) {
    player2.score += 1;
    ft_goalScored(p5);
  }
}

function ft_goalScored(p5: p5Types) {
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

function positionButton(Button: p5Types.Element, Dy: number, Dx: number = 0) {
//   let x = canvas.position().x;
//   let y = canvas.position().y;
  let x = 0;
  let y = 0;

  Button.position(x + WIDTH/2 + Dx, y + HEIGHT/2 + Dy);
}

function ft_style(Button: p5Types.Element) {
  Button.style('background-color', 'rgb(51, 65, 85)');
  Button.style('color', 'white');
  Button.style('border', 'none');
  Button.style('padding', '10px 20px');
  Button.style('font-size', 'larger');
  Button.style('cursor', 'pointer');
  Button.style('border-radius', '5px');
  Button.style('font-family', 'system-ui');
}

export function selectMode(p5: p5Types) {

  p5.removeElements();
  let playButton = p5.createButton('Vs other player');
  positionButton(playButton, -80, -60);
  playButton.parent('sketchHolder');
  ft_style(playButton);
  playButton.mousePressed(() => {
    p5.removeElements();
    socket.emit('join_room');
    p5.noLoop();
    p5.fill('white');
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.textSize(20);
    p5.textStyle(p5.BOLD);
    p5.text('Waiting for second player...', WIDTH / 2, HEIGHT / 2);
    waitingForPlayer = true;
    mode = 1;
  });
  let vsOtherPlayer2 = p5.createButton('1Vs1 on same device');
  positionButton(vsOtherPlayer2, 0, -85);
  ft_style(vsOtherPlayer2);
  vsOtherPlayer2.parent('sketchHolder');
  vsOtherPlayer2.mousePressed(() => {
    p5.removeElements();
    socket.emit("1Vs1 on same device");
    mode = 2;
    startCountdown(p5);
  });

  let vsComputerButt = p5.createButton('Vs Computer');
  positionButton(vsComputerButt, 80, -55);
  ft_style(vsComputerButt);
  vsComputerButt.parent('sketchHolder');
  vsComputerButt.mousePressed(() => {
    mode = 3;
    let easyButton = p5.createButton('Easy');
    positionButton(easyButton, 140, -130); // Adjust these values as needed
    ft_style(easyButton);
    easyButton.parent('sketchHolder');
    easyButton.mousePressed(() => {
      difficulty = 1;
      socket.emit('VsComputer');
      startCountdown(p5);
    });
  
    let mediumButton = p5.createButton('Medium');
    ft_style(mediumButton);
    positionButton(mediumButton, 140, -40); // Adjust these values as needed
    mediumButton.parent('sketchHolder');
    mediumButton.mousePressed(() => {
      difficulty = 2;
      socket.emit('VsComputer');
      startCountdown(p5);
    });
  
    let hardButton = p5.createButton('Hard');
    positionButton(hardButton, 140, 80); // Adjust these values as needed
    ft_style(hardButton);
    hardButton.parent('sketchHolder');
    hardButton.mousePressed(() => {
      difficulty = 3;
      socket.emit('VsComputer');
      startCountdown(p5);
    });
  });

}

export function handleGameStates(p5: p5Types) {
    if (countdown > 0) {
        p5.textSize(32);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.textStyle(p5.BOLD);
        p5.text('Game starts in: ' + countdown, WIDTH / 2, HEIGHT / 2);
        return;
    }

    else if (waitingForPlayer) {
      p5.textSize(32);
      p5.text('Waiting for second player...', WIDTH / 2, HEIGHT / 2);
    }

    else if (disconnectMessage) {
      p5.textAlign(p5.CENTER, p5.CENTER);
      p5.textSize(20);
      p5.text(disconnectMessage, WIDTH / 2, HEIGHT / 2);
    }

    else if (gameOverMessage) {
      p5.textAlign(p5.CENTER, p5.CENTER);
      p5.textSize(20);
      p5.text(gameOverMessage, WIDTH / 2, HEIGHT / 2 - 60);
      p5.text(winnerMessage, WIDTH / 2, HEIGHT / 2);
    }

    if (playAgain) {
        let playAgainButt = p5.createButton('Main menu');
        positionButton(playAgainButt, 40, -60);
        ft_style(playAgainButt);
        playAgainButt.parent('sketchHolder');
        playAgainButt.mousePressed(() => {
          p5.removeElements();
          player1.score = 0;
          player2.score = 0;
          disconnectMessage = "";
          gameOverMessage = "";
          winnerMessage = "";
          playAgain = false;
          playAgainButt.remove();
          selectMode(p5);
        });
    }
}


export function checkKeys(p5: p5Types) {
    
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

export function  _mouseDragged(p5: p5Types)
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

export function eventListeners(p5: p5Types) {
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
    socket.emit('gameOver', { player1Score: player1.score, player2Score: player2.score });
    gameOver(p5, player1, player2);
  });

  socket.on('opponentDisconnected', () => {
    p5.removeElements();
    play = false;
    disconnectMessage = "Opponent Disconnected :(";
    playAgain = true;
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

export function startCountdown(p5: p5Types) {
  p5.removeElements();
  countdown = 3;
  countdownInterval = setInterval(() => {
    countdown--;
    if (countdown === 0) {
      clearInterval(countdownInterval);
      play = true;
      p5.loop();
    }
    p5.redraw();
  }, 1000);
}

export function gameOver(p5: p5Types, player1: Player, player2: Player) {
  p5.removeElements();
  play = false;
  gameOverMessage = 'Game Over!';
  winnerMessage = (player1.score > player2.score) ? 'Player1 Won' : 'Player2 Won';
  playAgain = true;
}

