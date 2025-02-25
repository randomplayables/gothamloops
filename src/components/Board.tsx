import Cell from "./Cell"

const Board = () => {
    return(
        <div className="board">
        {[
            [{value: 0}, {value: 1}, {value: 2}, {value: "mine"}],
            [{value: 3}, {value: 4}, {value: 5}, {value: 6}],
            [{value: 7}, {value: 7}, {value: "mine"}, {value: "mine"}]
            ].map((row) => (
              <div className="row">{row.map((cell) => (
                <Cell cell = {cell}/> 
              ))}</div>
            ))}
        </div>
    )
}

export default Board