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
import{nav2} from '../app'
const lsh = ls.getItem()

const Zone = (props) =>{
  const{page}=props.cambio
  const {prups, params} = page
  const {zinfo, devs, locdata, mess, doupd, sched} = prups
  const zid = zinfo[0].id



  // const asched = prups.state[zid].pro
  // console.log('devs: ', JSON.stringify(devs))
  // console.log('zinfo: ', JSON.stringify(zinfo))
  // console.log('prups.state: ', prups.state)
  if (prups.state){
    prups.state.temp_out={darr:[0,0,0,0]}
  }

  const [client, publish] = useContext(Context);
  client.onMessageArrived= onMessageArrived

  useEffect(() => {
    connect(client,lsh,(client)=>{
      if (client.isConnected()){
        setupSocket(client, devs, publish, topics, (devs, client)=>doOtherShit(devs, client))
      }
    })
    return client.disconnect()
  },[])

  // useEffect(()=>{
  //   console.log('doupd: ', doupd)
  //   if(doupd){
  //     console.log('gonna publish taht shit')
  //     console.log('client.isConnected(): ', client.isConnected())
  //   }
  // }, [doupd]) 

  const[status, setStatus] = useState('focused')
  const [state, dispatch] = useReducer(reducer, prups.state);
  const [over, setOver] = useState(68)

  const topics  = ['srstate', 'sched', 'flags', 'timr']
  const doOtherShit=()=>{
    //console.log('other shit but not connected doesnt work yet')
    publish(client, "presence", "hello form do other shit")
    if(doupd){
      console.log('props: ', props)
      const ssched = JSON.stringify(sched)
      const dinf = getDinfo(params.query, devs)
      const topic = `${dinf.dev}/prg`
      const payload = `{"id":${dinf.sr},"pro":${ssched}}`
      publish(client, topic, payload)
    }
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
  const schedChange=(asched)=>()=>{
    client.disconnect()
    console.log('asched: ', asched, locdata, zid)
    nav2('DailyScheduler', {...prups, zinfo, asched, from:'Zone'}, zid)
  }

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
          onoff: {onoff} setpoint: {set}  {mess} 
          </div>
    
          
            <span style={styles.schedstr}>{JSON.stringify(pro)}</span>
          <br/>
          <input type="range" min="50" max="75" value={over} onChange={handleOver}/><span>{over}</span><br/>
          <button onClick={cmdOverride}>override thermostat setting</button><br/>
          <button onClick={schedChange(pro)}>change todays schedule</button><br/>
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

const styles={
  schedstr:{
    fontSize: 9
  }
}