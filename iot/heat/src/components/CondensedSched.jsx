import React from 'react'
// import {hma2time} from '../../npm/mqtt-hooks'
import {hma2time} from '@mckennatim/mqtt-hooks'

const CondensedSched = (props)=>{
  const {sch,fontsz} = props
  const styles={
    schedstr:{
      fontSize: fontsz*1,
    }
  }

  const renderSched = ()=>{
    if(sch[0].length>0){
      const asched = sch.slice().map((s,i)=>{
        const ti = hma2time(s)
        return (
          <span key={i} style={styles.schedstr}>
            <span> {ti} </span>
            <span > {(s[2]+s[3])/2}&deg; </span>
          </span>
        )
      })
      return asched
    }
    else {
      console.log('no sched repo')
      return(
        <span>  no schedule reported, device offline</span>
      )
    }
  }

  return (<span>{renderSched()}</span>)
}

export{CondensedSched}

