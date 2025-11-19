import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="text-center mt-10 bg-blue-200 p-4 rounded-2xl m-10">
      <h1 className='text-2xl font-bold'>Sport Sync Frontend</h1>
      <div className="h-40 flex flex-col items-center justify-center bg-blue-700 m-5 rounded-2xl">
        <button onClick={() => setCount((count) => count + 1)} className='h-auto'>
          count is {count}
        </button>
        <p>Tailwind Test</p>
      </div>
      </div>
    </>
  )
}

export default App
