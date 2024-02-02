
import p5Types from "p5";
import { removeEventListeners } from "./gameLogic";
import { Socket } from "socket.io-client";
import { WIDTH, HEIGHT } from "../classes/constants";
import { gameConfig } from "../classes/gameConfig";

export let play: boolean = false;
export let mode: number = 0;
export let difficulty: number = 1; // 1: Easy, 2: Medium, 3: Hard

let disconnectMessage: string | null,
    countdownInterval: NodeJS.Timeout,
    countdown: number = 0;

export let disconnect: boolean = false;


export function handleGameStates(p5: p5Types, config: gameConfig, socket: Socket) {
    if (countdown > 0) {
        p5.textSize(32);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.textStyle(p5.BOLD);
        p5.text('Game starts in: ' + countdown, config.canvasWidth/2, config.canvasHeight/2);
        return;
    }

    else if (disconnectMessage) {
      p5.textAlign(p5.CENTER, p5.CENTER);
      p5.textSize(20);
      p5.text(disconnectMessage, config.canvasWidth/2, config.canvasHeight/2);
    }

}

export function startCountdown(p5: p5Types) {
  p5.removeElements();
  countdown = 3;
  disconnectMessage = null;
  disconnect = false;
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
}

export function opponentDisconnect(socket: Socket, p5: p5Types, setGameOver: (value: boolean) => void){
  removeEventListeners(socket);
  p5.removeElements();
  play = false;
  disconnect = true;
  disconnectMessage = 'Opponent Disconnected :(';
  setGameOver(true);
}
