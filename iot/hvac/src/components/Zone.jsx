import React,{useContext, useReducer, useState, useEffect} from 'react'
import {cfg, ls, makeHref} from '../utilities/getCfg'
import {
  connect,
  Context, 
  useDevSpecs,  
  processMessage, 
  getZinfo,
  getDinfo, 
  setupSocket,
  monitorFocus,
  ClientSocket
// } from '@mckennatim/mqtt-hooks'
} from '../../npm/mqtt-hooks'
const lsh = ls.getItem()

const Zone = (props) =>{
  const prups = props.cambio.page.prups
  const zinfo = prups.zinfo
  const zid = zinfo[0].id
  const devs = prups.devs

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

  const topics  = ['srstate', 'sched', 'flags', 'timr']
  const doOtherShit=()=>{
    //console.log('other shit but not connected doesnt work yet')
    publish(client, "presence", "hello form do other shit")
  }

  function reducer(state,action){
    console.log('state: ', JSON.stringify(state))
    console.log('action: ', JSON.stringify(action))
    const nstate = {...state}
    nstate[action.type]= action.payload
    return nstate
  }

  function onMessageArrived(message){
    const nsarr = processMessage(message, devs, zinfo, state)
    const zarr = nsarr.filter((n)=>Object.keys(n)[0]==zinfo[0].id)
    if(zarr.length>0){
      console.log('zarr[0]: ', JSON.stringify(zarr[0]))
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
  const da = state[zid].darr
  const pro = state[zid].pro
  const temp =da[0]
  const set = (da[2]+da[3])/2
  const onoff = da[1]
  return (
    <div>
      {status}
      <h1>{zinfo[0].name}</h1>
      <h3>temp:{temp}</h3>
      <div>
        set: {set} onoff: {onoff}
      </div>

      <pre>{JSON.stringify(pro)}</pre><br/>

    </div>
  );
}

export{Zone}