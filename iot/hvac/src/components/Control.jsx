import React, {useContext, useState, useReducer} from 'react'// eslint-disable-line no-unused-vars
import {cfg, ls, makeHref} from '../utilities/getCfg'
// import {nav2} from '../app'
import {Zones} from './Zones.jsx'
import Icon from '@material-ui/core/Icon';
import outdoors from '../img/outdoors.png'


import {
  connect,
  Context, 
  useDevSpecs,  
  processMessage, 
  setupSocket,
  monitorFocus
} from '@mckennatim/mqtt-hooks'
// } from '../../npm/mqtt-hooks'

const lsh = ls.getItem()

const Control = () => {
  const [client, publish] = useContext(Context);
  client.onMessageArrived= onMessageArrived

  const doOtherShit=()=>{
    //console.log('other shit but not connected doesnt work yet')
    publish(client, "presence", "hello form do other shit")
  }


  const topics  = ['srstate', 'sched', 'flags', 'timr'] 

  const {devs, zones, binfo, error}= useDevSpecs(ls, cfg, client, (devs)=>{
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
    timer: {pro:[[]], timeleft:0, darr:[0,0,0,0]},
    tv: {pro:[[]], darr:[0,0,0,0]},
    mb: {pro:[[]], darr:[0,0,0,0]},
    martha: {pro:[[]], darr:[0,0,0,0]}
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


  const rrender=()=>{
    if (!error){
      const {locdata} = binfo
      const ico = status=='blur-disconnected' ? 'block' : 'signal_cellular_alt'
      return(
        <div>
        <header style={styles.header}>
          <div style={styles.container}>
            <div style={styles.ul}><div><Icon>house</Icon> {locdata && locdata.loc} </div></div>
            <div style={styles.ur}><Icon>{ico}</Icon> </div>
            
            <div style={styles.ll}>
              <div style={styles.txt}><span style={styles.otxt}>outside: </span> {state.temp_out.darr[0]} &deg;F</div>
            </div>
            <div style={styles.lr}>
              <div style={styles.bigd}>
                <a href="./#/bigdata"><span><Icon style={styles.tline}>timeline</Icon></span></a>
              </div>
            </div>
          </div>
        </header>
        <Zones zones={zones} state={state} devs={devs} locdata={locdata}/>
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

const styles ={
  header:{
    // position: '-webkit-sticky',
    position: 'sticky',
    top: 0,
    backgroundImage: 'linear-gradient(#3c3c3c,#111 )',
    color:'white'
  },
  out:{
    // background: 'white',
    backgroundImage: `url(${outdoors})`,
    filter:'hue-rotate(180deg)',
    backgroundSize: 'cover',
    width:"40px",
    height:"40px",
    textAlign:'center',

  },
  txt:{
    color:'white'
  },
  otxt:{
    fontSize: '10px'
  },
  tline:{
    color:'white',
    fontSize:'30px'
  },
  bigd:{
    background:'grey',
    width:'30px',
    height:'30px',
    border: '1px solid white',
    borderRadius: '4px'
  },
  container:{
    display: 'grid',
    gridTemplateColumns: 'auto 50px',
    gridTemplateRows: '25px 35px',
  },
  ul:{
    gridColumnStart: 1,
    gridRowStart: 1,
    margin: '6px'
  },
  ur:{
    gridColumnStart: 2,
    gridRowStart: 1,
  },
  ll:{
    gridColumnStart: 1,
    gridRowStart: 2,
    margin: '10px'
  },
  lr:{
    gridColumnStart: 2,
    gridRowStart: 2,
  },


}

