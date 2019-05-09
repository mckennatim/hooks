
// src/count/page.js
import React from 'react'
import {CountProvider, useCount} from './count-context'
function Counter() {
  const {state: {count},increment} = useCount()
  return <button onClick={increment}>{count}</button>
}

function CountDisplay() {
  const {state: {count}} = useCount()
  return <div>The current counter count is {count}</div>
}

function CountPage(props) {
  // const {state: {count}} = useCount()
  return (
    <div>
      {/* {count} Uncaught Error: useCount must be used within a CountProvider*/}
      <CountProvider>
        <CountDisplay />
        <Counter />
      </CountProvider>
      {props.children}
    </div>
  )
}

export {CountPage}