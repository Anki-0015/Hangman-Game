
import React from 'react';

interface WordDisplayProps {
  word: string;
  guessedLetters: Set<string>;
}

const WordDisplay: React.FC<WordDisplayProps> = ({ word, guessedLetters }) => {
  return (
    <div className="flex justify-center gap-3 mb-8">
      {word.split('').map((letter, index) => (
        <div
          key={index}
          className="w-10 h-14 md:w-12 md:h-16 border-b-2 border-white/30 flex items-center justify-center backdrop-blur-sm bg-white/5 rounded-lg transition-all duration-300"
        >
          <span 
            className={`text-3xl md:text-4xl font-mono font-bold ${
              guessedLetters.has(letter)
                ? "animate-letter-reveal text-white"
                : "opacity-0"
            }`}
          >
            {letter}
          </span>
        </div>
      ))}
    </div>
  );
};

export default WordDisplay;
