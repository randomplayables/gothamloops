import { TBoard, TLevel } from "../types"
import Cell from "./Cell"

type Props = {
  gameBoard: TBoard
  handleCellLeftClick: (row: number, col: number) => void
  level: TLevel
}

const Board = (props: Props) => {
  const {level, gameBoard, handleCellLeftClick} = props

    return(
        <div className="board">
        {gameBoard.map((row, rowIndex) => (
              <div className="row">{row.map((cell, cellIndex) => (
                <Cell
                cell={cell}
                rowIndex={rowIndex}
                cellIndex={cellIndex}
                handleCellLeftClick={handleCellLeftClick}
                level={level}/> 
              ))}</div>
            ))}
        </div>
    )
}

export default Board