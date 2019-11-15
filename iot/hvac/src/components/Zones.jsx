import React from 'react'
import{nav2} from '../app'
import {
  getZinfo,
  whereInSched,
  hma2time
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
    nav2('Zone', {state: zstate, zinfo, zones, devs, locdata, from:'Zones', mess}, k)
  }

  const findKnext=(k)=>{
    const sched = state[k].pro
    if(sched[0].length>0 && tzadj.length>0){
      const idx = whereInSched(sched, tzadj)
      const s = sched[idx]
      const ti =s ? hma2time(s): 'dog'//
      const mess = idx==-1 ? "until midnight" : `until: ${ti} then ${(s[2]+s[3])/2}`
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
        const ima = `./img/${zone[0].img}`
        return(
        <li style={styles.li} key={i} onClick={gotoZone(k)}>
          <img src={ima} alt={ima} width="70"/>
          {sk.darr[1]} 
          {zone[0].name}
          {sk.darr[0]} 
          set {set} 
          <span style={{fontSize:10}}>{findKnext(k)}</span>
        </li>
        )
      })
      return(
        <div>
          <fieldset style={styles.fieldset}>
            <legend>Zones</legend>
            <ul style={styles.ul}>
              {tli}
            </ul>     
          </fieldset>
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

const styles={
  schedstr:{
    fontSize: 10
  },

  ul: {
    listStyleType:'none',
    listStylePosition: 'inside',
    paddingLeft: 0,
    margin:4
  },
  li:{
    borderStyle:'ridge'
  },
  fieldset:{
    paddingLeft: 4,
    paddingRight: 4
  }
}