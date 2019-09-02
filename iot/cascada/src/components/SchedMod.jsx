import React, {useState} from 'react'
import {startWhen, endWhen, newInterval, add2sched, m2hm, getNow}from '@mckennatim/mqtt-hooks'
import{ ZoneTimer}from '../../../../../npm/react-zonetimer/lib/ZoneTimer'
// import {ZoneTimer} from '../../nod/zonetimer/ZoneTimer.jsx'

const SchedMod=(props)=>{
  console.log('props: ', props)
  const sunrise = props.cambio.page.prups.sunrise
  const sunset = props.cambio.page.prups.sunset
  console.log('sunrise, sunset: ', sunrise, sunset)
  const tzd_tza = -5

  const btz = Intl.DateTimeFormat().resolvedOptions().timeZone
  const btime = (new Date()).toString()
  
  const createReport=(nintvl, newsched)=>{
    const preport = JSON.parse(report)
    console.log('preport: ', preport)
    console.log('nintvl: ', nintvl)
    if (preport.length>20){
      preport.shift()
    }
    preport.push({sched:newsched, nintvl:nintvl})
    console.log('preport: ', preport)
    return JSON.stringify(preport)
  }

  const qry = window.location.hash.split('?')[1]

  const [howlong, setHowlong]=useState(2)
  const [delay, setDelay]=useState('0:0')

  const [sched, setSched] = useState(JSON.stringify([[0,0,0],[9,10,1],[9,40,0],[17,0,1],[17,50,0]]))
  const [report, setReport]= useState(JSON.stringify([{sched:sched, nintvl:[[]]}]))
  const [base, setBase] = useState(sched)

  const modBaseSched=(e)=>{
    setBase(e.target.value)
  }


  const toggleOnoff=()=>{
    console.log('tzd_tza: ', tzd_tza)
    console.log('delay: ', delay)
    console.log('howlong: ', howlong)
    const starttime = startWhen(tzd_tza, delay)
    console.log('starttime: ', starttime)
    const endtime = endWhen(starttime, m2hm(howlong))
    console.log('endtime: ', endtime)
    const nintvl = newInterval(starttime,[1], endtime, [0])
    console.log('nintvl: ', JSON.stringify(nintvl))
    const newsched = add2sched(JSON.parse(sched), nintvl, tzd_tza)
    const snsched = JSON.stringify(newsched)
    console.log('snsched: ', snsched)
    setSched(snsched)
    console.log('sched: ', sched )
    const nrepo = createReport(nintvl, newsched)
    console.log('nrepo: ', nrepo)
    setReport(nrepo)
  }

  const handleChange=(e)=>{
    setHowlong(e.target.value)
  }

  const handleDelay =(e)=>{
    setDelay(e.target.value)
  }

  const resetSched =()=>{
    setSched(base)
  }
  
  const renderReport=()=>{
    const preport= JSON.parse(report)
    const lis = preport.map((entry, idx)=>{
      return(
        <li key={idx}>
          <div>
            <span>{JSON.stringify(entry.nintvl)}</span><br/>
            <span>{JSON.stringify(entry.sched)}</span>
          </div>
        </li>
      )
    })
    return(
      <ul>{lis}</ul>
    )
  }


  return(
    <div>
      <ZoneTimer 
        range={[55,75]}
        templines={[
          {v:72,c:'red'}, 
          {v:68, c:'orange'},
          {v:64, c:'green'},  
          {v:60, c:'purple'}, 
          {v:56, c:'blue'}]}
        sunrise={sunrise} 
        sunset={sunset} 
      />
      <ZoneTimer 
        range={[0,1]}
        templines={[
          {v:1,c:'red'}, 
          {v:0, c:'orange'}]}
        sunrise={sunrise} 
        sunset={sunset}   
      />
      {/* {renderSVG()}
      {getRectPos()} */}
      <h2>SchedMod for {qry}</h2>
      {btime}{btz}<br/>
      tzd_tza={tzd_tza}<br/>
      <button onClick={toggleOnoff}>toggle</button><br/>
      {howlong}
      <input className="slider" type="range" min="2" max="120" step="1" value={howlong} onChange={handleChange}></input><br/>
      delay as hr:min {delay} <input type="text" size="2" value={delay} onChange={handleDelay}/>
        <br/>
        time: <input type="time"/><br/>
      <input type="text" value={base} onChange={modBaseSched} size="40"/>  
      <button onClick={resetSched}>reset sched</button>
      <br/>
      {JSON.stringify(getNow(tzd_tza))}<br/>
      {renderReport()}
    </div>
  )
}

export{SchedMod}

// function calcAng(dy,dx){
//   var ang
//   if(dx==0){
//     dy>0 ? ang=pi/2 :ang=3*pi/2
//   }else{ang=Math.atan(dy/dx)}
//   if(dx>0&&dy<0){
//     ang=ang+2*pi
//   }else if (dx<0){
//     ang=ang+pi
//   }
//   return ang
// }