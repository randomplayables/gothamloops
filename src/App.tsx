import './App.css'
import Board from "./components/Board.tsx"
import useGothamLoopsGame from './hooks/useGothamLoopsGame.tsx'

function App() {

  const {gameBoard, handleCellLeftClick} = useGothamLoopsGame()
  return <div className='game'>
    <Board gameBoard={gameBoard} handleCellLeftClick={handleCellLeftClick}/>
  </div>
}

export default App
