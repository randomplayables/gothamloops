import './App.css'
import Board from "./components/Board.tsx"
import useGothamLoopsGame from './hooks/useGothamLoopsGame.tsx'

function App() {

  const {gameBoard} = useGothamLoopsGame()
  return <div className='game'>
    <Board gameBoard={gameBoard}/>
  </div>
}

export default App
