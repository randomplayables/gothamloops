/**
 * Board component for Gotham Loops game.
 * 
 * Renders the game grid based on the current gameBoard state. Each cell in the grid
 * is rendered as a Cell component which handles its own visual state and interactions.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {TBoard} props.gameBoard - Two-dimensional array representing the current state of the game board
 * @param {Function} props.handleCellLeftClick - Callback function triggered when a cell is clicked
 * @param {TLevel} props.level - Current difficulty level of the game ("deuce", "trey", or "quad")
 * @param {PastCell[][]} props.pastCells - Two-dimensional array containing the history of cell states across all rounds
 * @returns {JSX.Element} Rendered game board with rows and cells
 */
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