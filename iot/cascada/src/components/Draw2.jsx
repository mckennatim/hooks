import React from 'react'
// import {ZoneTimer} from '../../nod/zonetimer/index'
import{ZoneTimer}from '@mckennatim/react-zonetimer'
// import {nav2 } from '../app'

const Draw2=(props)=>{
  const locdata = props.cambio.page.prups.locdata
  // const query = props.cambio.page.params.query
  const {sunrise,sunset} = locdata
  const asched = [[0,0,59,53],[7,45,79,71],[10,50,56,52],[17,45,66,64],[20,50,56,52],[22,50,67,61]]
  // const ret2page = props.cambio.page.prups.from

  const setNewSched=(sched)=>()=>{
    
    console.log('sched: ', JSON.stringify(sched))
  }

  return(
    <div>
      <ZoneTimer 
        range={[53,80]}
        dif={2}
        difrange={12}
        templines={[
        {v:72,c:'red'}, 
        {v:68, c:'orange'},
        {v:64, c:'green'},  
        {v:60, c:'purple'}, 
        {v:56, c:'blue'}]}
        sunrise={sunrise} 
        sunset={sunset}
        asched={asched}
        retNewSched={setNewSched}   
      />
    </div>
  )
}

export{Draw2}