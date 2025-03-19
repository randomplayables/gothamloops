/**
 * Main App component for Gotham Loops game.
 * 
 * This is the root component that orchestrates the game's UI. It renders either
 * the active game interface or the final score screen depending on game state.
 * Uses the useGothamLoopsGame custom hook to manage all game logic and state.
 * 
 * @component
 * @returns {JSX.Element} The complete game application
 */
import './App.css'
import Board from "./components/Board.tsx"
import SelectLevel from "./components/SelectLevel.tsx"
import useGothamLoopsGame from './hooks/useGothamLoopsGame.tsx'
import Header from './components/Header.tsx'
import FinalScore from './components/FinalScore.tsx'

/**
 * Main application component that renders the Gotham Loops game.
 * 
 * Conditionally renders either the game interface or the final score screen
 * based on whether the game is over. Uses the useGothamLoopsGame hook to
 * access and manage all game state and logic.
 */
function App() {

  const {
    level,
    changeLevel,
    gameBoard,
    handleCellLeftClick,
    isRoundOver,
    roundScore,
    totalScore,
    round,
    handleStartNewRound,
    isGameOver,
    finalTotalScore,
    pastCells} = useGothamLoopsGame()

  return (
    <div className='game'>
      {isGameOver ? (
        <FinalScore 
          finalTotalScore={finalTotalScore} 
          onStartNewGame={() => window.location.reload()} 
        />
      ) : (
        <>
          <Header 
            isRoundOver={isRoundOver} 
            roundScore={roundScore} 
            totalScore={totalScore}
            round={round}
            onStartNewRound={handleStartNewRound}
          />
          <Board 
            level={level} 
            gameBoard={gameBoard} 
            handleCellLeftClick={handleCellLeftClick}
            pastCells={pastCells}
          />
          <SelectLevel 
            level={level} 
            changeLevel={changeLevel}
          />
        </>
      )}
    </div>
  )
}

export default App
