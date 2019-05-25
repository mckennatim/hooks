import React from 'react'
import {startWhen, endWhen, newInterval, add2sched}from '@mckennatim/mqtt-hooks'

const SchedMod=(props)=>{
  const tzd_tza = (-7- -4)

  const btz = Intl.DateTimeFormat().resolvedOptions().timeZone

  const btime = (new Date()).toString()

  const delay = '2:0'
  const dur = '1:25'
  console.log('delay: ', delay)
  console.log('startWhen(tzd_tza, delay): ', startWhen(tzd_tza, delay))
  const starttime = startWhen(tzd_tza, delay)
  console.log('dur: ', dur)
  console.log('endWhen(starttime, dur): ', endWhen(starttime, dur))
  const endtime = endWhen(startWhen(tzd_tza, delay), dur)

  const nintvl = newInterval(starttime,[1], endtime, [0])
  console.log('invl: ', JSON.stringify(nintvl))

  const asched = [[0,0,0], [14,10,1], [14,35,0], [17,20,1], [17,40,0]]
  // const asched = [[0,0,1]]
  console.log('asched: ', JSON.stringify(asched))
  console.log('add2sched(asched, nintvl, tzd_tza): ', JSON.stringify(add2sched(asched, nintvl, tzd_tza)))
  console.log('props: ', props)
  const qry = window.location.hash.split('?')[1]
  console.log('qry: ', qry)


  return(
    <div>
      <h2>SchedMod for {qry}</h2>
      {btime}{btz}<br/>
      tzd_tza={tzd_tza}
    </div>
  )
}

export{SchedMod}