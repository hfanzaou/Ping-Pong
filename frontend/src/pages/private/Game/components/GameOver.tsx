import React from 'react';
import { Text } from '@mantine/core';

type GameOverProps = {
    score: number;
    user: string;
    setGameOver: (value: boolean) => void;
    setGameStart: (v: boolean) => void;
};

const GameOver: React.FC<GameOverProps> = ({
    score,
    user,
    setGameOver,
    setGameStart,
}) => {
    const isWin = score > 0;

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
            className="flex flex-col w-[700px] h-[450px] bg-gray-800 rounded-xl justify-center items-center relative"
        >
        <Text ta='center' c='white' fz='xl' fw='bold' mb='lg'>
                Game Over!
            </Text>
            <Text ta='center' c='white' fz='xl' fw='bold' mb='lg'>
                {isWin ? 'You Win :)' : 'You Lost :('}
            </Text>
            <button
                className="transition ease-in-out delay-150 bg-gray-600 hover:-translate-y-1 hover:scale-110 hover:bg-gray-900 duration-300 rounded mb-4 font-bold p-4 px-4 text-white"
                onClick={handleRestart}>
                    Play Again
            </button>
            <button
                className="transition ease-in-out delay-150 bg-gray-600 hover:-translate-y-1 hover:scale-110 hover:bg-gray-900 duration-300 rounded mb-4 font-bold p-4 px-4 text-white"
                onClick={handleMainMenu}>
                    Main Menu
            </button>
        </div>
    );
};

export default GameOver;
