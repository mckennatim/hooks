

const fetchWeekSched = (ls, cfg, devid, senrel)=>{
  var lsh = ls.getItem()
  if(lsh){
    let url= cfg.url.api+'/admin/u/scheds/'+devid+'/'+senrel
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

const replaceWeekSched = (ls, cfg, keyvals)=>{
  console.log('in rplace')
  var lsh = ls.getItem()
  console.log('keyvals: ', keyvals)
  if(lsh){
    let url= cfg.url.api+'/admin/u/scheds'
    let options= {
      headers: {
        'Authorization': 'Bearer '+ lsh['token'],
        'Content-Type': 'application/json'
      },
      method: 'PUT',
      body:JSON.stringify(keyvals)
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

export{fetchWeekSched, replaceWeekSched}