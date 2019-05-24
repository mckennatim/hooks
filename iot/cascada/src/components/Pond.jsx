import React, {useState} from 'react'


const Pond=(props)=>{
  const{data, zinf}= props
  const href = `#sched?${zinf.name}`
  console.log('data.timeleft/60: ', data.timeleft/60)
  const [howlong, setHowlong]= useState(data.timeleft/60)
  const [onoff, setOnoff]= useState(0)
  const handleChange=(e)=>{
    setHowlong(e.target.value)
  }

  const toggleOnoff = ()=>{
    setOnoff(!onoff*1)
    console.log('onoff: ', onoff)
  }

  return(
    <div>
      <h2>{zinf.name}</h2>
      <span>{data.darr[0]}</span><br/>
      <span>{data.timeleft/60}</span><br/>
      <span>{JSON.stringify(data.pro)}</span><br/>
      <button onClick={toggleOnoff}>toggle</button> {onoff}<br/>
      {howlong}
      <input  type="range" min="1" max="120" step="1" value={howlong} onChange={handleChange}></input><br/>
      <a href={href}>Change schedule for {zinf.name}</a>
    </div>
  )
}

export{Pond}