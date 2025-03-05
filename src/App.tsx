import './App.css'
import Board from "./components/Board.tsx"
import SelectLevel from "./components/SelectLevel.tsx"
import useGothamLoopsGame from './hooks/useGothamLoopsGame.tsx'

function App() {

  const {level, changeLevel, gameBoard, handleCellLeftClick} = useGothamLoopsGame()
  return <div className='game'>
    <Board level={level} gameBoard={gameBoard} handleCellLeftClick={handleCellLeftClick}/>
    <SelectLevel level={level} changeLevel = {changeLevel}/>
  </div>
}

export default App
