import { useState } from "react"
import { initGame } from "../utils"
import { TBoard } from "../types"

const useGothamLoopsGame = () => {
    const [gameBoard, setGameBoard] = useState(initGame(9, 9, 0.8))
    
    // Track the current position for faster lookup
    const [currentPosition, setCurrentPosition] = useState(() => {
        // Initialize by finding the home position
        const rows = gameBoard.length
        const cols = gameBoard[0].length
        const centerRow = Math.floor(rows / 2)
        const centerCol = Math.floor(cols / 2)
        return { row: centerRow, col: centerCol }
    })
    
    // Check if a move is legal (adjacent to current position)
    const isLegalMove = (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
        const rowDiff = Math.abs(fromRow - toRow)
        const colDiff = Math.abs(fromCol - toCol)
        return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)
    }
    
    const openCell = (board: TBoard, row: number, col: number) => {
        
        const newGameBoard: TBoard = JSON.parse(JSON.stringify(gameBoard))
        const cell = newGameBoard[row][col]
        
        // Get the current place position
        const { row: currentRow, col: currentCol } = currentPosition
        console.log("Current position:", currentRow, currentCol)
        console.log("Attempting to move to:", row, col)
        
        // Check if this is a legal move from the current position
        if (!isLegalMove(currentRow, currentCol, row, col)) {
            console.log("Illegal move - you can only move to adjacent cells")
            return null // Return null to indicate invalid move
        }
        
        // If we get here, the move is legal
        // Update the place status
        newGameBoard[currentRow][currentCol].place = false // Remove place from previous position
        newGameBoard[row][col].place = true // Set place at new position
        newGameBoard[row][col].isOpen = true // Open the new cell
        
        // Update current position
        setCurrentPosition({ row, col })

        console.log(cell)

        if (cell.isHome) {
            console.log("This is your home")
        } else {
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