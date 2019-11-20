import React from 'react'
import{nav2} from '../app'
import {
  getZinfo,
  whereInSched,
  hma2time
// } from '@mckennatim/mqtt-hooks'
} from '../../npm/mqtt-hooks'
import '../css/zones.css'

const Zones=(props)=>{
  const {zones, devs, state, locdata}=props
  const tzadj=locdata ? locdata.tzadj : "0"
  const keys = Object.keys(state)
  const tkeys = keys.filter((k)=>k!='temp_out'&&k!='timer')
  console.log('locdata: ', locdata)

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
  // const renderZones=()=>{
  //   if(zones.length>0){
  //     console.log(zones)
  //     console.log(devs)
  //     console.log('devs: ', devs)
  //     const tli = tkeys.map((k,i)=>{
  //       const sk = state[k]
  //       console.log('sk: ', sk)
  //       const set = (sk.darr[2]+sk.darr[3])/2
  //       const zone = zones.filter((z)=>z.id==k)
  //       const ima = `./img/${zone[0].img}`
  //       const rt = {
  //         outer:{
  //           float:"right",
  //           margin: '6px',
  //         },
  //         up:{
  //           fontSize:'12px',
  //           fontFamily: 'Helvetica,Arial,sans-serif',
  //           float:'right',
  //           width: '42px',
  //           padding: '2px',
  //           borderRadius: '3px',
  //           background: sk.darr[1] ? 'red' : 'rgba(38, 162, 43, 0.75)'
  //         },
  //         dn:{
  //           float: 'right',
  //           fontSize: '10px'
  //         },
  //         temp:{
  //           // float:'left'
  //         }

  //       }
  //       return(
  //       <li style={styles.li.li} key={i} onClick={gotoZone(k)}>
  //         <div style={styles.li.div}>
  //           <img src={ima} alt={ima} width="70" height="70"/>
              
  //           <div style={rt.outer}>
  //             <div style={rt.up}>
  //               <span>{set} &deg;F</span><br/>
  //             </div><br/><br/>
  //             <div style={rt.dn}>
  //               <span>{findKnext(k)}</span>
  //             </div>
  //           </div>
  //           {sk.darr[0]}
  //           {zone[0].name}
  //         </div>
  //       </li>
  //       )
  //     })
  //     return(
  //       <div>
  //         <fieldset style={styles.fieldset}>
  //           <legend>Zones</legend>
  //           <ul style={styles.ul}>
  //             {tli}
  //           </ul>     
  //         </fieldset>
  //       </div>
  //     )
  //   }else{
  //     return <h4>nozones</h4>
  //   }
  // }

  const renderZones=()=>{
    if(zones.length>0){
      console.log(zones)
      console.log(devs)
      console.log('devs: ', devs)
      const tli = tkeys.map((k,i)=>{
        const sk = state[k]
        const set = (sk.darr[2]+sk.darr[3])/2
        const zone = zones.filter((z)=>z.id==k)
        const ima = `./img/${zone[0].img}`
        const rt = {
          outer:{
            float:"right",
            margin: '6px',
          },
          up:{
            fontSize:'12px',
            fontFamily: 'Helvetica,Arial,sans-serif',
            float:'right',
            width: '42px',
            padding: '2px',
            borderRadius: '3px',
            background: sk.darr[1] ? 'red' : 'rgba(38, 162, 43, 0.75)'
          },
          dn:{
            fontFamily: 'Helvetica,Arial,sans-serif',
            fontStretch: 'ultra-condensed',
            float:'right',
            fontSize: '8px'
          },
          temp:{
            // float:'left'
          }
        }
        return(
        <li style={styles.li.li} key={i} onClick={gotoZone(k)}>
          <div className='container'>
            <div className='item-img'>
            <img src={ima} alt={ima} width="70" height="70"/>
            </div> 
            <div className='item-temp'>
              {sk.darr[0]} &deg;F
            </div>  
            <div className='item-name'>
              <div>
              {zone[0].name}
              </div>
            </div>
            <div className='item-setpt'>
              <div style={rt.up}>
                <span>{set} &deg;F</span><br/>
              </div><br/><br/>
            </div>
            <div className='item-til'>
              <div style={rt.dn}>
                <span style={rt.dn}>{findKnext(k)}</span>
              </div>
            </div>
          </div>
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
      {/* {renderZones2()} */}
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
    div:{
      display:"block"
    },
    li: {
      border: '1px solid grey'
    }
  },
  fieldset:{
    paddingLeft: 4,
    paddingRight: 4
  }
} 