import './App.css'

function App() {
  return <div className='game'>
    {[
      [0, 1, 2, 3, "M"],
      [0, 1, 2, 3, "M"],
      [0, 1, 2, 3, "M"]
      ].map((row) => (
        <div>{row.map((cell) => cell)}</div>
      ))}
  </div>
}

export default App
