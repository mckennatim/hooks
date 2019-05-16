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

const messageReducer = (state, action) => {//{temp_gh: 0, hum_gh: 0, light_gh: ({ison: false, timeleft: 0}), temp_out: 0}
  const ns = {}
  switch (action.type){
    case 'temp-gh': 
      if(action.payload.darr){//srstate
        ns.temp_gh=action.payload.darr[0]
      }
      return ns
    case 'hum-gh': 
      if(action.payload.darr){
        ns.hum_gh=action.payload.darr[0]
      }
      return ns  
    case 'light-gh':
      const lgh = {...state.light_gh}
      if (action.payload.darr){
        lgh.ison= action.payload.darr[0]
      }
      if(action.payload.timeleft){
        lgh.timeleft=action.payload.timeleft
      }
      if(action.payload.pro){
        lgh.pro=action.payload.pro
      }
      ns.light_gh = lgh
      return ns
    case 'temp-out': 
      if (action.payload.darr){
        ns.temp_out = action.payload.darr[0]
      }
      return ns
    default: return ns  
  }
}

const Twitter = () => {
  console.log('Twitterr re-rendering')
  const [client, publish] = useContext(Context);
  client.onMessageArrived= onMessageArrived

  const {devs, zones, binfo}= useDevSpecs(ls, cfg, client, (client, devs)=>{
    setupSocket(client, devs, publish, subscribe, req, ()=>console.log('in callback'))
  })
  
  const initstate= {temp_gh: 0, hum_gh: 0, light_gh: {ison: false, timeleft: 0}, temp_out:0}
  const [bs,setBigstate] = useState(initstate)
  // const[temp_gh, setTemp_gh] = useState({darr:[0,0,0,0]})
  // const[light_gh, setLight_gh] = useState({sched:[[]], timeleft:0, darr:[0]})
  const [prog, setProg] = useState([[0,0,0]])

  function onMessageArrived(mess){
    const message = processRawMessage(mess)
    const ns = processMessage(message, devs, zones, messageReducer, bs)
    const key =Object.keys(ns)[0]
    if(key){
      bs[key]= ns[key]
      setBigstate({...bs})
      console.log('ns[key].pro: ', ns[key].pro)
      if(key=='light_gh' && ns[key].pro){
        console.log('RESETTING prog')
        setProg(JSON.stringify(ns[key].pro))
      }
    }
  }

  monitorFocus(window, client, lsh, ()=>{
    setupSocket(client, devs, publish, subscribe, req, ()=>console.log('in monitor callback'))
  })
  
  const toggleOnOff=()=>{
    const dinfo = getDinfo('light-gh', devs)
    const newt = !bs.light_gh.ison*1
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
    const dinfo = getDinfo('light-gh', devs)
    const topic = `${dinfo.dev}/pro`
    const payload = `{"id":${dinfo.sr},"pro":[${prog}]}`
    console.log('topic + payload: ', topic + payload)
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
    console.log('bs.light_gh: ', bs.light_gh)
    const btext = bs.light_gh.ison ? 'ON': 'OFF'
    const bkg = bs.light_gh.ison ? {background:'green'} : {background:'red'}
    return(<button style={bkg}onClick={toggleOnOff}>{btext}</button>)
  }

  const renderZones=()=>{
    if(zones.length>0){
      const z1 = getZinfo('temp-gh',zones)
      const z2 = getZinfo('hum-gh',zones)
      const z3 = getZinfo('temp-out',zones)
      const z4 = getZinfo('light-gh', zones)
      return(
        <div>
          <h3>{z3.name}: {bs.temp_out}</h3>
          <h3>{z1.name}: {bs.temp_gh}</h3>
          <h3>{z2.name}: {bs.hum_gh}</h3>
          <h4>{z4.name} program has them on for another {bs.light_gh.timeleft/60} minutes</h4>
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

