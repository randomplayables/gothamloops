type RoundDisplayProps = {
    round: number
    onStartNewRound?: () => void
    isRoundOver: boolean
}

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