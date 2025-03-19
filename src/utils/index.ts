/**
 * Utility functions for Gotham Loops game.
 * 
 * This file contains core game logic functions that handle board creation,
 * probability calculations, and scoring mechanisms that drive the game.
 * 
 * @module utils
 */
import { TBoard, PastCell } from "../types"

/**
 * Creates an empty game board with the specified dimensions.
 * 
 * Initializes a board where all cells have default properties.
 * The center cell is designated as the home cell.
 * 
 * @param {number} rows - Number of rows in the board
 * @param {number} cols - Number of columns in the board
 * @returns {TBoard} A new board with initialized cells
 */
const createBoard = (rows: number, cols: number) => {
    const board: TBoard = []

    for (let rowIndex = 0; rowIndex < rows; rowIndex++){
        board[rowIndex] = []

        for (let cellIndex = 0; cellIndex < cols; cellIndex++){
            board[rowIndex][cellIndex] = {
                isOpen: false,
                round: 1,
                p: 0.5,
                isHome: false,
                place: false,
                highlight: null
            }
        }
    }
    
    // Calculate the center indices (median)
    const centerRowIndex = Math.floor(rows / 2)
    const centerCellIndex = Math.floor(cols / 2)
    
    // Set the center cell as the home cell
    board[centerRowIndex][centerCellIndex].isHome = true;
    board[centerRowIndex][centerCellIndex].place = true;
    
    return board
}

/**
 * Initializes a new game board with default cell probabilities.
 * 
 * Creates an empty board and fills it with appropriate probability values.
 * 
 * @param {number} rows - Number of rows in the board
 * @param {number} cols - Number of columns in the board
 * @param {number} numCoins - Number of coins used in probability calculations
 * @returns {TBoard} A fully initialized game board
 */
export const initBoard = (rows: number, cols: number, numCoins: number) => {
    const emptyBoard = createBoard(rows, cols)
    const gameBoard = fillBoardWithPs(emptyBoard, rows, cols, numCoins)
    return gameBoard
}

/**
 * Helper function to initialize a new game.
 * 
 * Wrapper around initBoard that creates a new game board.
 * 
 * @param {number} rows - Number of rows in the board
 * @param {number} cols - Number of columns in the board
 * @param {number} numCoins - Number of coins used in probability calculations
 * @returns {TBoard} A fully initialized game board
 */
export const initGame = (rows: number, cols: number, numCoins: number) => {
    return initBoard(rows, cols, numCoins)
}

/**
 * Calculates the probability for a cell based on coin flips.
 * 
 * Uses a probabilistic model based on coin flips to determine
 * the likelihood of successfully traversing a cell.
 * 
 * @param {number} flips - Number of coin flips to simulate
 * @param {number} numCoins - Number of coins used per flip
 * @returns {number} Probability value between 0 and 1
 */
const calculateCellProbability = (flips: number, numCoins: number) => {
  const failurePerTrial = 1 - Math.pow(0.5, numCoins);
  return 1 - Math.pow(failurePerTrial, flips);
}

/**
 * Fills a board with probability values based on distance from home.
 * 
 * Assigns probabilities to each cell based on Manhattan distance from
 * the home cell. Cells closer to home have higher probabilities of success.
 * 
 * @param {TBoard} emptyBoard - The board to fill with probabilities
 * @param {number} rows - Number of rows in the board
 * @param {number} cols - Number of columns in the board
 * @param {number} numCoins - Number of coins used in probability calculations
 * @returns {TBoard} Board with assigned probability values
 */
const fillBoardWithPs = (emptyBoard: TBoard, rows: number, cols: number, numCoins: number) => {
  // Find the home cell (which should be at the center)
  const centerRowIndex = Math.floor(rows / 2);
  const centerCellIndex = Math.floor(cols / 2);
  
  // Calculate maxsteps (maximum distance from any corner to home)
  // Using Manhattan distance
  const maxsteps = centerRowIndex + centerCellIndex;
  
  // Update probabilities for all cells
  for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
      for (let cellIndex = 0; cellIndex < cols; cellIndex++) {
          // Calculate Manhattan distance from home (stepdistance)
          const stepdistance = Math.abs(rowIndex - centerRowIndex) + Math.abs(cellIndex - centerCellIndex);
          
          // Set probability based on coin-flipping model
          let cellP;
          
          if (rowIndex === centerRowIndex && cellIndex === centerCellIndex) {
              // Home cell always has maximum probability
              cellP = 1.0;
          } else {
              // Calculate number of flips = maxsteps - stepdistance + 1
              // This ensures corner cells get 1 flip and home gets maxsteps+1
              const flips = maxsteps - stepdistance + 1;
              
              // Probability of getting at least one heads in 'flips' tries
              cellP = calculateCellProbability(flips, numCoins)
              
              // Ensure minimum probability of 0.1
              cellP = Math.max(cellP, 0.1);
          }
          
          // Update cell probability
          emptyBoard[rowIndex][cellIndex].p = (cellP as number);
      }
  }
  return emptyBoard;
}

/**
 * Updates cell probabilities based on past visits across rounds.
 * 
 * Increases the probability of success for cells that were visited in previous
 * rounds or are neighbors of previously visited cells. This makes the game
 * progressively more challenging as rounds advance.
 * 
 * @param {TBoard} gameBoard - Current game board
 * @param {PastCell[][]} pastCells - History of cell states from past rounds
 * @param {number} numCoins - Number of coins used in probability calculations
 * @returns {TBoard} Updated board with adjusted probabilities
 */
export const updateProbabilitiesFromPastVisits = (
  gameBoard: TBoard,
  pastCells: PastCell[][],
  numCoins: number
): TBoard => {
  // Make a deep copy of the game board to avoid mutations
  const updatedBoard: TBoard = JSON.parse(JSON.stringify(gameBoard));
  const rows = gameBoard.length;
  const cols = gameBoard[0].length;
  
  // Find the home cell (which should be at the center)
  const centerRowIndex = Math.floor(rows / 2);
  const centerCellIndex = Math.floor(cols / 2);
  
  // Calculate maxsteps (maximum distance from any corner to home)
  const maxsteps = centerRowIndex + centerCellIndex;
  
  // Create a map to track which rounds each cell has "extra flips" from
  // Using Sets to ensure we only count each round once
  const extraFlipsFromRounds: Set<number>[][] = Array(rows)
    .fill(null)
    .map(() => Array(cols)
      .fill(null)
      .map(() => new Set<number>())
    );

  // Determine how many past rounds we have data for
  const numPastRounds = pastCells[0][0].isOpen.length;

  // For each past round (0-indexed, so round 1 is index 0)
  for (let round = 0; round < numPastRounds; round++) {
    // For each cell
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        // Check if this cell was visited in this round
        if (pastCells[i][j].isOpen[round]) {
          // For each cell on the board at distance 0 or 1, add this round
          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              // Skip the home cell
              if (gameBoard[r][c].isHome) continue;
              
              // Calculate Manhattan distance
              const distance = Math.abs(r - i) + Math.abs(c - j);
              
              // If this cell is itself or a neighboring cell, add this round
              if (distance === 0 || distance === 1) {
                extraFlipsFromRounds[r][c].add(round);
              }
            }
          }
        }
      }
    }
  }
  
  // Now update probabilities based on the calculated extra flips
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Skip the home cell
      if (gameBoard[r][c].isHome) continue;
      
      // Calculate the base stepdistance and flips
      const stepdistance = Math.abs(r - centerRowIndex) + Math.abs(c - centerCellIndex);
      const baseFlips = Math.max(1, maxsteps - stepdistance);

      // Add the extra flips from unique past rounds
      const totalFlips = baseFlips + extraFlipsFromRounds[r][c].size;
      
      // Calculate new probability using the coin-flipping model
      let newP = calculateCellProbability(totalFlips, numCoins)
      
      // Apply the same scaling factor as the original cell probability
      const originalP = gameBoard[r][c].p as number; 
      const theoreticalBaseP = calculateCellProbability(baseFlips, numCoins)
      
      if (theoreticalBaseP > 0 && theoreticalBaseP < 1) {
        // Calculate the scaling factor applied in fillBoardWithPs
        const scalingFactor = originalP / theoreticalBaseP;
        newP = newP * scalingFactor;
      }
      
      // Ensure probability stays between 0.1 and 1.0
      updatedBoard[r][c].p = Math.max(0.1, Math.min(newP, 1.0));
    }
  }
  
  return updatedBoard;
}

/**
 * Calculates the score for a player's move to a specific cell.
 * 
 * Score is primarily based on distance from home, with penalties
 * for visiting cells that were already visited in previous rounds.
 * 
 * @param {number} row - Row index of the cell
 * @param {number} col - Column index of the cell
 * @param {boolean} isHome - Whether this is the home cell
 * @param {PastCell[][]} pastCells - History of cell states from past rounds
 * @param {number} boardRows - Total number of rows in the board
 * @param {number} boardCols - Total number of columns in the board
 * @returns {number} The calculated score for this move
 */
export const calculateMoveScore = (
  row: number, 
  col: number, 
  isHome: boolean,
  pastCells: PastCell[][], 
  boardRows: number, 
  boardCols: number
): number => {
  // If it's the home cell, score is 0
  if (isHome) {
    return 0;
  }
  
  // Calculate Manhattan distance from home (center of board)
  const centerRow = Math.floor(boardRows / 2);
  const centerCol = Math.floor(boardCols / 2);
  const distanceFromHome = Math.abs(row - centerRow) + Math.abs(col - centerCol);
  
  // Base score is directly proportional to distance from home
  let score = distanceFromHome;
  
  // Check if cell was visited in any previous round
  const wasVisitedPreviously = pastCells[row][col].isOpen.some(Boolean);
  
  // Apply penalty for previously visited cells
  if (wasVisitedPreviously) {
    score = Math.max(0, score - 1); // Subtract 1, but don't go below 0
  }
  
  return score;
};