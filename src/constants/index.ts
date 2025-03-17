import { TLevel } from "../types";

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

// Colors for marking cells that were visited in previous rounds
export const ROUND_COLORS = [
  '#60D394', // Round 1: Emerald 
  '#8AC926', // Round 2: Yellow green
  '#6A4C93', // Round 3: Ultra violet
  '#073B4C', // Round 4: Midnight green
  '#8A716A', // Round 5: Cinereous
  '#125E8A', // Round 6: Lapis Lazulli
  '#D6CA98', // Round 7: Sage
];