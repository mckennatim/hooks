import React, {useState} from 'react'


const Spot=(props)=>{
  const{data, zinf}= props
  const [howlong, setHowlong]= useState(data.timeleft/60)
  const handleChange=(e)=>{
    setHowlong(e.target.value)
  }

  return(
    <div>
      <h2>{zinf.name}</h2>
      <span>{data.darr[0]}</span><br/>
      <span>{data.timeleft/60}</span><br/>
      <span>{JSON.stringify(data.pro)}</span><br/>
      {howlong}
      <input  type="range" min="1" max="120" step="1" value={howlong} onChange={handleChange}></input><br/>
    </div>
  )
}

export{Spot}