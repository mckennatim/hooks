import React from 'react'
import {startWhen, endWhen, newInterval}from '../../nod/src'

const tzd_tza = (-7- -4)
console.log('tzd_tza: ', tzd_tza)

const delay = '0:15'
const dur = '1:05'
console.log('delay: ', delay)
console.log('startWhen(tzd_tza, delay): ', startWhen(tzd_tza, delay))
const starttime = startWhen(tzd_tza, delay)
console.log('dur: ', dur)
console.log('endWhen(starttime, dur): ', endWhen(starttime, dur))
const endtime = endWhen(startWhen(tzd_tza, delay), dur)

const invl = newInterval(starttime,[1], endtime, [0])
console.log('invl: ', invl)


const SchedMod=(props)=>{
  console.log('props: ', props)
  const qry = window.location.hash.split('?')[1]
  console.log('qry: ', qry)


  return(
    <div>
      <h2>SchedMod for {qry}</h2>
    </div>
  )
}

export{SchedMod}