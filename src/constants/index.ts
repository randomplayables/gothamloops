/**
 * Game constants for Gotham Loops.
 * 
 * This file defines the core configuration values used throughout the game,
 * including level definitions, default settings, and visual styling values.
 * 
 * @module constants
 */

import { TLevel } from "../types";

/**
 * Level configuration settings for different game difficulties.
 * 
 * Each level defines:
 * - rows: Number of rows in the game board
 * - cols: Number of columns in the game board
 * - numCoins: Number of coins used in probability calculations
 * 
 * Higher numCoins values increase the probability difficulty.
 * 
 * @constant
 */
export const LEVELS = {
  deuce: {
    rows: 13,
    cols: 13,
    numCoins: 2
  },
  trey: {
    rows: 17,
    cols: 17,
    numCoins: 3
  },
  quad: {
    rows: 21,
    cols: 21,
    numCoins: 4
  },
};

/**
 * The default game difficulty level.
 * 
 * Used for initial game state and when resetting preferences.
 * 
 * @constant
 * @default "deuce"
 */
export const DEFAULT_LEVEL: TLevel = 'deuce'

/**
 * Color palette for marking cells visited in different rounds.
 * 
 * Each color corresponds to a specific round number and is used
 * to create visual rings on cells that were visited in previous rounds.
 * Colors rotate if there are more than 7 rounds.
 * 
 * @constant
 */
export const ROUND_COLORS = [
  '#60D394', // Round 1: Emerald 
  '#8AC926', // Round 2: Yellow green
  '#6A4C93', // Round 3: Ultra violet
  '#073B4C', // Round 4: Midnight green
  '#8A716A', // Round 5: Cinereous
  '#E5ECE9', // Round 6: Mint cream
  '#BF8686', // Round 7: Old Rose
  
];