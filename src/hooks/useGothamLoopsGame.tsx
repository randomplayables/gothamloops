/**
 * Custom hook that manages the core game logic for Gotham Loops.
 * 
 * This hook encapsulates the entire game state and logic, including:
 * - Board state management
 * - Level selection
 * - Round progression
 * - Score calculation
 * - Player movement
 * - Game over detection
 * - History tracking across rounds
 * 
 * @returns {Object} Game state and control functions
 * @returns {string} returns.level - Current difficulty level ("deuce", "trey", or "quad")
 * @returns {Function} returns.changeLevel - Function to change the game difficulty
 * @returns {TBoard} returns.gameBoard - Current state of the game board
 * @returns {Function} returns.handleCellLeftClick - Function to handle cell clicks
 * @returns {TrackRound} returns.roundHistory - Data tracking the current round's history
 * @returns {boolean} returns.isRoundOver - Whether the current round has ended
 * @returns {number} returns.roundScore - Score for the current round
 * @returns {number} returns.totalScore - Accumulated score across all rounds
 * @returns {number} returns.round - Current round number
 * @returns {Function} returns.handleStartNewRound - Function to start a new round
 * @returns {PastCell[][]} returns.pastCells - History of all cells across previous rounds
 * @returns {MultiRoundTrack} returns.multiRoundTrack - Data tracking all rounds played
 * @returns {boolean} returns.isGameOver - Whether the game has ended
 * @returns {number} returns.finalTotalScore - Final score at game completion
 */
import { useCallback, useEffect, useState, useRef } from "react"
import { initGame, updateProbabilitiesFromPastVisits, calculateMoveScore } from "../utils"
import { TBoard, TrackRound, TLevel, PastCell, MultiRoundTrack } from "../types";
import { DEFAULT_LEVEL, LEVELS } from "../constants";
import useRound from "./useRound"; 
import { initGameSession, saveGameData } from "../services/apiService";

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
    const [gameSession, setGameSession] = useState<any>(null);
    const [roundHistory, setRoundHistory] = useState<TrackRound>({
        step: 0,
        placeCell: [],
        p: [],
        score: [],
        rvalue: [] 
    });

    // Add an effect to initialize the session when the game starts
    useEffect(() => {
        const initSession = async () => {
            const session = await initGameSession();
            setGameSession(session);
        }
        ;
        initSession();
    }, []);
  
    
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

    /**
     * Resets the game board to a fresh state.
     * 
     * Clears the current round data and initializes a new board
     * according to the current level settings.
     */
    const resetBoard = useCallback(() => {
        setIsRoundOver(false)
        setRoundScore(0)
        setRoundHistory({
            step: 0,
            placeCell: [],
            p: [],
            score: [],
            rvalue: []
        });

        // Reset the current position to the home (center) position of the new board
        const centerRow = Math.floor(currentLevel.rows / 2);
        const centerCol = Math.floor(currentLevel.cols / 2);
        setCurrentPosition({ row: centerRow, col: centerCol });

        setGameBoard(
            initGame(currentLevel.rows, currentLevel.cols, currentLevel.numCoins)
        )
    }, [currentLevel])

    /**
     * Starts a completely new game.
     * 
     * Resets all game state including the board, round number,
     * and clears multi-round tracking data.
     */
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

    /**
     * Starts a new round or ends the game after 7 rounds.
     * 
     * Updates the board with probability adjustments based on previous rounds,
     * saves the current round data to history, and prepares for the next round.
     * If all 7 rounds are completed, calculates the final score and ends the game
     * after updating the board to show Round 7 rings.
     */
//     const startNewRound = useCallback(() => {
        
//         // Add the current round score to the total score if the round wasn't lost
//         if (roundScore > 0) {
//             setTotalScore(prevTotal => prevTotal + roundScore);
//         }

//         // 1) Build a fresh copy of `pastCells` from the current gameBoard
//         const newPastCells = structuredClone(pastCells);
//         for (let i = 0; i < gameBoard.length; i++) {
//         for (let j = 0; j < gameBoard[i].length; j++) {
//             const cell = gameBoard[i][j];
//             if ("isOpen" in cell) {
//             newPastCells[i][j].isOpen.push(cell.isOpen as boolean);
//             newPastCells[i][j].round.push(cell.round as number);
//             newPastCells[i][j].p.push(cell.p as number);
//             newPastCells[i][j].place.push(cell.place as boolean);
//             newPastCells[i][j].highlight?.push(cell.highlight as "red" | "green");
//             }
//         }
//         }
//         console.log("Updated pastCells:", newPastCells);
    
//         // 2) Build the new multiRoundTrack entry
//         const newMultiRoundTrack = structuredClone(multiRoundTrack);
//         newMultiRoundTrack.rounds.push({
//         roundNumber: round,           // This is the *old* round number just completed
//         roundHistory: { ...roundHistory },
//         finalScore: roundScore
//         });
//         console.log("Updated multiRoundTrack:", newMultiRoundTrack);
    
//         // 3) Now actually set the updated states for pastCells and multiRoundTrack
//         setPastCells(newPastCells);
//         setMultiRoundTrack(newMultiRoundTrack);

//           // After updating pastCells and multiRoundTrack, save the current round data
//           if (round > 0 && gameSession) { // Skip saving for initial round=0 state
//             const roundDataToSave = {
//                 roundNumber: round,
//                 finalScore: roundScore,
//                 roundHistory: { ...roundHistory },
//                 boardSize: {
//                     rows: currentLevel.rows,
//                     cols: currentLevel.cols
//                 },
//                 difficulty: level,
//                 success: roundScore > 0 // Whether the round was completed successfully
//             };

//              // Save the data to the RandomPlayables platform
//              await saveGameData(round, roundDataToSave);
// }
        
//         // // Check if we're about to exceed 7 rounds
//         // if (round >= 7) {
//         //     // Calculate final total score from multiRoundTrack
//         //     const totalScore = newMultiRoundTrack.rounds.reduce((sum, roundData) => 
//         //     sum + roundData.finalScore, 0);
            
//         //     // Update the game board to show the Round 7 rings first
            
//         //     // Reset the current position to the home cell
//         //     const centerRow = Math.floor(currentLevel.rows / 2);
//         //     const centerCol = Math.floor(currentLevel.cols / 2);
//         //     setCurrentPosition({ row: centerRow, col: centerCol });
            
//         //     // Create a copy of the game board to show completed Round 7
//         //     const finalBoard = structuredClone(gameBoard);
            
//         //     // Update the board to ensure all steelblue markers are gone
//         //     for (let i = 0; i < finalBoard.length; i++) {
//         //         for (let j = 0; j < finalBoard[i].length; j++) {
//         //             const cell = finalBoard[i][j];
//         //             if (cell.isOpen) {
//         //                 cell.isOpen = false; // Remove steelblue markers
//         //             }
//         //         }
//         //     }
            
//         //     setGameBoard(finalBoard);
//         //     setFinalTotalScore(totalScore);
            
//         //     // Set game over after a brief delay to allow the board to update visually
//         //     setTimeout(() => {
//         //         setIsGameOver(true);
//         //     }, 100);
            
//         //     return; // Don't start a new round
//         // }
//         // Also update the game over section to save the final game data
//         // // In the "if (round >= 7)" block within startNewRound
//         if (round >= 7) {
            
//         // Calculate final total score from multiRoundTrack
//         const totalScore = newMultiRoundTrack.rounds.reduce((sum, roundData) => 
//             sum + roundData.finalScore, 0);
        
//         // Save final game data
//         if (gameSession) {
//             const finalGameData = {
//                 totalScore,
//                 allRounds: newMultiRoundTrack.rounds,
//                 difficulty: level,
//                 success: true,
//                 gameCompleted: true
//             };
            
//         await saveGameData(8, finalGameData); // Use round 8 for final game data
//         }


//         // 4) Increment the round now that we're starting a new round
//         incrementRound();
    
//         // 5) Create a fresh board for the new round
//         const newBoard = initGame(
//         currentLevel.rows,
//         currentLevel.cols,
//         currentLevel.numCoins
//         );
    
//         // 6) Apply updated probabilities using the *newPastCells* local variable
//         const updatedBoard = updateProbabilitiesFromPastVisits(
//         newBoard,
//         newPastCells, // Pass the local variable, not the (stale) state
//         currentLevel.numCoins
//         );
        
//         setGameBoard(updatedBoard);
    
//         // 7) Reset round-related state
//         setIsRoundOver(false);
//         setRoundScore(0);
//         setRoundHistory({
//         step: 0,
//         placeCell: [],
//         p: [],
//         score: [],
//         rvalue: []
//         });
    
//         // 8) Reset the player's position to the home cell
//         const centerRow = Math.floor(currentLevel.rows / 2);
//         const centerCol = Math.floor(currentLevel.cols / 2);
//         setCurrentPosition({ row: centerRow, col: centerCol });
    
//     }, [
//         round,
//         incrementRound,
//         currentLevel,
//         gameBoard,
//         pastCells,
//         multiRoundTrack,
//         roundHistory,
//         roundScore,
//         gameSession // Add gameSession to dependencies
//     ]);

const startNewRound = useCallback(async () => {
    // Add the current round score to the total score if the round wasn't lost
    if (roundScore > 0) {
        setTotalScore(prevTotal => prevTotal + roundScore);
    }

    // 1) Build a fresh copy of `pastCells` from the current gameBoard
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

    // 2) Build the new multiRoundTrack entry
    const newMultiRoundTrack = structuredClone(multiRoundTrack);
    newMultiRoundTrack.rounds.push({
        roundNumber: round,           // This is the *old* round number just completed
        roundHistory: { ...roundHistory },
        finalScore: roundScore
    });
    console.log("Updated multiRoundTrack:", newMultiRoundTrack);

    // 3) Now actually set the updated states for pastCells and multiRoundTrack
    setPastCells(newPastCells);
    setMultiRoundTrack(newMultiRoundTrack);

    // After updating pastCells and multiRoundTrack, save the current round data
    if (round > 0 && gameSession) { // Skip saving for initial round=0 state
        const roundDataToSave = {
            roundNumber: round,
            finalScore: roundScore,
            roundHistory: { ...roundHistory },
            boardSize: {
                rows: currentLevel.rows,
                cols: currentLevel.cols
            },
            difficulty: level,
            success: roundScore > 0 // Whether the round was completed successfully
        };

        // Save the data to the RandomPlayables platform
        await saveGameData(round, roundDataToSave);
    }
    
    // Check if we're about to exceed 7 rounds
    if (round >= 7) {
        // Calculate final total score from multiRoundTrack
        const totalScore = newMultiRoundTrack.rounds.reduce((sum, roundData) => 
            sum + roundData.finalScore, 0);
        
        // Save final game data
        if (gameSession) {
            const finalGameData = {
                totalScore,
                allRounds: newMultiRoundTrack.rounds,
                difficulty: level,
                success: true,
                gameCompleted: true
            };
            
            await saveGameData(8, finalGameData); // Use round 8 for final game data
        }
        
        // Reset the current position to the home cell
        const centerRow = Math.floor(currentLevel.rows / 2);
        const centerCol = Math.floor(currentLevel.cols / 2);
        setCurrentPosition({ row: centerRow, col: centerCol });
        
        // Create a copy of the game board to show completed Round 7
        const finalBoard = structuredClone(gameBoard);
        
        // Update the board to ensure all steelblue markers are gone
        for (let i = 0; i < finalBoard.length; i++) {
            for (let j = 0; j < finalBoard[i].length; j++) {
                const cell = finalBoard[i][j];
                if (cell.isOpen) {
                    cell.isOpen = false; // Remove steelblue markers
                }
            }
        }
        
        setGameBoard(finalBoard);
        setFinalTotalScore(totalScore);
        
        // Set game over after a brief delay to allow the board to update visually
        setTimeout(() => {
            setIsGameOver(true);
        }, 100);
        
        return; // Don't start a new round
    }

    // 4) Increment the round now that we're starting a new round
    incrementRound();

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
        score: [],
        rvalue: []
    });

    // 8) Reset the player's position to the home cell
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
    roundScore,
    gameSession,
    level // Add level to dependencies
]);
      
    /**
     * Changes the game difficulty level.
     * 
     * Updates the level state and reinitializes the game board
     * and past cell tracking for the new level dimensions.
     * 
     * @param {TLevel} selectedLevel - The new difficulty level to set
     */  
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

    /**
     * Checks if a move from one cell to another is legal.
     * 
     * A legal move is to an adjacent cell (up, down, left, or right).
     * Diagonal moves are not allowed.
     * 
     * @param {number} fromRow - Starting row position
     * @param {number} fromCol - Starting column position
     * @param {number} toRow - Target row position
     * @param {number} toCol - Target column position
     * @returns {boolean} Whether the move is legal
     */
    const isLegalMove = (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
        const rowDiff = Math.abs(fromRow - toRow)
        const colDiff = Math.abs(fromCol - toCol)
        return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)
    }

    /**
     * Handles the logic when a player opens a cell.
     * 
     * Updates the game state based on the player's move to a new cell,
     * including calculating scores, checking for round completion,
     * and applying probability checks.
     * 
     * @param {TBoard} board - Current game board
     * @param {number} row - Row of the cell being opened
     * @param {number} col - Column of the cell being opened
     * @returns {TBoard|null} Updated board or null if the move is invalid
     */
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
            rvalue: [...prev.rvalue, rvalue]
        }));
    
        // Calculate the new round score and update state
        setRoundScore(prev => {
            return prev + moveScore;
        });
        
        // Compute the random value once for this move
        const rvalue: number = Math.random();
        if (cell.isHome) {
            if (roundHistory.step > 0){
                setIsRoundOver(true)
                cell.highlight = "green"
            }
            console.log("This is your home")
        } else {
            console.log("rvalue: ", rvalue)
            console.log("cell.p: ", cell.p)
            if (rvalue > (cell.p as number)){
                setIsRoundOver(true)
                cell.highlight = "red"
                setRoundScore(0)
            }
            console.log("You're out walking")
        }
    
        return newGameBoard
    }, [currentPosition, isRoundOver, roundHistory.step, pastCells, currentLevel.rows, currentLevel.cols, round])

    /**
     * Handles player clicks on cells.
     * 
     * Processes the player's attempt to move to a new cell,
     * updates the game board if the move is valid.
     * 
     * @param {number} row - Row of the clicked cell
     * @param {number} col - Column of the clicked cell
     * @returns {null} Returns null if the move is invalid
     */
    const handleCellLeftClick = useCallback((row: number, col: number) => {
        if (isRoundOver) return null

        const newGameBoard: TBoard = JSON.parse(JSON.stringify(gameBoard))
        const boardAfterOpeningCell = openCell(newGameBoard, row, col)
        
        if (boardAfterOpeningCell){
            setGameBoard(boardAfterOpeningCell)
        }  
    }, [isRoundOver, gameBoard, openCell])

    /**
     * Handles UI request to start a new round.
     * 
     * Acts as a wrapper for the startNewRound function
     * that is called from UI components.
     */
    const handleStartNewRound = useCallback(async () => {
        if (isRoundOver) {
            await startNewRound()
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