import { useState, useCallback } from "react"

const useRound = () => {
    const [round, setRound] = useState<number>(1)
    
    // Function to increment the round counter
    const incrementRound = useCallback(() => {
        setRound(prevRound => prevRound + 1)
    }, [])
    
    // Function to reset the round counter
    const resetRound = useCallback(() => {
        setRound(1)
    }, [])
    
    return { round, incrementRound, resetRound }
}

export default useRound