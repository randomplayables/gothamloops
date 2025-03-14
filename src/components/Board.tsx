import { TBoard, TLevel, PastCell } from "../types"
import Cell from "./Cell"

type Props = {
  gameBoard: TBoard
  handleCellLeftClick: (row: number, col: number) => void
  level: TLevel
  pastCells: PastCell[][] 
}

const Board = (props: Props) => {
  const {level, gameBoard, handleCellLeftClick, pastCells} = props

    return(
        <div className="board">
        {gameBoard.map((row, rowIndex) => (
              <div className="row" key={`row-${rowIndex}`}>{row.map((cell, cellIndex) => (
                <Cell
                key={`cell-${rowIndex}-${cellIndex}`}
                cell={cell}
                rowIndex={rowIndex}
                cellIndex={cellIndex}
                handleCellLeftClick={handleCellLeftClick}
                level={level}
                pastVisits={pastCells[rowIndex][cellIndex]}/> 
              ))}</div>
            ))}
        </div>
    )
}

export default Board