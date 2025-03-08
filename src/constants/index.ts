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

// export const LEVELS = {
//     easy: {
//       rows: 13,
//       cols: 13,
//       p: .99,
//       decay: 0.1
//     },
//     medium: {
//       rows: 17,
//       cols: 17,
//       p: .9,
//       decay: 0.2
//     },
//     expert: {
//       rows: 21,
//       cols: 21,
//       p: .8,
//       decay: 0.3
//     },
//   };

//   export const DEFAULT_LEVEL: TLevel = 'easy'

export const LEVELS = {
  easy: {
    rows: 13,
    cols: 13,
    p: 0.95,
    decay: 0.85
  },
  medium: {
    rows: 17,
    cols: 17,
    p: 0.9,
    decay: 0.75
  },
  expert: {
    rows: 21,
    cols: 21,
    p: 0.85,
    decay: 0.65
  },
};

export const DEFAULT_LEVEL: TLevel = 'easy'