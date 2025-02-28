import { TBoard } from "../types"
import Cell from "./Cell"

type Props = {
  gameBoard: TBoard
  handleCellLeftClick: (row: number, col: number) => void
}

const Board = (props: Props) => {
  const {gameBoard, handleCellLeftClick} = props

    return(
        <div className="board">
        {gameBoard.map((row, rowIndex) => (
              <div className="row">{row.map((cell, cellIndex) => (
                <Cell
                cell = {cell}
                rowIndex={rowIndex}
                cellIndex={cellIndex}
                handleCellLeftClick={handleCellLeftClick}/> 
              ))}</div>
            ))}
        </div>
    )
}

export default Board