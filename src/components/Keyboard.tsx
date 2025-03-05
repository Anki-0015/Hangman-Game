
import React from 'react';

interface KeyboardProps {
  guessedLetters: Set<string>;
  correctLetters: Set<string>;
  onGuess: (letter: string) => void;
  isGameOver: boolean;
}

const Keyboard: React.FC<KeyboardProps> = ({
  guessedLetters,
  correctLetters,
  onGuess,
  isGameOver,
}) => {
  const rows = [
    'QWERTYUIOP'.split(''),
    'ASDFGHJKL'.split(''),
    'ZXCVBNM'.split(''),
  ];

  const getButtonClass = (letter: string) => {
    const baseClass = "w-8 h-10 md:w-10 md:h-12 m-1 rounded-md font-mono transition-all duration-200 transform active:scale-95 ";
    
    if (!guessedLetters.has(letter)) {
      return baseClass + "bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20";
    }
    
    if (correctLetters.has(letter)) {
      return baseClass + "bg-game-success text-white cursor-default";
    }
    
    return baseClass + "bg-game-error text-white cursor-default";
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      {rows.map((row, i) => (
        <div key={i} className="flex justify-center mb-2">
          {row.map((letter) => (
            <button
              key={letter}
              onClick={() => !isGameOver && !guessedLetters.has(letter) && onGuess(letter)}
              disabled={isGameOver || guessedLetters.has(letter)}
              className={getButtonClass(letter)}
            >
              {letter}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
