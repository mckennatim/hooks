

import React, {useState} from 'react'// eslint-disable-line no-unused-vars
import {ZoneTimer}from '@mckennatim/react-zonetimer'
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'


const App = () =>{
  // const asched = [[0,0,58], [6,20,69], [8,30,64], [17,40,68], [23,0,58]] 
  const asched = [[0,0,55]]
  const sunrise = "06:18"
  const sunset = "19:24"  
  const setNewSched=(newsched)=>()=>{
    setSched(newsched)
    console.log('sched: ', sched)
  } 
  

  const [sched,setSched] = useState(asched)
  const [temp,setTemp] = useState(62)
  console.log('sched: ', JSON.stringify(sched))
  const handleTempChangeStart=()=>{
    console.log('temp change start')
  }
  const handleTempChange=(value)=>{
    setTemp(value)
  }
  const handleTempChangeComplete=()=>{
    console.log('temp change end')
  }

  return(
    <div>
      <h1>hello to the world</h1>
      <ZoneTimer 
        asched={sched}
        range={[55,75]}
        templines={[
          {v:72,c:'red'}, 
          {v:68, c:'orange'},
          {v:64, c:'green'},  
          {v:60, c:'purple'}, 
          {v:56, c:'blue'}]}
        sunrise={sunrise} 
        sunset={sunset} 
        retNewSched={setNewSched}
      />
      <div style={{width:280, margin:30}}>
        <div className='slider'>
          <Slider
            min={55}
            max={75}
            value={temp}
            onChangeStart={handleTempChangeStart}
            onChange={handleTempChange}
            onChangeComplete={handleTempChangeComplete}        
          />
        </div>
      </div>
    </div>
  )
}

export{App}