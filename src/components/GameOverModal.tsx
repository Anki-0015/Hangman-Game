
import React from 'react';
import { Trophy, Skull } from 'lucide-react';

interface GameOverModalProps {
  isWin: boolean;
  word: string;
  onRestart: () => void;
  score: number;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ isWin, word, onRestart, score }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center animate-fade-in">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-lg border border-white/20 text-center">
        <div className="flex justify-center mb-4">
          {isWin ? (
            <Trophy className="w-12 h-12 text-yellow-400 animate-bounce" />
          ) : (
            <Skull className="w-12 h-12 text-red-400 animate-bounce" />
          )}
        </div>
        <h2 className="text-3xl font-bold mb-4">
          {isWin ? 'Congratulations!' : 'Game Over'}
        </h2>
        <p className="mb-2">
          {isWin
            ? 'You guessed the word correctly!'
            : `The word was: ${word}`}
        </p>
        <p className="text-xl font-bold mb-6">
          Total Score: {score}
        </p>
        <button
          onClick={onRestart}
          className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-md transition-all duration-200 border border-white/20"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default GameOverModal;

