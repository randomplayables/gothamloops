import { useCallback, useEffect, useState, useRef } from "react"
import { initGame } from "../utils"
import { TBoard, TrackRound, TLevel, PastCell, MultiRoundTrack } from "../types";
import { DEFAULT_LEVEL, LEVELS } from "../constants";
import useRound from "./useRound"; // Import the useRound hook

const useGothamLoopsGame = () => {
    // Use the round hook with memoized functions
    const { round, incrementRound, resetRound } = useRound();

    const [level, setLevel] = useState(DEFAULT_LEVEL)
    const currentLevel = LEVELS[level]
    
    // Track if this is the initial mount
    const isInitialMount = useRef(true);

    const [gameBoard, setGameBoard] = useState(
        initGame(
            LEVELS[DEFAULT_LEVEL].rows,
            LEVELS[DEFAULT_LEVEL].cols,
            LEVELS[DEFAULT_LEVEL].p,
            LEVELS[DEFAULT_LEVEL].decay
        )
    )
    
    const [isRoundOver, setIsRoundOver] = useState(false)
    const [roundScore, setRoundScore] = useState(0)
    const [roundHistory, setRoundHistory] = useState<TrackRound>({
        step: 0,
        placeCell: [],
        p: [],
        score: []
    });
    
    // Track the current position for faster lookup
    const [currentPosition, setCurrentPosition] = useState(() => {
        // Initialize by finding the home position
        const rows = gameBoard.length
        const cols = gameBoard[0].length
        const centerRow = Math.floor(rows / 2)
        const centerCol = Math.floor(cols / 2)
        return { row: centerRow, col: centerCol }
    })

    const resetBoard = useCallback(() => {
        setIsRoundOver(false)
        setRoundScore(0)
        setRoundHistory({
            step: 0,
            placeCell: [],
            p: [],
            score: []
        });

        // Reset the current position to the home (center) position of the new board
        const centerRow = Math.floor(currentLevel.rows / 2);
        const centerCol = Math.floor(currentLevel.cols / 2);
        setCurrentPosition({ row: centerRow, col: centerCol });

        setGameBoard(
            initGame(currentLevel.rows, currentLevel.cols, currentLevel.p, currentLevel.decay)
        )
    }, [currentLevel])

    // const startNewGame = useCallback(() => {
    //     resetBoard()
    //     resetRound() // Reset round counter for new game
    // }, [resetBoard, resetRound])
    const startNewGame = useCallback(() => {
        resetBoard();
        resetRound(); // Reset round counter for new game
        
        // Reset multi-round track
        setMultiRoundTrack({
            rounds: []
        });
        
        // Reset pastCells
        setPastCells(() => {
            const rows = currentLevel.rows;
            const cols = currentLevel.cols;
            const cells: PastCell[][] = [];
            for (let i = 0; i < rows; i++) {
                cells[i] = [];
                for (let j = 0; j < cols; j++) {
                    cells[i][j] = {
                        isOpen: [],
                        round: [],
                        p: [],
                        isHome: i === Math.floor(rows / 2) && j === Math.floor(cols / 2),
                        place: [],
                        highlight: []
                    };
                }
            }
            return cells;
        });
    }, [resetBoard, resetRound, currentLevel]);

    // Track past cell states across rounds
    const [pastCells, setPastCells] = useState<PastCell[][]>(() => {
        // Initialize with empty arrays for each cell
        const rows = LEVELS[DEFAULT_LEVEL].rows;
        const cols = LEVELS[DEFAULT_LEVEL].cols;
        const cells: PastCell[][] = [];
        for (let i = 0; i < rows; i++) {
            cells[i] = [];
            for (let j = 0; j < cols; j++) {
                cells[i][j] = {
                    isOpen: [],
                    round: [],
                    p: [],
                    isHome: i === Math.floor(rows / 2) && j === Math.floor(cols / 2),
                    place: [],
                    highlight: []
                };                }
        }    
        return cells;
    });
    
    // Track round data across multiple rounds
    const [multiRoundTrack, setMultiRoundTrack] = useState<MultiRoundTrack>({
        rounds: []
    });

    // const startNewRound = useCallback(() => {
    //     resetBoard()
    //     incrementRound() // Increment round counter for new round
    // }, [resetBoard, incrementRound])

    // Update the startNewRound function to save current round data:
    const startNewRound = useCallback(() => {
        // Save the current round's history in the multi-round track
        // setMultiRoundTrack(prev => ({
        //     rounds: [
        //         ...prev.rounds,
        //         {
        //             roundNumber: round,
        //             roundHistory: { ...roundHistory },
        //             finalScore: roundScore
        //         }
        //     ]
        // }

        // The commented out version of setMultiRoundTrack  above should be used in production
        // The version below is for understanding how function is behaving in development
        setMultiRoundTrack(prev => {
            const updatedTrack = {
                rounds: [
                    ...prev.rounds,
                    {
                        roundNumber: round,
                        roundHistory: { ...roundHistory },
                        finalScore: roundScore
                    }
                ]
            };
            
            console.log('Multi-round data updated:', updatedTrack);
            return updatedTrack;
        });

        
    // ));

    // Save all cell states for this round in PastCell format
    setPastCells(prev => {
        const newPastCells = [...prev];
        for (let i = 0; i < gameBoard.length; i++) {
            for (let j = 0; j < gameBoard[i].length; j++) {
                const cell = gameBoard[i][j];
                if ('isOpen' in cell) { // Check if it's a PresentCell
                    newPastCells[i][j].isOpen.push(cell.isOpen as boolean);
                    newPastCells[i][j].round.push(cell.round as number);
                    newPastCells[i][j].p.push(cell.p as number);
                    newPastCells[i][j].place.push(cell.place as boolean);
                    if (cell.highlight) {
                        newPastCells[i][j].highlight?.push(cell.highlight as "red" | "green");
                    } else {
                        newPastCells[i][j].highlight?.push('null');
                    }
                }
            }
        }
        return newPastCells;
    });
    
    resetBoard();
    incrementRound();
    }, [resetBoard, incrementRound, round, roundHistory, roundScore, gameBoard]);


    // const changeLevel = useCallback((selectedLevel: TLevel) => {
    //     setLevel(selectedLevel)
    //     // We'll handle reset in the useEffect
    // }, [])

    const changeLevel = useCallback((selectedLevel: TLevel) => {
        setLevel(selectedLevel);
        // Reset pastCells when the level changes
        setPastCells(() => {
            const rows = LEVELS[selectedLevel].rows;
            const cols = LEVELS[selectedLevel].cols;
            const cells: PastCell[][] = [];
            for (let i = 0; i < rows; i++) {
                cells[i] = [];
                for (let j = 0; j < cols; j++) {
                    cells[i][j] = {
                        isOpen: [],
                        round: [],
                        p: [],
                        isHome: i === Math.floor(rows / 2) && j === Math.floor(cols / 2),
                        place: [],
                        highlight: []
                    };
                }
            }
            return cells;
        });
        // We'll handle the rest of the reset in the useEffect
    }, []);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            startNewGame();
        } else if (level !== DEFAULT_LEVEL) {
            // Only run when level changes, not on initial mount
            startNewGame();
        }
    }, [level, startNewGame])

    // Check if a move is legal (adjacent to current position)
    const isLegalMove = (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
        const rowDiff = Math.abs(fromRow - toRow)
        const colDiff = Math.abs(fromCol - toCol)
        return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)
    }
    
    const openCell = useCallback((board: TBoard, row: number, col: number) => {
        // Make a deep copy so that we don't mutate the original board
        const newGameBoard: TBoard = JSON.parse(JSON.stringify(board))
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

        // Calculate the new round score and update state
        setRoundScore(prev => {
            return prev + moveScore;
        });
        
        if (cell.isHome) {
            if (roundHistory.step > 0 && cell.isHome === true){
                setIsRoundOver(true)
                cell.highlight = "green"
                console.log(`See pastCells object:`, pastCells);
            }
            console.log("This is your home")
        } else {
            let rvalue: number = Math.random() 
            if (rvalue > (cell.p as number)){
                console.log("rvalue: ", rvalue)
                console.log("cell.p: ", cell.p)
                setIsRoundOver(true)
                cell.highlight = "red"
                setRoundScore(0)
                console.log(`See pastCells object:`, pastCells);
            }
            console.log("You're out walking")
        }

        return newGameBoard
    }, [currentPosition, isRoundOver, roundHistory.step])

    const handleCellLeftClick = useCallback((row: number, col: number) => {
        if (isRoundOver) return null

        const newGameBoard: TBoard = JSON.parse(JSON.stringify(gameBoard))
        const boardAfterOpeningCell = openCell(newGameBoard, row, col)
        
        if (boardAfterOpeningCell){
            setGameBoard(boardAfterOpeningCell)
        }  
    }, [isRoundOver, gameBoard, openCell])

    // Function to handle starting a new round (for UI to call)
    const handleStartNewRound = useCallback(() => {
        if (isRoundOver) {
            startNewRound()
        }
    }, [isRoundOver, startNewRound])

    return {
        level, 
        changeLevel, 
        gameBoard, 
        handleCellLeftClick, 
        roundHistory, 
        isRoundOver, 
        roundScore,
        round,
        handleStartNewRound,
        pastCells,
        multiRoundTrack
    }
}

export default useGothamLoopsGame