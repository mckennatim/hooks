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
} from '@mckennatim/mqtt-hooks'
// } from '../../nod/mqtt-hooks'

// import {setKeyVal}from '../actions/responsive'
const mytimezone = Intl.DateTimeFormat().resolvedOptions().timeZone


const lsh = ls.getItem()


const Control = (props) => {
  const page =props.cambio.page
  const query = page.params.query
  const prups = page.prups
  const rsched = prups.sched
  const [client, publish] = useContext(Context);
  // let pond= {darr:[0], pro:[[]], timeleft:0, status:'off'}
  // let bridge= {darr:[0], pro:[[]], timeleft:0, status:'off'}
  // let center= {darr:[0], pro:[[]], timeleft:0, status:'off'}
  client.onMessageArrived= onMessageArrived

  const doOtherShit=(devs, client)=>{
    client.subscribe('moment/jdtime')
    publish(client, 'moment/dtime', mytimezone )
  }



  const topics  = ['devtime', 'jdtime', 'srstate', 'sched', 'flags', 'timr'] 
  const {devs, zones, binfo, error}= useDevSpecs(ls, cfg, client, (devs)=>{
    connect(client,lsh,(client)=>{
      console.log('client.isConnected(): ', client.isConnected())
      if (client.isConnected()){
        setupSocket(client, devs, publish, topics, (devs, client)=>doOtherShit(devs, client))
      }
    })
  })

  const[pond, setPond] = useState({darr:[0], pro:[[]], timeleft:0, status:'off'})
  const[bridge, setBridge] = useState({darr:[0], pro:[[]], timeleft:0, status:'off'})
  const[center, setCenter] = useState({darr:[0], pro:[[]], timeleft:0, status:'off'})
  const[devtime, setDevtime] = useState({dow:0})
  const[, setTzd_tza] =useState(0)
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
            // console.log('ps: ', ps)
            setPond(setRelayStatus(ps))
            // pond = setRelayStatus(ps)
            break
          case 'bridge':
            const bs = {...ns[key]}
            setBridge(setRelayStatus(bs))
            // bridge = {...ns[key]}
            // console.log('bridge: ', bridge)
            break
          case 'center':
            const cs = {...ns[key]}
            setCenter(setRelayStatus(cs))
            // center = setRelayStatus(cs)
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

  const updateFrom = ()=>{
    const q = location.hash.split('?')
    if (client.isConnected() && q[0]=='#/control' && (q[1]=='pond' || q[1]=='bridge'|| q[1]=='center')){
      console.log('q: ', q)
      const ssched = JSON.stringify(rsched)
      const dinf = getDinfo(query, devs)
      const topic = `${dinf.dev}/prg`
      const payload = `{"id":${dinf.sr},"pro":${ssched}}`
      location.replace('#/control')
      setTimeout(()=>{
        publish(client, topic, payload)
        console.log('do gpublish')
      },2000)
    }
  }

  updateFrom()

  const rrender=()=>{
    if (!error){
      if(zones.length>0 && devs){
        // if (client.isConnected() &&(query=='pond' || query=='bridge'|| query=='center')){
        //   console.log('query: ', query)
        //   const dinf = getDinfo(query, devs)
        //   const topic = `${dinf.dev}/prg`
        //   const payload = `{"id":${dinf.sr},"pro":${rsched}}`
        //   publish(client, topic, payload)
        //   const npage ={...page}
        //   npage.params.query =""
        //   setKeyVal({page:npage})
        // }
        return(
          
          <div>
            <button onClick={updateFrom}>update from</button>
            <h1 style={{fontWeight: 300}}>Cascada </h1>
            <Pond data={pond} 
              zinf={getZinfo('pond',zones)} 
              dinf={getDinfo('pond', devs)}
              binf={binfo}
              client={client} 
              publish={publish}
            />
            <Spot data={bridge} 
              zinf={getZinfo('bridge',zones)} 
              dinf={getDinfo('bridge', devs)}
              binf={binfo}
              client={client} 
              publish={publish}
              setStatus={setStatusTimed(bridge)}
            />
            <Spot data={center} 
              zinf={getZinfo('center',zones)} 
              dinf={getDinfo('center', devs)}
              binf={binfo}
              client={client} 
              publish={publish}
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



