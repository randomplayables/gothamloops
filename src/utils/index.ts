import { TBoard, PastCell } from "../types"

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

const fillBoardWithPs = (emptyBoard: TBoard, rows: number, cols: number, p: number, decay: number) => {
    // Find the home cell (which should be at the center)
    const centerRowIndex = Math.floor(rows / 2);
    const centerCellIndex = Math.floor(cols / 2);
    
    // Set decay factor (how quickly probability decreases with distance)
    // Can be adjusted based on desired difficulty level
    const decayFactor = decay; 
    
    // Update probabilities for all cells
    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
        for (let cellIndex = 0; cellIndex < cols; cellIndex++) {
            // Calculate Manhattan distance from home
            const distance = Math.abs(rowIndex - centerRowIndex) + Math.abs(cellIndex - centerCellIndex);
            
            // Set probability based on distance
            let cellP;
            
            if (rowIndex === centerRowIndex && cellIndex === centerCellIndex) {
                // Home cell always has maximum probability
                cellP = 1.0;
            } else {
                // Calculate probability based on exponential decay
                // cellP = p * Math.exp(-distance * decayFactor);

                // Calculate probability based on geometric decay
                cellP = p * Math.pow(decayFactor, distance);
                
                // Ensure minimum probability of 0.1
                cellP = Math.max(cellP, 0.1);
            }
            
            // Update cell probability
            emptyBoard[rowIndex][cellIndex].p = cellP;
        }
    }

        // // Log the probability values for visualization
        // console.log("Board probability values:");
        // let boardVisualization = "";
        
        // for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
        //     let rowStr = "";
        //     for (let cellIndex = 0; cellIndex < cols; cellIndex++) {
        //         // Format to 2 decimal places and pad for alignment
        //         const cellP = emptyBoard[rowIndex][cellIndex].p.toFixed(2);
        //         rowStr += cellP + " ";
        //     }
        //     boardVisualization += rowStr + "\n";
        // }
        
        // console.log(boardVisualization);
    
    return emptyBoard;
}

export const initBoard = (rows: number, cols: number, p: number, decay: number) => {
    const emptyBoard = createBoard(rows, cols)
    const gameBoard = fillBoardWithPs(emptyBoard, rows, cols, p, decay)

    return gameBoard
}

export const initGame = (rows: number, cols: number, p: number, decay: number) => {
    return initBoard(rows, cols, p, decay)
}

/**
 * Updates cell probabilities based on past visits
 * @param gameBoard The current game board
 * @param pastCells The record of past cell visits
 * @param familiarity How much the probability increases for visited cells
 * @param neighborEffect How much the effect extends to neighboring cells
 * @param decayFactor How quickly the neighborhood effect drops off with distance
 * @returns The updated game board with new probabilities
 */
export const updateProbabilitiesFromPastVisits = (
    gameBoard: TBoard,
    pastCells: PastCell[][],
    familiarity: number = 0.1,      // Increase in probability for directly visited cells
    neighborEffect: number = 0.05,  // Initial effect on neighboring cells
    decayFactor: number = 0.5       // How quickly the effect drops with distance
  ): TBoard => {
    // Make a deep copy of the game board to avoid mutations
    const updatedBoard: TBoard = JSON.parse(JSON.stringify(gameBoard));
    const rows = gameBoard.length;
    const cols = gameBoard[0].length;
    
    // For each cell that was visited in past rounds
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        // Count how many times this cell was visited
        const visitCount = pastCells[i][j].isOpen.filter(Boolean).length;
        
        if (visitCount > 0) {
          // For each cell on the board, calculate the effect based on distance
          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              // Skip the home cell - it should always remain at maximum probability
              if (gameBoard[r][c].isHome) continue;
              
              // Calculate Manhattan distance from the visited cell
              const distance = Math.abs(r - i) + Math.abs(c - j);
              
              // Calculate effect based on distance
              // - Direct hit gets full familiarity boost
              // - Neighbors get reduced effect based on distance
              let effect = 0;
              if (distance === 0) {
                // This is the visited cell itself
                effect = familiarity * visitCount;
              } else {
                // This is a neighboring cell - effect decreases with distance
                effect = neighborEffect * Math.pow(decayFactor, distance) * visitCount;
              }
              
              // Update probability, ensuring it doesn't exceed 1.0
              const currentP = updatedBoard[r][c].p as number;
              updatedBoard[r][c].p = Math.min(currentP + effect, 1.0);
            }
          }
        }
      }
    }
    
    return updatedBoard;
  }