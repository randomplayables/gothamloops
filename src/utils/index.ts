import { TBoard } from "../types"

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
                cellP = p * Math.exp(-distance * decayFactor);
                
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