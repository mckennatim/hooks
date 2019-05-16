import React, {useContext, useState} from 'react'// eslint-disable-line no-unused-vars
import {cfg, ls} from '../utilities/getCfg'
import {ClientSocket, 
  Context, 
  monitorFocus, 
  processRawMessage, 
  useDevSpecs,  
  processMessage, 
  getZinfo,
  getDinfo, 
  subscribe, 
  req} from '../../nod/src/index'
const lsh = ls.getItem()

const setupSocket=(client, devs, publish, subscribe, req, cb)=>{
  const thedevs = Object.keys(devs)
  const topics  = ['srstate', 'sched', 'flags', 'timr'] 
  publish(client, 'presence', 'doodle do de de')
  subscribe(client, thedevs, topics)
  req(client, thedevs, publish, topics )
  cb()
}

// const init = {
//   "temp_out":{darr:[0,0,0,0]}, 
//   "temp_gh":{darr:[0,0,0,0]}, 
//   "hum_gh":{darr:[0,0,0,0]}, 
//   "light_gh":{pro:[[]], timeleft:0, darr:[0]}
// }

// const messageReducer = (state, action)=>{
//   const keys =Object.keys(state)
//   const newstate = keys.reduce((newdata, label)=>{
//     if(action.type==label){
//       const tmp ={}
//       tmp[label] ={...newdata[label]} //
//       Object.keys(state[label]).map((d)=>{
//         if(action.payload[d]){
//           tmp[label][d] = action.payload[d]
//         }
//       })
//       newdata[label]=tmp[label]
//     }
//     return newdata
//   },{...state})
//   return newstate
// }

// const action = {}
// action.type = "light_gh"
// const state = {...init}
// init[action.type].timeleft = 4212
// action.payload = {}
// action.payload.pro = [[1,2,3], [4,5,6], [7,8,9]]
// console.log('action: ', action)
// console.log('state: ', state)
// const prt = {}
// prt[action.type]= {...state[action.type]}
// console.log('prt: ', prt)
// const updatedstate = messageReducer(prt, action)
// console.log('updatedstate: ', updatedstate)

// const messageReducer = (state, action) => {//{temp_gh: 0, hum_gh: 0, light_gh: ({ison: false, timeleft: 0}), temp_out: 0}
//   const ns = {}
//   switch (action.type){
//     case 'temp_gh': 
//       const temp_gh = {...state.temp_gh}
//       if(action.payload.darr){//srstate
//         temp_gh.darr=action.payload.darr
//       }
//       ns.temp_gh=temp_gh
//       return ns
//     case 'hum_gh': 
//       const hum_gh = {...state.hum_gh}
//       if(action.payload.darr){
//         hum_gh.darr=action.payload.darr
//       }
//       ns.hum_gh=hum_gh
//       return ns  
//     case 'light_gh':
//       const lgh = {...state.light_gh}
//       if (action.payload.darr){
//         lgh.darr= action.payload.darr
//       }
//       if(action.payload.timeleft){
//         lgh.timeleft=action.payload.timeleft
//       }
//       if(action.payload.pro){
//         lgh.pro=action.payload.pro
//       }
//       ns.light_gh = lgh
//       return ns
//     case 'temp_out': 
//       const temp_out = {...state.temp_out}
//       if (action.payload.darr){
//         temp_out.darr = action.payload.darr
//       }
//       ns.temp_out=temp_out
//       return ns
//     default: return ns  
//   }
// }

const Twitter = () => {
  console.log('Twitterr re-rendering')
  const [client, publish] = useContext(Context);
  client.onMessageArrived= onMessageArrived

  const {devs, zones, binfo}= useDevSpecs(ls, cfg, client, (client, devs)=>{
    setupSocket(client, devs, publish, subscribe, req, ()=>console.log('in callback'))
  })
  
  const[temp_out, setTemp_out] = useState({darr:[0,0,0,0]})
  const[temp_gh, setTemp_gh] = useState({darr:[0,0,0,0]})
  const[hum_gh, setHum_gh] = useState({darr:[0,0,0,0]})
  const[light_gh, setLight_gh] = useState({pro:[[]], timeleft:0, darr:[0]})

  const [prog, setProg] = useState('[[0,0,0]]')
  const [priorprog, setPriorProg] = useState([[0,0,0]])

  function onMessageArrived(mess){
    const message = processRawMessage(mess)
    const ns = processMessage(message, devs, zones, {temp_out, temp_gh, hum_gh, light_gh})
    if(ns){
      console.log('ns: ', ns)
      const key =Object.keys(ns)[0]
      console.log('key: ', key)
      switch (key){
        case 'temp_out':
          setTemp_out({...ns[key]})
          break
        case 'temp_gh':
          setTemp_gh({...ns[key]})
          break
        case 'hum_gh':
          setHum_gh({...ns[key]})
          break
        case 'light_gh':
          setLight_gh({...ns[key]})
          console.log('light_gh: ', light_gh)
          if(JSON.stringify(ns[key].pro)!=priorprog){
            console.log('UPDATING prog')
            setProg(JSON.stringify(ns[key].pro))
            setPriorProg(prog)
          }
          break
      }
    }
  }

  monitorFocus(window, client, lsh, ()=>{
    setupSocket(client, devs, publish, subscribe, req, ()=>console.log('in monitor callback'))
  })
  
  const toggleOnOff=()=>{
    const dinfo = getDinfo('light-gh', devs)
    const newt = !light_gh.darr[0]*1
    const topic = `${dinfo.dev}/cmd`
    const payload = `{"id":${dinfo.sr},"sra":[${newt}]}`
    console.log('topic + payload: ', topic + payload)
    publish(client, topic, payload)
  }

  const changeProg=(e)=>{
    console.log('e.target.value: ', e.target.value)
    setProg(e.target.value)
  }

  const sendChange=()=>{
    console.log('prog: ', prog)
    const dinfo = getDinfo('light_gh', devs)
    const topic = `${dinfo.dev}/prg`
    const payload = `{"id":${dinfo.sr},"pro":${prog}}`
    console.log('topic + payload: ', topic + payload)
    publish(client, topic, payload)
  }

  const renderProg=()=>{
    return(
      <div>
        <input type="text" size="60" onChange={changeProg} value={prog}/>
        <button onClick={sendChange}>change prog for today</button>
      </div>
    )
  }

  const renderOnOff=()=>{
    console.log('light_gh: ', light_gh)
    const btext = light_gh.darr[0] ? 'ON': 'OFF'
    const bkg = light_gh.darr[0] ? {background:'green'} : {background:'red'}
    return(<button style={bkg}onClick={toggleOnOff}>{btext}</button>)
  }

  const renderZones=()=>{
    if(zones.length>0){
      const z1 = getZinfo('temp_gh',zones)
      const z2 = getZinfo('hum_gh',zones)
      const z3 = getZinfo('temp_out',zones)
      const z4 = getZinfo('light_gh', zones)
      return(
        <div>
          <h3>{z3.name}: {temp_out.darr[0]}</h3>
          <h3>{z1.name}: {temp_gh.darr[0]}</h3>
          <h3>{z2.name}: {hum_gh.darr[0]}</h3>
          <h4>{z4.name} program has them on for another {light_gh.timeleft/60} minutes</h4>
        </div>
      )
    }else{
      return <h4>nozones</h4>
    }
  }

  return (
    <div>
      <h1>hello Twiiter </h1>
      {renderZones()}
      {renderOnOff()}
      {renderProg()}
      <pre>{JSON.stringify(devs, null, 2)}</pre><br/>
      <pre>{JSON.stringify(zones, null, 4)}</pre> <br/>
      <pre>{JSON.stringify(binfo, null, 4)}</pre>
    </div>
  );
};

const App = () => (
  <ClientSocket cfg={cfg}>
    <Twitter />
  </ClientSocket>
);

export{App}

