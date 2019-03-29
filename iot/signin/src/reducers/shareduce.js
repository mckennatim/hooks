const newco=(state, action) =>{
  switch (action.type) {
    case 'SET_EDIT':
      return {
        ...state,
        curperson: action.payload
      };     
    case 'SET_UPDATE':
      return {
        ...state,
        update: action.payload.update
      };    
    case 'SET_KEY_VAL':
      const keys = Object.keys(action.payload)
      keys.map((key)=>{
        state[key] =action.payload[key]
      })
      return {
        ...state,
      };    
    default:
      return state;
  }
}

export{newco}