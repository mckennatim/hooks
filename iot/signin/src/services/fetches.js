import {ls, cfg} from '../utilities/getCfg'
import {geta} from '../utilities/wfuncs'

const fetchLocs=(mobj)=>{
  if(geta('mobj.token', mobj)){
    let url= cfg.url.api+'/reg/coids'
    let options= {headers: {'Authorization': 'Bearer '+ mobj.token}}
    return(
      fetch(url, options)
        .then((response)=>response.json())
        .then((json)=>{
          console.log('json: ', json)
          if(json.message){
            return {qmessage: json.message}
          }else{
            return json
          }
        })
        .catch((e)=>{
          return {qmessage: e.message}
        })
      )         
  }else{
    let p2 =Promise.resolve({qmessage:'you dont exist! '})
    return p2
  }
}

const fetchApps=()=>{
  var lsh = ls.getItem();
  if(geta('lsh.token', lsh)){
    let url= cfg.url.api+'/reg/apps'
    let options= {headers: {'Authorization': 'Bearer '+ lsh['token']}}
    return(
      fetch(url, options)
        .then((response)=>response.json())
        .then((json)=>json)
        .catch((e)=>{
          return {qmessage: e.message}
        })
      )         
  }else{
    let p2 =Promise.resolve({qmessage:'you dont exist! Try re-registering '})
    return p2
  }
}

const fetchALUtoken=(token, co)=>{
  if(token){
    let url= cfg.url.api+'/reg/ctoken/'+co.coid+'/'+co.role
    console.log('url: ', url)
    let options= {headers: {'Authorization': 'Bearer '+ token}}
    return(
      fetch(url, options)
        .then((response)=>response.json())
        .then((json)=>{
          if(json.message){
            return {qmessage: json.message}
          }else{
            return json
          }
        })
        .catch((e)=>{
          return {qmessage: e.message}
        })
      )         
  }else{
    let p2 =Promise.resolve({qmessage:'you dont exist! '})
    return p2
  }
}


export{fetchALUtoken, fetchApps, fetchLocs}