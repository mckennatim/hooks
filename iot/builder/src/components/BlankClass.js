import React from 'react' // eslint-disable-line no-unused-vars
import {pStyle} from '../styles'
import {ls} from '../utilities/getCfg'
import {mapClass2Element} from '../hoc'

const style = {
 ...pStyle, outer: {...pStyle.outer, background: '#D54ac6'}
}

class BlankClass extends React.Component{
  constructor (props){
    super(props);
  }

  componentDidMount(){
  }

  componentWillUnmount(){
  }  

  render(){
    return(
      <div style={style.outer} >
        <h4>in BlankClass</h4>
      </div>
    )
  }
}

BlankClass=mapClass2Element(BlankClass)

export {BlankClass}
