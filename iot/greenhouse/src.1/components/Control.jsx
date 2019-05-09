import React, {useEffect, useState}from 'react'
import{publish,connect, client }from '../services/mq'
import {fetchDevZones} from '../services/fetches'

const Control = (props)=>{
  //client.disconnect()
  const {cambio}= props
  const{qconn, message}=cambio
  const [ ,setSpecs] = useState({});
  const [devs,setDevs] = useState(undefined)
  const [mitems, setMitems]= useState({outtemp:0, greentemp:0, greenhumid:0, tleft:0, ison:1})

  useEffect(() => {
    let didCancel=false
    if(!didCancel){
      fetchDevZones().then((data)=>{
        setSpecs(data)
        const devs = Object.keys(data.devs)
        console.log('devs: ', devs)
        setDevs(devs)
        connect(devs)
      })
    }
    return ()=>{
      didCancel=true
    }
  }, []);

  window.onfocus = ()=>{
    connect(devs)
  }

  window.onblur= ()=>{
    try{
      client.disconnect()
    }catch(err){
      console.log(err)
    }
  }

  if(qconn){
    publish('presence', 'Dogs and cats forever ');
  }
  
  const renderTimrVal=(m)=>{
    if(m && m.topic=='timr')
    return m.payload.tIMElEFT[2]/60
  }

  const tval = renderTimrVal(message)

  // const processMessage = (m)=>{
  //   if(m){
  //     switch (m.topic) {
  //       case 'timr':
  //         setMitems({tleft: m.payload.tIMElEFT[2]/60, ...mitems})
  //         break;
      
  //       default:
  //         break;
  //     }
  //   }
  // }
  // processMessage(message)

  return(
    <div>
      <h3>in Control</h3>
      {message && message.topic}
      {tval}
      <h4>outside temp: {mitems.outtemp}</h4>
      <h4>outside temp: {mitems.greentemp}</h4>
      <h4>outside temp: {mitems.greenhumid}</h4>
      <h5>lights on for {mitems.tleft} minutes)</h5>
      <span>{mitems.ison}</span>
      </div>
  )
}

export{Control}