import React from 'react' // eslint-disable-line no-unused-vars
import {cfg} from '../utilities/getCfg'
// import { setKeyVal } from '../actions/personacts';
// import {blankperson} from '../store'

console.log('cfg.url.authqry: ', cfg.url.authqry)

const Nav = (props) =>{
  console.log('props: ', props)

  // const setU=()=>{
  //   setKeyVal({update:false, curperson:blankperson})
  // }
  return (
    <div style={style.he}>
    <span>timecards - signup  </span>
      <div style={style} id="menu"> 
        <ul>
          <li style={style.li}><a style={style.a} href="#splash" data-navigo>home</a></li>
          <li style={style.li}><a style={style.a} href={cfg.url.authqry}>register</a></li>
          <li style={style.li}><a style={style.a} href="#about" data-navigo>about</a></li>
          <li style={style.li}><a style={style.a} href="#urapps" data-navigo>apps</a></li>
          <li style={style.li}><a style={style.a} href="#help" data-navigo>help</a></li>
          {props.newco.ispartner && 
          <li style={style.li}><a style={style.a} href="#company" data-navigo>company</a></li>
          }
          <div></div>
        </ul>
      </div>
     </div> 
  )
}
export {Nav}

let style={
  background: 'white',
  li:{
    display: 'inline',
    padding: '2px',
    paddingRight: '4px',
    background: 'whitesmoke'
  },
  a:{
    textDecoration: 'none',
    color: 'green'    
  }
}