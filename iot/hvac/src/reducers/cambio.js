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
      const npage = {...state.page, name:action.payload.name, params:action.payload.params}
      return {
        ...state,
        page: npage
      }; 
    case 'PAGE_SET_PROPS':
      const ppage = {...state.page, prups:action.payload}
      return{
        ...state,
        page:ppage
      }   
    default:
      return state;
  }
}

export{cambio}