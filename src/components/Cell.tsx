import clsx from "clsx"
import { CELL_NUMBERS_COLORS } from "../constants"
import { GameCell } from "../types"

type  CellProps = {
    cell: GameCell
    rowIndex: number
    cellIndex: number
    handleCellLeftClick: (row: number, col: number) => void
}

const Cell = ({cell, rowIndex, cellIndex, handleCellLeftClick}: CellProps) => {
    return( <div className={clsx("cell", typeof cell.value === 'number' && CELL_NUMBERS_COLORS[cell.value]

    )}
    onClick={() => handleCellLeftClick(rowIndex, cellIndex)}
    >
        {typeof cell.value === "number" && <> {cell.value || "" }</> }
        {cell.value === "mine" && <>.</>}
        {cell.isOpen && <div className="isO"></div>}
        {cell.wasOpen && <div className="wasO"></div>}
        {cell.isHome && <div className="home"></div>}
        </div>
        )
}

export default Cell