import React, { useEffect, useRef } from 'react';
import p5 from "p5";
import { Socket } from 'socket.io-client';
import { eventListeners, checkKeys, computerPlayer, initGame, gameLoop, _mouseDragged, player1, player2, ball, sparks, goalScored, forge } from "./gameLogic";
import { WIDTH, HEIGHT, RACKET_HEIGHT, RACKET_WIDTH, INITIAL_SPEED, BALL_DIAMETER, MOVE } from '../classes/constants';
import { handleGameStates, play } from './gameStates';
import { gameConfig } from '../classes/gameConfig';
import { userData } from '../Game';



interface Props {
  socket: Socket;
  avatar: string;
  config: gameConfig;
  user: userData;
  endGame: (gameOverMess: string) => void;
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
        eventListeners(p, socket, config);
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
        handleGameStates(p, config, socket, endGame);
        
        if (play) {
          p.textSize(32);
          p.textStyle(p.BOLD);
          p.text(player1.score, 40, 60);
          p.text(player2.score, WIDTH - 60, 60);
          
          checkKeys(p, socket, config.mode);
          if (config.mode == 3) {
            computerPlayer(config.difficulty);
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
            player1.racket.forceUpdate();
          } else if (player2.racket.forcePush) {
            player2.racket.forceUpdate();
          }
          
          if (forge.forgeIsFormed()) {
            if (config.mode == 2 || config.mode == 3) {
              gameLoop(p, socket, config);
            }
            ball.show(p);
          } else {
            forge.update(p);
            forge.show(p);
            p.translate(p.random(-3, 3), p.random(-3, 3));
          }

          player1.show(p);
          if (player1.racket.forcePush) {
            player1.racket.forceUpdate();
          }

          player2.show(p);
          if (player2.racket.forcePush) {
            player2.racket.forceUpdate();
          }

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
