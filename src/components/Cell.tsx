import clsx from "clsx"
import { CELL_NUMBERS_COLORS } from "../constants"

const Cell = ({cell}) => {
    return( <div className={clsx("cell", typeof cell.value === 'number' && CELL_NUMBERS_COLORS[cell.value]

    )}
    >
        {typeof cell.value === "number" && <> {cell.value || "" }</> }
        {cell.value === "mine" && <>.</>}
        {cell.isOpen && <div className="isO"></div>}
        {cell.wasOpen && <div className="wasO"></div>}
        </div>
        )
}

export default Cell