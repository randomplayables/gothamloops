import clsx from "clsx"
import { LEVELS } from "../constants"
import { TLevel } from "../types"

type SelectLevelProps = {
    level: string
    changeLevel: (selectedLevelName: TLevel) => void
}

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