import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Cell from './Cell'
import { PastCell } from '../types'

describe('Cell Component', () => {
  it('renders without crashing', () => {
    const mockHandleClick = vi.fn()
    const mockCell = {
      isOpen: false,
      round: 1,
      p: 0.5,
      isHome: false,
      place: false,
      highlight: null
    }
    const mockPastVisits: PastCell = {
      isOpen: [],
      round: [],
      p: [],
      isHome: false,
      place: [],
      highlight: []
    }
    
    const { container } = render(
      <Cell
        cell={mockCell}
        rowIndex={0}
        cellIndex={0}
        handleCellLeftClick={mockHandleClick}
        level="deuce"
        pastVisits={mockPastVisits}
      />
    )
    
    // Check that the component renders a div with the 'cell' class
    const cellElement = container.querySelector('.cell')
    expect(cellElement).not.toBeNull()
  })
  
  it('calls handleCellLeftClick when clicked', async () => {
    const mockHandleClick = vi.fn()
    const mockCell = {
      isOpen: false,
      round: 1,
      p: 0.5,
      isHome: false,
      place: false,
      highlight: null
    }
    const mockPastVisits: PastCell = {
      isOpen: [],
      round: [],
      p: [],
      isHome: false,
      place: [],
      highlight: []
    }
    
    const { container } = render(
      <Cell
        cell={mockCell}
        rowIndex={0}
        cellIndex={0}
        handleCellLeftClick={mockHandleClick}
        level="deuce"
        pastVisits={mockPastVisits}
      />
    )
    
    const user = userEvent.setup()
    const cellElement = container.querySelector('.cell')
    
    if (cellElement) {
      await user.click(cellElement)
      
      expect(mockHandleClick).toHaveBeenCalledOnce()
      expect(mockHandleClick).toHaveBeenCalledWith(0, 0)
    } else {
      throw new Error('Cell element not found')
    }
  })
  
  it('displays home indicator when isHome is true', () => {
    const mockHandleClick = vi.fn()
    const mockCell = {
      isOpen: false,
      round: 1,
      p: 0.5,
      isHome: true, // This cell is a home cell
      place: false,
      highlight: null
    }
    const mockPastVisits: PastCell = {
      isOpen: [],
      round: [],
      p: [],
      isHome: true,
      place: [],
      highlight: []
    }
    
    const { container } = render(
      <Cell
        cell={mockCell}
        rowIndex={0}
        cellIndex={0}
        handleCellLeftClick={mockHandleClick}
        level="deuce"
        pastVisits={mockPastVisits}
      />
    )
    
    // Check for the home indicator div
    const homeIndicator = container.querySelector('.home')
    expect(homeIndicator).not.toBeNull()
  })
})