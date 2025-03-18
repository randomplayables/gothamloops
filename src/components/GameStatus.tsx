/**
 * GameStatus component for Gotham Loops game.
 * 
 * Displays the current round score and total accumulated score during gameplay.
 * The round score label changes based on whether the round is in progress or completed.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.isRoundOver - Indicates whether the current round has ended
 * @param {number} props.roundScore - The score for the current round
 * @param {number} props.totalScore - The accumulated score across all rounds
 * @returns {JSX.Element} Rendered game status display with current scores
 */
type GameStatusProps = {
    isRoundOver: boolean
    roundScore: number
    totalScore: number
}

/**
 * Renders the current round score and total score information.
 * 
 * @param {GameStatusProps} props - The component properties
 * @param {boolean} props.isRoundOver - Whether the current round has ended
 * @param {number} props.roundScore - Score for the current round
 * @param {number} props.totalScore - Accumulated score from all rounds
 */
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