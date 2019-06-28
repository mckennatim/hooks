import React, {useState} from 'react'
import {startWhen, endWhen, newInterval, add2sched, m2hm, m2ms}from '@mckennatim/mqtt-hooks'
import {BigButtonA} from './BigButtonA.jsx'
import waterfall_off from '../img/waterfall_off.gif'
import waterfall_on from '../img/waterfall_on.gif'
import loading from '../img/loading200.gif'
import {pondBut} from '../styles/appstyles'

const Pond=(props)=>{
  const{data, zinf, dinf, tzd_tza, client, publish}= props
  // console.log('JSON.stringify(data): ', JSON.stringify(data))
  const href = `#sched?${zinf.name}`
  const [howlong, setHowlong]= useState(1)
  const [delay, setDelay]= useState('0:0')
  const [onoff, setOnoff]= useState(0)
  const [image, setImage] = useState(waterfall_off)
  const [wtext, setWtext] = useState("howlong")

  const handleChange=(e)=>{
    setHowlong(e.target.value)
  }

  const toggleOnoff = ()=>{
    if(onoff==0){/*send in a new schedule which will turn it on by monitorRelayState */
      if (delay==0){
        setOnoff(-1)/*until it does mark as waiting */
        setImage(loading)
        setWtext('waiting')
      }
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
      setImage(waterfall_off)
      setWtext(`howlong`)
      
    } else if (data.darr[0]==1 && onoff<=0) {
      setOnoff(1)
      setImage(waterfall_on)
      setWtext(`timeleft`)
    } 
  }
  monitorRelayState()

  const setBtext=()=>{
    if(wtext=='howlong'){
      return `turn ON for: ${howlong} min`
    }else if(wtext=='timeleft'){
      return `${m2ms(data.timeleft)} to go click OFF`
    }else if(wtext=='waiting'){
      return 'waiting'
    } 
  }

  

  const handleDelay=(e)=>{
    setDelay(e.target.value)
  }

  return(
    <div>
      <h3 style={{color:'yellow'}}> {zinf.name}</h3>
      <BigButtonA
        onoff={onoff}
        toggleOnoff={toggleOnoff}
        image={image}
        btext={setBtext()}
        styles={pondBut}
      ></BigButtonA>
      <div>
        <input className="slider" type="range" min="1" max="120" step="1" value={howlong} onChange={handleChange}></input><br/>
        delay as hr:min <input type="text" size="2" value={delay} onChange={handleDelay}/>
        <br/>
        <span style={{fontSize: ".6em"}}>{JSON.stringify(data.pro)}</span><br/>
        <a href={href}>
          <span style={{fontSize: ".6em"}}>Modify the db schedule for {zinf.name}</span>
        </a><br></br>
        
      </div>

    </div>
  )
}

export{Pond}

// function m2ms(dur){
//   const sec = Math.floor(((dur/60) % 1)*60)
//   const min = Math.floor(dur/60)
//   return `${min}:${sec}`
// }
