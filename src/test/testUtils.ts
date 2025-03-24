import { TBoard, PastCell } from '../types'

/**
 * Creates a mock game board for testing
 */
export function createMockBoard(rows: number, cols: number): TBoard {
  const board: TBoard = []
  
  for (let i = 0; i < rows; i++) {
    board[i] = []
    for (let j = 0; j < cols; j++) {
      board[i][j] = {
        isOpen: false,
        round: 1,
        p: 0.5,
        isHome: i === Math.floor(rows/2) && j === Math.floor(cols/2),
        place: i === Math.floor(rows/2) && j === Math.floor(cols/2),
        highlight: null
      }
    }
  }
  
  return board
}

/**
 * Creates mock past cells data for testing
 */
export function createMockPastCells(rows: number, cols: number): PastCell[][] {
  const pastCells: PastCell[][] = []
  
  for (let i = 0; i < rows; i++) {
    pastCells[i] = []
    for (let j = 0; j < cols; j++) {
      pastCells[i][j] = {
        isOpen: [],
        round: [],
        p: [],
        isHome: i === Math.floor(rows/2) && j === Math.floor(cols/2),
        place: [],
        highlight: []
      }
    }
  }
  
  return pastCells
}