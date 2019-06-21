import React, {useState} from 'react'
import {startWhen, endWhen, newInterval, add2sched, m2hm, getNow}from '../../nod/src'

const SchedMod=()=>{
  
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



  // const asched = [[0,0,0], [10,10,1], [12,25,0], [17,20,1], [17,59,0]]
  //const asched = [[0,0,1]]
 // console.log('asched: ', JSON.stringify(asched))
  //console.log('add2sched(asched, nintvl, tzd_tza): ', JSON.stringify(add2sched(asched, nintvl, tzd_tza)))
  //console.log('props: ', props)
  const qry = window.location.hash.split('?')[1]
  //console.log('qry: ', qry)

  const [howlong, setHowlong]=useState(2)
  const [delay, setDelay]=useState('0:0')

  //const [tzd_tza] = useState(0)
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

  // const createReport=(nintvl, newsched)=>{
  //   const preport = JSON.parse(report)
  //   console.log('preport: ', preport)
  //   console.log('nintvl: ', nintvl)
  //   if (preport.length>20){
  //     preport.shift()
  //   }
  //   preport.push({sched:newsched, nintvl:nintvl})
  //   console.log('preport: ', preport)
  //   return JSON.stringify(preport)
  // }

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
      <h2>SchedMod for {qry}</h2>
      {btime}{btz}<br/>
      tzd_tza={tzd_tza}<br/>
      <button onClick={toggleOnoff}>toggle</button><br/>
      {howlong}
      <input className="slider" type="range" min="2" max="120" step="1" value={howlong} onChange={handleChange}></input><br/>
      delay as hr:min {delay} <input type="text" size="2" value={delay} onChange={handleDelay}/>
        <br/>
      <input type="text" value={base} onChange={modBaseSched} size="50"/>  
      <button onClick={resetSched}>reset sched</button>
      <br/>
      {JSON.stringify(getNow(tzd_tza))}<br/>

      {renderReport()}
    </div>
  )
}

export{SchedMod}