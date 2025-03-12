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

// const fillBoardWithPs = (emptyBoard: TBoard, rows: number, cols: number, p: number, decay: number) => {
//     // Find the home cell (which should be at the center)
//     const centerRowIndex = Math.floor(rows / 2);
//     const centerCellIndex = Math.floor(cols / 2);
    
//     // Set decay factor (how quickly probability decreases with distance)
//     // Can be adjusted based on desired difficulty level
//     const decayFactor = decay; 
    
//     // Update probabilities for all cells
//     for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
//         for (let cellIndex = 0; cellIndex < cols; cellIndex++) {
//             // Calculate Manhattan distance from home
//             const distance = Math.abs(rowIndex - centerRowIndex) + Math.abs(cellIndex - centerCellIndex);
            
//             // Set probability based on distance
//             let cellP;
            
//             if (rowIndex === centerRowIndex && cellIndex === centerCellIndex) {
//                 // Home cell always has maximum probability
//                 cellP = 1.0;
//             } else {
//                 // Calculate probability based on exponential decay
//                 // cellP = p * Math.exp(-distance * decayFactor);

//                 // Calculate probability based on geometric decay
//                 cellP = p * Math.pow(decayFactor, distance);
                
//                 // Ensure minimum probability of 0.1
//                 cellP = Math.max(cellP, 0.1);
//             }
            
//             // Update cell probability
//             emptyBoard[rowIndex][cellIndex].p = cellP;
//         }
//     }

//         // // Log the probability values for visualization
//         // console.log("Board probability values:");
//         // let boardVisualization = "";
        
//         // for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
//         //     let rowStr = "";
//         //     for (let cellIndex = 0; cellIndex < cols; cellIndex++) {
//         //         // Format to 2 decimal places and pad for alignment
//         //         const cellP = emptyBoard[rowIndex][cellIndex].p.toFixed(2);
//         //         rowStr += cellP + " ";
//         //     }
//         //     boardVisualization += rowStr + "\n";
//         // }
        
//         // console.log(boardVisualization);
    
//     return emptyBoard;
// }

export const initBoard = (rows: number, cols: number, p: number, decay: number) => {
    const emptyBoard = createBoard(rows, cols)
    const gameBoard = fillBoardWithPs(emptyBoard, rows, cols, p, decay)

    return gameBoard
}

export const initGame = (rows: number, cols: number, p: number, decay: number) => {
    return initBoard(rows, cols, p, decay)
}

const fillBoardWithPs = (emptyBoard: TBoard, rows: number, cols: number, p: number, decay: number) => {
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
              // P(success) = 1 - P(all tails) = 1 - 0.5^flips
              cellP = 1 - Math.pow(0.5, flips);
              
              // Apply the base probability factor (p) to maintain game balance
              // This allows using the existing p parameter but in a new way
              cellP = cellP * p;
              
              // Ensure minimum probability of 0.1
              cellP = Math.max(cellP, 0.1);
          }
          
          // Update cell probability
          emptyBoard[rowIndex][cellIndex].p = cellP;
      }
  }

  return emptyBoard;
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
// export const updateProbabilitiesFromPastVisits = (
//     gameBoard: TBoard,
//     pastCells: PastCell[][],
//     familiarity: number = 0.1,      // Increase in probability for directly visited cells
//     neighborEffect: number = 0.05,  // Initial effect on neighboring cells
//     decayFactor: number = 0.5       // How quickly the effect drops with distance
//   ): TBoard => {
//     // Make a deep copy of the game board to avoid mutations
//     const updatedBoard: TBoard = JSON.parse(JSON.stringify(gameBoard));
//     const rows = gameBoard.length;
//     const cols = gameBoard[0].length;
    
//     // For each cell that was visited in past rounds
//     for (let i = 0; i < rows; i++) {
//       for (let j = 0; j < cols; j++) {
//         // Count how many times this cell was visited
//         const visitCount = pastCells[i][j].isOpen.filter(Boolean).length;
        
//         if (visitCount > 0) {
//           // For each cell on the board, calculate the effect based on distance
//           for (let r = 0; r < rows; r++) {
//             for (let c = 0; c < cols; c++) {
//               // Skip the home cell - it should always remain at maximum probability
//               if (gameBoard[r][c].isHome) continue;
              
//               // Calculate Manhattan distance from the visited cell
//               const distance = Math.abs(r - i) + Math.abs(c - j);
              
//               // Calculate effect based on distance
//               // - Direct hit gets full familiarity boost
//               // - Neighbors get reduced effect based on distance
//               let effect = 0;
//               if (distance === 0) {
//                 // This is the visited cell itself
//                 effect = familiarity * visitCount;
//               } else {
//                 // This is a neighboring cell - effect decreases with distance
//                 effect = neighborEffect * Math.pow(decayFactor, distance) * visitCount;
//               }
              
//               // Update probability, ensuring it doesn't exceed 1.0
//               const currentP = updatedBoard[r][c].p as number;
//               updatedBoard[r][c].p = Math.min(currentP + effect, 1.0);
//             }
//           }
//         }
//       }
//     }
    
//     return updatedBoard;
//   }

export const updateProbabilitiesFromPastVisits = (
  gameBoard: TBoard,
  pastCells: PastCell[][],
  familiarity: number = 0.1,      // Now represents extra flips for visited cells
  neighborEffect: number = 0.05,  // Now represents extra flips for neighboring cells
  decayFactor: number = 0.5       // How quickly the effect drops with distance
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
  
  // Calculate extra flips for each cell based on past visits
  const extraFlips: number[][] = Array(rows).fill(0).map(() => Array(cols).fill(0));
  
  // For each cell that was visited in past rounds
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      // Count how many times this cell was visited
      const visitCount = pastCells[i][j].isOpen.filter(Boolean).length;
      
      if (visitCount > 0) {
        // For each cell on the board, calculate the extra flips based on distance
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            // Skip the home cell - it should always remain at maximum probability
            if (gameBoard[r][c].isHome) continue;
            
            // Calculate Manhattan distance from the visited cell
            const distance = Math.abs(r - i) + Math.abs(c - j);
            
            // Calculate extra flips based on distance
            if (distance === 0 || distance === 1) {
              // This is the visited cell itself - add 1 extra flip per visit
              // extraFlips[r][c] += (familiarity * 10) * visitCount; // Convert from previous scale to flips
              extraFlips[r][c] += visitCount; // Convert from previous scale to flips
            } //else {
              // This is a neighboring cell - effect decreases with distance
            //   extraFlips[r][c] += (neighborEffect * 10) * Math.pow(decayFactor, distance) * visitCount;
            // }
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
      
      // Add the extra flips from past visits (rounded to nearest whole flip)
      const totalFlips = baseFlips + Math.round(extraFlips[r][c]);
      
      // Calculate new probability using the coin-flipping model
      // P(success) = 1 - P(all tails) = 1 - 0.5^totalFlips
      let newP = 1 - Math.pow(0.5, totalFlips);
      
      // Apply the same scaling factor as the original cell probability
      const originalP = gameBoard[r][c].p as number;
      const theoreticalBaseP = 1 - Math.pow(0.5, baseFlips); 
      
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

