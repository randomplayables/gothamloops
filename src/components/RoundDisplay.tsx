/**
 * RoundDisplay component for Gotham Loops game.
 * 
 * Displays the current round number and conditionally renders a button to start
 * the next round when the current round is over. The button text changes
 * when the player reaches the final round.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {number} props.round - The current round number
 * @param {Function} [props.onStartNewRound] - Optional callback function to start a new round
 * @param {boolean} props.isRoundOver - Indicates whether the current round has ended
 * @returns {JSX.Element} Rendered round display with round number and optional button
 */
type RoundDisplayProps = {
    round: number
    onStartNewRound?: () => void
    isRoundOver: boolean
}

/**
 * Renders the current round number and provides a button to progress to the next round.
 * 
 * The button is only displayed when the current round is over. 
 * Button text changes to "Show Results" when player completes all 7 rounds.
 * 
 * @param {RoundDisplayProps} props - Component properties
 * @param {number} props.round - Current round number (1-7)
 * @param {Function} [props.onStartNewRound] - Optional function to handle starting a new round
 * @param {boolean} props.isRoundOver - Whether the current round has ended
 */
const RoundDisplay = ({ round, onStartNewRound, isRoundOver }: RoundDisplayProps) => {

    // Determine the button text based on the current round
    const buttonText = round === 7 
    ? "Show Results" 
    : `Start Round ${round + 1}`;

    return (
        <div className="round-display">
            <div className="round-counter">Round: {round}</div>
            {isRoundOver && onStartNewRound && (
                <button 
                    className="new-round-button" 
                    onClick={onStartNewRound}
                >
                    {buttonText}
                </button>
            )}
        </div>
    )
}

export default RoundDisplay