import React from 'react'
import {hma2time} from '../../npm/mqtt-hooks'

const CondensedSched = ({sch})=>{
  const asched = sch.map((s,i)=>{
    const ti = hma2time(s)
    return (
      <span key={i} style={styles.schedstr}>
        <span> {ti} </span>
        <span > {s[3]}&deg; </span>
      </span>
    )
  })
return (<span>{asched}</span>)
}

export{CondensedSched}

const styles={
  schedstr:{
    fontSize: 10
  }
}