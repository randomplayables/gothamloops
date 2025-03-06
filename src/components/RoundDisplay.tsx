type RoundDisplayProps = {
    round: number
    onStartNewRound?: () => void
    isRoundOver: boolean
}

const RoundDisplay = ({ round, onStartNewRound, isRoundOver }: RoundDisplayProps) => {
    return (
        <div className="round-display">
            <div className="round-counter">Round: {round}</div>
            {isRoundOver && onStartNewRound && (
                <button 
                    className="new-round-button" 
                    onClick={onStartNewRound}
                >
                    Start Round {round + 1}
                </button>
            )}
        </div>
    )
}

export default RoundDisplay