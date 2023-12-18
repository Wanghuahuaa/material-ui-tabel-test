import { useState } from 'react'
import './App.less'
import ReactVirtualizedTable from './TableTest'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ReactVirtualizedTable></ReactVirtualizedTable>
    </>
  )
}

export default App
