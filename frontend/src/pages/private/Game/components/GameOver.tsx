import React, { useEffect, useState } from 'react';
import { Text } from '@mantine/core';
import { disconnect } from './gameStates';

type GameOverProps = {
    player1Score: number;
    player2Score: number;
    side: boolean;
    mode: number;
    disconnect: boolean;
    setGameOver: (value: boolean) => void;
    setGameStart: (v: boolean) => void;
};

const GameOver: React.FC<GameOverProps> = ({
    player1Score,
    player2Score,
    side,
    mode,
    setGameOver,
    setGameStart,
}) => {
    const [isWin, setIsWin] = useState(false);


    useEffect(() => {
        if (side  && player1Score > player2Score) {
            setIsWin(true);
        }
        else if (!side && player2Score > player1Score) {
            setIsWin(true);
        }
        else if (disconnect) {
            setIsWin(true);
        }
    }, []);

    const handleRestart = () => {
        setGameOver(false);
        setGameStart(true);
    };

    const handleMainMenu = () => {
        setGameOver(false);
        setGameStart(false);
    };

    return (
        <div 
            className="flex flex-col w-[90%] md:w-[700px] h-[450px] bg-gray-800 rounded-xl justify-center items-center relative"
        >
            { disconnect && (
                <Text ta='center' c='white' fz='xl' fw='bold' mb='lg'>
                    Opponent Disconnected
                </Text>
            )}
            <Text ta='center' c='white' fz='xl' fw='bold' mb='lg'>
                Game Over!
            </Text>
            <Text ta='center' c='white' fz='xl' fw='bold' mb='lg'>
                {isWin ? 'You Won :)' : 'You Lost :('}
            </Text>
            <Text ta='center' c='white' fz='xl' fw='bold' mb='lg'>
                Score: {player1Score} - {player2Score}
            </Text>
            {(mode !== 1) && (
                <button
                    className="transition ease-in-out delay-150 bg-gray-600 hover:-translate-y-1 hover:scale-110 hover:bg-gray-900 duration-300 rounded mb-4 font-bold p-4 px-4 text-white"
                    onClick={handleRestart}>
                        Play Again
                </button>
            )}
            <button
                className="transition ease-in-out delay-150 bg-gray-600 hover:-translate-y-1 hover:scale-110 hover:bg-gray-900 duration-300 rounded mb-4 font-bold p-4 px-4 text-white"
                onClick={handleMainMenu}>
                    Main Menu
            </button>
        </div>
    );
};

export default GameOver;
