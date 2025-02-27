import { TBoard } from "../types"

const createBoard = (rows: number, cols: number) => {
    const board: TBoard = []

    for (let rowIndex = 0; rowIndex < rows; rowIndex++){
        board[rowIndex] = []

        for (let cellIndex = 0; cellIndex < cols; cellIndex++){
            board[rowIndex][cellIndex] = {
                value: ".",
                isOpen: false,
                round: 1,
                p: 0.5
            }
        }
    }

    return board
}

export const initBoard = (rows: number, cols: number, p: number) => {
    const emptyBoard = createBoard(rows, cols)

    return emptyBoard
}

export const initGame = (rows: number, cols: number, p: number) => {
    return initBoard(rows, cols, p)
}