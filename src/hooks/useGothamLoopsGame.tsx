import { useState } from "react"
import { initGame } from "../utils"
import { TBoard, TrackRound } from "../types";

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
    
    // New state for tracking round moves using the TrackRound type
    const [roundHistory, setRoundHistory] = useState<TrackRound>({
        step: 0,
        placeCell: [],
        p: [],
        score: []
    });
    
    // Check if a move is legal (adjacent to current position)
    const isLegalMove = (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
        const rowDiff = Math.abs(fromRow - toRow)
        const colDiff = Math.abs(fromCol - toCol)
        return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)
    }
    
    const openCell = (board: TBoard, row: number, col: number) => {
        
        // Make a deep copy so that we don't mutate the original board
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
        
        // Update the place status on the board
        newGameBoard[currentRow][currentCol].place = false // Remove place from previous position
        newGameBoard[row][col].place = true // Set place at new position
        newGameBoard[row][col].isOpen = true // Open the new cell
        
        // Update current position
        setCurrentPosition({ row, col })
        
        // Calculate the score for this move:
        // Type guard to check if we're dealing with a PresentCell
        // 'round' is a number in PresentCell but number[] in PastCell
        const isPresentCell = typeof cell.round === 'number';
        
        // We can now safely calculate the score if it's a PresentCell
        const moveScore = cell.isHome ? 0 : (isPresentCell ? 1 / (cell.p as number) : 0);

        // // Update round history
        setRoundHistory((prev) => ({
            step: prev.step + 1,
            placeCell: [...prev.placeCell, { row, cell: col }],
            p: [...prev.p, isPresentCell ? (cell.p as number) : 0], // Type assertion with a check
            score: [...prev.score, moveScore],
        }));

        console.log("cell: ", cell)
        console.log("roundHistory: ", roundHistory)

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

    return{gameBoard, handleCellLeftClick, roundHistory}
}

export default useGothamLoopsGame