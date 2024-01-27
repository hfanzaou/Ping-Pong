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

const Game: React.FC<Props> = ( {socket, avatar}) => {
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
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [gameOverMess, setGameOverMess] = useState("");
  
  const startGame = () => {
    console.log('startGame!');
    console.log(user);
    console.log(opp);
    console.log(config);
    console.log(side);
    setGameStarted(true);
    if (config.mode == 3) {
      console.log('Here');
      setOpp({ username: 'Computer', level: config.difficulty.toString(), avatar: 'https://i.imgur.com/1zXQq3j.png' });
    }
  };

  const endGame = (gameOverMes: string) => {
    console.log('endGame!');
    setGameEnded(true);
    setGameOverMess(gameOverMes);
    // setGameStarted(false);
    // setOpp({username: "--", level: "----", avatar: ""});
    // setSide(true);
  };

  const MainMenuClick = () => {
    setGameEnded(false);
    setGameStarted(false);
    setOpp({username: "--", level: "----", avatar: ""});
    setSide(true);
  }

  const fetchUserName = async () => {
    const res = await axios.get('user/name')
    .then((res) => {
      //console.log(res.data);
      socket.emit('userName', res.data.name);
    });
  };

  const fetchOppData = async (id: number) => {
    try {
      const res = await axios.get('user/game', {params: {opp: id}})
      .then((res) => {
        // console.log(res.data);
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
      // setUser({ ...user, username: userParam });
      // setOpp({ ...opp, username: oppParam })  ;
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
      setGameStarted(true);
    });

    socket.on('CannotStartGame', () => {
      console.log('Cannot start game!');
      setGameStarted(false);
    });
  }, [user]);

  return (
    <div className="flex justify-center items-center mx-4 p-5 rounded-lg bg-slate-900">
      <div className="mr-10">
        <PlayerCard 
          name={side ? user.username : opp?.username} 
          avatar={side ? user.avatar : opp?.avatar} 
          level={side ? user.level : opp?.level?.toString()} />
      </div>
      <div
        id="sketchHolder"
        className="rounded-xl shadow-2xl"
        >
        {( gameStarted ? (
          <GameComponent socket={socket} avatar={avatar} config={config} user={user} endGame={endGame} />
        ) : (
          <GameSettings socket={socket} setGameConfig={setGameConfig} startGame={startGame} />
        )
        )}
      </div>
      <div className="ml-10">
        <PlayerCard 
          name={(side || config.mode == 3) ? opp.username : user.username} 
          avatar={(side || config.mode == 3) ? opp?.avatar : user.avatar} 
          level={(side || config.mode == 3) ? opp.level.toString() : user.level} />
      </div>
    </div>
  );
}

export default Game;
