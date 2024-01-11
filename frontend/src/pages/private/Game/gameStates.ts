
// import { Ball } from "./classes/ball";
import { Player } from "./classes/player";
import p5Types from "p5";
import { canvas } from "./Game";
import { socket } from "./Game";
import { player1, player2 } from "./gameLogic";

const WIDTH = 700;
const HEIGHT = 450;

export let play: boolean = false;
export let mode: number = 0;
export let difficulty: number = 1; // 1: Easy, 2: Medium, 3: Hard

let disconnectMessage: string | null,
    gameOverMessage: string | null,
    winnerMessage: string | null,
    playAgain: boolean = false,
    countdownInterval: NodeJS.Timeout,
    countdown: number = 0,
    waitingForPlayer = false;

function positionButton(Button: p5Types.Element, Dy: number, Dx: number = 0) {
  let pos: any = canvas.position();
  Button.position(pos.x + WIDTH/2 + Dx, pos.y + HEIGHT/2 + Dy);
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

    else if (gameOverMessage && winnerMessage) {
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
          disconnectMessage = null;
          gameOverMessage = null;
          winnerMessage = null;
          playAgain = false;
          playAgainButt.remove();
          selectMode(p5);
        });
    }
}

export function startCountdown(p5: p5Types) {
  p5.removeElements();
  waitingForPlayer = false;
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

export function opponentDisconnect() {
  play = false;
  disconnectMessage = 'Opponent Disconnected :(';
  playAgain = true;
}