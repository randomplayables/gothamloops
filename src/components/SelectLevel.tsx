/**
 * SelectLevel component for Gotham Loops game.
 * 
 * Renders a list of difficulty level options that the player can select from.
 * Highlights the currently active level and updates the game state when a new level
 * is selected.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.level - The currently selected level
 * @param {Function} props.changeLevel - Callback function triggered when a different level is selected
 * @returns {JSX.Element} Rendered level selection interface with buttons for each difficulty level
 */
import clsx from "clsx"
import { LEVELS } from "../constants"
import { TLevel } from "../types"

type SelectLevelProps = {
    level: string
    changeLevel: (selectedLevelName: TLevel) => void
}

/**
 * Renders a set of buttons allowing the player to select the game difficulty level.
 * 
 * Uses the LEVELS constant to generate buttons for each available level option.
 * Applies styling to indicate the currently selected level.
 * 
 * @param {SelectLevelProps} props - Component properties
 * @param {string} props.level - Currently active level name
 * @param {Function} props.changeLevel - Function to handle level change when a button is clicked
 */
const SelectLevel = ({level, changeLevel}: SelectLevelProps) => {
    return ( <ul className="select-level">
        {Object.keys(LEVELS).map((levelName) => (
            <li key ={levelName}>
                <button
                className={clsx(level === levelName && "active")}
                onClick={() => changeLevel(levelName as TLevel)}>{levelName}</button>
            </li>
        ))}
    </ul>)
}

export default SelectLevel;