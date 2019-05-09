/*-----------on saving sensor dataor not-----------------*/

const recoStates=()=>{
  console.log('in recoStates')
  var url=cfg.url.api+"/dedata/rec"
  var sdata=deviceId+':'+dsenrel.value
  var pdata ={id:sdata}
  superagent.post(url)
    .set('Authorization', 'Bearer ' + userToken)
    .send(pdata)
    .end(function(e, res) {
      console.log(!!e ? e.status: 'no error')
      console.log(res.body)
    })	
}
const noRecoStates=()=>{
  console.log('in noRecoStates')
  var url=cfg.url.api+"/dedata/rec"
  var sdata=deviceId+':'+dsenrel.value
  var pdata ={id:sdata}
  superagent.delete(url)
    .set('Authorization', 'Bearer ' + userToken)
    .send(pdata)
    .end(function(e, res) {
      console.log(!!e ? e.status: 'no error')
      console.log(res.body)
    })	
}

/*----------save program for senrel to mysql/geniot/scheds */

const saveProg=()=>{
  console.log("in saveProg")
  const sdata = `{"devid":"${deviceId}","dow":${dday.value},"senrel":${dsenrel.value},"sched":"${ddayprog.value}" }`
  const pdata= JSON.parse(sdata)
  var url=cfg.url.api+"/dedata/prg"
  superagent.post(url)
    .set('Authorization', 'Bearer ' + userToken)
    .send(pdata)
    .end(function(e, res) {
      console.log(!!e ? e.status: 'no error')
      console.log(res.body)
    })	
}

/*-----------utility functions-------------*/
const parseQuery = (query)=>{
  var obj = {};
  query.substr(1).split('&')
    .map((term)=>{
      var ar = term.split('=')
      obj[ar[0]]=ar[1]
    }
  )
  return obj
}

const stripQuery=()=>{
  var url = window.location.href;
  var value = url.substring(8)
  value=value.substring(value.indexOf('/')+1).split("?")[0];
  return value;     
}

const get=(path, props)=>{
  return path.split(".")
    .slice(1)
    .reduce((xs,x)=>(xs && xs[x]) ? xs[x] : null , props)
}

const getToken=(appid)=>{
  var t = JSON.parse(localStorage.getItem(appid))
  //console.log(t)
  return t
}


//test funcs------------------------------------------
var pa = [[0,0,57,59],[9,15,68,70],[9,45,57,59],[20,0,68,70], [21,0,57,59]]
var ba = [[9,2,72,74],[9,40,58,62]]

var arr = pa.concat(ba)

console.log(arr)

var sarr =arr.sort((a,b)=>{
  if(a[0]-b[0]<0){
    return -1
  }else if(a[0]-b[0]>0){
    return 1
  }else if (a[0]-b[0]==0){
    if ([a[1]-b[1]]<0){
      return -1
    }else return 1
  }
})

console.log(sarr)
console.log(sarr[0])
var rarr = sarr.reduce((acc,curr)=>{
  console.log('acc at atart ',acc)
  var a=acc[acc.length-1][2]
  var b=curr[2]
  if (a!=b){
    console.log('not equal',a,b)
    acc.push(curr)
    return acc
  }else if(a==0 && b==0){
    var nac =acc.slice(0,-1)
    nac.push(curr)
    return nac		
  }else if(a==1 && b==1){
    return acc
  }
}, [sarr[0]])

console.log(rarr)

var carr =arr.sort((a,b)=>{
  if(a[0]-b[0]<0){
    return -1
  }else if(a[0]-b[0]>0){
    return 1
  }else if (a[0]-b[0]==0){
    if ([a[1]-b[1]]<0){
      return -1
    }else return 1
  }
}).reduce((acc,curr)=>{
  var a=acc[acc.length-1][2]
  var b=curr[2]
  if (a!=b){
    acc.push(curr)
    return acc
  }else if(a==0 && b==0){
    var nac =acc.slice(0,-1)
    nac.push(curr)
    return nac		
  }else if(a==1 && b==1){
    return acc
  }
}, [arr[0]])

console.log(carr)

const sortFunc=(a,b)=>{
  if(a[0]-b[0]<0){
    return -1
  }else if(a[0]-b[0]>0){
    return 1
  }else if (a[0]-b[0]==0){
    if ([a[1]-b[1]]<0){
      return -1
    }else return 1
  }	
}

const redFunc=(acc,curr)=>{
  var a=acc[acc.length-1][2]
  var b=curr[2]
  if (a!=b){
    acc.push(curr)
    return acc
  }else if(a==0 && b==0){
    var nac =acc.slice(0,-1)
    nac.push(curr)
    return nac		
  }else if(a==1 && b==1){
    return acc
  }	
}

const combined = (aprog,boost)=>{
  return aprog.concat(boost).sort(sortFunc).reduce(redFunc,[aprog[0]])
}
console.log(combined(pa,ba))