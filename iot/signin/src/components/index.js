import React from 'react'// eslint-disable-line no-unused-vars
import {router} from '../app'
import {App} from './App'
import {Blank} from './Blank.jsx'
import {Apps} from './Apps.jsx'
import {GoAuth} from './GoAuth.jsx'
import {FromAuth} from './FromAuth.jsx'
import {Splash} from './Splash.jsx'
import {Locs} from './Locs.jsx'
import {Nav} from './Nav.jsx'

const pStyle={}

const Home = () =>{
  function goprod(){
    console.log("in home goprod")
    router.navigate('/about');
  }
    const style = {
    ...pStyle, outer: {...pStyle.outer, background: '#CC66CC'}
  }
  return(
    <div style={style.outer}>
      <h3> Home </h3>
      <button id="but" onClick={goprod}>goto about</button>
    </div>
  )
}
//const multi=[] //multi delared but empty defaults to single panel

const multi =[
  {pri:'AboutDemo', mul:[
    ['AboutDemo', 'Splash'],
    ['AboutDemo', 'Splash', 'Help'],
    ['AboutDemo','Splash', 'Help', 'Home']
  ]},
  {pri:'About', mul:[
    ['About', 'Splash'],
    ['About', 'Splash', 'AboutDemo'],
    ['About','Splash', 'AboutDemo', 'Home']
  ]},
  {pri:'Help', mul:[
    ['Help', 'Splash'],
    ['Help', 'Splash', 'About'],
    ['Help','Splash', 'About', 'AboutDemo']
  ]}
  ]

//['watch', 'phone', 'phoneL', 'tablet', 'tabletL', 'laptop']
const panes= [1,1,2,2,3,3,4]

export { Splash, GoAuth, FromAuth, Locs, Apps, Blank, Home, App, Nav, multi, panes}

