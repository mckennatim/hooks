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
//} from '@mckennatim/mqtt-hooks'
// import {setKeyVal}from '../actions/responsive'
const mytimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
// const mytimezone = 'America/Los_Angeles'
console.log('mytimezone: ', mytimezone)


const lsh = ls.getItem()


const Control = () => {
  const [client, publish] = useContext(Context);
  client.onMessageArrived= onMessageArrived

  const doOtherShit=(devs, client)=>{
    client.subscribe('moment/jdtime')
    publish(client, 'moment/dtime', mytimezone )
  }

  const topics  = ['devtime', 'jdtime', 'srstate', 'sched', 'flags', 'timr'] 
  const {devs, zones, binfo, error}= useDevSpecs(ls, cfg, client, (devs)=>{
    connect(client,lsh,(client)=>{
      if (client.isConnected()){
        setupSocket(client, devs, publish, topics, (devs, client)=>doOtherShit(devs, client))
      }
    })
  })
  const[pond, setPond] = useState({darr:[0], pro:[[]], timeleft:0, status:'off'})
  const[bridge, setBridge] = useState({darr:[0], pro:[[]], timeleft:0, status:'off'})
  const[center, setCenter] = useState({darr:[0], pro:[[]], timeleft:0, status:'off'})
  const[devtime, setDevtime] = useState({dow:0})
  const[tzd_tza, setTzd_tza] =useState(0)
  const[status, setStatus] = useState('focused')

  function onMessageArrived(message){
    const nsarr = processMessage(message, devs, zones, {pond, bridge, center, devtime})
    if(nsarr.length>0){
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
  
  const goSignin =()=>{
    const href = makeHref(window.location.hostname, 'signin', '')//, `?${locid}`)
    console.log('href: ', href)
    window.location.assign(href)
  }

  const setStatusTimed = (data)=>(tf)=>{
    console.log('data: ', JSON.stringify(data))
    console.log('tf: ', tf)
    const nb = {...bridge, status:'timed'}
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
              binf={binfo}
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
              setStatus={setStatusTimed(bridge)}
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

function setRelayStatus(bs){
  if(bs.timeleft>0){
    bs.status='timed'
  }else if (bs.darr[0]==1 && bs.timeleft==0){
    bs.status='on'
  } else bs.status='off'
  return bs
}



