import React from 'react'
// import {responsivePage} from '../showRWD'
// import {Splash} from './Splash.jsx'
// const compoi = {Splash}
import * as compoi from './index'
// console.log('compoi: ', compoi['Splash'])
// console.log('Splash: ', Splash)

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
    return this.responsivePage(this.props)
  }

  responsivePage (props){
    let elArr = []
    // const pageName = 'Splash'
    const {types, browser} = props.responsive
    const {page} =props.cambio
    const pageName = page.name
    const browserTypeIdx = types.indexOf(browser)
    const panesPerType = compoi.panes[browserTypeIdx]
    const pageList = compoi.multi.filter((amul)=>(amul.pri==pageName))
    if(pageList.length==0){ //if there is no multi array for the page
      const singleElement = React.createElement(compoi[pageName], {key:1, cambio:props.cambio, responsive: props.responsive}, null)
      elArr.push(singleElement)
    }else{
      const multiList= pageList[0].mul.filter((mu,i)=>(i+2)==panesPerType)
      if (multiList.length==0){ // if the multilist is empty
        const singleElement = React.createElement(compoi[pageName] , {key:1, cambio:props.cambio, responsive: props.responsive}, null)
        elArr.push(singleElement)
      }else{//use the array matching the panesPerType size and add all its names to the element arrray
        const elList = multiList[0].map((pgStr,i)=>{
          const pg = React.createElement(compoi[pageName], {key:i, cambio:props.cammbio, responsive: props.responsive}, null)
          return pg
        })
        elArr = elList
      }
    }
    // elArr.push(React.createElement(compoi[pageName], {key:1}, null))
    return elArr
  }


  render(){
    return(
      <div>
        <div style={style.container}>
        <div style={style.content}>
          {/* <Splash/> */}
          {this.responsivePage(this.props)
            .map((el)=>el)
          }
          {/* {React.createElement(compoi[pagename], null)} */}
        </div>
         {/* {this.showPage().map((el)=>{
           return React.createElement(el, null)
         })}  */}
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