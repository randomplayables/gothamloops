import { useState } from "react"
import { initGame } from "../utils"

const useGothamLoopsGame = () => {
    const [gameBoard, setgameBoard] = useState(initGame(9, 9, 0.8))

    return{gameBoard}
}

export default useGothamLoopsGame