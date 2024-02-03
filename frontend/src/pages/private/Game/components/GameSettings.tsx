import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { FaArrowLeft } from 'react-icons/fa';
import { gameConfig } from '../classes/gameConfig';
import { Text } from '@mantine/core';
import './loader.css';
import { userData } from '../Game';

interface Props {
  socket: Socket;
  setGameStart: (v: boolean) => void;
  setGameConfig: (config: gameConfig) => void;
  user: userData;
  opp: string | null;
}

const GameSettings: React.FC<Props> = ({ socket, setGameConfig, setGameStart, user, opp}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [numGoals, setNumGoals] = useState(10);
  const [ballSpeed, setBallSpeed] = useState('normal');
  const [ballSize, setBallSize] = useState('medium');
  const [ballType, setBallType] = useState('ghost');
  const [boost, setBoost] = useState(true);
  const [creatingGame, setCreatingGame] = useState(false);
  const [waitingForPlayer, setWaitingForPlayer] = useState(false);
  const [challengePlayer, setChallengePlayer] = useState(false);
  const [joinGame, setJoinGame] = useState(false);
  const [playAgainstComputer, setPlayAgainstComputer] = useState(false);
  const [play1vs1Click, setPlay1vs1Click] = useState(false);
  const [difficulty, setDifficulty] = useState('Easy');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [helpDisplay, setHelpDisplay] = useState<boolean>(false);

  function handleCreateNewGameClick() {
    setCreatingGame(true);
    setShowSettings(true);
  }

  function handleHelpClick() {
    setHelpDisplay(!helpDisplay);
  }
  function handleCreateGame() {
    setIsLoading(true);
    setLoadingMessage('Waiting for a second player ...');
    setWaitingForPlayer(true);
    let speed: number;
    switch (ballSpeed) {
      case 'slow':
        speed = 7;
        break;
      case 'normal':
        speed = 9;
        break;
      case 'fast':
        speed = 15;
        break;
      default:
        speed = 9;
    }
    if (playAgainstComputer) {
      let diff: number;
      switch (difficulty) {
        case 'Easy':
          diff = 1;
          break;
        case 'Medium':
          diff = 2;
          break;
        case 'Hard':
          diff = 3;
          break;
        default:
          diff = 1;
      }
      
      setGameConfig(new gameConfig (
        3,
        numGoals, 
        speed,
        ballSize,
        ballType, 
        boost, 
        diff
      ));
      socket.emit('VsComputer');
      setGameStart(true);
    }
    else if (play1vs1Click) {
      setGameConfig( new gameConfig (
        2,
        numGoals,
        speed,
        ballSize,
        ballType,
        boost,
        0
      ));
      socket.emit('1vs1 on same device');
      setGameStart(true);
    }
    else {
      let config = new gameConfig( 
        1, 
        numGoals, 
        speed,
        ballSize,
        ballType, 
        boost, 
        0
      );
      setGameConfig(config);
      socket.emit('create_room', config);
    }
  }

  function handleChallengePlayer() {
    setChallengePlayer(true);
  }

  function handleJoinGameClick() {
    setIsLoading(true);
    setLoadingMessage('Looking for games ...');
    setJoinGame(true);
    socket.emit('join_room');
  }

  function handlePlayAgainstComputerClick() {
    setPlayAgainstComputer(true);
    setShowSettings(true);
    setCreatingGame(true);
  }

  function handlePlay1vs1Click() {
    setPlay1vs1Click(true);
    setCreatingGame(true);
    setShowSettings(true);
    socket.emit('1vs1 on same device');
  }

  function handleBackClick() {
    setCreatingGame(false);
    setShowSettings(false);
    setPlayAgainstComputer(false);
    setChallengePlayer(false);
    setWaitingForPlayer(false);
    if (isLoading) {
      setIsLoading(false);
      socket.emit('cancele');
    }
  }

  useEffect(() => {

    socket.on('startGame', () => {
      setIsLoading(false);
      setWaitingForPlayer(false);
      setJoinGame(false);
      setGameStart(true);
    });
    socket.on('NoGames', () => {
      setTimeout(() => {
        setLoadingMessage('No Games Found :(');
      }, 2000);
    });

    return () => {
      socket.off('startGame');
      socket.off('NoGames');
    }

  }, []);

  useEffect(() => {
    console.log("Opponent: " + opp);
    if (opp) {
        let config =  new gameConfig (
            1,
            numGoals,
            10,
            ballSize,
            ballType,
            boost,
            0
        );
        setIsLoading(true);
        setLoadingMessage('Waiting for ' + opp + ' to accept the challenge ...');
        // socket.emit('createGame', {userName: user.username, oppName: opp, config: config});
    }
  }, [opp]);

  return (
    <div 
    className="w-full h-full grid grid-cols-2 grid-rows-4 gap-4 bg-gray-800 rounded-xl justify-center items-center relative"
    >
      {isLoading ? (
        <div className="row-span-4 col-span-2 flex flex-col justify-center items-center">
        <div className="loader"></div>
          <Text ta='center' mt='xl' c='white' fz='xl' fw={800} >
           {loadingMessage}
          </Text>
          <button
            className="absolute top-0 left-0 m-4 color-white hover:bg-gray-900 p-4 px-4 rounded"
            onClick={handleBackClick}
          >
          <FaArrowLeft size={24} color='white'/>
          </button>
        </div>
      ) : (
        <>
        {creatingGame && showSettings ? (
        <>
            <button
              className="row-span-1 absolute top-0 left-0 m-4 color-white hover:bg-gray-900 p-4 px-4 rounded"
              onClick={handleBackClick}
            >
              <FaArrowLeft size={24} color='white' />
            </button>
            <div className="col-span-2 row-span-3 flex flex-col items-center justify-center space-y-4 font-mono font-bold">
                <label 
                  className="bg-gray-500 font-mono font-bold text-center text-lg text-slate-300 rounded mb-4"
                  title="Choose the number of goals (max 20)"
                >
                  Number of goals: 
                  <input 
                    className='bg-slate-700 rounded text-center text-white w-36 h-6 m-2' 
                    type="number" min="1" max="20" 
                    value={numGoals} onChange={e => setNumGoals(parseInt(e.target.value))}
                  />
                </label>
                <label 
                  className="bg-gray-500 text-lg font-mono font-bold text-slate-300 rounded mb-4" 
                  title="Choose the speed of the ball (slow, normal, fast)"
                >
                  Ball speed: 
                  <select 
                    className=" w-36 rounded h-6 text-center font-mono bg-slate-700 text-white m-2" 
                    value={ballSpeed} 
                    onChange={e => setBallSpeed(e.target.value)}
                  >
                    <option value="slow">Slow</option>
                    <option value="normal">Normal</option>
                    <option value="fast">Fast</option>
                  </select>
                </label>
                <label 
                  className="bg-gray-500 text-lg text-slate-300 rounded mb-4" 
                  title="Choose the speed of the ball (slow, normal, fast)"
                  >
                  Ball Type: 
                  <select 
                    className="mr-2 rounded text-center w-36 h-6 m-2 bg-slate-700 text-white" 
                    value={ballType} 
                    onChange={e => setBallType(e.target.value)}
                    >
                    <option value="circle">Circle</option>
                    <option value="square">Square</option>
                    <option value="ghost">Ghost</option>
                  </select>
                </label>
                {ballType === 'ghost' && (
                <label 
                  className="bg-gray-500 text-lg font-mono text-slate-300 rounded mb-4" 
                  title="Choose the size of Ghost ball"
                >
                  Ball Size: 
                  <select 
                    className="w-36 rounded text-center h-6 m-2 bg-slate-700 text-white hover:bg-gray-900" 
                    value={ballSize} 
                    onChange={e => setBallSize(e.target.value)}
                  >
                    <option value="smal">Small</option>
                    <option value="medium">Medium</option>
                    <option value="big">Big</option>
                  </select>
                </label>
                )}
                <label 
                  className="bg-gray-500 text-lg text-slate-300 rounded mb-4" 
                  title="Activate the boost (whenever the ball collides with a racket the speed increases)"
                >
                  Activate boost: 
                  <input 
                    className="bg-slate-700 ml-24 m-2 size-5 rounded accent-slate-700" 
                    type="checkbox" checked={boost} 
                    onChange={e => setBoost(e.target.checked)} 
                  />
                </label>
                {playAgainstComputer && (
                  <label 
                    className="bg-gray-500 text-lg  text-slate-300 rounded mb-4" 
                    title="Choose the difficulty (Easy, Medium, Hard)"
                  >
                    Difficulty: 
                    <select  
                      className="ml-20 mr-2 rounded text-center bg-slate-700 text-white" 
                      value={difficulty} 
                      onChange={e => setDifficulty(e.target.value)}
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </label>
                )}
              </div>
              
            <button
              className="transition ease-in-out delay-150 bg-gray-600 hover:-translate-y-1 hover:scale-110 hover:bg-gray-900 duration-300 rounded mb-4 font-bold p-4 px-4 text-white ml-20"
              onClick={handleCreateGame}
            >
              Create Game
            </button>
            { (!playAgainstComputer && !play1vs1Click) && (
              <button
                className="transition ease-in-out delay-150 bg-gray-600 hover:-translate-y-1 hover:scale-110 hover:bg-gray-900 duration-300 rounded mb-4 font-bold p-4 px-4 text-white mr-20"
                onClick={handleChallengePlayer}
              >
                Challenge a Player
              </button>
            )}
          </>
        ) : (
          <>
            <button
              className="row-span-1 transition ease-in-out delay-150 bg-slate-600 hover:-translate-y-1 hover:scale-110 hover:bg-slate-700 duration-300 rounded font-mono text-white p-1 sm:p-5 ml-20"
              onClick={handleCreateNewGameClick}
            >
              Create a Game
            </button>
            <button
              className="row-span-1 transition ease-in-out delay-150 bg-slate-600 hover:-translate-y-1 hover:scale-110 hover:bg-slate-700 duration-300 rounded font-mono text-white p-1 sm:p-5 mr-20"
              onClick={handleJoinGameClick}
            >
              Join a Game
            </button>
            <button
              className="transition ease-in-out delay-150 bg-slate-600 hover:-translate-y-1 hover:scale-110 hover:bg-slate-700 duration-300 rounded font-mono text-white p-1 sm:p-5 ml-20"
              onClick={handlePlayAgainstComputerClick}
            >
              Against Computer
            </button>
            <button
              className="transition ease-in-out delay-150 bg-slate-600 hover:-translate-y-1 hover:scale-110 hover:bg-slate-700 duration-300 rounded font-mono text-white p-1 sm:p-5 mr-20"
              onClick={handlePlay1vs1Click}
            >
              On same device
            </button>
              <div className="col-span-2 row-span-2 text-center flex flex-col justify-center items-center m-4">
                <button 
                  className="text-white font-mono bg-neutral-500 rounded p-0 sm:p-2 hover:bg-neutral-700 transition ease-in-out delay-150 hover:-translate-y-2" 
                  title="How to play?"
                  onClick={handleHelpClick}
                >
                  How to Play?
                </button><br/>
  
              {helpDisplay && (
            <div className="bg-neutral-700 rounded-lg m-5 transition-opacity duration-500 ease-in-out">
              <div className="text-center">
                <span className="text-white font-mono">
                  → Create a game with custom settings, or join a pending game.<br/>
                  → You can also play against Computer, or against an other player in the same device.<br/>
                  → Move your paddle up and down with the UP ↑ and DOWN ↓, or the W and S keys.<br/>
                </span>
              </div>
            </div>
            )}
            </div>
          </>
        )}
      </>
      )}
    </div>
)};

export default GameSettings;
