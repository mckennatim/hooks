import React from 'react'
// import {ZoneTimer} from '../../nod/zonetimer/index'
import{ZoneTimer}from '@mckennatim/react-zonetimer'
// import {nav2 } from '../app'

const Draw3=(props)=>{
  const locdata = props.cambio.page.prups.locdata
  // const query = props.cambio.page.params.query
  const {sunrise,sunset} = locdata
  const bsched = [[0,0,0],[9,10,1],[9,40,0],[17,0,1],[17,50,0]]
  // const ret2page = props.cambio.page.prups.from

  const setNewSched=(sched)=>()=>{
    
    console.log('sched: ', JSON.stringify(sched))
  }

  return(
    <div>
      <ZoneTimer 
        range={[0,1]}
        templines={[
          {v:1,c:'red'}, 
          {v:0, c:'orange'}]}
        sunrise={sunrise} 
        sunset={sunset}
        asched={bsched}
        retNewSched={setNewSched}   
      />
    </div>
  )
}

export{Draw3}