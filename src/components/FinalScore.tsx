/**
 * FinalScore component for Gotham Loops game.
 * 
 * Displays the game-over screen with the player's final score after completing
 * all 7 rounds. Provides a button to start a new game.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {number} props.finalTotalScore - The player's final cumulative score across all rounds
 * @param {Function} props.onStartNewGame - Callback function to reset the game state and start a new game
 * @returns {JSX.Element} Rendered game-over screen with final score and restart button
 */
export type FinalScoreProps = {
    finalTotalScore: number;
    onStartNewGame: () => void;
  }
  
  /**
 * Renders the final score screen after the game is completed.
 * 
 * @param {FinalScoreProps} props - Component properties
 * @param {number} props.finalTotalScore - The player's final cumulative score
 * @param {Function} props.onStartNewGame - Function to handle starting a new game
 */
  const FinalScore = ({ finalTotalScore, onStartNewGame }: FinalScoreProps) => {
    return (
      <div className="final-score-container">
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
    )
  }
  
  export default FinalScore;