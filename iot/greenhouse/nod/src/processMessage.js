
const messageReducer = (state, action)=>{
  const keys =Object.keys(state)
  const newstate = keys.reduce((newdata, label)=>{
    if(action.type==label){
      const tmp ={}
      tmp[label] ={...newdata[label]} //
      Object.keys(state[label]).map((d)=>{
        if(action.payload[d]){
          tmp[label][d] = action.payload[d]
        }
      })
      newdata[label]=tmp[label]
    }
    return newdata
  },{...state})
  return newstate
}


const findLabel=(message, devs)=>{
  const dev = Object.keys(devs).find(key => key === message.dev)
  let i=[]
  if(message.topic=='srstate'){
    i = devs[dev].filter((a)=>a.sr === message.payload.id)
  }if(message.topic=='timr'){
    i = devs[dev].filter((a)=>message.payload.tIMElEFT[a.sr]>0)
  }if(message.topic=='sched'){
    i = devs[dev].filter((a)=>a.sr === message.payload.id)
  }
  return i
}

const processRawMessage= (mess)=>{
  var narr = mess.destinationName.split('/')
  const dev = narr[0]
  const topic = narr[1]
  var pls = mess.payloadString
  const payload= JSON.parse(pls)
  const message = {dev:dev, topic:topic, payload:payload}
  return message
}

const processMessage = (mess, devs, zones, bigstate)=>{
  const message = processRawMessage(mess)
  const newstates =[]
  const devinfArr = findLabel(message, devs)
  devinfArr.map((devinf)=>{
    const action={}
    action.payload={}
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
    if(Object.entries(action.payload).length != 0){
      const prt ={}
      prt[action.type]= {...bigstate[action.type]}
      const newstate =  messageReducer(prt, action)
      newstates.push(newstate)
    }    
  })
  return newstates
}
export{processMessage}