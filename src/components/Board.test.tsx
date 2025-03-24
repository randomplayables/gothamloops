import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import Board from './Board'
import { createMockBoard, createMockPastCells } from '../test/testUtils.ts'

describe('Board Component', () => {
  it('renders the correct number of rows and cells', () => {
    const mockHandleClick = vi.fn()
    const mockBoard = createMockBoard(3, 3)
    const mockPastCells = createMockPastCells(3, 3)
    
    const { container } = render(
      <Board
        gameBoard={mockBoard}
        handleCellLeftClick={mockHandleClick}
        level="deuce"
        pastCells={mockPastCells}
      />
    )
    
    const rows = container.querySelectorAll('.row')
    expect(rows.length).toBe(3)
    
    const cells = container.querySelectorAll('.cell')
    expect(cells.length).toBe(9)
  })
})
