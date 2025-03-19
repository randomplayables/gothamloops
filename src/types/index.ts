/**
 * Type definitions for the Gotham Loops game.
 * 
 * This file contains all the shared TypeScript interfaces and types used throughout
 * the application to ensure type safety and consistent data structures.
 * 
 * @module types
 */
import { LEVELS } from "../constants"

/**
 * Represents a cell's state in the current round.
 * 
 * Contains all properties needed to render a cell and determine its behavior
 * during gameplay in the current round.
 */
type PresentCell = {
    isOpen: boolean // Whether this cell has been visited in the current round
    round: number // The current round number
    p: number // Probability value for this cell
    isHome: boolean // Whether this is the home/center cell
    place: boolean // Whether the player is currently on this cell
    highlight?: "red" | "green" | null // Visual highlight state (null = no highlight)
}

/**
 * Represents a cell's history across multiple rounds.
 * 
 * Tracks all states a cell has been in across previous rounds of the game.
 * Each array index corresponds to a specific past round.
 */
export type PastCell = {
    isOpen: boolean[] // Whether the cell was visited in each past round
    round: number[] // The round number
    p: number[] // Probability values for this cell in past rounds
    isHome: boolean // Whether this is the home/center cell
    place: boolean[] // Whether the player was on this cell in past rounds
    highlight?: string[] // Visual highlights applied in past rounds
}

/**
 * Tracks the state of a single round including all moves and scores.
 * 
 * Used to record the history of player actions and outcomes during a round.
 */
export type TrackRound = {
    step: number // Step number within this round
    placeCell: { row: number, cell: number }[] // Position of each cell visited
    p: number[] // Probability values of visited cells
    score: number[] // Score earned at each step
    rvalue: number[] // Random values generated for probability checks
}

/**
 * Tracks data across multiple rounds of the game.
 * 
 * Used to maintain a history of all rounds played in a single game session.
 */
export type MultiRoundTrack = {
    rounds: {
        roundNumber: number; // Which round this was (1-7)
        roundHistory: TrackRound; // Complete history of this round
        finalScore: number; // Final score achieved in this round
    }[];
};

/**
 * Union type representing either the current state of a cell or its history.
 * 
 * Used when a component needs to handle both present and past cell states.
 */
export type GameCell =  PresentCell | PastCell

/**
 * Type representing the entire game board.
 * 
 * A two-dimensional array of GameCell objects forming the game grid.
 */
export type TBoard = GameCell[][]

/**
 * Type representing the available difficulty levels.
 * 
 * Uses the keys of the LEVELS constant to ensure consistency between
 * the available levels and their configurations.
 */
export type TLevel = keyof typeof LEVELS
