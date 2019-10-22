import React from 'react'
import{nav2} from '../app'
import {
  getZinfo,
  whereInSched
// } from '@mckennatim/mqtt-hooks'
} from '../../npm/mqtt-hooks'

const Zones=(props)=>{
  const {zones, devs, state, tzadj}=props
  const keys = Object.keys(state)
  const tkeys = keys.filter((k)=>k!='temp_out'&&k!='timer')
  // const temp_out = state.temp_out
  // const timer = state.timer
  // console.log('temp_out: ', temp_out)

  const gotoZone=(k)=>()=>{
    const zinfo = [getZinfo(k, zones)]
    // const dinfo =getDinfo(k, devs)
    const tinfo = getZinfo('temp_out', zones)
    zinfo.push(tinfo)
    console.log('zinfo: ', JSON.stringify(zinfo))
    const zstate = {}
    zstate[k]=state[k]
    nav2('Zone', {state: zstate, zinfo, devs, from:'Zones'}, k)
  }

  const findKnext=(k)=>{
    const sched = state[k].pro
    if(sched[0].length>0 && tzadj.length>0){
      whereInSched(sched, tzadj)
      return(
        <span>{JSON.stringify(sched)}</span>
      )
    }
  }

  const renderZones=()=>{
    if(zones.length>0){
      const tli = tkeys.map((k,i)=>{
        const sk = state[k]
        const set = (sk.darr[2]+sk.darr[3])/2
        const zone = zones.filter((z)=>z.id==k)
        return(
        <li key={i} onClick={gotoZone(k)}>{sk.darr[1]} {zone[0].name} {sk.darr[0]} set {set} {findKnext(k)}</li>
        )
      })
      return(
        <div>
          <h3>Zones</h3>
        <ul >
          {tli}
        </ul>     
        </div>
      )
    }else{
      return <h4>nozones</h4>
    }
  
  }
  return(
    <div>
      {renderZones()}
    </div>
  )
}

export{Zones}