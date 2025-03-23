import { describe, it, expect } from 'vitest'
import { calculateMoveScore } from './index'
import { PastCell } from '../types' // Import the PastCell type

describe('calculateMoveScore', () => {
  it('returns 0 for the home cell', () => {
    // Create properly typed pastCells
    const pastCells: PastCell[][] = Array(13).fill(null).map(() => 
      Array(13).fill(null).map(() => ({
        isOpen: [] as boolean[],  // Explicitly type as boolean[]
        round: [] as number[],
        p: [] as number[],
        isHome: false,
        place: [] as boolean[],
        highlight: [] as string[]
      }))
    )
    
    // Test home cell (assuming center of 13x13 board)
    const score = calculateMoveScore(6, 6, true, pastCells, 13, 13)
    expect(score).toBe(0)
  })
  
  it('calculates score based on distance from home', () => {
    // Create properly typed pastCells
    const pastCells: PastCell[][] = Array(13).fill(null).map(() => 
      Array(13).fill(null).map(() => ({
        isOpen: [] as boolean[],
        round: [] as number[],
        p: [] as number[],
        isHome: false,
        place: [] as boolean[],
        highlight: [] as string[]
      }))
    )
    
    // Test a cell that's 3 steps away from home (6,6)
    const score = calculateMoveScore(9, 6, false, pastCells, 13, 13)
    expect(score).toBe(3)
  })
  
  it('reduces score for previously visited cells', () => {
    // Create properly typed pastCells
    const pastCells: PastCell[][] = Array(13).fill(null).map(() => 
      Array(13).fill(null).map(() => ({
        isOpen: [] as boolean[],
        round: [] as number[],
        p: [] as number[],
        isHome: false,
        place: [] as boolean[],
        highlight: [] as string[]
      }))
    )
    
    // Mark cell (9,6) as visited in a previous round - use push instead of assignment
    pastCells[9][6].isOpen.push(true)
    
    // Test a cell that's 3 steps away but was visited in a previous round
    const score = calculateMoveScore(9, 6, false, pastCells, 13, 13)
    expect(score).toBe(2) // 3 - 1 = 2
  })
})