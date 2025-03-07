type GameStatusProps = {
    isRoundOver: boolean
    roundScore: number
}

const GameStatus = (props: GameStatusProps) => {
    const {isRoundOver, roundScore} = props
    const scoreLabel = isRoundOver ? "Final Round Score:" : "Running Round Score:"

    return(
    <div className="game-status">
        <span>{scoreLabel} {roundScore.toFixed(2)}</span>
    </div>
    )

}

export default GameStatus