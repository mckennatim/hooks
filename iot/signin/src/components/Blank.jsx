import React from 'react'// eslint-disable-line no-unused-vars
import {mapClass2Element} from '../hoc/mapClass2Element'

class Blank extends React.Component{
  active='mabibi'
  componentDidMount(){
    this.getActive()
  }  
  getActive(){
    console.log('dog')
  }
  render(){
    return(
      <div style={style.outer}>
        <h3> Blank is {this.active}</h3>
        <p>Typical JS snobbery in these comments. Everyone knows a huge proportion of JavaScript on the web is written on jQuery, so it is perfectly acceptable to provide a solution here for jQuery if it already has a built-in method for testing objects. It's likely that thousands of developers looking for help will find this answer helpful. Nobody said it's the only way to do it. I notice how nobody acts all elitist about the guy who posted a solution to use underscore.js</p>
      </div>
    )
  }
}
Blank = mapClass2Element(Blank)

export {Blank}

const style = {
  outer:{
    overflow:'hidden',
    padding: '4px',
    margin: '2px 10px 10px 10px'
  }
}