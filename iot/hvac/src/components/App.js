import React from 'react'
import {responsivePage} from '../showRWD'
import {ClientSocket} from '@mckennatim/mqtt-hooks'
// import {ClientSocket} from '../../npm/mqtt-hooks'
import {cfg} from '../utilities/getCfg'

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
      <ClientSocket cfg={cfg}>
      <div>
        <div style={style.container}>
        <div style={style.content}>
          {/* <Splash/> */}
          {responsivePage(this.props)
            .map((el)=>el)
          }
          {/* {React.createElement(compoi[pagename], null)} */}
        </div>
         {/* {this.showPage().map((el)=>{
           return React.createElement(el, null)
         })}  */}
        </div>
      </div>
      </ClientSocket>
      )
  }
}
export{App}

let style = {
  he:{
    height: '50px',
    background: '#222',
    flexGrow: 1,
    flexGhrink: 0,
    flexBasis: '98%', 
  },
  container:{
    background: '#222',
    display: 'flex',
    flexDirection: 'row', /* generally better */
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'stretch',
    alignItems: 'stretch'
  },
  content:{
    minHeight:'200px',
    background: '#222',
    flexGrow: 1,
    flexShrink: 1, /*can shrink from 300px*/
    flexBasis: '225px'  
  }
}