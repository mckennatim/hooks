import React from 'react'// eslint-disable-line no-unused-vars
import {mStyle} from '../styles'
import {cfg} from '../utilities/getCfg'

const url = cfg.url.authqry
// const url = cfg.url.soauth+"/spa/"+cfg.appid+"?apiURL="+encodeURIComponent(cfg.url.api)+"&cbPath="+encodeURIComponent(cfg.cbPath)


const Nav = () =>(
  <div id="menu"> 
    <ul>
      <li style={mStyle.li}><a style={mStyle.a} href={url}>register</a></li>
      <li style={mStyle.li}><a style={mStyle.a} href="#registered" data-navigo>logout</a></li>
      <li style={mStyle.li}><a style={mStyle.a} href="#devcrud" data-navigo>devCRUD</a></li>
      <li style={mStyle.li}><a style={mStyle.a} href="#rjv" data-navigo>rjv</a></li>
    </ul>
  </div>
  )
export {Nav}
