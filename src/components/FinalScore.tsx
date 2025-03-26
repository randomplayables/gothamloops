/**
 * FinalScore component for Gotham Loops game.
 * 
 * Displays the game-over screen with the player's final score after completing
 * all 7 rounds. This component can be dragged around to view the game board underneath.
 * 
 * @component
 * @param {FinalScoreProps} props - Component props
 * @param {number} props.finalTotalScore - The player's final cumulative score across all rounds
 * @param {Function} props.onStartNewGame - Callback function to reset the game state and start a new game
 * @returns {JSX.Element} Rendered draggable game-over screen with final score and restart button
 */
import { useState, useRef, useEffect } from 'react';

export type FinalScoreProps = {
    finalTotalScore: number;
    onStartNewGame: () => void;
  }
  
  const FinalScore = ({ finalTotalScore, onStartNewGame }: FinalScoreProps) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
  
    // Initialize position to center when component mounts
    useEffect(() => {
      if (containerRef.current) {
        // Center the modal initially
        const width = containerRef.current.offsetWidth;
        const height = containerRef.current.offsetHeight;
        setPosition({
          x: (window.innerWidth - width) / 2,
          y: (window.innerHeight - height) / 2
        });
      }
    }, []);
  
    // Handle mouse down event to start dragging
    const handleMouseDown = (e: React.MouseEvent) => {
      if (containerRef.current) {
        setIsDragging(true);
        // Calculate the offset between mouse position and container position
        setDragOffset({
          x: e.clientX - containerRef.current.getBoundingClientRect().left,
          y: e.clientY - containerRef.current.getBoundingClientRect().top
        });
      }
    };
  
    // Handle mouse move event to update position while dragging
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
    };
  
    // Handle mouse up event to stop dragging
    const handleMouseUp = () => {
      setIsDragging(false);
    };
  
    // Add and remove event listeners
    useEffect(() => {
      if (isDragging) {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
      }
  
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }, [isDragging, dragOffset]);
  
    return (
      <div className="final-score-overlay">
        <div
          ref={containerRef}
          className={`final-score-container ${isDragging ? 'dragging' : ''}`}
          style={{
            position: 'absolute',
            left: `${position.x}px`,
            top: `${position.y}px`,
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
        >
          <div 
            className="drag-handle"
            onMouseDown={handleMouseDown}
          >
            <span className="drag-instructions">Drag to move</span>
          </div>
          <h2>Game Over!</h2>
          <p>You completed 7 rounds</p>
          <div className="final-score">
            <h3>Final Total Score: {finalTotalScore.toFixed(2)}</h3>
          </div>
          <button 
            className="new-game-button"
            onClick={onStartNewGame}
          >
            Start New Game
          </button>
        </div>
      </div>
    );
  };
  
  export default FinalScore;