import React from 'react'
import {hma2time} from '../../npm/mqtt-hooks'

const CondensedSched = (props)=>{
  const {sch} = props
  const asched = sch.slice().map((s,i)=>{
    const ti = hma2time(s)
    // console.log('s: ', s)
    return (
      <span key={i} style={styles.schedstr}>
        <span> {ti} </span>
        <span > {(s[2]+s[3])/2}&deg; </span>
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