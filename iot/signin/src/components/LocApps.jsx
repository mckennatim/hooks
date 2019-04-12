import React, {useEffect, useState} from 'react'
import {ls, makeHref} from '../utilities/getCfg'
import {storageLocal} from '../utilities/storageLocal'
import {fetchLocApps, fetchToken} from '../services/fetches'


const LocApps = (props)=>{
  const [apps, setApps]= useState([])
  console.log('apps: ', apps)
  const locid = props.cambio.page.params.loc

  const getLocApps=(loc)=>{
    console.log('locid: ', loc)
    fetchLocApps(ls.getKey('token'), locid).then((apps)=>{
      const mapps = apps.results.map((m)=>({app: m.appid, role:m.role}))
      setApps(mapps)
    })
  }

  console.log('locid: ', locid)
  useEffect(()=>{
    console.log('in useEffect')
    getLocApps(locid)
  },[locid])

  const gotoApp =(appid, role)=>()=>{
    fetchToken(ls.getKey('token'), locid, appid, role).then((tok)=>{
      console.log('tok: ', tok)
      const apptok = storageLocal(tok.app)
      apptok.setItem(tok.tdata)
      const whereto = role==="installer"||role==="builder" ? role : tok.app
      const href = makeHref(window.location.hostname, whereto, `#AppLoc?${tok.app}`)
      console.log('href: ', href)
      window.location.assign(href)
    })
  }

  const renderWhat=()=>{
    const mstyle = respStyle(style.li, props.responsive.size)
    console.log('apps: ', apps)
    if(!ls.getKey('token')){
      return(
        <div>
          <h4>This machine has forgotten about you. </h4>
        </div>
      )
    }
    return (
      <ul>
      {apps.map((d,i)=>(
        <li key={i} style={mstyle} onClick={gotoApp(d.app, d.role)}>{d.app} {d.role}</li>
      ))}
      </ul>
    )
  }

  return(
    <div>
      <h3>Apps at {locid}</h3>
      {renderWhat()}
      <span>
        Choos a different <a href="#locs">location</a>?
      </span>
    </div>
  )
}

export{LocApps}

let style ={
  li:{
    display: "block",
    width: "50%",
    padding: "10px",
    background:"white",
    border: "solid 1px"
  }
}

const respStyle =(s,sz)=>{
  const n = {}
  if (sz<500){
    n.width="80%"
  }
  return ({...s, ...n})

}