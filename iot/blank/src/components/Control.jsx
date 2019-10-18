import React, {useContext, useState} from 'react'// eslint-disable-line no-unused-vars
import {cfg, ls, makeHref} from '../utilities/getCfg'

import {
  connect,
  Context, 
  useDevSpecs,  
  processMessage, 
  getZinfo,
  getDinfo, 
  setupSocket,
  monitorFocus
} from '@mckennatim/mqtt-hooks'
// } from '../../../../npm/mqtt-hooks'

const lsh = ls.getItem()

const Zones=(props)=>{
  const {zones, temp_out, temp_gh, hum_gh, light_gh}=props
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
  return(
    <div>
      {renderZones()}
    </div>
  )
}

const Control = () => {
  const [client, publish] = useContext(Context);
  client.onMessageArrived= onMessageArrived

  const doOtherShit=()=>{
    //console.log('other shit but not connected doesnt work yet')
    //publish(client, "presence", "hello form do other shit")
  }

  const topics  = ['srstate', 'sched', 'flags', 'timr'] 
  const {devs, zones, binfo, error}= useDevSpecs(ls, cfg, client, (devs)=>{
    connect(client,lsh,(client)=>{
      console.log('client.isConnected(): ', client.isConnected())
      if (client.isConnected()){
        setupSocket(client, devs, publish, topics, (devs, client)=>doOtherShit(devs, client))
      }
    })
  })
  const[temp_out, setTemp_out] = useState({darr:[0,0,0,0]})
  const[temp_gh, setTemp_gh] = useState({darr:[0,0,0,0]})
  const[hum_gh, setHum_gh] = useState({darr:[0,0,0,0]})
  const[light_gh, setLight_gh] = useState({pro:[[]], timeleft:0, darr:[0]})
  const[status, setStatus] = useState('focused')
  const [prog, setProg] = useState('[[0,0,0]]')
  const [priorprog, setPriorProg] = useState([[0,0,0]])

  function onMessageArrived(message){
    // console.log('client.isConnected(): ', client.isConnected())
    // console.log('in onMessage arrived')
    // client.disconnect()
    const nsarr = processMessage(message, devs, zones, {temp_out, temp_gh, hum_gh, light_gh})
    // const nsarr=[]
    if(nsarr.length>0){
      nsarr.map((ns)=>{
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
      })
    }
  }

  monitorFocus(window, client, lsh, ()=>{
    setStatus(status)
    if (client.isConnected()){
      setupSocket(client, devs, publish, topics, (devs,client)=>doOtherShit(devs,client))
    }
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
  const goSignin =()=>{
    const href = makeHref(window.location.hostname, 'signin', '')//, `?${locid}`)
    console.log('href: ', href)
    window.location.assign(href)
  }

  const renderProg=()=>{
    return(
      <div>
        <input type="text" size="30" onChange={changeProg} value={prog}/>
        <button onClick={sendChange}>change prog for today</button>
      </div>
    )
  }

  const renderOnOff=()=>{
    const btext = light_gh.darr[0] ? 'ON': 'OFF'
    const bkg = light_gh.darr[0] ? {background:'green'} : {background:'red'}
    return(<button style={bkg}onClick={toggleOnOff}>{btext}</button>)
  }

  const rrender=()=>{
    if (!error){
      return(
        <div>
          <h1>Greenhouse </h1>
          <Zones zones={zones} temp_out={temp_out} temp_gh={temp_gh} hum_gh={hum_gh} light_gh={light_gh}/>
          {renderOnOff()}
          {renderProg()}
          <pre>{JSON.stringify(devs, null, 2)}</pre><br/>
          <pre>{JSON.stringify(zones, null, 4)}</pre> <br/>
          <pre>{JSON.stringify(binfo, null, 4)}</pre>
        </div>

      )
    }else{
      return(
        <div>
          <p>
            From this app on this machine&#39;s perspective, {error.qmessage} It is probably best to
          <button onClick={goSignin}>go and (re-)signin</button>
          </p>
        </div>
      )
    }
  }

  return (
    <div>
      {rrender()}
    </div>
  );
};

export{Control}

