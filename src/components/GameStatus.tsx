type GameStatusProps = {
    isRoundOver: boolean
    roundScore: number
    totalScore: number
}

const GameStatus = (props: GameStatusProps) => {
    const {isRoundOver, roundScore, totalScore} = props
    const scoreLabel = isRoundOver ? "Final Round Score:" : "Running Round Score:"

    return(
    <div className="game-status">
        <span>{scoreLabel} {roundScore.toFixed(2)}</span>
        <span className="total-score">Total Score: {totalScore.toFixed(2)}</span>
    </div>
    )

}

export default GameStatus