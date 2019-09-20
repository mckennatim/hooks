import React from 'react'
import {ZoneTimer} from '../../nod/zonetimer/index'
// import{ZoneTimer}from '@mckennatim/react-zonetimer'
import {nav2 } from '../app'

const SchedMod=(props)=>{
  const locdata = props.cambio.page.prups.locdata
  const query = props.cambio.page.params.query
  const {sunrise,sunset} = locdata
  const asched = props.cambio.page.prups.sched
  const ret2page = props.cambio.page.prups.from

  const setNewSched=(sched)=>()=>{
    nav2(ret2page, {locdata, sched}, query)()
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
        asched={asched}
        retNewSched={setNewSched}   
      />
    </div>
  )
}

export{SchedMod}
