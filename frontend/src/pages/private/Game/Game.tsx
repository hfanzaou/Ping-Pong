import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import PlayerCard from './components/PlayerCard';
import axios from 'axios';
import GameComponent from './components/GameComponent';
import GameSettings from './components/GameSettings';
import { gameConfig } from './classes/gameConfig';
import "./Game.css";
import GameOver from './components/GameOver';
import { player1, player2 } from './components/gameLogic';
import { disconnect } from './components/gameStates';
// import { Text } from '@mantine/core';

interface Props {
  socket: Socket;
  avatar: string;
  setUrlName: Function;
}

export interface userData {
  username: string;
  id?: number;
  level: string;
  avatar?: string;
}

interface OppData {
  username: string;
  level: string;
  avatar: string;
}

const Game: React.FC<Props> = ( {socket, avatar, setUrlName}) => {
  const [config, setGameConfig] = useState<gameConfig>( new gameConfig( 
    1, 
    10, 
    8, 
    'medium',
    'ghost',
    true, 
    1
  ));
  const [user, setUser] = useState<userData>({
    username: "",
    level: "",
    avatar: avatar
  });
  const [opp, setOpp] = useState<OppData>({ 
    username: "--", 
    level: "----", 
    avatar: "" 
  });
  const [side, setSide] = useState<boolean>(true);
  const [gameStart, setGameStart] = useState(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [oppParam, setOppParam] = useState<string | null>(null);

  const fetchUserName = async () => {
    const res = await axios.get('user/name')
    .then((res) => {
      if (res.data.name && res.data.name !== "")
        socket.emit('userName', {username: res.data.name});
    });
  };

  const fetchOppData = async (id: number) => {
    try {
      const res = await axios.get('user/game', {params: {opp: id}})
      .then((res) => {
        setOpp({ username: res.data.username, level: res.data.level, avatar: res.data.avatar });
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {

    if (user.username == "")
      fetchUserName();
    setSide(true);
    socket.on('userId', async (id: number) => {
      const res = await axios.get('user/game', {params: {opp: id}})
      .then((res) => {
        console.log(res.data);
        setUser({ username: res.data.username, id: id, level: res.data.level, avatar: res.data.avatar });
      });
    });

    socket.on('getData', (id: number, side: boolean) => {
      setSide(side);
      fetchOppData(id);
    });
    
    return () => {
      socket.off('startGame');
      socket.off('CannotStartGame');
      socket.off('userId');
      socket.off('getData');
    };
  }, []);

  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oppParam = params.get('opp');

    if (oppParam && user.username !== "" && !gameStart) {
      socket.emit('createGame', {userName: user.username, oppName: oppParam, config: config});
      setOppParam(oppParam);
    }
  
    socket.on('startGame', (config) => {
      console.log('Game started!');
      setGameConfig(config);
      setGameStart(true);
    });

    socket.on('CannotStartGame', () => {
      console.log('Cannot start game!');
      setGameStart(false);
    });


    return () => {
      socket.off('startGame');
      socket.off('CannotStartGame');
    };

  }, [user]);

  useEffect(() => {
    if (config.mode == 3) {
      setOpp({ username: 'Computer', level: config.difficulty.toString(), avatar: '' });
    }
  }, [config]);

  useEffect(() => {
    if (!gameStart) {
      setSide(true);
      setOpp({ username: "--", level: "----", avatar: "" });
    }
  }, [gameStart, gameOver]);

  return (
      <div className='mx-[50px] mt-[20px] p-5 rounded-xl bg-slate-900 shadow-5 xl:h-[75vh]'>
          <div className="flex justify-center items-center">

      <div className="mr-10 player-card">
        <PlayerCard
          setUrlName={setUrlName}
          name={side ? user.username : opp?.username} 
          avatar={side ? user.avatar : opp?.avatar} 
          level={side ? user.level : opp?.level?.toString()} />
      </div>
      <div className="player-avatar">
        <img src={side ? user.avatar : opp?.avatar} alt="Player avatar" />
      </div>
      <div
        id="sketchHolder"
        className="rounded-xl shadow-2xl w-[90%] md:w-[700px] h-[450px]"
        >
        {gameOver ? (
          <GameOver player1Score={player1.score} player2Score={player2.score} side={side} mode={config.mode} disconnect={disconnect} setGameOver={setGameOver} setGameStart={setGameStart} />
        ) : ( gameStart ? (
          <GameComponent socket={socket} avatar={avatar} config={config} user={user} setGameStart={setGameStart} setGameOver={setGameOver} />
        ) : (
          <GameSettings socket={socket} setGameConfig={setGameConfig} setGameStart={setGameStart} user={user} opp={oppParam} />
        )
        )}
      </div>
      <div className="ml-10 player-card">
        <PlayerCard
          setUrlName={setUrlName}
          name={(side || config.mode == 3) ? opp.username : user.username} 
          avatar={(side || config.mode == 3) ? opp?.avatar : user.avatar} 
          level={(side || config.mode == 3) ? opp.level.toString() : user.level} />
      </div>
      <div className="player-avatar rounded-xl">
        <img src={(side || config.mode == 3) ? opp?.avatar : user.avatar} alt="Player avatar" />
      </div>
    </div>
    </div>
  );
}

export default Game;
