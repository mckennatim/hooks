import React,{useContext, useReducer, useState, useEffect} from 'react'
import {ls, cfg} from '../utilities/getCfg'
import {
  connect,
  Context, 
  processMessage, 
  setupSocket,
  monitorFocus,
  getDinfo,
  fetchSched,
  deleteHolds,
  replaceHold
// } from '@mckennatim/mqtt-hooks'
} from '../../npm/mqtt-hooks'
import{nav2} from '../app'
import {CondensedSched} from './CondensedSched.jsx'
const lsh = ls.getItem()

const dat = new Date().toISOString().split('T')[0]

const Zone = (props) =>{
  const{page}=props.cambio
  const {prups, params} = page
  const {zinfo, devs, locdata, mess, doupd, sched} = prups
  const zid = zinfo[0].id
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

  const[status, setStatus] = useState('focused')
  const [state, dispatch] = useReducer(reducer, prups.state);
  const [over, setOver] = useState(68)
  const [holdval, setHoldVal]= useState(60)
  const [holddate, setHoldDate]= useState(dat)
  const [holdradio,setHoldRadio]=useState(1)

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
      console.log('topic, payload: ', topic, payload)
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
    const da =state[zid].darr
    const dif = da[2]-da[3]
    const newdarr = [over+dif/2,over-dif/2]
    const di = getDinfo(zid,devs)
    const topic = `${di.dev}/cmd`
    const payload = `{"id":${di.sr},"sra":[${newdarr}]}`
    console.log('topic, payload: ', topic, payload)
    //publish(client, topic, payload)
  }

  const handleOver=(e)=>{
    setOver(e.target.value*1)
  }

  const handleWeekly=()=>{
    client.disconnect()
    const pro = state[zid].pro
    const temp_out = state.temp_out.darr[0]
    nav2('WeeklyScheduler', {...prups, zinfo, sched:pro, from:'Zone', temp_out, devs}, zid)
  }

  const handleHoldVal = (e)=>{
    setHoldVal(e.target.value)   
  }

  const setHold = () =>{
    console.log('state[zid].darr: ', state[zid].darr)
    const da =state[zid].darr
    const dif = da[2]*1-da[3]*1
    const ssched = JSON.stringify([[0,0,holdval*1+dif/2,holdval*1-dif/2]])
    const dinf = getDinfo(params.query, devs)
    const topic = `${dinf.dev}/prg`
    const payload = `{"id":${dinf.sr},"pro":${ssched}}`
    console.log('topic, payload: ', topic, payload)
    console.log('holdradio: ', holdradio)
    const srarr= findHeatZonesIn(devs)
    console.log('srarr: ', srarr)
    let dbs =[]
    if(holdradio==99){
      dbs = srarr.map((s)=>{
        s.dow=128
        s.sched=ssched
        s.until=holddate
        return s
      })
    }else{
      dbs = [{devid:dinf.dev, senrel:dinf.sr, dow:128, sched:ssched, until:holddate}]
    }
    console.log('dbs: ', dbs)
    publish(client, topic, payload)
    replaceHold(ls,cfg, dbs)

  }

  const releaseHold =()=>{
    const dinf = getDinfo(params.query, devs)
    fetchSched(ls, cfg, dinf.dev, dinf.sr, locdata.dow).then((data)=>{
      const newsched = data.results[0].sched
      console.log('newsched: ', newsched)
      const dinf = getDinfo(params.query, devs)
      const topic = `${dinf.dev}/prg`
      const payload = `{"id":${dinf.sr},"pro":${newsched}}`
      console.log('topic, payload: ', topic, payload)
      publish(client, topic, payload)
    })
    let dels = []
    if(holdradio==99){
      dels= findHeatZonesIn(devs)
    }else{
      dels = [{devid:dinf.dev, senrel:dinf.sr}]
    }
    deleteHolds(ls, cfg, dels)
  }

  const upDate = (e)=>{
    setHoldDate(e.target.value)
  }

  const changeRadio=(i)=>()=>{
    setHoldRadio(i)
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
      const ima = `./img/${zinfo[0].img}`
      return (
        <div style={styles.content}>
          <header style={styles.header}>
            <img src={ima} alt={ima} width="70"/>
            <span>{zinfo[0].name}</span>
            {status} <a href="./">goback</a>
            <div>outside temperature: {state.temp_out.darr[0]}</div>
            <div>temp:{temp}</div>
            <div>onoff: {onoff}</div>
            
          </header>
          <div>
            setpoint: {set}  <span style={styles.schedstr}>{mess}</span> 
          </div>
            <CondensedSched sch={pro}/><br/>
          <fieldset style={styles.boost}>
            <legend>BOOST temp temporarily</legend>

            <button onClick={cmdOverride}>override thermostat setting</button><br/>
            <input type="range" min="50" max="75" value={over} onChange={handleOver}/><span>{over}</span><br/>
          </fieldset>
                    <div style={styles.today} >
          <fieldset>
            <legend>Change todays schedule</legend>
            <button onClick={schedChange(pro)}>change todays schedule</button><br/>
          </fieldset>
          </div>
          <div style={styles.hold}>
          <fieldset>
            <legend>HOLD temperature until</legend>
            <input onChange={upDate} value={holddate}type="date"/><br/>
            <input type="range" min="50" max="75" value={holdval} onChange={handleHoldVal}/><span>{holdval}</span><br/>
            <button onClick={setHold}>set hold</button>
            <button onClick={releaseHold}>release</button><br/>
            <fieldset>
              <legend>Apply Hold to</legend>
              <input name='rhold' type="radio" value="1" 
                onChange={changeRadio(1)}
                checked={holdradio==1}
              />{zinfo[0].name}<br/>
              <input name='rhold' type="radio" value="99"
                onChange={changeRadio(99)}
                checked={holdradio==99}              
              />ALL zones<br/>
            </fieldset>
          </fieldset>
          </div >
          <div style={styles.weekly}>
          <fieldset>
            <legend>Modify weekly schedule</legend>
            <button onClick={handleWeekly}>change weekly schedule</button><br/>
          </fieldset>
          </div>
          <div style={styles.hold}>
          <fieldset>
            <legend>Show Data</legend>
            <button onClick={handleWeekly}>show data</button><br/>
          </fieldset>
          </div>
          
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
    fontSize: 10
  },
  header:{
    // position: '-webkit-sticky',
    position: 'sticky',
    top: 0,
    backgroundImage: 'linear-gradient( #6facd5,#497bae )',
    color:'white'
  },
  content:{
    backgroundColor: '#FFD34E',
    color:'blue'
  },
  boost:{
    backgroundColor: '#FFD34E',
    color:'red'
  },
  hold:{
    backgroundColor: '#DB9E36',
    color: 'blue'
  },
  weekly: {
    backgroundColor: '#BD4932',
    color:'#FFD34E'
  },
  today:{
    backgroundColor: '#FFD34E',
    color:'blue'
  }
}

const findHeatZonesIn = (devs)=>{
  const devarr = Object.keys(devs)
  let res=[]
  devarr.map((d)=>{
    const m = devs[d]
      .filter((s)=>s.label!='temp_out'&&s.label!='timer')
      .map((b)=>{
        return {devid:d, senrel:b.sr}
      })
    res = res.concat(m)
    return m
  })
  return res
}