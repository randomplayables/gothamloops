import './App.css'
import Board from "./components/Board.tsx"
import SelectLevel from "./components/SelectLevel.tsx"
import useGothamLoopsGame from './hooks/useGothamLoopsGame.tsx'
import Header from './components/Header.tsx'
import FinalScore from './components/FinalScore.tsx'

function App() {

  const {
    level,
    changeLevel,
    gameBoard,
    handleCellLeftClick,
    isRoundOver,
    roundScore,
    round,
    handleStartNewRound,
    isGameOver,
    finalTotalScore} = useGothamLoopsGame()

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
            round={round}
            onStartNewRound={handleStartNewRound}
          />
          <Board 
            level={level} 
            gameBoard={gameBoard} 
            handleCellLeftClick={handleCellLeftClick}
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
