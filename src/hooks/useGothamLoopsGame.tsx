import { useCallback, useEffect, useState } from "react"
import { initGame } from "../utils"
import { TBoard, TrackRound, TLevel } from "../types";
import { DEFAULT_LEVEL, LEVELS } from "../constants";
import useRound from "./useRound";

const useGothamLoopsGame = () => {
    // Use the round hook
    const { round, incrementRound, resetRound } = useRound();


    const [level, setLevel] = useState(DEFAULT_LEVEL)
    const currentLevel = LEVELS[level]

    const changeLevel = useCallback((selectedLevel: TLevel) => {
        setLevel(selectedLevel)
        resetRound() // Reset round counter when level changes
    }, [resetRound])

    const [gameBoard, setGameBoard] = useState(
        initGame(
            LEVELS[DEFAULT_LEVEL].rows,
            LEVELS[DEFAULT_LEVEL].cols,
            LEVELS[DEFAULT_LEVEL].p,
            LEVELS[DEFAULT_LEVEL].decay
        )
    )

    const resetBoard = useCallback(() => {
        setIsRoundOver(false)
        setRoundScore(0)
        setRoundHistory(() => ({
            step: 0,
            placeCell: [],
            p: [],
            score: []
        }));

        // Important: Reset the current position to the home (center) position of the new board
        const centerRow = Math.floor(currentLevel.rows / 2);
        const centerCol = Math.floor(currentLevel.cols / 2);
        setCurrentPosition({ row: centerRow, col: centerCol });

        setGameBoard(
            initGame(currentLevel.rows, currentLevel.cols, currentLevel.p, currentLevel.decay)
        )

    }, [currentLevel])

    const startNewGame = useCallback(() => {
        resetBoard()
        resetRound() // Reset round counter for new game
    }, [resetBoard, resetRound])

    const startNewRound = useCallback(() => {
        resetBoard()
        incrementRound() // Increment round counter for new round
    }, [resetBoard, incrementRound])

    useEffect(() => {
        startNewGame()
    }, [level, startNewGame])

    const [isRoundOver, setIsRoundOver] = useState(false)
    
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
    
    // Add a state for round score
    const [roundScore, setRoundScore] = useState(0);

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

        if (isRoundOver){
            console.log("The round is over")
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

        // Calculate the new round score and update state
        const newRoundScore = [...roundHistory.score, moveScore].reduce(
            (accumulator, currentValue) => accumulator + currentValue, 
            0
        );
        setRoundScore(newRoundScore);
        
        if (cell.isHome) {
            if (roundHistory.step > 0 && cell.isHome === true){
                setIsRoundOver(true)
                cell.highlight = "green"
            }
            console.log("This is your home")
        } else {

        let rvalue: number = Math.random() 
        if (rvalue > (cell.p as number)){
            console.log("rvalue: ", rvalue)
            console.log("cell.p: ", cell.p)
            setIsRoundOver(true)
            cell.highlight = "red"

        }
            console.log("You're out walking")
        }

        console.log("isRoundOver: ", isRoundOver)

        return newGameBoard
    }

    const handleCellLeftClick = (row: number, col: number) => {

        if (isRoundOver) return null

        const newGameBoard: TBoard = JSON.parse(JSON.stringify(gameBoard))
        const boardAfterOpeningCell = openCell(newGameBoard, row, col)
        

        if (boardAfterOpeningCell){
            setGameBoard(boardAfterOpeningCell)
        }  
    }

    // Function to handle starting a new round (for UI to call)
    const handleStartNewRound = () => {
        if (isRoundOver) {
            startNewRound()
        }
    }

    return{level, changeLevel, gameBoard, handleCellLeftClick, roundHistory, isRoundOver, roundScore, round, handleStartNewRound}
}

export default useGothamLoopsGame