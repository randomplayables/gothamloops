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