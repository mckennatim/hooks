const help=(state, action) =>{
  switch (action.type) {
    case 'SET_KEY_VAL':
      const keys = Object.keys(action.payload)
      keys.map((key)=>{
        state[key] =action.payload[key]
      })
      return {
        ...state,
      };
    case 'HELP_LOADING':
      return{
        ...state, isloading:true
      }      
    case 'HELP_NOT_AVAILABLE':
      return{
        ...state, xhr:{message:'help not available'}
      }      
      case 'HELP_LOADED':
      return{
        ...state, 
        isloading:false,
        allhelp:action.payload
      }      
    default:
      return state;
  }
}

export{help}