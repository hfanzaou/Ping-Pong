const WIDTH = 700;
const HEIGHT = 450;
const RACKET_HEIGHT = 100;
const RACKET_WIDTH = 15;
const RACKET_DY = 10;
const INITIAL_SPEED = 6;
const MAX_SPEED = 50;
const INC_SPEED = 0.5;
const BALL_DIAMETER = 15;
const BALL_DIAMETER_SQUARED = BALL_DIAMETER * BALL_DIAMETER;
const MAX_SCORE = 10;
const FRAME_RATE = 10;

let player1, player2, ball;

let socket;
let play = 0, side = 1;
let mode = 0; // mode: 1 Vs other player, 2 1Vs1 on one device, 3 VSComputer
let difficulty = 1; // 1: Easy, 2: Medium, 3: Hard
let waitingForPlayer = false;
let disconnectMessage = null, gameOverMessage = null, winnerMessage = null, playAgain = false, countdownInterval = null, countdown = 0;
let goalScored = false;
let update = false;

function  gameLoop()
{
  if (!goalScored && !update) {
    updateBallPos();
    updatePosition();
  }
  update = false;
}

function  updatePosition() {
    ball.x += (ball.xdir * ball.speed);
    ball.y += (ball.ydir * ball.speed);
}

function  updateBallPos()
{
  if (checkCollision(player1)) {
    ball.xdir = 1;
    ball.ydir = (ball.y - (player1.racket.y + RACKET_HEIGHT/2)) / RACKET_HEIGHT;
    if (ball.speed < MAX_SPEED)
      ball.speed += INC_SPEED;
  }
  else if (checkCollision(player2)) {
    ball.xdir = -1;
    ball.ydir = (ball.y - (player2.racket.y + RACKET_HEIGHT/2)) / RACKET_HEIGHT;
    if (ball.speed < MAX_SPEED)
      ball.speed += INC_SPEED;
  }
  else if (ball.x > WIDTH || ball.x < (BALL_DIAMETER >> 1)) {
    if (ball.x > WIDTH)
      player1.score += 1;
    else
      player2.score += 1;
    ball.x = WIDTH / 2;
    ball.y = HEIGHT / 2;
    ball.xdir *= -1;
    ball.ydir = 0;
    ball.speed = INITIAL_SPEED;
    if (player1.score == MAX_SCORE || player2.score == MAX_SCORE) {
        socket.emit('VsComputerGameOver', { player1Score: player1.score, player2Score: player2.score });
        gameOver();
    }
    else {
      goalScored = true;
      setTimeout(() => {
        goalScored = false;
      }, 500);
    }
  }
  else if (ball.y + (BALL_DIAMETER >> 1) >= HEIGHT || ball.y - (BALL_DIAMETER >> 1) <= 0) {
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

function selectMode() {

    let playButton = createButton('Vs other player');
    playButton.position(WIDTH / 2 - 20, HEIGHT / 2 - 60);
    playButton.mousePressed(() => {
      removeElements();
      socket.emit('join_room', ball);
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
        socket.emit('VsComputer');
        startCountdown();
      });
    
      let mediumButton = createButton('Medium');
      mediumButton.position(WIDTH / 2, HEIGHT / 2 + 100); // Adjust these values as needed
    
      mediumButton.mousePressed(() => {
        difficulty = 2;
        socket.emit('VsComputer');
        startCountdown();
      });
    
      let hardButton = createButton('Hard');
      hardButton.position(WIDTH / 2 + 80, HEIGHT / 2 + 100); // Adjust these values as needed
    
      hardButton.mousePressed(() => {
        difficulty = 3;
        socket.emit('VsComputer');
        startCountdown();
      });
    });
  
    let vsOtherPlayer2 = createButton('1Vs1 on same device');
    vsOtherPlayer2.position(WIDTH/2 - 40, HEIGHT/2);
    vsOtherPlayer2.mousePressed(() => {
      removeElements();
      mode = 2;
    });
}

function handleGameStates() {
    if (countdown > 0) {
        textSize(32);
        textAlign(CENTER, CENTER);
        text('Game starts in: ' + countdown, WIDTH / 2, HEIGHT / 2);
        return;
    }

    else if (waitingForPlayer) {
      textSize(32);
      text('Waiting for second player...', WIDTH / 2, HEIGHT / 2);
    }

    else if (disconnectMessage) {
      textAlign(CENTER, CENTER);
      textSize(20);
      text(disconnectMessage, WIDTH / 2, HEIGHT / 2);
    }

    else if (gameOverMessage) {
      textAlign(CENTER, CENTER);
      textSize(20);
      text(gameOverMessage, WIDTH / 2, HEIGHT / 2 - 60);
      text(winnerMessage, WIDTH / 2, HEIGHT / 2);
    }

    if (playAgain) {
        let playAgainButt = createButton('Play Again?');
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
}