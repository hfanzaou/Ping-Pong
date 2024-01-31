
import { Player } from "../classes/Player";
import p5Types from "p5";
import { canvas } from "./GameComponent";
import { initGame, player1, player2, removeEventListeners } from "./gameLogic";
import { Socket } from "socket.io-client";
import { WIDTH, HEIGHT } from "../classes/constants";
import { gameConfig } from "../classes/gameConfig";

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

class consoleMessage {
  constructor(public message: string, public color: string) {
    this.message = message;
    this.color = color;
  }

  display(p5: p5Types) {
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.textSize(20);
    p5.textStyle(p5.BOLD);
    p5.fill(this.color);
    p5.text(this.message, WIDTH / 2, HEIGHT / 2);
  }
}

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

export function handleGameStates(p5: p5Types, config: gameConfig, socket: Socket) {
    if (countdown > 0) {
        p5.textSize(32);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.textStyle(p5.BOLD);
        p5.text('Game starts in: ' + countdown, WIDTH / 2, HEIGHT / 2);
        return;
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
      //endGame(winnerMessage);
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

export function gameOver(p5: p5Types, socket: Socket, setGameOver: (value: boolean) => void) {

  removeEventListeners(socket);
  p5.removeElements();
  play = false;
  setGameOver(true);
  // gameOverMessage = 'Game Over!';
  // winnerMessage = (player1.score > player2.score) ? player1.user.username + ' Won' : player2.user.username + ' Won';
  // playAgain = true;
}

export function opponentDisconnect() {
  play = false;
  disconnectMessage = 'Opponent Disconnected :(';
  playAgain = true;
}
