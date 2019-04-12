import React from 'react'// eslint-disable-line no-unused-vars
import ReactDOM from 'react-dom'// eslint-disable-line no-unused-vars
import {pStyle} from '../styles'
import {parseQuery} from '../utilities/wfuncs'
import {cfg, ls} from '../utilities/getCfg'
import {mStyle} from '../styles'


const style = {
  ...pStyle, outer: {...pStyle.outer, background: '#FF9966'}
}
pStyle.outer.background='#C4A265'

function Registered(props){
  const getLocs = () =>{
    location.replace('#devcrud')
  }
  var em ='NOT'
  var regstr = 'dog'
  const query= props.cambio.page.params.query;
  var mobj = parseQuery(query)
  if (mobj!=undefined) {
    if(Object.keys(mobj).find((x)=>x=='message')){
      console.log('hay message');
      regstr=decodeURI(mobj.message)
    }else{
      em = mobj.email
      ls.setItem(mobj);
      getLocs()
    }
  }else{
    regstr = 'so register already'
  }
  return(
    <div style={style.outer} >
      <h4>You Be Registered {em} </h4>
      <a style={mStyle.a} href={cfg.url.authqry}>{regstr}</a>
      <span></span>
    </div>
    )
}

export {Registered}
