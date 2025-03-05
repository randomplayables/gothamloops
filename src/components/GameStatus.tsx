type GameStatusProps = {
    isRoundOver: boolean
    roundScore: number
}

const GameStatus = (props: GameStatusProps) => {
    const {isRoundOver, roundScore} = props

    return(
    <>
    {isRoundOver && <span>Round Over</span>}
    {roundScore}
    </>
    )

}

export default GameStatus