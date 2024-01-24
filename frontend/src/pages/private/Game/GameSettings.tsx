import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { FaArrowLeft } from 'react-icons/fa';
import { gameConfig } from './classes/constants';

interface Props {
  socket: Socket;
  startGame: () => void;
  setGameConfig: (config: gameConfig) => void;
}

const GameSettings: React.FC<Props> = ({ socket, setGameConfig, startGame}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [countdown, setCountdown] = useState<number>(0);
  const [numGoals, setNumGoals] = useState(10);
  const [ballSpeed, setBallSpeed] = useState('normal');
  const [boost, setBoost] = useState(false);
  const [creatingGame, setCreatingGame] = useState(false);
  const [waitingForPlayer, setWaitingForPlayer] = useState(false);
  const [challengePlayer, setChallengePlayer] = useState(false);
  const [joinGame, setJoinGame] = useState(false);
  const [playAgainstComputer, setPlayAgainstComputer] = useState(false);
  const [play1vs1Click, setPlay1vs1Click] = useState(false);
  const [difficulty, setDifficulty] = useState('Easy');

  function handleCreateNewGameClick() {
    setCreatingGame(true);
    setShowSettings(true);
  }

  function handleCreateGame() {
    setWaitingForPlayer(true);
    let speed: number;
    switch (ballSpeed) {
      case 'slow':
        speed = 7;
        break;
      case 'normal':
        speed = 10;
        break;
      case 'fast':
        speed = 15;
        break;
      default:
        speed = 7;
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
      setGameConfig({ mode: 3, maxScore: numGoals, ballSpeed: speed, boost: boost, difficulty: diff });
      //socket.emit('VsComputer', { maxScore: numGoals, ballSpeed: speed, boost: boost, difficulty: diff });
      startGame();
    }
    else if (play1vs1Click) {
      setGameConfig({ mode: 2, maxScore: numGoals, ballSpeed: speed, boost: boost, difficulty: 0});
      socket.emit('1vs1 on same device');
      startGame();
    }
    else {
      setGameConfig({ mode: 1, maxScore: numGoals, ballSpeed: speed, boost: boost, difficulty: 0});
      socket.emit('create_room', { maxScore: numGoals, ballSpeed: speed, boost: boost });
    }
  }

  function handleChallengePlayer() {
    setChallengePlayer(true);
  }

  function handleJoinGameClick() {
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
  }

  useEffect(() => {
    socket.on('startGame', () => {
      setWaitingForPlayer(false);
      setJoinGame(false);
      startGame();
    });
  }, []);

  return (
    <div 
      className="flex w-[700px] h-[450px] bg-gray-800 rounded justify-center items-center relative"
    >
      <div 
        className="flex flex-col p-4 rounded">
        {creatingGame ? (
          <>
            <button
              className="absolute top-0 left-0 m-4 color-white hover:bg-gray-900 p-4 px-4 rounded"
              onClick={handleBackClick}
            >
              <FaArrowLeft size={24} />
            </button>
            {showSettings && (
              <div className="flex flex-col">
                <label 
                  className="bg-gray-500 w-96 text-lg font-sans rounded mb-4"
                  title="Choose the number of goals (max 20)"
                >
                  Number of goals: 
                  <input 
                    className='bg-slate-700 w-36 h-6 ml-7 rounded text-center text-white' 
                    type="number" min="1" max="20" 
                    value={numGoals} onChange={e => setNumGoals(parseInt(e.target.value))}
                  />
                </label>
                <label 
                  className="bg-gray-500 text-lg font-sans rounded mb-4" 
                  title="Choose the speed of the ball (slow, normal, fast)"
                >
                  Ball speed: 
                  <select 
                    className="ml-20 rounded text-center w-36 bg-slate-700 text-white" 
                    value={ballSpeed} 
                    onChange={e => setBallSpeed(e.target.value)}
                  >
                    <option value="slow">Slow</option>
                    <option value="normal">Normal</option>
                    <option value="fast">Fast</option>
                  </select>
                </label>
                <label 
                  className="bg-gray-500 text-lg font-sans rounded mb-4" 
                  title="Activate the boost (whenever the ball collides with a racket the speed increases)"
                >
                  Activate boost: 
                  <input 
                    className="bg-slate-700 ml-24 rounded size-5" 
                    type="checkbox" checked={boost} 
                    onChange={e => setBoost(e.target.checked)} 
                  />
                </label>
                {playAgainstComputer && (
                  <label 
                    className="bg-gray-500 text-lg font-sans rounded mb-4" 
                    title="Choose the difficulty (Easy, Medium, Hard)"
                  >
                    Difficulty: 
                    <select  
                      className="ml-20 rounded text-center w-36 bg-slate-700 text-white" 
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
              )}
            <button
              className="bg-gray-600 hover:bg-gray-900 text-white font-bold p-4 px-4 rounded mb-4"
              onClick={handleCreateGame}
            >
              Create Game
            </button>
            {waitingForPlayer && <p>Waiting for a second player...</p>}
            <button
              className="bg-gray-600 hover:bg-gray-900 text-white font-bold p-4 px-4 rounded mb-4"
              onClick={handleChallengePlayer}
            >
              Challenge a Player
            </button>
            {challengePlayer && <p>Invite a player...</p>}
          </>
        ) : (
          <>
            <button
              className=" bg-gray-600 hover:bg-gray-900 text-white font-bold p-4 px-4 rounded mb-4"
              onClick={handleCreateNewGameClick}
            >
              Create a new Game
            </button>
            <button
              className=" bg-gray-600 hover:bg-gray-900 text-white font-bold p-4 px-4 rounded mb-4"
              onClick={handleJoinGameClick}
            >
              Join a Game
            </button>
            {joinGame && <p>Looking for Games...</p>}
            <button
              className=" bg-gray-600 hover:bg-gray-900 text-white font-bold p-4 px-4 rounded mb-4"
              onClick={handlePlayAgainstComputerClick}
            >
              Play against Computer
            </button>
            <button
              className=" bg-gray-600 hover:bg-gray-900 text-white font-bold p-4 px-4 rounded mb-4"
              onClick={handlePlay1vs1Click}
            >
              Play 1vs1 on same device
            </button>
            {countdown > 0 && <p>Game starts in: {countdown}</p>}
            {/* Other buttons */}
          </>
        )}
      </div>
    </div>
  );
};

export default GameSettings;
