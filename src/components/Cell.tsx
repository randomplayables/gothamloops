/**
 * Cell component for Gotham Loops game.
 * 
 * Renders an individual cell in the game grid with appropriate visual states based on 
 * cell properties. Displays rings for past visits, highlights for special states,
 * and handles user interactions.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {GameCell} props.cell - Current state data for this cell
 * @param {number} props.rowIndex - Row position of this cell in the game board
 * @param {number} props.cellIndex - Column position of this cell in the game board
 * @param {Function} props.handleCellLeftClick - Callback function triggered when the cell is clicked
 * @param {TLevel} props.level - Current difficulty level of the game ("deuce", "trey", or "quad")
 * @param {PastCell} props.pastVisits - History of this cell's states across previous rounds
 * @returns {JSX.Element} Rendered game cell with appropriate visual indicators
 */
import clsx from "clsx"
import { GameCell, TLevel, PastCell } from "../types"
import { ROUND_COLORS } from "../constants"

type  CellProps = {
    cell: GameCell
    rowIndex: number
    cellIndex: number
    handleCellLeftClick: (row: number, col: number) => void
    level: TLevel
    pastVisits: PastCell
}

const Cell = ({cell, rowIndex, cellIndex, handleCellLeftClick, level, pastVisits}: CellProps) => {

    /**
     * Collect the rounds where this cell was previously visited.
     * Used to render visual indicators for past visits.
     * @type {number[]}
     */
    const visitedInRounds: number[] = [];

    // Loop through past visits and collect the rounds
    for (let i = 0; i < pastVisits.isOpen.length; i++) {
        if (pastVisits.isOpen[i]) {
            // If it was open in this past round, add the round number to our array
            const round = pastVisits.round[i];
            if (!visitedInRounds.includes(round)) {
                visitedInRounds.push(round);
            }
        }
    }

    // Sort rounds from oldest to newest so outer rings are older rounds
    visitedInRounds.sort((a, b) => a - b);

    return(
    <div
        className={clsx(
            "cell",
            level !== "deuce" && "smaller-cell"
        )}
            onClick={() => handleCellLeftClick(rowIndex, cellIndex)}
    >

        {/* Render rings for past visits from oldest (outer) to newest (inner) */}
        {visitedInRounds.map((round, index) => {
            // Calculate ring size - earlier rounds get larger rings
            const ringSize = 90 - (index * 15);
            
            // Get color for this round (index 0 = round 1)
            const colorIndex = (round - 1) % ROUND_COLORS.length;
            const ringColor = ROUND_COLORS[colorIndex];
            
            return (
                <div 
                    key={`ring-${round}`} 
                    className="past-visit-ring" 
                    style={{
                        borderColor: ringColor,
                        width: `${ringSize}%`,
                        height: `${ringSize}%`,
                        zIndex: 5 - index, // Make sure outer rings don't cover inner rings
                    }}
                />
            );
        })}

        {cell.isOpen && cell.highlight === null &&  <div className="isO"></div>}
        {cell.isHome && cell.highlight !== "green" && <div className="home"></div>}
        {!cell.place && <div className="empty-cell"></div>}
        {cell.place && <div className="on-place"></div>}
        {cell.highlight === "red" && <div className="red"></div>}
        {cell.highlight === "green" && <div className="green"></div>}
        </div>
        )
}

export default Cell