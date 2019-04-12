import {isEqual} from 'underscore'
import moment from 'moment-timezone'
// import { isObservable } from '../utilities/ofuncs';
import {geta} from '../utilities/wfuncs'
import { fromMqtt$} from './fromMqtt';
import{getArrObjByObjKeyVal} from '../utilities/wfuncs'
import {createSchedObj} from '../utilities/getCfg'
// import{qreducer} from './qreducer'
import{qcreateStore} from './qrxred'
import{grabSrstateData, grabSchedData, readyState} from './qactions'


/*----------for setting up qstore and listeners in comonentDidMount-------*/

let mqttStore

const createMqttStore=(devs,qdata,tz)=>{
  let initstate = {devs, qdata, tz:tz}
  mqttStore = qcreateStore(initstate)
}

const getMqttStore=()=>mqttStore

/*---------for managing mqtt------------------------*/

var mqtt$ = {
  next() {},
  error(err) {throw err;},
  complete() {}
}

const mqttConnect= ()=>{
  //mqtt$.next('end')
  mqtt$ = fromMqtt$()
  mqtt$.subscribe(
    function (e) {
      var sp = e.topic.split("/")
      var job = sp[1];
      console.log(JSON.stringify(e))
      switch(job){
        case "ready":
          // console.log(JSON.stringify(e))
          readyState(e)
          qstatus.setReady(e.payload.ready)
          if(e.payload.ready){
            mqtt$nextSubscribe()
            mqtt$nextPublishReqs()
          }
          break;
        case "srstate":
          // console.log(JSON.stringify(e))
          grabSrstateData(e)
          break;
        case "timr":
          // grabTimrData(e.payload)
          break;
        case "flags":
          // grabFlagData(e.payload)
          break;
        case "sched":
          grabSchedData(e)
          break;
      }
  });
}

const mqttEnd = ()=>{
  console.log('in mqttEnd')
  mqtt$.next('end')
  qstatus.setReady(false)
}

const mqttReq = ()=>{
  mqtt$nextPublishReqs()
}

/*--------forming qdata from devs and zones; updating and accessing it----------

BTW cmd changes the current state(a boost) which lasts until the next schedule change.
CYURD001/cmd {"id":0,"sra":[84,72]}
-----------*/
let subtopics= ["srstate", "sched", "flags", "devtime"]
//reqs= [`{\"id\":0,\"req\":\"srstates\"}`, `{\"id\":1,\"req\":\"progs\"}`]
let reqs= [{id:0, req:"srstates"}, {id:1,req:"progs"}]
let subscriptions = []
let pubreqs = []
let devscopy= {}// eslint-disable-line no-unused-vars

const createSubscriptions=(devs)=>{
  let subs=[]
  Object.keys(devs).map((dev)=>{
    subtopics.map((s)=>{
      let o={pubsub:'subscribe'}
      o.topic =`${dev}/${s}`
      subs.push(o)
    })
  })
  // console.log(subs)
  subscriptions = subs
  return(subscriptions)
}
  
const mqtt$nextSubscribe=()=>{
  subscriptions.map((sub)=>{
    mqtt$.next(sub)
  })
}
const mqtt$nextPublishReqs=()=>{
  pubreqs.map((pub)=>{
    mqtt$.next(pub)
  })
}

const mqtt$nextPublish = (topic,message)=>{
  let o={pubsub:'publish'}
  o.topic=topic
  o.message=JSON.stringify(message)
  mqtt$.next(o)  
}

const createStartupPubreqs = (devs)=>{
  let pubs=[]
  Object.keys(devs).map((dev)=>{
    reqs.map((r)=>{
      let o={pubsub:'publish'}
      o.topic =`${dev}/req`
      o.message = JSON.stringify(r)
      pubs.push(o)
    })
  })
  pubreqs = pubs
  // console.log(pubreqs[0].message)  
}

const lsDevsQdataRetQdata=(devs,zones,tz,ls)=>{
  let qdata = createBlankQdata(devs, zones)
  ls.modItem("devs", devs)
  ls.modItem("qdata", qdata)
  ls.modItem("tz", tz)
  return qdata  
}

const setupMqttStore=(devs, qdata, tz)=>{
  createSubscriptions(devs)
  createStartupPubreqs(devs)
  createMqttStore(devs, qdata,tz)
}

const hookupMqtt=(loc, ls, cb)=>{
  let devs = ls.getKey('devs')
  let qdata = ls.getKey('qdata')
  let cloc = ls.getKey("cloc")
  let tz = ls.getKey("tz")
  let unsub
  let haystore=false
  let mqttStore = getMqttStore()
  if(mqttStore){
    haystore=true
  } else if(cloc==loc && devs && qdata){
    setupMqttStore(devs, qdata, tz) 
    haystore=true
    mqttStore = getMqttStore()    
  }
  if(haystore){
    unsub = mqttStore
      .subscribe((state)=>{
        //console.log(state)
        cb(state)
      }
    )     
  }
  return unsub
}

const reset = {
  ck4change: (qu,status)=>{
    // console.log('ck4change ran')
    status.ischanged=false
    if(!isEqual(qu.sr,status.prior.sr)){
      status.ischanged = true
      status.prior.sr=qu.sr
    }else if(!isEqual(qu.schedobj,status.prior.schedobj)){
      status.ischanged = true
      status.prior.schedobj=qu.schedobj
    }else{
      status.ischanged=false
    }
    // console.log('yo, checking 4 change', status)
    return status
  },
  ck4changeWeek: (qu, status)=>{
    let nstatus = {...status}
    //console.log(qu.sr.dev, '=??', nstatus.prior.sr.dev)
    if(!isEqual(qu.sr,nstatus.prior.sr)){
      console.log('inside ', qu.sr.dev, '=??', nstatus.prior.sr.dev)

      //status.prior.sr=qu.sr
      nstatus.ischanged=true
    }else {
      nstatus.ischanged=false
    }
    // console.log('yo, checking 4 change', status)
    return nstatus    
  },
  urlSr: (props)=>{
    return geta('props.cambio.page.params.sr', props)
  }, 
  readyMessage: (priormess, qstate, that)=>{
    let curmess
    if(geta('qstate.readystate.message',qstate)){
      curmess = qstate.readystate.message
      if(curmess!=priormess){
        that.setState({qmessage: curmess})
      }
    } 
    return curmess    
  },
  stateWhenUrlsrChanges: (prior, urlsr, qstate, that,cb)=>{
    let cursrrec, cursched 
    if (qstate.qdata && urlsr) { 
      cursrrec = qstate.qdata[urlsr].sr     
      cursched = qstate.qdata[urlsr].sched 
      if(!isEqual(prior.urlsr,urlsr)){
        console.log('resetting urlsr')
        that.setState({qdata:qstate.qdata[urlsr], tz:qstate.tz})
        prior.urlsr=urlsr
        cb({srrec:cursrrec, sched:cursched})
      }      
    }
    return {srrec:cursrrec, sched:cursched}
  },
  stateWhenSchedChanges: (priorsched, cursched, that)=>{
    // console.log('priorsched: ',JSON.stringify(priorsched))
    // console.log('cursched: ',JSON.stringify(cursched))
    if(cursched && that.state.qdata && !isEqual(priorsched,cursched)){
      let oldschedobj ={}
      // console.log('cursched: ',JSON.stringify(cursched))
      const schedobj = createSchedObj(cursched, that.state.tz)
      if(!isNaN(schedobj.sched[0].setpt) && !isEqual(oldschedobj,schedobj)){
        //console.log('sched causing reset')
        //copySchedobj2store(schedobj)
        that.setState({schedobj:schedobj, dow:schedobj.dow})
        oldschedobj = schedobj
      }
      //that.resetTimer(schedobj.timeleft)
    }
    return cursched    
  },
  stateWhenSrrecChanges: (priorsrrec, cursrrec, that)=>{
    if(cursrrec && that.state.qdata && !isEqual(priorsrrec,cursrrec)){
      //console.log('srrec causing reset')
      // that.state.qdata.sr = cursrrec
      // that.setState({qdata:that.state.qdata})
    }    
    return cursrrec
  },
  timer: (that)=>{
    let schedobj = that.state.schedobj
    if(schedobj){
      let mom = moment(schedobj.timeleft,'H:mm')
      that.setState({fornext: mom.format('H:mm')})
      if (that.tmr){
        clearInterval(that.tmr)
      }
      that.tmr = setInterval(()=>{
        mom.subtract(60, 'seconds')
        that.setState({fornext: mom.format('H:mm')})
      },60000)
    }
  }
}

const createBlankQdata = (devs, zones)=>{
  let odata = {}
  zones.map((zone)=>{
    odata[zone.id]={id:zone.id, name:zone.name, img:zone.img,
      spec:{type:"temp", diff: 2},
      sr:{temp:44, relay:0, setpt:68, id:0, dev:"CYURD"},
      schedobj:{sched:[]},
      timeleft:0,
      ts:0
    }
  })
  return odata
}

const qdataAsArray=(qdata)=>{
  return Object.entries(qdata).map( (res)=>res[1])
}

const srUpdateQdata=(state, message)=>{
  let devid=message.topic.split('/')[0] 
  let sYl =getArrObjByObjKeyVal('sr', message.payload.id , state.devs[devid]) 
  if(sYl){
    let zoi = state.qdata[sYl.label]
    // console.log('zoi: ',JSON.stringify(zoi))
    if(zoi){
      zoi.ts = new Date()
      zoi.sr.temp = message.payload.darr[0]
      zoi.sr.relay = message.payload.darr[1]
      zoi.sr.setpt = Math.floor((message.payload.darr[2]+message.payload.darr[3])/2)
      zoi.sr.id = message.payload.id
      zoi.sr.dev = devid
      state.qdata[sYl.label]=zoi
      return state 
    }else{
      return state
    }
  }else {
    return state
  }  
}

const schedUpdateQdata=(state, message)=>{
  let devid=message.topic.split('/')[0] 
  let sYl =getArrObjByObjKeyVal('sr', message.payload.id , state.devs[devid])
  if(sYl){
    let zoi = state.qdata[sYl.label]
    if(zoi){
      zoi.ts = new Date()
      // zoi.sched = message.payload.pro
      zoi.schedobj = createSchedObj(message.payload.pro, state.tz)
      state.qdata[sYl.label]=zoi
      return state 
    }else{
      return state
    }
  }else {
    return state
  }

}

/*-------------dealing with mqttconnection on focus, page change and mount----------*/

var qstatus=(()=>{
  let ready =false
  const qpages = ["AtLoc", "SensorRelay", "TimerCtrl", "WeekSched"]
  const setReady = (tf)=>{ready=tf}
  return{
    setReady: setReady,
    // hello: ()=>console.log('hello world'),
    getReady: ()=>ready,
    getQpages: ()=>qpages
  }  
})()

const qOnMount = ()=>{
  let ready =qstatus.getReady()
  // console.log('qOnMount, ready: ',ready)
  if (!ready){
    mqttConnect()
  }
}

const qOnPageSwitch = (to)=>{
  let qpages =qstatus.getQpages()
  let ready =qstatus.getReady()
  let arriving2q  = qpages.includes(to)
  // console.log('qOnPageSwitch, to:', to,arriving2q, ' ready:', ready  )
  if(!arriving2q && ready){
    // console.log('!arriving2q && ready: ',JSON.stringify(  !arriving2q && ready))
    mqttEnd()
  }else if(arriving2q && ready){
    // console.log(' arriving2q && ready: ',JSON.stringify(  arriving2q && ready))  
    mqttReq()
  }
}

const qOnFocus = (to, frum, focused)=>{
  let qpages =qstatus.getQpages()
  let ready =qstatus.getReady()
  let arriving2q  = qpages.includes(to)
  // let leavingQ = qpages.includes(frum)
  // console.log('qOnFocus, ready:', ready, ' focused:', focused, ' arriving2q:', arriving2q)
  if(arriving2q  && focused && !ready){
    // console.log('arriving2q && focused -> mqttConnect')
    mqttConnect()
  } else if(!focused && ready){
    // console.log('!focused -> mqttEnd')
    mqttEnd()
  } 
}

export{ srUpdateQdata, schedUpdateQdata, qOnFocus, qdataAsArray, qOnMount, qOnPageSwitch,  setupMqttStore,lsDevsQdataRetQdata, hookupMqtt, createBlankQdata, createSubscriptions,mqtt$nextPublish, reset}