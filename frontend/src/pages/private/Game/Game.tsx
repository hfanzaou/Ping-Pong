import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import PlayerCard from './components/PlayerCard';
import axios from 'axios';
import GameComponent from './components/GameComponent';
import GameSettings from './components/GameSettings';
import { gameConfig } from './classes/gameConfig';
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
    false, 
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
  
  const startGame = () => {
    console.log('startGame!');
    console.log(user);
    console.log(opp);
    console.log(config);
    console.log(side);
    setGameStart(true);
    if (config.mode == 3) {
      console.log('Here');
      setOpp({ username: 'Computer', level: config.difficulty.toString(), avatar: 'https://i.imgur.com/1zXQq3j.png' });
    }
  };

  const fetchUserName = async () => {
    const res = await axios.get('user/name')
    .then((res) => {
      socket.emit('userName', res.data.name);
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
    if (config.mode == 3) {
      setOpp({ username: 'Computer', level: config.difficulty.toString(), avatar: 'https://i.imgur.com/1zXQq3j.png' });
    }
  }, [config]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userParam = params.get('user');
    const oppParam = params.get('opp');

    if (userParam && oppParam) {
      if (userParam == user.username) {
        socket.emit('createGame', { user1: userParam, user2: oppParam, config: config });
      }
    }

    socket.on('startGame', () => {
      console.log('Game started!');
      setGameConfig(new gameConfig(
        1, 
        10, 
        8, 
        'medium',
        'ghost',
        false, 
        1
      ));
      setGameStart(true);
    });

    socket.on('CannotStartGame', () => {
      console.log('Cannot start game!');
      setGameStart(false);
    });
  }, [user]);

  return (
    <div className="flex justify-center items-center mx-4 p-5 rounded-lg bg-slate-900">
      <div className="mr-10">
        <PlayerCard
          setUrlName={setUrlName}
          name={side ? user.username : opp?.username} 
          avatar={side ? user.avatar : opp?.avatar} 
          level={side ? user.level : opp?.level?.toString()} />
      </div>
      <div
        id="sketchHolder"
        className="rounded-xl shadow-2xl"
        >
        {( gameStart ? (
          <GameComponent socket={socket} avatar={avatar} config={config} user={user} setGameStart={setGameStart} />
        ) : (
          <GameSettings socket={socket} setGameConfig={setGameConfig} startGame={startGame} />
        )
        )}
      </div>
      <div className="ml-10">
        <PlayerCard
          setUrlName={setUrlName}
          name={(side || config.mode == 3) ? opp.username : user.username} 
          avatar={(side || config.mode == 3) ? opp?.avatar : user.avatar} 
          level={(side || config.mode == 3) ? opp.level.toString() : user.level} />
      </div>
    </div>
  );
}

export default Game;
