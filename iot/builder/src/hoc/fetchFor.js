import React from 'react'
import {geta} from '../utilities/wfuncs'
import {ls} from '../utilities/getCfg'

let fetchFor=(Comp, cfg)=>{
  return class PP extends React.Component {
    constructor (props){
      super(props);
      this.state= {data: []}
    }
    componentDidMount(){
      var lsh = ls.getItem();
      if(geta('lsh.token', lsh)){
        // console.log(cfg);
        let urlparams =''
        if (cfg.urlparams.length>0){
          cfg.urlparams.map((p)=>{
            urlparams+='/'+lsh[p]
          })
        }
        cfg.options.headers.Authorization='Bearer ' + lsh['token']
        this.setState({...this.state,
          status: 'waiting',
          data: [],
          message: 'is-loading'
        })
        let url = cfg.url+urlparams
        fetch(url, cfg.options)
          .then((response)=>response.json())
          .then((json)=>{
            if(json.message){
              // console.log(json.message);
              this.setState({...this.state,
                status: 'error',
                data: [],
                message: 'not-authorized'
              })
            }else{
              // console.log(json);
              if(json.length==0){
                this.setState({...this.state,
                  status: 'success',
                  data: json,
                  message: 'no-records'
                })
              }else if(json.length==1){
                //location.replace('#at/'+json[0])
                this.setState({...this.state,
                  status: 'success',
                  data: json,
                  message: 'just-1'
                })
              }else{
                this.setState({...this.state,
                  status: 'success',
                  data: json,
                  message: 'multi'
                })
              }
            }
          })
          .catch((err)=>{
            console.log('error');
            console.log(err);
            this.setState({...this.state,
              status: 'error',
              data: [],
              message: 'server-failure'
            })
          })
      }else{
        console.log('null getItem, not registered');
        this.setState({...this.state,
          status: 'error',
          data: [],
          message: 'not-registered'
        })
      }
    }
    render() {
      return (
        <Comp {...this.props} {...this.state} />
      )
    }
  }
}

export{fetchFor}
