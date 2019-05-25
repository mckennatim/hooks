import React, {useState} from 'react'
import {startWhen, endWhen, newInterval, add2sched, m2hm}from '@mckennatim/mqtt-hooks'


const Pond=(props)=>{
  const{data, zinf, dinf, tzd_tza, client, publish}= props
  // console.log('JSON.stringify(data): ', JSON.stringify(data))
  const href = `#sched?${zinf.name}`
  const [howlong, setHowlong]= useState(1)
  const [delay, setDelay]= useState('0:0')
  const [onoff, setOnoff]= useState(0)
  const handleChange=(e)=>{
    setHowlong(e.target.value)
  }

  const toggleOnoff = ()=>{
    if(onoff==0){/*send in a new schedule which will turn it on by monitorRelayState */
      setOnoff(-1)/*until it does mark as waiting */
      const starttime = startWhen(tzd_tza, delay)
      const endtime = endWhen(starttime, m2hm(howlong))
      const nintvl = newInterval(starttime,[1], endtime, [0])
      const sched =data.pro
      const nsched =add2sched(sched, nintvl, tzd_tza)
      const prog =JSON.stringify(nsched)
      const topic = `${dinf.dev}/prg`
      const payload = `{"id":${dinf.sr},"pro":${prog}}`
      publish(client, topic, payload)
    } else if(onoff==1){ /*if it is on toggle it off by cmd */
      const topic = `${dinf.dev}/cmd` 
      const payload = `{"id":${dinf.sr},"sra":[0]}`
      console.log('topic + payload: ', topic + payload)
      publish(client, topic, payload)
    }
  }

  const monitorRelayState=()=>{
    if (data.darr[0]==0 && onoff==1){
      setOnoff(0)
    } else if (data.darr[0]==1 && onoff<=0) {
      setOnoff(1)
    } 
  }

  monitorRelayState()

  const handleDelay=(e)=>{
    setDelay(e.target.value)
  }

  return(
    <div>
      <h2>{zinf.name}</h2>
      <span>{data.darr[0]}</span><br/>
      <span>{data.timeleft/60}</span><br/>
      <span>{JSON.stringify(data.pro)}</span><br/>
      <button onClick={toggleOnoff}>toggle</button> {onoff}<br/>
      delay as hr:min <input type="text" size="2" value={delay} onChange={handleDelay}/>
      <br/>
      {howlong}
      <input  type="range" min="1" max="120" step="1" value={howlong} onChange={handleChange}></input><br/>
      <a href={href}>Modify the db schedule for {zinf.name}</a>
    </div>
  )
}

export{Pond}