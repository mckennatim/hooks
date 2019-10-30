import React from 'react'
import{nav2} from '../app'
import {
  getZinfo,
  whereInSched
// } from '@mckennatim/mqtt-hooks'
} from '../../npm/mqtt-hooks'

const Zones=(props)=>{
  const {zones, devs, state, locdata}=props
  const tzadj=locdata ? locdata.tzadj : "0"
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
    const zstate = {}
    zstate[k]=state[k]
    const mess = findKnext(k)
    nav2('Zone', {state: zstate, zinfo, devs, locdata, from:'Zones', mess}, k)
  }

  const findKnext=(k)=>{
    const sched = state[k].pro
    if(sched[0].length>0 && tzadj.length>0){
      const idx = whereInSched(sched, tzadj)
      const s = sched[idx]
      const mess = idx==-1 ? "until midnight" : `until: ${s[0]}:${s[1]} then ${(s[2]+s[3])/2}`
      return(
        mess
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
        <li key={i} onClick={gotoZone(k)}>{sk.darr[1]} {zone[0].name} {sk.darr[0]} set {set} <span>{findKnext(k)}</span></li>
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