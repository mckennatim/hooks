import React from 'react'
import {responsivePage} from '../showRWD'
// import MqttProvider from '../components/MqttProvider.jsx'
// import {Splash} from './Splash.jsx'
// const compoi = {Splash}
// import * as compoi from './index'
// console.log('compoi: ', compoi['Splash'])
//console.log('Splash: ', Splash)

class App extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      el3: {name: "mcmurry"},
      we: {name: "curtis"},
      otherwise: "dogshit"
    };
  }
  componentDidMount (){
    // console.log('compoi[Splash](this.props): ', compoi['Splash'](this.props)) 
    //console.log('Splash: ', Splash(this.props))    

  }

  showRt(rtpg){
    if(typeof rtpg != 'function'){
      return rtpg.pg(rtpg.params)
    }
      return rtpg(this.props)
  }
  showPage(){
    return responsivePage(this.props)
  }

  render(){
    return(
      <div>
        <div style={style.container}>
          <div style={style.content}>
            {/* <Splash/> */}
            {responsivePage(this.props)
              .map((el)=>el)
            }
            {/* {React.createElement(compoi[pagename], null)} */}
          </div>
        </div>
      </div>
      )
  }
}
export{App}

let style = {
  he:{
    height: '50px',
    background: 'white',
    flexGrow: 1,
    flexGhrink: 0,
    flexBasis: '98%', 
  },
  container:{
    background: '#CCCCCC',
    display: 'flex',
    flexDirection: 'row', /* generally better */
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'stretch',
    alignItems: 'stretch'
  },
  content:{
    minHeight:'200px',
    background: '#99CCFF',
    flexGrow: 1,
    flexShrink: 1, /*can shrink from 300px*/
    flexBasis: '225px'  
  }
}