/**
 * Custom hook for managing round state in Gotham Loops game.
 * 
 * Provides state and functions to track, increment, and reset the current round number.
 * This hook centralizes round management logic for use across the game.
 * 
 * @returns {Object} Round state and control functions
 * @returns {number} returns.round - The current round number
 * @returns {Function} returns.incrementRound - Function to advance to the next round
 * @returns {Function} returns.resetRound - Function to reset back to round 1
 */
import { useState, useCallback } from "react"

const useRound = () => {
    const [round, setRound] = useState<number>(1)
    
    /**
     * Increases the round counter by 1.
     * Used when moving to the next round of the game.
     */
    const incrementRound = useCallback(() => {
        setRound(prevRound => prevRound + 1)
    }, [])
    
    /**
     * Resets the round counter back to 1.
     * Used when starting a new game.
     */
    const resetRound = useCallback(() => {
        setRound(1)
    }, [])
    
    return { round, incrementRound, resetRound }
}

export default useRound