
import React from 'react';

interface HangmanDrawingProps {
  wrongGuesses: number;
}

const HangmanDrawing: React.FC<HangmanDrawingProps> = ({ wrongGuesses }) => {
  const parts = [
    // Head with better circular shape and thicker stroke
    <circle 
      key="head" 
      cx="50" 
      cy="25" 
      r="10" 
      className="fill-none stroke-current stroke-[3] opacity-90" 
    />,
    // Body with rounded line caps
    <line 
      key="body" 
      x1="50" 
      y1="35" 
      x2="50" 
      y2="65" 
      className="stroke-current stroke-[3] opacity-90" 
      strokeLinecap="round"
    />,
    // Left Arm with curved path
    <path
      key="leftArm"
      d="M50 45 Q35 50 25 55"
      className="stroke-current stroke-[3] opacity-90 fill-none"
      strokeLinecap="round"
    />,
    // Right Arm with curved path
    <path
      key="rightArm"
      d="M50 45 Q65 50 75 55"
      className="stroke-current stroke-[3] opacity-90 fill-none"
      strokeLinecap="round"
    />,
    // Left Leg with curved path
    <path
      key="leftLeg"
      d="M50 65 Q35 75 25 85"
      className="stroke-current stroke-[3] opacity-90 fill-none"
      strokeLinecap="round"
    />,
    // Right Leg with curved path
    <path
      key="rightLeg"
      d="M50 65 Q65 75 75 85"
      className="stroke-current stroke-[3] opacity-90 fill-none"
      strokeLinecap="round"
    />,
  ];

  return (
    <div className="w-full max-w-[200px] mx-auto mb-8">
      <svg 
        viewBox="0 0 100 100" 
        className="stroke-white/90 transition-all duration-300"
      >
        {/* Gallows structure with rounded corners and thicker lines */}
        <path 
          d="M10 95 L90 95" 
          className="stroke-current stroke-[3] opacity-90" 
          strokeLinecap="round"
        />
        <path 
          d="M30 95 L30 5" 
          className="stroke-current stroke-[3] opacity-90" 
          strokeLinecap="round"
        />
        <path 
          d="M30 5 L50 5" 
          className="stroke-current stroke-[3] opacity-90" 
          strokeLinecap="round"
        />
        <path 
          d="M50 5 L50 15" 
          className="stroke-current stroke-[3] opacity-90" 
          strokeLinecap="round"
        />
        
        {/* Animate parts appearing with a fade-in effect */}
        <g className="transition-opacity duration-300">
          {parts.slice(0, wrongGuesses)}
        </g>
      </svg>
    </div>
  );
};

export default HangmanDrawing;
