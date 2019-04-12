import {srUpdateQdata, schedUpdateQdata} from './interface'

const qreducer=(state, action) =>{
  let modstate
  switch (action.type) {
    case 'SRSTATE_CHANGED':
      modstate = srUpdateQdata(state, action.payload)
      return modstate;
    case 'SCHED_CHANGED':
      modstate = schedUpdateQdata(state, action.payload)
      return modstate;
    case 'READY_STATE':
      return {...state, readystate:action.payload.payload}
    case 'SI_NECESITAS_MQTTREQ':
      console.log('in qreduser for SI_NECESITAS_MQTTREQ')
      return state  
    default:
      return state;
  }
}

export{qreducer}