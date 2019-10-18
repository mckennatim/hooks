import React from 'react'
import{nav2} from '../app'
import {
  getZinfo,
  getDinfo
// } from '@mckennatim/mqtt-hooks'
} from '../../npm/mqtt-hooks'

const Zones=(props)=>{
  const {zones, devs, state}=props
  const keys = Object.keys(state)
  const tkeys = keys.filter((k)=>k!='temp_out'&&k!='timer')
  const temp_out = state.temp_out
  const timer = state.timer

  const gotoZone=(k)=>(j)=>{
    const zinfo = [getZinfo(k, zones)]
    const dinfo =getDinfo(k, devs)
    console.log('dinfo: ', dinfo)
    console.log('zinfo: ', zinfo)
    const zstate = {}
    zstate[k]=state[k]
    nav2('Zone', {state: zstate, zinfo, devs, from:'Zones'}, k)
  }

  const renderZones=()=>{
    if(zones.length>0){
      const tli = tkeys.map((k,i)=>{
        const sk = state[k]
        const set = (sk.darr[2]+sk.darr[3])/2
        const zone = zones.filter((z)=>z.id==k)
        return(
        <li key={i} onClick={gotoZone(k)}>{sk.darr[1]} {zone[0].name} {sk.darr[0]} set {set}</li>
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