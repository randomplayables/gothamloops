import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App Integration', () => {
  it('renders the game interface on load', () => {
    render(<App />)
    
    // Verify key elements are present
    expect(screen.getByText(/round:/i)).toBeInTheDocument()
    expect(screen.getByText(/total score:/i)).toBeInTheDocument()
  })
  
  it('changes difficulty level when user selects a different level', async () => {
    render(<App />)
    
    const user = userEvent.setup()
    const treyButton = screen.getByRole('button', { name: /trey/i })
    
    await user.click(treyButton)
    
    // Verify the level changed (may need to check for a CSS class or other indicator)
    expect(treyButton).toHaveClass('active')
  })
})