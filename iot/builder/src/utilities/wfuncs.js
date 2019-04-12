import React from 'react'
import ReactDOM from 'react-dom'

const dog=(ani)=>{
  return ani
}

const geta=(dotstr, obj)=>{
  return dotstr.split(".")
    .slice(1)
    .reduce((xs,x)=>(xs && xs[x]) ? xs[x] : null , obj)
}

const deepObjModify=(dotstr, val, obj)=>{
  if(geta(dotstr, obj)){
    var keyarray = dotstr.split(".")
    var ls = keyarray.slice(-1)[0]
    keyarray
      .slice(1) 
      .reduce((xs,x)=>{
        if(xs && xs[x]) {
          if(x==ls){
            xs[x]=val
          }
          return xs[x]
        }
      }, obj)
    let newobj = {...obj}
    return newobj
  } else {
    return 'nested key not accessable'
  }
}

const log = console.log.bind(console);

function el(id){
  return document.getElementById(id)
}

const render = (pg, para)=>{
  ReactDOM.render(React.createElement(pg, para), document.getElementById('rt')) 
}

const parseQuery = (query)=>{
  var obj = {};
  query.split('&')
    .map((term)=>{
      var ar = term.split('=')
      obj[ar[0]]=ar[1]
    }
  )
  return obj
}

const getArrObjByObjKeyVal =((key, val, arr)=>{
  return arr.find((x)=>{
    return x[key]==val
  })
})

const getIdxByObjKeyVal =((key, val, arr)=>{
  return arr.findIndex((x)=>{
    return x[key]==val
  })
})

const getIdxYobj=((key, val, arr)=>{
  var idx = getIdxByObjKeyVal(key, val, arr)
  var obj = arr[idx]
  return{idx, obj}
})

export {geta, dog, render, log, parseQuery, el, deepObjModify, getArrObjByObjKeyVal, getIdxByObjKeyVal, getIdxYobj}  
