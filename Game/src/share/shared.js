export function  gameLoop(ball, player1, player2)
{
  if (!goalScored) {
    updateBallPos(ball, player1, player2);
    ball.updatePosition();
  }
}

export function  updateBallPos(ball, player1, player2)
{
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
    if (player1.score == MAX_SCORE || player2.score == MAX_SCORE) {
      removeElements();
      play = 0;
      gameOverMessage = 'Game Over!';
      winnerMessage = (player1.score > player2.score) ? 'Player1 Won' : 'Player2 Won';
      playAgain = true;
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


function checkCollision(ball, player) {
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
