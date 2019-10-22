import React,{useContext, useReducer, useState, useEffect} from 'react'
import {ls} from '../utilities/getCfg'
import {
  connect,
  Context, 
  processMessage, 
  setupSocket,
  monitorFocus,
  getDinfo
// } from '@mckennatim/mqtt-hooks'
} from '../../npm/mqtt-hooks'
const lsh = ls.getItem()

const Zone = (props) =>{
  const prups = props.cambio.page.prups
  const zinfo = prups.zinfo
  const zid = zinfo[0].id
  const devs = prups.devs
  // console.log('devs: ', JSON.stringify(devs))
  // console.log('zinfo: ', JSON.stringify(zinfo))
  // console.log('prups.state: ', prups.state)
  if (prups.state){prups.state.temp_out={darr:[0,0,0,0]}}

  const [client, publish] = useContext(Context);
  client.onMessageArrived= onMessageArrived

  useEffect(() => {
    connect(client,lsh,(client)=>{
      console.log('client.isConnected(): ', client.isConnected())
      if (client.isConnected()){
        setupSocket(client, devs, publish, topics, (devs, client)=>doOtherShit(devs, client))
      }
    })
    return client.disconnect()
  },[])

  const[status, setStatus] = useState('focused')
  const [state, dispatch] = useReducer(reducer, prups.state);
  const [over, setOver] = useState(68)

  const topics  = ['srstate', 'sched', 'flags', 'timr']
  const doOtherShit=()=>{
    //console.log('other shit but not connected doesnt work yet')
    publish(client, "presence", "hello form do other shit")
  }

  function reducer(state,action){
    const nstate = {...state}
    nstate[action.type]= action.payload
    return nstate
  }

  function onMessageArrived(message){
    const nsarr = processMessage(message, devs, state)
    // console.log('nsarr: ', JSON.stringify(nsarr))
    const zarr = nsarr.filter((n)=>Object.keys(n)[0]==zinfo[0].id||Object.keys(n)[0]==zinfo[1].id)
    if(zarr.length>0){
      // console.log('zarr[0]: ', JSON.stringify(zarr[0]))
      const key =Object.keys(zarr[0])[0]
      const action = {type:key, payload:zarr[0][key]}
      dispatch(action)
    }
  }

  monitorFocus(window, client, lsh, (status, client)=>{
    setStatus(status)
    if (client.isConnected()){
      setupSocket(client, devs, publish, topics, (devs,client)=>doOtherShit(devs,client))
    }
  })
  const cmdOverride=()=>{
    console.log('in command override')
    const da =state[zid].darr
    const dif = da[2]-da[3]
    const newdarr = [over+dif/2,over-dif/2]
    console.log('newdarr: ', newdarr)
    console.log('devs, null,2: ', JSON.stringify(devs, null,2))
    const di = getDinfo(zid,devs)
    const topic = `${di.dev}/cmd`
    const payload = `{"id":${di.sr},"sra":[${newdarr}]}`
    console.log('topic, payload: ', topic, payload)
    publish(client, topic, payload)
  }

  const handleOver=(e)=>{
    setOver(e.target.value*1)
  }

  const renderZone=()=>{
    if (zinfo[0].id == 'nada' ){
      window.history.back()
      return(
        <div>duclsad nada</div>
      )
    }else{
      const da = state[zid].darr
      const pro = state[zid].pro
      const temp =da[0]
      const set = (da[2]+da[3])/2
      const onoff = da[1]
      return (
        <div>
          {status}
          <h1>{zinfo[0].name}</h1>
          <h3>outside temperature: {state.temp_out.darr[0]}</h3>
          <h3>temp:{temp}</h3>
          <div>
          onoff: {onoff} setpoint: {set}  intil: 
          </div>
    
          <pre>{JSON.stringify(pro)}</pre><br/>
          <input type="range" min="50" max="75" value={over} onChange={handleOver}/><span>{over}</span><br/>
          <button onClick={cmdOverride}>override thermostat setting</button><br/>
          <button>change todays schedule</button><br/>
          <button>change weekly schedule</button><br/>
          <button>set hold</button>
        </div>
      );
    }
  }
  return(
    <div>
      {renderZone()}
    </div>
  )
}

export{Zone}