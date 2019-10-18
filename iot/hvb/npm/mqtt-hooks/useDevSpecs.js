import { useEffect, useState} from "react";
// import {connect } from './index'

const geta=(dotstr, obj)=>{
  return dotstr.split(".")
    .slice(1)
    .reduce((xs,x)=>(xs && xs[x]) ? xs[x] : null , obj)
}

export function useDevSpecs(ls,cfg, client,cb ){
  var lsh = ls.getItem()
  const [zones ,setZones] = useState({});
  const [binfo ,setBinfo] = useState({});
  const [devs,setDevs] = useState(undefined) 
  const [error, setError] =useState(undefined)
  const [mounted, setMounted] =useState(false)
  const fetchDevZones=()=>{
    if(geta('lsh.token', lsh)){
      let url= cfg.url.api+'/admin/i/devzones'
      let options= {
        headers: {'Authorization': 'Bearer '+ lsh['token']},
        method: 'GET'
      }  
      return(
        fetch(url, options)
          .then((response)=>response.json())
      ) 
    }else{
      let p2 =Promise.resolve({qmessage:'you dont exist! '})
      return p2
    } 
  }
  useEffect(() => {
    let didCancel=false
    if(!didCancel){
      fetchDevZones().then((data)=>{
        // console.log('data: ', data)
        if(data){
          // console.log('data: ', data)
          if (data && data.qmessage){
            setError(data)
          }else{
            console.log('devs: ', data.devs)
            //Object.keys(data.devs)
            setDevs(data.devs)
            setBinfo(data.binfo)
            setZones(data.zones)

            cb(data.devs)
            // if (!client.isConnected()){
            //   connect(client, lsh, ()=>cb(client,data.devs)) 
            // }
          }
        }
      })
    }
    return ()=>{
      didCancel=true
      setMounted(false)
      if(client.isConnected()){
        console.log('client disconnecting')
        // client.disconnect()
      }
    }
  },[]); 
  return {devs, zones, binfo, error, mounted} 
}


