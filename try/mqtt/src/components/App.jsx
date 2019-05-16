import React, {useContext, useState} from 'react'// eslint-disable-line no-unused-vars
import {cfg, ls} from '../utilities/getCfg'
import {ClientSocket, 
  Context, 
  useDevSpecs,  
  processMessage, 
  getZinfo,
  getDinfo, 
  setupSocket,
  monitorFocus
} from '../../nod/src/index'

const lsh = ls.getItem()

const Twitter = () => {
  console.log('Twitterr re-rendering')
  const [client, publish] = useContext(Context);
  client.onMessageArrived= onMessageArrived

  const topics  = ['srstate', 'sched', 'flags', 'timr'] 
  const {devs, zones, binfo}= useDevSpecs(ls, cfg, client, (client, devs)=>{
    setupSocket(client, devs, publish, topics)
  })
  
  const[temp_out, setTemp_out] = useState({darr:[0,0,0,0]})
  const[temp_gh, setTemp_gh] = useState({darr:[0,0,0,0]})
  const[hum_gh, setHum_gh] = useState({darr:[0,0,0,0]})
  const[light_gh, setLight_gh] = useState({pro:[[]], timeleft:0, darr:[0]})

  const [prog, setProg] = useState('[[0,0,0]]')
  const [priorprog, setPriorProg] = useState([[0,0,0]])

  function onMessageArrived(message){
    const ns = processMessage(message, devs, zones, {temp_out, temp_gh, hum_gh, light_gh})
    if(ns){
      const key =Object.keys(ns)[0]
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
          if(JSON.stringify(ns[key].pro)!=priorprog){
            setProg(JSON.stringify(ns[key].pro))
            setPriorProg(prog)
          }
          break
      }
    }
  }

  monitorFocus(window, client, lsh, ()=>{
    setupSocket(client, devs, publish, topics)
  })
  
  const toggleOnOff=()=>{
    const dinfo = getDinfo('light_gh', devs)
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

