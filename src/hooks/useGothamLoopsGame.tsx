import { useCallback, useEffect, useState, useRef } from "react"
import { initGame, updateProbabilitiesFromPastVisits, calculateMoveScore } from "../utils"
import { TBoard, TrackRound, TLevel, PastCell, MultiRoundTrack } from "../types";
import { DEFAULT_LEVEL, LEVELS } from "../constants";
import useRound from "./useRound"; 

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
            LEVELS[DEFAULT_LEVEL].numCoins,
        )
    )
    
    const [isRoundOver, setIsRoundOver] = useState(false)
    const [roundScore, setRoundScore] = useState(0)
    const [totalScore, setTotalScore] = useState(0)
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

    const [isGameOver, setIsGameOver] = useState(false);
    const [finalTotalScore, setFinalTotalScore] = useState(0);

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
            initGame(currentLevel.rows, currentLevel.cols, currentLevel.numCoins)
        )
    }, [currentLevel])

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

    // Update the startNewRound function to save current round data:
    const startNewRound = useCallback(() => {
        
        // Check if we're about to exceed 7 rounds
        if (round >= 7) {
            // Calculate final total score from multiRoundTrack
            const totalScore = multiRoundTrack.rounds.reduce((sum, roundData) => 
            sum + roundData.finalScore, 0) + roundScore;
            
            setFinalTotalScore(totalScore);
            setIsGameOver(true);
            return; // Don't start a new round
        }

        // Add the current round score to the total score if the round wasn't lost
        if (roundScore > 0) {
            setTotalScore(prevTotal => prevTotal + roundScore);
        }

        // 1) Increment the round right away, so round is about to become (oldRound + 1).
        incrementRound();
      
        // 2) Build a fresh copy of `pastCells` from the current gameBoard
        const newPastCells = structuredClone(pastCells);
        for (let i = 0; i < gameBoard.length; i++) {
          for (let j = 0; j < gameBoard[i].length; j++) {
            const cell = gameBoard[i][j];
            if ("isOpen" in cell) {
              newPastCells[i][j].isOpen.push(cell.isOpen as boolean);
              newPastCells[i][j].round.push(cell.round as number);
              newPastCells[i][j].p.push(cell.p as number);
              newPastCells[i][j].place.push(cell.place as boolean);
              newPastCells[i][j].highlight?.push(cell.highlight as "red" | "green");
            }
          }
        }
        console.log("Updated pastCells:", newPastCells);
      
        // 3) Build the new multiRoundTrack entry
        const newMultiRoundTrack = structuredClone(multiRoundTrack);
        newMultiRoundTrack.rounds.push({
          roundNumber: round,           // This is the *old* round number just completed
          roundHistory: { ...roundHistory },
          finalScore: roundScore
        });
        console.log("Updated multiRoundTrack:", newMultiRoundTrack);
      
        // 4) Now actually set the updated states for pastCells and multiRoundTrack
        setPastCells(newPastCells);
        setMultiRoundTrack(newMultiRoundTrack);
      
        // 5) Create a fresh board for the new round
        const newBoard = initGame(
          currentLevel.rows,
          currentLevel.cols,
          currentLevel.numCoins
        );
      
        // 6) Apply updated probabilities using the *newPastCells* local variable
        const updatedBoard = updateProbabilitiesFromPastVisits(
          newBoard,
          newPastCells, // Pass the local variable, not the (stale) state
          currentLevel.numCoins
        );
        
        setGameBoard(updatedBoard);
      
        // 7) Reset round-related state
        setIsRoundOver(false);
        setRoundScore(0);
        setRoundHistory({
          step: 0,
          placeCell: [],
          p: [],
          score: []
        });
      
        // 8) Reset the player’s position to the home cell
        const centerRow = Math.floor(currentLevel.rows / 2);
        const centerCol = Math.floor(currentLevel.cols / 2);
        setCurrentPosition({ row: centerRow, col: centerCol });
      
      }, [
        round,
        incrementRound,
        currentLevel,
        gameBoard,
        pastCells,
        multiRoundTrack,
        roundHistory,
        roundScore
      ]);
      
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
        
        // Check if this cell has already been visited in this round
        const cellAlreadyVisitedThisRound = newGameBoard[row][col].isOpen  
        
        // Always mark the cell as open and record the current round number    
        newGameBoard[row][col].isOpen = true 
        newGameBoard[row][col].round = round;
    
        // Update current position
        setCurrentPosition({ row, col })
        
        // Calculate the score for this move - only score if not already visited in this round
        let moveScore = 0;
        if (!cellAlreadyVisitedThisRound) {
            moveScore = calculateMoveScore(
                row, 
                col, 
                cell.isHome, 
                pastCells, 
                currentLevel.rows, 
                currentLevel.cols
            );
        }
    
        // Update round history
        setRoundHistory((prev) => ({
            step: prev.step + 1,
            placeCell: [...prev.placeCell, { row, cell: col }],
            p: [...prev.p, typeof cell.p === 'number' ? cell.p : 0],
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
            }
            console.log("You're out walking")
        }
    
        return newGameBoard
    }, [currentPosition, isRoundOver, roundHistory.step, pastCells, currentLevel.rows, currentLevel.cols, round])

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
        totalScore,
        round,
        handleStartNewRound,
        pastCells,
        multiRoundTrack,
        isGameOver,
        finalTotalScore
    }
}

export default useGothamLoopsGame