// src/count/count-context.js
import React from 'react'

const CountContext = React.createContext()

function countReducer(state, action) {
  switch (action.type) {
    case 'INCREMENT': {
      return {count: state.count + 1}
    }
    default: {
      throw new Error(`Unsupported action type: ${action.type}`)
    }
  }
}

function CountProvider(props) {
  const [state, dispatch] = React.useReducer(countReducer, {count: 0})
  const value = React.useMemo(() => [state, dispatch], [state])
  return <CountContext.Provider value={value} {...props} />
}

function useCount() {
  const context = React.useContext(CountContext)
  if (!context) {
    throw new Error(`useCount must be used within a CountProvider`)
  }
  const [state, dispatch] = context
  const increment = () => dispatch({type: 'INCREMENT'})
  return {
    state,
    dispatch,
    increment,
  }
}

export {CountProvider, useCount}