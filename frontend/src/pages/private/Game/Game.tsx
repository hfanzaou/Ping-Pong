import { useState } from 'react';
import { io, Socket } from 'socket.io-client';
import Sketch from 'react-p5';
import p5Types, { Image } from "p5";
import React, { useEffect, useRef } from 'react';
import Header from '../../../Layout/Header/Header';
import p5 from "p5";
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



export let canvas: p5Types.Renderer;
let img: Image;
interface Props {
  socket: Socket;
  avatar: string;
}

const Game: React.FC<Props> = ( {socket, avatar}) => {
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
              <GameComponent socket={socket} avatar={avatar} />
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


const GameComponent: React.FC<Props> = ({socket, avatar}) => {

  const sketchRef = useRef(document.getElementById('sketchHolder'));

  useEffect(() => {
    new p5(p => {
      //let canvas: p5.Renderer;

      p.setup = async () => {
        const response = await fetch('http://localhost:3001/user/name', {
          credentials: "include"
        });
        const data = await response.json();
        socket.emit('userName', data.name);

        canvas = p.createCanvas(WIDTH, HEIGHT);
        // canvas.parent('');
        eventListeners(p, socket);
        p.noStroke();
        selectMode(p, socket);
      };
  
      p.draw = () => {
        p.background('rgb(40, 41, 55)');
        p.fill('white');
        handleGameStates(p, socket);
      
        if (play) {
          p.textSize(32);
          p.textStyle(p.BOLD);
          p.text(player1.score, 40, 60);
          p.text(player2.score, WIDTH - 60, 60);
        
          checkKeys(p, socket);
          if (mode == 3) {
            computerPlayer();
            gameLoop(p, socket);
          }
          else if (mode == 2) {
            gameLoop(p, socket);
          }
          p.circle(ball.x, ball.y, BALL_DIAMETER);
          p.rect(player1.racket.x, player1.racket.y, RACKET_WIDTH, RACKET_HEIGHT);
          p.rect(player2.racket.x, player2.racket.y, RACKET_WIDTH, RACKET_HEIGHT);
          p.stroke('white');
          p.strokeWeight(4);
          p.drawingContext.setLineDash([5, 15]);
          p.line(WIDTH / 2, 0, WIDTH / 2, HEIGHT);
          p.drawingContext.setLineDash([0, 0]);
          p.noStroke();
        }
      };
  }, 'sketchHolder');
  }, []);

  return <div ref={sketchRef} />;
};

export default Game
