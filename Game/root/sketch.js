
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
  handleGameStates()

  if (play) {
    textSize(32);
    textStyle(BOLD);
    text(player1.score, 40, 60);
    text(player2.score, WIDTH - 60, 60);

    checkKeys();
    if (mode == 3) {
      computerPlayer();
      gameLoop();
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
}

function checkKeys() {
    
  if (keyIsDown(87) || keyIsDown(UP_ARROW)) {
    if (side == 1 && player1.racket.y - RACKET_DY > 0) {
      socket.emit("updateRacket", player1.racket.y - RACKET_DY);
      player1.racket.y -= RACKET_DY;
    }
    else if (side == 2 && player2.racket.y - RACKET_DY > 0) {
      socket.emit("updateRacket", player2.racket.y - RACKET_DY);
      player2.racket.y -= RACKET_DY;
    }
  }
  
  else if (keyIsDown(83) || keyIsDown(DOWN_ARROW)) {
    if (side == 1 && player1.racket.y + RACKET_DY < HEIGHT - RACKET_HEIGHT) {
      socket.emit("updateRacket", player1.racket.y + RACKET_DY);
      player1.racket.y += RACKET_DY;
    }
    else if (side == 2 && player2.racket.y + RACKET_DY < HEIGHT - RACKET_HEIGHT) {
      socket.emit("updateRacket", player2.racket.y + RACKET_DY);
      player2.racket.y += RACKET_DY;
    }
  }

}

function  mouseDragged()
{
  if (mouseY < HEIGHT - RACKET_HEIGHT && mouseY >= 0 &&
      mouseX < WIDTH && mouseX >= 0)
      {
        socket.emit("updateRacket", mouseY);
        if (side == 1) player1.racket.y = mouseY;
        else player2.racket.y = mouseY;
      }
}

function computerPlayer() {
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

function eventListeners() {
  socket.on('gameStart', () => {
    removeElements();
    loop();
    waitingForPlayer = false;
    startCountdown();
  });

  socket.on('initGame', (data) => {
    side = data.side;
    player1 = data.player1;
    player2 = data.player2;
    ball = data.ball;
  });
  
  socket.on('gameOver', () => {
    socket.emit('gameOver', { player1Score: player1.score, player2Score: player2.score });
    gameOver();
  });

  socket.on('opponentDisconnected', () => {
    removeElements();
    play = 0;
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
    redraw();
  });

  socket.on('updateScore', (payload) => {
    player1.score = payload.player1Score;
    player2.score = payload.player2Score;
    ball = payload.ball;
    goalScored = true;
    console.log("Goal Scored");
    console.log(ball);
    redraw();
  });

}

function startCountdown() {
  removeElements();
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

function gameOver() {
  removeElements();
  play = 0;
  gameOverMessage = 'Game Over!';
  winnerMessage = (player1.score > player2.score) ? 'Player1 Won' : 'Player2 Won';
  playAgain = true;
}
