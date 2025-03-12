import GameStatus from "./GameStatus"
import RoundDisplay from "./RoundDisplay"

type HeaderProps = {
    isRoundOver: boolean
    roundScore: number
    totalScore: number
    round: number
    onStartNewRound?: () => void
}

const Header = (props: HeaderProps) => {
    const { isRoundOver, roundScore, totalScore, round, onStartNewRound } = props

    return (
        <header className="game-header">
            <GameStatus
                isRoundOver={isRoundOver}
                roundScore={roundScore}
                totalScore={totalScore}
            />
            <RoundDisplay 
                round={round} 
                onStartNewRound={onStartNewRound}
                isRoundOver={isRoundOver}
            />
        </header>
    )
}

export default Header