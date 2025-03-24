import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useRound from './useRound'

describe('useRound', () => {
    it('initializes with round 1', () => {
        const { result } = renderHook(() => useRound())
        expect(result.current.round).toBe(1)
      })
      
      it('increments round when incrementRound is called', () => {
        const { result } = renderHook(() => useRound())
        
        act(() => {
          result.current.incrementRound()
        })
        
        expect(result.current.round).toBe(2)
      })
      
      it('resets round to 1 when resetRound is called', () => {
        const { result } = renderHook(() => useRound())
        
        // First, increment the round
        act(() => {
          result.current.incrementRound()
        })
        expect(result.current.round).toBe(2)
        
        // Then reset it
        act(() => {
          result.current.resetRound()
        })
        expect(result.current.round).toBe(1)
      })
})