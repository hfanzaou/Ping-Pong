import React, { useState } from 'react';
import Header from '../../../Layout/Header/Header';
import { io, Socket } from 'socket.io-client';
import Sketch from 'react-p5';
import p5Types, { Image } from "p5";
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
import Avatar from 'react-avatar-edit';
import { Center, Grid, GridCol, SimpleGrid, Space } from '@mantine/core';
import UserCard from '../Profile/ProfileInfo/UserCard';
import PlayerCard from './PlayerCard';
import axios from 'axios';

const WIDTH = 700;
const HEIGHT = 450;
const RACKET_HEIGHT = 100;
const RACKET_WIDTH = 15;
const INITIAL_SPEED = 8;
const BALL_DIAMETER = 15;
const MOVE = 200;


let socket: Socket;
function Game({socketpass, avatar, setUrlName} : {socketpass: Socket, avatar: string, setUrlName: Function}) {
  socket = socketpass;
  const   [oppAvatar, setOppAvatar] = useState<string>();
  const   [oppName, setOppName] = useState<string>();
  const   [oppLevel, setOppLevel] = useState<string>();
  const   [side, setSide] = useState<boolean>()
  socket.on('getData', async (id: number, side: boolean) => 
  {
    setSide(side);
    console.log("hello");
    console.log(id)
    await axios.get('user/game', {params: {opp: id}})
    .then((res) => {
      setOppAvatar(res.data.avatar);
      console.log(res.data.username)
      setOppName(res.data.username);
      setOppLevel(res.data.level);
    }).catch((err)=> {
      console.log(err);
    })
  })
  return (
    <div className='mx-[50px] mt-[25px] p-5 rounded-lg bg-slate-900 shadow-5'>
            {/* <Header avatar={avatar}/> */}
            <div>

            <Grid>   
            <Grid.Col span={1}><PlayerCard name={side === true? 0: oppName} avatar={side === true? avatar: oppAvatar} /></Grid.Col>
            <Grid.Col span={7}>
            <div 
            id="sketchHolder" className="flex items-center justify-center">
              <GameComponent avatar={avatar} />
            </div>
            </Grid.Col>
            <Grid.Col span={1}>
              <PlayerCard name={side === false? 0: oppName} avatar={side === false? avatar: oppAvatar} />
              </Grid.Col>
           {/* <Space h="md" />  */}
            </Grid>
            </div>
        </div>
    );
  }
export {socket};
export let canvas: p5Types.Renderer;
let img: Image;
const GameComponent = ({avatar} : {avatar: string}) => {
  const setup = (p5: p5Types) => { 
    canvas = p5.createCanvas(WIDTH, HEIGHT);
    canvas.parent('sketchHolder');
    eventListeners(p5);
   p5.noStroke();
   selectMode(p5);
  };
  
  const draw = (p5: p5Types) => {
    p5.background('rgb(31,41,55)');
    handleGameStates(p5);

    if (play) {
      p5.fill('white');
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
      p5.circle(ball.x, ball.y , BALL_DIAMETER);
      p5.rect(player1.racket.x, player1.racket.y, RACKET_WIDTH, RACKET_HEIGHT);
      p5.rect(player2.racket.x, player2.racket.y, RACKET_WIDTH, RACKET_HEIGHT);
      p5.stroke('white');
      p5.strokeWeight(4);
      p5.drawingContext.setLineDash([5, 15]);
      p5.line(WIDTH / 2 , 0, WIDTH / 2, HEIGHT);
      p5.drawingContext.setLineDash([0, 0]);
      p5.noStroke();
    }
    handleGameStates(p5);
  };

  return <Sketch setup={setup} draw={draw} mouseDragged={_mouseDragged}/>;
};

export default Game
