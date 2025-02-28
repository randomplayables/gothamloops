import { TBoard } from "../types"
import Cell from "./Cell"

type Props = {
  gameBoard: TBoard
}

const Board = (props: Props) => {
  const {gameBoard} = props

    return(
        <div className="board">
        {gameBoard.map((row) => (
              <div className="row">{row.map((cell) => (
                <Cell cell = {cell}/> 
              ))}</div>
            ))}
        </div>
    )
}

export default Board