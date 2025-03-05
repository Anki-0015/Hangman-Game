
import React, { useState, useCallback, useEffect } from 'react';
import HangmanDrawing from '../components/HangmanDrawing';
import Keyboard from '../components/Keyboard';
import WordDisplay from '../components/WordDisplay';
import GameOverModal from '../components/GameOverModal';
import ProfileButton from '../components/ProfileButton';
import { Button } from '../components/ui/button';
import { HelpCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "@/contexts/ProfileContext";

type Difficulty = 'easy' | 'medium' | 'hard';

// Words with their corresponding hints and difficulties
const wordList = [
  { word: 'CAT', hint: 'A common household pet', difficulty: 'easy' as Difficulty },
  { word: 'DOG', hint: 'Man\'s best friend', difficulty: 'easy' as Difficulty },
  { word: 'REACT', hint: 'A popular JavaScript library for building user interfaces', difficulty: 'medium' as Difficulty },
  { word: 'TYPESCRIPT', hint: 'A typed superset of JavaScript', difficulty: 'hard' as Difficulty },
  { word: 'JAVASCRIPT', hint: 'The programming language of the web', difficulty: 'hard' as Difficulty },
  { word: 'PROGRAMMING', hint: 'The process of creating computer software', difficulty: 'hard' as Difficulty },
  { word: 'COMPUTER', hint: 'An electronic device that processes data', difficulty: 'medium' as Difficulty },
  { word: 'DEVELOPER', hint: 'Someone who creates software', difficulty: 'medium' as Difficulty },
  { word: 'INTERFACE', hint: 'A point of interaction between components', difficulty: 'medium' as Difficulty },
  { word: 'APPLICATION', hint: 'A software program designed for end users', difficulty: 'hard' as Difficulty }
] as const;

const Index = () => {
  const [wordData, setWordData] = useState<{ word: string; hint: string; difficulty: Difficulty }>({
    word: '',
    hint: '',
    difficulty: 'medium'
  });
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [correctLetters, setCorrectLetters] = useState<Set<string>>(new Set());
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium');
  const { toast } = useToast();
  const { profile, updateScore } = useProfile();

  // Load score from profile on startup
  useEffect(() => {
    if (profile) {
      setScore(profile.score);
    }
  }, [profile]);

  const getDifficultyMultiplier = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'easy': return 1;
      case 'medium': return 2;
      case 'hard': return 3;
      default: return 1;
    }
  };

  const initializeGame = useCallback(() => {
    const filteredWords = wordList.filter(word => word.difficulty === selectedDifficulty);
    const randomIndex = Math.floor(Math.random() * filteredWords.length);
    const selectedWordData = filteredWords[randomIndex] || wordList[0];
    
    setWordData({
      word: selectedWordData.word,
      hint: selectedWordData.hint,
      difficulty: selectedWordData.difficulty as Difficulty
    });
    
    setGuessedLetters(new Set());
    setWrongGuesses(0);
    setCorrectLetters(new Set());
    setIsGameOver(false);
    setIsWin(false);
    setShowHint(false);
  }, [selectedDifficulty]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handleGuess = (letter: string) => {
    const newGuessedLetters = new Set(guessedLetters).add(letter);
    setGuessedLetters(newGuessedLetters);

    if (wordData.word.includes(letter)) {
      const newCorrectLetters = new Set(correctLetters).add(letter);
      setCorrectLetters(newCorrectLetters);
      toast({
        title: "Good guess!",
        description: `'${letter}' is in the word!`,
        variant: "default",
        className: "bg-game-success text-white",
      });

      // Check win condition
      const isWordComplete = wordData.word
        .split('')
        .every(l => newGuessedLetters.has(l));
      
      if (isWordComplete) {
        const difficultyPoints = getDifficultyMultiplier(wordData.difficulty) * 100;
        const timeBonus = Math.max(0, 600 - wrongGuesses * 100);
        const roundScore = difficultyPoints + timeBonus;
        const newScore = score + roundScore;
        
        setScore(newScore);
        updateScore(newScore);
        setIsWin(true);
        setIsGameOver(true);
        
        toast({
          title: "Congratulations!",
          description: `You won! +${roundScore} points`,
          variant: "default",
          className: "bg-game-success text-white",
        });
      }
    } else {
      const newWrongGuesses = wrongGuesses + 1;
      setWrongGuesses(newWrongGuesses);
      
      toast({
        title: "Wrong guess",
        description: `'${letter}' is not in the word`,
        variant: "default",
        className: "bg-game-error text-white",
      });

      // Check lose condition
      if (newWrongGuesses >= 6) {
        const newScore = Math.max(0, score - 50);
        setScore(newScore);
        updateScore(newScore);
        setIsGameOver(true);
        
        toast({
          title: "Game Over",
          description: "You ran out of guesses! -50 points",
          variant: "default",
          className: "bg-game-error text-white",
        });
      }
    }
  };

  const toggleHint = () => {
    setShowHint(!showHint);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-5xl font-bold text-center drop-shadow-lg animate-fade-in bg-clip-text text-white">
            HANGMAN
          </h1>
          <ProfileButton />
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="text-xl font-bold bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
            Score: {score}
          </div>
          <div className="flex gap-2">
            {(['easy', 'medium', 'hard'] as const).map((difficulty) => (
              <Button
                key={difficulty}
                onClick={() => setSelectedDifficulty(difficulty)}
                variant={selectedDifficulty === difficulty ? "default" : "ghost"}
                className={`capitalize ${
                  selectedDifficulty === difficulty 
                    ? 'bg-white/20' 
                    : 'hover:bg-white/10'
                }`}
              >
                {difficulty}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-xl">
          <div className="relative">
            <HangmanDrawing wrongGuesses={wrongGuesses} />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-0 right-0 text-white/70 hover:text-white hover:bg-white/10"
              onClick={toggleHint}
            >
              <HelpCircle className="w-5 h-5" />
            </Button>
          </div>

          {showHint && (
            <div className="bg-white/5 backdrop-blur-md p-4 rounded-lg mb-6 animate-fade-in text-center">
              <p className="text-white/90">{wordData.hint}</p>
            </div>
          )}

          <WordDisplay word={wordData.word} guessedLetters={guessedLetters} />
          <Keyboard
            guessedLetters={guessedLetters}
            correctLetters={correctLetters}
            onGuess={handleGuess}
            isGameOver={isGameOver}
          />
        </div>

        {isGameOver && (
          <GameOverModal
            isWin={isWin}
            word={wordData.word}
            onRestart={initializeGame}
            score={score}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
