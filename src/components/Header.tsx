import GameStatus from "./GameStatus"

type HeaderProps = {
    isRoundOver: boolean
    roundScore: number
}

const Header = (props: HeaderProps) => {
    const {isRoundOver, roundScore} = props

    return <header>
        <GameStatus
        isRoundOver={isRoundOver}
        roundScore={roundScore}/>
    </header>
}

export default Header