const cambio=(state, action) =>{
  switch (action.type) {
    case 'SET_KEY_VAL':
      const keys = Object.keys(action.payload)
      keys.map((key)=>{
        state[key] =action.payload[key]
      })
      return {
        ...state,
      }; 
    case 'SET_FOCUS':
      return {
        ...state,
        infocus: action.payload.infocus
      };    
    case 'PAGE_SWITCHED':
      return {
        ...state,
        page: action.payload
      };    
    default:
      return state;
  }
}

export{cambio}