
class Player {
  constructor(x, y, score) {
    this.racket = { x, y };
    this.score = score;
  }
}

class Ball {
  x;
  y;
  xdir;
  ydir;
  speed;

  constructor(x, y, xdir, ydir, speed) {
    this.x = x;
    this.y = y;
    this.xdir = xdir;
    this.ydir = ydir;
    this.speed = speed;
  }

  updatePosition() {
    this.x += (this.xdir * this.speed);
    this.y += (this.ydir * this.speed);
  }
}

const WIDTH = 700;
const HEIGHT = 450;
const RACKET_HEIGHT = 100;
const RACKET_WIDTH = 15;
const RACKET_DY = 10;
const INITIAL_SPEED = 8;
const MAX_SPEED = 50;
const BALL_DIAMETER = 15;
const BALL_DIAMETER_SQUARED = BALL_DIAMETER * BALL_DIAMETER;
const MAX_SCORE = 10;
// const FRAME_RATE = 50;

let player1 = new Player(10, HEIGHT / 2, 0);
let player2 = new Player(WIDTH - 30, HEIGHT / 2, 0);
let ball = new Ball(WIDTH / 2, HEIGHT / 2, 1, 0, INITIAL_SPEED);

let socket;
let play = 0, side = 0;
let mode = 0; // mode: 1 Vs other player, 2 1Vs1 on one device, 3 VSComputer
let difficulty = 1; // 1: Easy, 2: Medium, 3: Hard
let waitingForPlayer = false;
let timer = 3;
let disconnectMessage = null, gameOverMessage = null, winnerMessage = null, playAgain = false, countdownInterval = null, countdown = 0;
let playAgainButt = null;
let goalScored = false;

function setup() {
  
  socket = io();
  eventListeners();
  createCanvas(WIDTH, HEIGHT);
  noStroke();
  // frameRate(FRAME_RATE);
  selectMode();
}

function draw() {
  
  background(0);
  fill('white');
  if (countdown > 0) {
    textSize(32);
    textAlign(CENTER, CENTER);
    text('Game starts in: ' + countdown, WIDTH / 2, HEIGHT / 2);
    return;
  }

  if (waitingForPlayer) {
    textSize(32);
    text('Waiting for second player...', WIDTH / 2, HEIGHT / 2);
  }

  if (disconnectMessage) {
    textAlign(CENTER, CENTER);
    textSize(20);
    text(disconnectMessage, WIDTH / 2, HEIGHT / 2);
  }

  if (gameOverMessage) {
    textAlign(CENTER, CENTER);
    textSize(20);
    text(gameOverMessage, WIDTH / 2, HEIGHT / 2 - 60);
    text(winnerMessage, WIDTH / 2, HEIGHT / 2);
  }
  
  if (playAgain) {
    if (!playAgainButt) {
      playAgainButt = createButton('Play Again?');
      playAgainButt.position(WIDTH / 2 - 40, HEIGHT / 2 + 60);
      playAgainButt.mousePressed(() => {
        removeElements();
        selectMode();
        player1.score = 0;
        player2.score = 0;
        disconnectMessage = null;
        gameOverMessage = null;
        winnerMessage = null;
        playAgain = false;
      });
    }
    playAgainButt.show();
  } else if (playAgainButt) {
    playAgainButt.hide();
  }

  if (!play)
    return ;

  textSize(32);
  textStyle(BOLD);
  text(player1.score.toString(), 40, 60);
  text(player2.score.toString(), WIDTH - 60, 60);

  checkKeys();
  
  if (mode == 3) {
    computerPlayer();
  }
  
  circle(ball.x, ball.y, BALL_DIAMETER);
  rect(player1.racket.x, player1.racket.y, RACKET_WIDTH, RACKET_HEIGHT);
  rect(player2.racket.x, player2.racket.y, RACKET_WIDTH, RACKET_HEIGHT);
  stroke('white');
  strokeWeight(4);
  drawingContext.setLineDash([5, 15]);
  line(WIDTH / 2, 0, WIDTH / 2, HEIGHT);
  drawingContext.setLineDash([0, 0]);
  noStroke();
}

function checkKeys() {
  // if (mode == 2 &&
  //   keyIsDown(UP_ARROW) &&
  //   racket2.y - racketDy > 0) {
  //     racket2.y -= racketDy;
  // }
    
  // if (mode == 2 &&
  //   keyIsDown(DOWN_ARROW) &&
  //   racket2.y + racketDy < height - RACKET_HEIGHT) {
  //     racket2.y += racketDy;
  // }
    
  if ((keyIsDown(87) || keyIsDown(UP_ARROW)) && player1.racket.y - RACKET_DY > 0) {
    player1.racket.y -= RACKET_DY;
    socket.emit("updateRacket", player1.racket.y - RACKET_DY);
  }
  
  if ((keyIsDown(83) || keyIsDown(DOWN_ARROW)) && player1.racket.y + RACKET_DY < HEIGHT - RACKET_HEIGHT) {
    player1.racket.y += RACKET_DY;
    socket.emit("updateRacket", player1.racket.y + RACKET_DY);
  }

}

function  mouseDragged()
{
  if (mouseY < HEIGHT - RACKET_HEIGHT &&
      mouseX < WIDTH &&
      mouseX >= 0 &&
      mouseY >= 0)
      {
        socket.emit("updateRacket", mouseY);
        player1.racket.y = mouseY;
      }
}

function computerPlayer() {
  let speed = difficulty * 2; // Adjust this multiplier as needed

  if (ball.x > WIDTH / 4) {
    if (ball.y >= player2.racket.y && ball.y <= player2.racket.y + RACKET_HEIGHT) {
      gameLoop(ball, player1, player2);
      return;
    }

    let diff = player2.racket.y - ball.y;
    if (diff < 0 && player2.racket.y + speed < HEIGHT)
      player2.racket.y += speed;
    else if (diff > 0 && player2.racket.y - speed > 0)
      player2.racket.y -= speed;

    // socket.emit("updateRacketVsComputer", player2.racket.y);
  }
  gameLoop(ball, player1, player2);
}

function selectMode() {

  player1 = new Player(10, HEIGHT / 2, 0);
  player2 = new Player(WIDTH - 30, HEIGHT / 2, 0);
  ball = new Ball(WIDTH / 2, HEIGHT / 2, 1, 0, INITIAL_SPEED);
  let playButton = createButton('Vs other player');
  playButton.position(WIDTH / 2 - 20, HEIGHT / 2 - 60);
  playButton.mousePressed(() => {
    socket.emit('join_room', ball);
    removeElements();
    noLoop();
    fill('white');
    textAlign(CENTER, CENTER);
    textSize(20);
    textStyle(BOLD);
    text('Waiting for second player...', WIDTH / 2, HEIGHT / 2);
    waitingForPlayer = true;
    mode = 1;
  });

  let vsComputerButt = createButton('Vs Computer');
  vsComputerButt.position(WIDTH/2 - 20, HEIGHT/2 + 60);
  vsComputerButt.mousePressed(() => {
    mode = 3;
    let easyButton = createButton('Easy');
    easyButton.position(WIDTH / 2 - 60, HEIGHT / 2 + 100); // Adjust these values as needed
    easyButton.mousePressed(() => {
      difficulty = 1;
      removeElements();
      socket.emit('VsComputer', ball);
      startCountdown();
    });
  
    let mediumButton = createButton('Medium');
    mediumButton.position(WIDTH / 2, HEIGHT / 2 + 100); // Adjust these values as needed
  
    mediumButton.mousePressed(() => {
      difficulty = 2;
      removeElements();
      socket.emit('VsComputer', ball);
      startCountdown();
    });
  
    let hardButton = createButton('Hard');
    hardButton.position(WIDTH / 2 + 80, HEIGHT / 2 + 100); // Adjust these values as needed
  
    hardButton.mousePressed(() => {
      difficulty = 3;
      removeElements();
      socket.emit('VsComputer', ball);
      startCountdown();
    });
    // removeElements();
  });

  let vsOtherPlayer2 = createButton('1Vs1 on same device');
  vsOtherPlayer2.position(WIDTH/2 - 40, HEIGHT/2);
  vsOtherPlayer2.mousePressed(() => {
    removeElements();
    mode = 2;
  });
}

function eventListeners() {
  socket.on('gameStart', () => {
    removeElements();
    loop();
    waitingForPlayer = false;
    startCountdown();
  });

  socket.on('player1', (_side) => {
    side = _side;
  });

  socket.on('player2', (_side) => {
      side = _side;
      let racket = player1.racket;
      player1.racket = player2.racket;
      player2.racket = racket;
  });

  socket.on('opponentDisconnected', () => {
    removeElements();
    play = 0;
    disconnectMessage = "Opponent Disconnected :(";
    playAgain = true;
  });

  socket.on('updateRacket', (pos) => {
    player2.racket.y = pos;
  });

  socket.on('updateBall', (ballPos) => {
    ball.x = ballPos.x;
    ball.y = ballPos.y;
    redraw();
  });

  socket.on('updateScore', (payload) => {
    player1.score = payload.player1Score;
    player2.score = payload.player2Score;
  });

  socket.on('gameOver', () => {
    removeElements();
    play = 0;
    gameOverMessage = 'Game Over!';
    winnerMessage = (player1.score > player2.score) ? 'Player1 Won' : 'Player2 Won';
    playAgain = true;
  });
}

function startCountdown() {
  countdown = 3;
  countdownInterval = setInterval(() => {
    countdown--;
    if (countdown === 0) {
      clearInterval(countdownInterval);
      play = 1;
      loop();
    }
    redraw();
  }, 1000);
}

function  gameLoop()
{
  // console.log('in Game loop');
  if (!goalScored) {
    updateBallPos();
    ball.updatePosition();
    // console.log('in Game loop ball: ', ball);
  }
}

function  updateBallPos()
{
  if (checkCollision(player1)) {
    ball.xdir = 1;
    ball.ydir = (ball.y - (player1.racket.y + RACKET_HEIGHT/2)) / RACKET_HEIGHT;
    if (ball.speed < MAX_SPEED)
      ball.speed += 0.5;
  }
  else if (checkCollision(player2)) {
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
    if (player1.score == MAX_SCORE || player2.score == MAX_SCORE) {
      socket.emit('gameOver', { player1Score: player1.score, player2Score: player2.score });
    } else {
      goalScored = true;
      setTimeout(() => {
        goalScored = false;
      }, 500);
    }
  }
  else if (ball.y > HEIGHT - (BALL_DIAMETER >> 1) || ball.y < (BALL_DIAMETER >> 1)) {
    ball.ydir *= -1;
  }
}


function checkCollision(player) {
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

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}