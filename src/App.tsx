import './App.css'
import Board from "./components/Board.tsx"
import SelectLevel from "./components/SelectLevel.tsx"
import useGothamLoopsGame from './hooks/useGothamLoopsGame.tsx'
import Header from './components/Header.tsx'

function App() {

  const {
    level,
    changeLevel,
    gameBoard,
    handleCellLeftClick,
    isRoundOver,
    roundScore} = useGothamLoopsGame()
  return <div className='game'>
    <Header isRoundOver={isRoundOver} roundScore={roundScore}/>
    <Board level={level} gameBoard={gameBoard} handleCellLeftClick={handleCellLeftClick}/>
    <SelectLevel level={level} changeLevel = {changeLevel}/>
  </div>
}

export default App
