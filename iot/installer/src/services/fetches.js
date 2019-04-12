import {ls, cfg} from '../utilities/getCfg'
import {geta} from '../utilities/wfuncs'
import {storageLocal} from '../utilities/storageLocal'

const fetchDevZones=(qry)=>{
  var lsh = storageLocal(qry).getItem()
  console.log('lsh: ', lsh)
  if(geta('lsh.token', lsh)){
    let url= cfg.url.api+'/admin/i/devzones'
    // console.log(url)
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


const deleteDev=(devid)=>{
  var lsh = ls.getItem();
  if(geta('lsh.token', lsh)){
    let url= cfg.url.api+'/admin/b/deldev/'+devid
    // console.log(url)
    let options= {
      headers: {'Authorization': 'Bearer '+ lsh['token']},
      method: 'DELETE'
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

const fetchDevids=()=>{
  var lsh = ls.getItem();
  // console.log(lsh)
  if(geta('lsh.token', lsh)){
    let url= cfg.url.api+'/admin/b/devlist/'
    let options= {headers: {'Authorization': 'Bearer '+ lsh['token']}}
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

const postDev=(devinfo)=>{
  var lsh = ls.getItem();
  if(geta('lsh.token', lsh)){
    let url= cfg.url.api+'/admin/b/savedev'
    // console.log(url)
    let options= {
      headers: {'Authorization': 'Bearer '+ lsh['token'],
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(devinfo)
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

const getLastDev=(base)=>{
    var lsh = ls.getItem();
    let devinfo
    if(geta('lsh.token', lsh)){
      let url= cfg.url.api+'/admin/b/nextdev/'+base
      // console.log(url)
      let options= {headers: {'Authorization': 'Bearer '+ lsh['token']}}
      return(
        fetch(url, options)
          .then((response)=>response.json())
          .then((json)=>{
            if(json.message){
              return devinfo={qmessage: json.message}
            }else{
              let res = json.devid.replace(base,"")
              const l = res.length
              res = base+(res*1+1).toString().padStart(l,"0")
              // console.log(res)
              return res
            }
          })
          .catch((e)=>{
            // console.log(e.message)
            devinfo={qmessage: e.message}
            return devinfo
          })
      )   
    }else{
      let p2 =Promise.resolve({qmessage:'you dont exist! '})
      return p2
    }
  }

const fetchDevInfo=(dev)=>{
    var lsh = ls.getItem();
    let devinfo
    if(geta('lsh.token', lsh)){
      let url= cfg.url.api+'/admin/b/dev/'+dev
      // console.log(url)
      let options= {headers: {'Authorization': 'Bearer '+ lsh['token']}}
      return(
        fetch(url, options)
          .then((response)=>response.json())
          .then((json)=>{
            if(json.message){
              return devinfo={qmessage: json.message}
            }else{
              let res = json
              let specs= JSON.parse(res.devinfo.specs)
              res.devinfo.specs=specs
              return res
            }
          })
          .catch((e)=>{
            // console.log(e.message)
            devinfo={qmessage: e.message}
            return devinfo
          })
      )   
    }else{
      let p2 =Promise.resolve({qmessage:'you dont exist! '})
      return p2
    }
  }

  export{fetchDevInfo, fetchDevids, getLastDev, postDev, deleteDev,fetchDevZones}