import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Componente1 from './components/Componente1.jsx'

function App() {
  const [count, setCount] = useState(0)

  useEffect(() => { console.log("hola") } , [count])

  const array = [ "Diego", "David", "Sergio" ]

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>

        

      <div className={`${count > 5 ? "text-red-500" : "text-green-500"}`}>

        { array.map((item, indice) => (
         <Componente1 nombre={item} key={item}/>
        )) }
      </div>

        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
