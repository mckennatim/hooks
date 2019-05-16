const findLabel=(message, devs)=>{
  const dev = Object.keys(devs).find(key => key === message.dev)
  let i=undefined
  if(message.topic=='srstate'){
    i = devs[dev].find((a)=>a.sr === message.payload.id)
  }if(message.topic=='timr'){
    i = devs[dev].find((a)=>message.payload.tIMElEFT[a.sr]>0)
  }if(message.topic=='sched'){
    i = devs[dev].find((a)=>a.sr === message.payload.id)
  }
  return i
}

const processMessage = (message, devs, zones, messageReducer, bigstate)=>{
  let devinf=undefined
  const action={}
  action.payload={darr:undefined, pro:undefined, timr: undefined}
  devinf = findLabel(message, devs)
  if(message.topic=='srstate'){
    if(devinf && devinf.label){
      action.type=devinf.label
      action.payload.darr = message.payload.darr
    }
  }
  if(message.topic=='timr'){
    if(devinf && devinf.label){
      action.type=devinf.label
      action.payload.timeleft = message.payload.tIMElEFT[devinf.sr]  
    }
  }
  if(message.topic=='sched'){
    if(devinf && devinf.label){
      action.type=devinf.label
      action.payload.pro = message.payload.pro
    }
  }
  const newstate =  messageReducer(bigstate, action)
  return newstate
}
export{processMessage}