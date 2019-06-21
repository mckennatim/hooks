import React, {useContext, useState, useEffect} from 'react'// eslint-disable-line no-unused-vars
import {cfg, ls, makeHref} from '../utilities/getCfg'
import {Pond, Spot} from './index'
import {
  connect,
  Context, 
  useDevSpecs,  
  processMessage, 
  getZinfo,
  getDinfo, 
  setupSocket,
  monitorFocus
} from '../../nod/src'
// const mytimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
const mytimezone = 'America/Los_Angeles'


const lsh = ls.getItem()


const Control = () => {
  const [client, publish] = useContext(Context);
  client.onMessageArrived= onMessageArrived

  const doOtherShit=(devs, client)=>{
    // const time = getDinfo('pond', devs).dev+'/time'
    client.subscribe('moment/jdtime')
    // publish(client, time, "What time is it at device?")
    publish(client, 'moment/dtime', mytimezone )
  }

  const topics  = ['devtime', 'jdtime', 'srstate', 'sched', 'flags', 'timr'] 
  const {devs, zones, error}= useDevSpecs(ls, cfg, client, (devs)=>
    connect(client,lsh,(client)=>{
      if (client.isConnected()){
        setupSocket(client, devs, publish, topics, (devs, client)=>doOtherShit(devs, client))
      }
    })
  )
  const[pond, setPond] = useState({darr:[0], pro:[[]], timeleft:0, status:'off'})
  const[bridge, setBridge] = useState({darr:[0], pro:[[]], timeleft:0, status:'off'})
  const[center, setCenter] = useState({darr:[0], pro:[[]], timeleft:0, status:'off'})
  const[devtime, setDevtime] = useState({dow:0})
  const[tzd_tza, setTzd_tza] =useState(0)
  const[status, setStatus] = useState('focused')
  // console.log('tzd_tza: ', tzd_tza)

  // const [prog, setProg] = useState('[[0,0,0]]')
  // const [priorprog, setPriorProg] = useState([[0,0,0]])

  function onMessageArrived(message){
    const nsarr = processMessage(message, devs, zones, {pond, bridge, center, devtime})
    if(nsarr.length>0){
      // console.log('nsarr: ', JSON.stringify(nsarr))
      nsarr.map((ns)=>{
        const key =Object.keys(ns)[0]
        // console.log('ns: ', JSON.stringify(ns))
        switch (key){
          case 'pond':
            const ps = {...ns[key]}
            setPond(setRelayStatus(ps))
            break
          case 'bridge':
            const bs = {...ns[key]}
            setBridge(setRelayStatus(bs))
            break
          case 'center':
            const cs = {...ns[key]}
            setCenter(setRelayStatus(cs))
            break
          case 'jdtime':
            const tza = new Date().toString().split('GMT')[1].split('00')[0]*1
            const tzd = {...ns[key]}.zone
            setTzd_tza(tzd-tza)
            setDevtime({...ns[key]}) 
            break
        }
      })
    }
  }


  monitorFocus(window, client, lsh, (status, client)=>{
    setStatus(status)
    if (client.isConnected()){
      setupSocket(client, devs, publish, topics, (devs,client)=>doOtherShit(devs,client))
    }
  })

  const doReset=()=>{
    const time = getDinfo('pond', devs).dev+'/time'
    publish(client, time, "What time is it at device?")
  }
  
  //const toggleOnOff=()=>{
    // const dinfo = getDinfo('light_gh', devs)
    // const newt = !light_gh.darr[0]*1
    // const topic = `${dinfo.dev}/cmd`
    // const payload = `{"id":${dinfo.sr},"sra":[${newt}]}`
    // console.log('topic + payload: ', topic + payload)

    //publish(client, topic, payload)
  // }

  // const changeProg=(e)=>{
  //   console.log('e.target.value: ', e.target.value)
  //   setProg(e.target.value)
  // }

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
    console.log('href: ', href)
    window.location.assign(href)
  }

  // const renderProg=()=>{
  //   return(
  //     <div>
  //       <input type="text" size="30" onChange={changeProg} value={prog}/>
  //       <button onClick={sendChange}>change prog for today</button>
  //     </div>
  //   )
  // }

  // const renderOnOff=()=>{
  //   // const btext = light_gh.darr[0] ? 'ON': 'OFF'
  //   // const bkg = light_gh.darr[0] ? {background:'green'} : {background:'red'}
  //   // return(<button style={bkg}onClick={toggleOnOff}>{btext}</button>)
  // }
  const resetJustoff = (data)=>(tf)=>{
    console.log('data: ', JSON.stringify(data))
    console.log('tf: ', tf)
    const nb = {...bridge, justoff:false}
    console.log('nb: ', JSON.stringify(nb)) 
    setBridge(nb)
    console.log('bridge: ', JSON.stringify(bridge))
  }

  const rrender=()=>{
    if (!error){
      if(zones.length>0 && devs){
        return(
          <div>
            <h1 style={{fontWeight: 300}}>Cascada </h1>
            <Pond data={pond} 
              zinf={getZinfo('pond',zones)} 
              dinf={getDinfo('pond', devs)}
              client={client} 
              publish={publish}
              tzd_tza={tzd_tza}
            />
            <Spot data={bridge} 
              zinf={getZinfo('bridge',zones)} 
              dinf={getDinfo('bridge', devs)}
              client={client} 
              publish={publish}
              tzd_tza={tzd_tza}
              resetJustoff={resetJustoff(bridge)}
            />
            <Spot data={center} 
              zinf={getZinfo('center',zones)} 
              dinf={getDinfo('center', devs)}
              client={client} 
              publish={publish}
              tzd_tza={tzd_tza}
            />
          </div>
        )
      }else{
        return <h4>nozones</h4>
      }

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
      {status}
      <button onClick={doReset}>reset</button>
      {rrender()}
    </div>
  );
};

export{Control}

function setRelayStatus (bs){
  if(bs.timeleft>0){
    bs.status='timed'
  }else if (bs.darr[0]==1 && bs.timeleft==0){
    bs.status='on'
  } else bs.status='off'
  return bs
}



