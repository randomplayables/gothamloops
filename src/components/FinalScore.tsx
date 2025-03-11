export type FinalScoreProps = {
    finalTotalScore: number;
    onStartNewGame: () => void;
  }
  
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