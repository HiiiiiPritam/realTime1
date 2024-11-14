import { useState } from 'react'
import GameCanvas from './components/GameCanvas'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <GameCanvas/>
    </>
  )
}

export default App
