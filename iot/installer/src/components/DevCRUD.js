import React from 'react' // eslint-disable-line no-unused-vars
import {pStyle} from '../styles'
import {ls, cfg} from '../utilities/getCfg'
//import {geta} from '../utilities/wfuncs'
import {mapClass2Element} from '../hoc'
// import {router} from '../app'
import {fetchDevInfo, getLastDev, postDev, deleteDev, fetchDevids} from '../services/fetches'
import ReactJson from 'react-json-view'// eslint-disable-line no-unused-vars
// import ReactMaterialSelect from 'react-material-select'// eslint-disable-line no-unused-vars
import '../styles/reactMaterialSelect.css'
// import Button from 'muicss/lib/react/button';// eslint-disable-line no-unused-vars
import Option from 'muicss/lib/react/option';// eslint-disable-line no-unused-vars
import Select from 'muicss/lib/react/select';// eslint-disable-line no-unused-vars
// import Appbar from 'muicss/lib/react/appbar';// eslint-disable-line no-unused-vars

const url = cfg.url.authcb('#registered')


const style = {
 ...pStyle, outer: {...pStyle.outer, 
                    background: '#c1b8b8'}
}

const vstyle = {
    outer: { 
      width: 800,
      background: 'white', 
      textAlign: 'left',
      MozTransform: 'scale(1.3)',
      zoom: '130%'
    },
    rjv: {
      fontFamily: 'Tahoma, Geneva, sans-serif',
      fontStretch: 'ultra-condensed',
      padding: 60,
      margin: 60   
    },
    old:{
      padding: 60,
      margin: 60
    },
    button:{
      backgroundColor: '#7abbdb',
      border: 'none',
      color: 'white',
      padding: '5px 10px',
      textAlign: 'center',
      textDecoration: 'none',
      display: 'inline-block',
      fontSize: '32px',
      margin: '4px 2px',
      cursor: 'pointer'
    },
    span:{
      textAlign:'left'
    }
}

class DevCRUD extends React.Component{
  constructor (props){
    super(props);
    // let page = this.props.cambio.page
    // let dev = 'DEVICES'
    // if (page.name=='Edit'){
    //   dev=page.params.dev
    // }
    this.state={
      devs:[],  
      qmessage: 'awaiting data', 
      devinfo: {
        devid:'CY',
        description:'no data',  
        specs:{}
      }
    }
    this.binfo={baseDevid:"CU", bizid:''}
    if(ls.getItem()){
      this.email = ls.getItem().email
    }else{
      console.log('this machine knows nothing of this app')
    }
    this.bldev={devid:"", 
                owner:"noneyet",
                description: "description",
                specs:{
                  software_version:"2.0", 
                  hardware_version: "wemos",
                  sr:[{
                        srid:0,
                        haysensor:{
                          senses:"humid/temp",
                          model:"DHT22/DS18B20"
                        },
                        hayrelay:{
                          controlled: 1,
                          defsched: [0,0,55,52]
                        }
                      },{
                        srid:1,
                        haysensor:0,
                        hayrelay:0
                      }
                    ]
                }, 
              }
  }

  defaults = {
      onAdd: true,
      onEdit: true,
      onDelete: true,
      indentWidth: 2,
      displayDataTypes: false
    }  

  componentDidMount(){
    this.getDevids()
  }

  componentWillUnmount(){
  }  

  getDevids=()=>{
    fetchDevids()
      .then((json)=>{
        if(json.qmessage){
          this.setState({qmessage: json.qmessage, devs:[]})
        }else{
          // console.log('no hay message', json.qmessage)
          this.binfo = json.binfo
          this.setState({devs:json.devs, qmessage:'ub '})
          //console.log('json.devs: ', json.devs)
          this.refreshDevinfo(json.devs[0])
        }        
      })
  }

  refreshDevinfo=(devid)=>{
      this.setState({qmessage:'waiting...', value:devid})
    fetchDevInfo(devid)
      .then((res)=>{
        this.setState({devinfo:res.devinfo, value:res.devinfo.devid, qmessage:'ur '},()=>{
        })
      })
  }

  handleSelect =(e)=>{
    this.refreshDevinfo(e.target.value)
  }

  goSave=()=>{
    let devinfo = {...this.state.devinfo}
    let sspecs = JSON.stringify(devinfo.specs)
    devinfo.specs=sspecs
    console.log(devinfo)
    postDev(devinfo)
      .then(data => {
        console.log(data)// JSON from `response.json()` call
        //this.getDevids()
      }) 
      .catch(error => console.error(error))
  }

  delDev=()=>{
    console.log(this.state.devinfo)
    let devid=this.state.devinfo.devid
    console.log('deleting', devid)
    deleteDev(devid)
      .then(data => {
        console.log(data)// JSON from `response.json()` call
        this.getDevids()
        this.refreshDevinfo(this.state.devs[0])
      }) 
      .catch(error => console.error(error))  
  }

  addDev=()=>{
    console.log(this.binfo)
      getLastDev(this.binfo.baseDevId)
      .then((lastdev)=>{
        let ndevs = this.state.devs.slice()
        let ninfo = {...this.bldev}
        ninfo.devid=lastdev
        ninfo.owner = this.binfo.emailId
        ndevs.push(lastdev)
        console.log(ndevs)
        console.log(ninfo)
        this.setState({devs:ndevs, devinfo:ninfo})
      })  
  }

  logout=()=>{
    console.log('logging out')
    ls.setItem("")
  }

  changeDevinfo =(m)=>{
    console.log(m)
  }

  render(){
    // console.log('rerendering')
    // console.log(this.state)
    const{devinfo}=this.state
    const{
        onAdd,
        onEdit,
        onDelete,
        indentWidth,
        displayDataTypes,
      } = this.defaults    
    return(
      <div style={style.outer} >
      <span style={vstyle.span} >{this.state.qmessage} {this.email} <a href={url}>re-login </a><a  onClick={this.logout}> logout</a></span>
        <form action="">
        <Select label='select' value={this.state.devinfo.devid} onChange={this.handleSelect.bind(this)} >
          {
            this.state.devs.map(function (dev, i) {
              return <Option key={i} value={dev} label={dev} />;
            })
          }
        </Select> 
        <button style={vstyle.button} onClick={this.addDev.bind(this)}>+</button>
        <button  style={vstyle.button} onClick={this.goSave}><i className="material-icons" >save</i></button>
        <button  style={vstyle.button} onClick={this.delDev}><i className="material-icons" >delete</i></button>
        </form>        
        <div style={vstyle.old}>


        </div>
        <div style={vstyle.outer}>
          <ReactJson src={devinfo}
            style={vstyle.rjv}
            displayDataTypes={displayDataTypes}
            indentWidth={indentWidth}
            onEdit={onEdit ? e => {
              console.log(e.updated_src)
              this.setState({ devinfo: e.updated_src })
            }: false} 
            onDelete={onDelete ? e => {
              console.log(e.updated_src)
              this.setState({ devinfo: e.updated_src })
            }: false} 
            onAdd={onAdd ? e => {
              console.log(e.updated_src)
              this.setState({ devinfo: e.updated_src })
            }: false} 
          />         
        </div> 
      </div>
    )
  }
}

DevCRUD=mapClass2Element(DevCRUD)

export {DevCRUD}
