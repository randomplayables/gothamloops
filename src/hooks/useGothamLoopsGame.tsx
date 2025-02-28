import { useState } from "react"
import { initGame } from "../utils"

const useGothamLoopsGame = () => {
    const [gameBoard, setgameBoard] = useState(initGame(9, 9, 0.8))

    const handleCellLeftClick = (row: number, col: number) => {
        console.log("left click: ", row, col)
    }

    return{gameBoard, handleCellLeftClick}
}

export default useGothamLoopsGame