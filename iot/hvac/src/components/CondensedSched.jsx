import React from 'react'
// import {hma2time} from '../../npm/mqtt-hooks'
import {hma2time} from '@mckennatim/mqtt-hooks'

const CondensedSched = (props)=>{
  const {sch,fontsz} = props
  console.log('sch: ', sch)
  const styles={
    schedstr:{
      fontSize: fontsz*1,
    }
  }
  const asched = sch.slice().map((s,i)=>{
    const ti = hma2time(s)
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

