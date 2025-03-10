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
  easy: {
    rows: 13,
    cols: 13,
    p: 0.999,
    decay: 0.975
  },
  medium: {
    rows: 17,
    cols: 17,
    p: 0.99,
    decay: 0.975
  },
  expert: {
    rows: 21,
    cols: 21,
    p: 0.975,
    decay: 0.975
  },
};

export const DEFAULT_LEVEL: TLevel = 'easy'