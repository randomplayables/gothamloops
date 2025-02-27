import { TBoard } from "../types"
import {initGame} from "../utils"
import Cell from "./Cell"

const BOARD: TBoard = initGame(3, 3, 0.5)

// const Board: TBoard = [
//   [{value: "."}, {value: "."}, {value: "."}, {value: "."}],
//   [{value: "."}, {value: ".", isOpen: true}, {value: "."}, {value: "."}],
//   [{value: ".", wasOpen: true}, {value: "."}, {value: "."}, {value: "."}]
//   ]

const Board = () => {
    return(
        <div className="board">
        {BOARD.map((row) => (
              <div className="row">{row.map((cell) => (
                <Cell cell = {cell}/> 
              ))}</div>
            ))}
        </div>
    )
}

export default Board