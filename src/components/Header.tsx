import GameStatus from "./GameStatus"
import RoundDisplay from "./RoundDisplay"

type HeaderProps = {
    isRoundOver: boolean
    roundScore: number
    round: number
    onStartNewRound?: () => void
}

const Header = (props: HeaderProps) => {
    const { isRoundOver, roundScore, round, onStartNewRound } = props

    return (
        <header className="game-header">
            <GameStatus
                isRoundOver={isRoundOver}
                roundScore={roundScore}
            />
            <RoundDisplay 
                round={round} 
                onStartNewRound={onStartNewRound}
                isRoundOver={isRoundOver}
            />
        </header>
    )

    // return <header>
    //     <GameStatus
    //     isRoundOver={isRoundOver}
    //     roundScore={roundScore}/>
    //     <RoundDisplay/>
    // </header>
}

export default Header