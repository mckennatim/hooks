import React, {useContext, useState, useReducer} from 'react'// eslint-disable-line no-unused-vars
import {cfg, ls, makeHref} from '../utilities/getCfg'
// import {nav2} from '../app'
import {Zones} from './Zones.jsx'

import {
  connect,
  Context, 
  useDevSpecs,  
  processMessage, 
  setupSocket,
  monitorFocus
// } from '@mckennatim/mqtt-hooks'
} from '../../npm/mqtt-hooks'

const lsh = ls.getItem()

const Control = () => {
  const [client, publish] = useContext(Context);
  client.onMessageArrived= onMessageArrived

  const doOtherShit=()=>{
    //console.log('other shit but not connected doesnt work yet')
    publish(client, "presence", "hello form do other shit")
  }


  const topics  = ['srstate', 'sched', 'flags', 'timr'] 

  const {devs, zones, binfo, specs, error}= useDevSpecs(ls, cfg, client, (devs)=>{
    // setTilNext()
    if(!client.isConnected()){
      connect(client,lsh,(client)=>{
        if (client.isConnected()){
          setupSocket(client, devs, publish, topics, (devs, client)=>doOtherShit(devs, client))
        }
      })
    }else{
      setupSocket(client, devs, publish, topics, (devs, client)=>doOtherShit(devs, client))
    }
  })

  const initialState = {
    kid: {pro:[[]], darr:[0,0,0,0]},
    lr: {pro:[[]], darr:[0,0,0,0]},
    music: {pro:[[]], darr:[0,0,0,0]},
    peri: {pro:[[]], darr:[0,0,0,0]},
    temp_out: {darr:[0,0,0,0]},
    timer: {pro:[[]], timeleft:0, darr:[0,0,0,0]}
  }
  const[status, setStatus] = useState('focused')
  const [state, dispatch] = useReducer(reducer, initialState);

  function reducer(state,action){
    const nstate = {...state}
    nstate[action.type]= action.payload
    return nstate
  }


  function onMessageArrived(message){
    const nsarr = processMessage(message, devs, state)
    if(nsarr.length>0){
      // console.log('nsarr: ', JSON.stringify(nsarr))
      nsarr.map((ns)=>{
        const key =Object.keys(ns)[0]
        const action = {type:key, payload:ns[key]}
        dispatch(action)
      })
    }
  }


  monitorFocus(window, client, lsh, (status, client)=>{
    setStatus(status)
    if (client.isConnected()){
      setupSocket(client, devs, publish, topics, (devs,client)=>doOtherShit(devs,client))
    }
  })
  
  // const sendChange=()=>{
  //   console.log('prog: ', prog)
  //   const dinfo = getDinfo('light_gh', devs)
  //   const topic = `${dinfo.dev}/prg`
  //   const payload = `{"id":${dinfo.sr},"pro":${prog}}`
  //   console.log('topic + payload: ', topic + payload)
  //   publish(client, topic, payload)
  // }
  const goSignin =()=>{
    const href = makeHref(window.location.hostname, 'signin', '')//, `?${locid}`)
    window.location.assign(href)
  }

  // console.log('state: ', JSON.stringify(state))
  const renderSpecs = () =>{
    const thespecs = specs.map((s,i)=>{
      const server = JSON.parse(s.server)
      const spec = JSON.parse(s.specs)
      return(
        <li key={i}>{s.devid} <br/> 
        {s.description} <br/> 
        owner: {s.owner} <br/>
        hysteresis: {spec.hysteresis} <br/>
        <pre>{JSON.stringify(server, null, 4)}</pre>
        <pre>{JSON.stringify(spec, null, 4)}</pre>
        </li>
      )
    })
    return(
      <div>
      <ul>
        {thespecs}
      </ul>
      </div>
    )
  }

  // console.log('binfo: ', binfo)
  const rrender=()=>{
    if (!error){
      const {locdata} = binfo
      return(
        <div>
          {status}
          <h1>hvac </h1>
          <h3>outside temp: {state.temp_out.darr[0]}</h3>
          <Zones zones={zones} state={state} devs={devs} locdata={locdata}/>
          <pre>{JSON.stringify(devs, null, 2)}</pre><br/>
          <pre>{JSON.stringify(zones, null, 4)}</pre> <br/>
          <pre>{JSON.stringify(binfo, null, 4)}</pre>
          {specs && renderSpecs()}
          {/* <pre>{JSON.stringify(specs, null, 4)}</pre> */}
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

