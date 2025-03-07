type GameStatusProps = {
    isRoundOver: boolean
    roundScore: number
}

const GameStatus = (props: GameStatusProps) => {
    const {isRoundOver, roundScore} = props
    const scoreLabel = isRoundOver ? "Final Round Score:" : "Running Round Score:"

    return(
    // <>
    // {isRoundOver && <span>Round Over</span>}
    // <span>Round Score: {roundScore}</span>
    // {roundScore}
    // </>
    <div className="game-status">
    <span>{scoreLabel} {roundScore}</span>
    </div>
    )

}

export default GameStatus