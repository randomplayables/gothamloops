/**
 * Header component for Gotham Loops game.
 * 
 * Acts as the main game header that combines the GameStatus and RoundDisplay components.
 * Displays round information, scores, and provides controls for progressing through the game.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.isRoundOver - Indicates whether the current round has ended
 * @param {number} props.roundScore - The score for the current round
 * @param {number} props.totalScore - The accumulated score across all rounds
 * @param {number} props.round - The current round number
 * @param {Function} [props.onStartNewRound] - Optional callback function to start a new round
 * @returns {JSX.Element} Rendered game header with status and round information
 */
import GameStatus from "./GameStatus"
import RoundDisplay from "./RoundDisplay"

type HeaderProps = {
    isRoundOver: boolean
    roundScore: number
    totalScore: number
    round: number
    onStartNewRound?: () => void
}

/**
 * Renders the game header containing game status and round information.
 * 
 * Combines the GameStatus and RoundDisplay components to create a complete
 * header for the game interface.
 * 
 * @param {HeaderProps} props - The component properties
 * @param {boolean} props.isRoundOver - Whether the current round has ended
 * @param {number} props.roundScore - Score for the current round
 * @param {number} props.totalScore - Accumulated score from all rounds
 * @param {number} props.round - Current round number
 * @param {Function} [props.onStartNewRound] - Optional function to handle starting a new round
 */
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