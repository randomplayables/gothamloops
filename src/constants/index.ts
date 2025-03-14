import { TLevel } from "../types";

export const CELL_NUMBERS_COLORS = [
    null, 
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight'
]

export const LEVELS = {
  deuce: {
    rows: 11,
    cols: 11,
    numCoins: 2
  },
  trey: {
    rows: 15,
    cols: 15,
    numCoins: 3
  },
  quad: {
    rows: 19,
    cols: 19,
    numCoins: 4
  },
};

export const DEFAULT_LEVEL: TLevel = 'deuce'

// // Colors for marking cells that were visited in previous rounds
// export const ROUND_COLORS = [
//   '#FF5733', // Round 1: Red-Orange  
//   '#3357FF', // Round 2: Blue
//   '#33FF57', // Round 3: Green
//   '#FF33F5', // Round 4: Pink
//   '#F5FF33', // Round 5: Yellow
//   '#33FFF5', // Round 6: Cyan
//   '#FF8433', // Round 7: Orange
// ];

// Colors for marking cells that were visited in previous rounds
export const ROUND_COLORS = [
  '#FF5733', // Round 1: Red-Orange  
  '#3357FF', // Round 2: Blue
  '#33FF57', // Round 3: Green
  '#FF33F5', // Round 4: Pink
  '#F5FF33', // Round 5: Yellow
  '#33FFF5', // Round 6: Cyan
  '#FF8433', // Round 7: Orange
];