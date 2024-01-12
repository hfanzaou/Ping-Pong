import React from 'react';
import Header from '../../../Layout/Header/Header';
import { io, Socket } from 'socket.io-client';
import Sketch from 'react-p5';
import p5Types from "p5";
import { selectMode, handleGameStates, mode, play } from "./gameStates";
import { eventListeners,
        checkKeys, 
        computerPlayer,
        gameLoop,
        _mouseDragged,
        player1,
        player2,
        ball 
      } from "./gameLogic";

const WIDTH = 700;
const HEIGHT = 450;
const RACKET_HEIGHT = 100;
const RACKET_WIDTH = 15;
const INITIAL_SPEED = 8;
const BALL_DIAMETER = 15;
    

function Game({avatar} : {avatar: string}) {
  return (
    <div>
            {/* <Header avatar={avatar}/> */}
            <div id="sketchHolder" className="flex items-center justify-center">
              <GameComponent />
            </div>
        </div>
    );
  }
  
export let socket: Socket;
export let canvas: p5Types.Renderer;

const GameComponent = () => {
  
  if (socket === undefined)
    socket = io(import.meta.env.VITE_API_BASE_URL);

  const setup = (p5: p5Types) => { 
    canvas = p5.createCanvas(WIDTH, HEIGHT);
    canvas.parent('sketchHolder');
    eventListeners(p5);
    p5.noStroke();
    selectMode(p5);
  };
  
  const draw = (p5: p5Types) => {
    p5.background('rgb(40, 41, 55)');
    p5.fill('white');
    handleGameStates(p5);

    if (play) {
      p5.textSize(32);
      p5.textStyle(p5.BOLD);
      p5.text(player1.score, 40, 60);
      p5.text(player2.score, WIDTH - 60, 60);

      checkKeys(p5);
      if (mode == 3) {
        computerPlayer();
        gameLoop(p5);
      }
      else if (mode == 2) {
        gameLoop(p5);
      }
      p5.circle(ball.x, ball.y, BALL_DIAMETER);
      p5.rect(player1.racket.x, player1.racket.y, RACKET_WIDTH, RACKET_HEIGHT);
      p5.rect(player2.racket.x, player2.racket.y, RACKET_WIDTH, RACKET_HEIGHT);
      p5.stroke('white');
      p5.strokeWeight(4);
      p5.drawingContext.setLineDash([5, 15]);
      p5.line(WIDTH / 2, 0, WIDTH / 2, HEIGHT);
      p5.drawingContext.setLineDash([0, 0]);
      p5.noStroke();
    }
  };

  return <Sketch setup={setup} draw={draw} mouseDragged={_mouseDragged}/>;
};

export default Game
