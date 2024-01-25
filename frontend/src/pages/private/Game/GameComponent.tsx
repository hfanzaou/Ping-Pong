import React, { useEffect, useRef } from 'react';
import p5 from "p5";
import { Socket } from 'socket.io-client';
import { eventListeners, checkKeys, computerPlayer, initGame, gameLoop, _mouseDragged, player1, player2, ball, sparks, goalScored, forceUpdate } from "./gameLogic";
import { WIDTH, HEIGHT, RACKET_HEIGHT, RACKET_WIDTH, INITIAL_SPEED, BALL_DIAMETER, MOVE } from './classes/constants';
import { handleGameStates, play } from './gameStates';
import { gameConfig } from './classes/constants';
import { userData } from './Game';



interface Props {
  socket: Socket;
  avatar: string;
  config: gameConfig;
  user: userData;
  endGame: () => void;
}

export let canvas: p5.Renderer;

const GameComponent: React.FC<Props> = ({socket, avatar, config, user, endGame}) => {
  const sketchRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    console.log(config);
    if (sketchRef.current === null) return;
    new p5(p => {
      p.setup = async () => {
        canvas = p.createCanvas(WIDTH, HEIGHT);
        eventListeners(p, socket);
        if (config.mode == 3 || config.mode == 2) {
          initGame(p, socket, config, user);
        }
        else {
          socket.emit('ready');
        }
        p.noStroke();
      };
  
      p.draw = () => {
        p.background('rgb(31, 41, 55)');
        p.fill('white');
        handleGameStates(p, socket, endGame);
        
        if (play) {
          p.textSize(32);
          p.textStyle(p.BOLD);
          p.text(player1.score, 40, 60);
          p.text(player2.score, WIDTH - 60, 60);
          
          checkKeys(p, socket, config.mode);
          if (config.mode == 3) {
            computerPlayer(config.difficulty);
            gameLoop(p, socket, config);
          }
          else if (config.mode == 2) {
            gameLoop(p, socket, config);
          }
          if (goalScored) {
            p.translate(p.random(-13, 13), p.random(-13, 13));
            for (var i = sparks.length - 1; i >= 0; i--) {
              sparks[i].update();
              sparks[i].show();
              if (sparks[i].done()) {
                sparks.splice(i, 1);
              }
            }
          }

          if (player1.racket.forcePush) {
            forceUpdate(player1);
          } else if (player2.racket.forcePush) {
            forceUpdate(player2);
          }

          p.circle(ball.x, ball.y, BALL_DIAMETER);
          p.rect(player1.racket.x, player1.racket.y, RACKET_WIDTH, RACKET_HEIGHT, 5);
          p.rect(player2.racket.x, player2.racket.y, RACKET_WIDTH, RACKET_HEIGHT, 5);
          p.stroke('white');
          p.strokeWeight(4);
          p.drawingContext.setLineDash([5, 15]);
          p.line(WIDTH / 2, 0, WIDTH / 2, HEIGHT);
          p.drawingContext.setLineDash([0, 0]);
          p.noStroke();
      }
      };
    }, sketchRef.current);
  }, []);

  return <div ref={sketchRef} />;
};

export default GameComponent;
