import { useState } from "react"
import { initGame } from "../utils"
import { TBoard } from "../types"

const useGothamLoopsGame = () => {
    const [gameBoard, setGameBoard] = useState(initGame(9, 9, 0.8))

    const openCell = (board: TBoard, row: number, col: number) => {
        const newGameBoard: TBoard = JSON.parse(JSON.stringify(gameBoard))
        const cell = newGameBoard[row][col]
        console.log(cell)

        if (cell.isHome){
            console.log("This is your home")
        }

        if (!cell.isHome){
            console.log("You're out walking")
        }


        return newGameBoard
    }

    const handleCellLeftClick = (row: number, col: number) => {
        // console.log("left click: ", row, col)
        const newGameBoard: TBoard = JSON.parse(JSON.stringify(gameBoard))

        const boardAfterOpeningCell = openCell(newGameBoard, row, col)

        if (boardAfterOpeningCell){
            setGameBoard(boardAfterOpeningCell)
        }

        
    }

    return{gameBoard, handleCellLeftClick}
}

export default useGothamLoopsGame