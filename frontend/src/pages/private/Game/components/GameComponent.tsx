import React, { useEffect, useRef, useState } from 'react';
import p5 from "p5";
import { Socket } from 'socket.io-client';
import { eventListeners, checkKeys, computerPlayer, initGame, gameLoop, _mouseDragged, player1, player2, ball, sparks, goalScored, forge } from "./gameLogic";
import { handleGameStates, play } from './gameStates';
import { gameConfig } from '../classes/gameConfig';
import { userData } from '../Game';
import GameOver from './GameOver';



interface Props {
  socket: Socket;
  avatar: string;
  config: gameConfig;
  user: userData;
  setGameStart: (v: boolean) => void;
  //GameStart: boolean;
}

export let canvas: p5.Renderer;

const GameComponent: React.FC<Props> = ({socket, avatar, config, user, setGameStart}) => {
  const sketchRef = useRef<HTMLDivElement | null>(null);
  const [gameOver, setGameOver] = useState<boolean>(false);

  useEffect(() => {

    console.log(config);
    if (sketchRef.current === null) return;
    new p5(p => {
      p.setup = async () => {
        config.canvasWidth = p.windowWidth > 800 ? (p.windowWidth * 0.51) : (p.windowWidth * 0.8);
        config.canvasHeight = p.windowHeight > 600 ? (p.windowHeight * 0.7) : (p.windowHeight * 0.9);
        canvas = p.createCanvas(config.canvasWidth, config.canvasHeight);
        eventListeners(p, socket, config, setGameOver);
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
      
        if (!play)
          handleGameStates(p, config, socket);
        
        if (play) {
          socket.emit('state', "Ingame");
          p.textSize(32);
          p.textStyle(p.BOLD);
          p.text(player1.score, 40, 60);
          p.text(player2.score, config.canvasWidth - 60, 60);
          
          checkKeys(p, socket, config);
          if (config.mode == 3) {
            computerPlayer(config.difficulty, config);
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
              gameLoop(p, socket, config, setGameOver);
            }
            ball.show(p, config.canvasWidth);
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
          p.line(config.canvasWidth / 2, 0, config.canvasWidth / 2, config.canvasHeight);
          p.drawingContext.setLineDash([0, 0]);
          p.noStroke();
        }
      };
      
      p.windowResized = () => {
        config.canvasWidth = p.windowWidth > 800 ? (p.windowWidth * 0.51) : (p.windowWidth * 0.8);
        config.canvasHeight = p.windowHeight > 600 ? (p.windowHeight * 0.7) : (p.windowHeight * 0.9);
        player1.racket.resize(config.canvasWidth, config.canvasHeight, 1);
        player2.racket.resize(config.canvasWidth, config.canvasHeight, 2);
        socket.emit('windowResized');
        p.resizeCanvas(config.canvasWidth, config.canvasHeight);
      };

  }, sketchRef.current);

  }, [gameOver]);

  return (
    gameOver ? <GameOver score={player1.score} user={user.username} setGameOver={setGameOver} setGameStart={setGameStart} /> 
      : <div ref={sketchRef} />
  );
};

export default GameComponent;
