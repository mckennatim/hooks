

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

export{fetchWeekSched}