import { GameCell } from "../types"

type  CellProps = {
    cell: GameCell
    rowIndex: number
    cellIndex: number
    handleCellLeftClick: (row: number, col: number) => void
}

const Cell = ({cell, rowIndex, cellIndex, handleCellLeftClick}: CellProps) => {
    return(
    <div
        className="cell"
        onClick={() => handleCellLeftClick(rowIndex, cellIndex)}
    >
        {cell.isOpen && <div className="isO"></div>}
        {cell.wasOpen && <div className="wasO"></div>}
        {cell.isHome && <div className="home"></div>}
        {!cell.place && <div className="empty-cell"></div>}
        {cell.place && <div className="on-place"></div>}
        </div>
        )
}

export default Cell