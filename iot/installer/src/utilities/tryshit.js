
/*
      {/* 
      <li key={z.id}><div>
        {z.name} 
        {z.img} <br/>
        temp: {zdat[i].temp}
       
      </div></li>
    */

var devs= {
      "CYURD003": [
        {
          "sr": 0,
          "label": "kid"
        },
        {
          "sr": 1,
          "label": "lr"
        }
      ],
      "CYURD006": [
        {
          "sr": 0,
          "label": "music"
        },
        {
          "sr": 1,
          "label": "peri"
        }
      ]
    }

var zones =[
      {
        "id": "lr",
        "name": "Living Room",
        "img": "lr.jpg"
      },
      {
        "id": "music",
        "name": "Music Room",
        "img": "music.jpg"
      },
      {
        "id": "peri",
        "name": "Peri's Study",
        "img": "peri.jpg"
      },
      {
        "id": "kid",
        "name": "Kids Suite",
        "img": "kid.jpg"
      }
    ]

var zones2 =[
      {
        "id": "lr",
        "name": "Living Room",
        "img": "lr.jpg",
          temp: 76,
          relay: 0,
          setpt: [78, 76]
      },
      {
        "id": "music",
        "name": "Music Room",
        "img": "music.jpg",
          temp: 76,
          relay: 0,
          setpt: [78, 76]
      },
      {
        "id": "peri",
        "name": "Peri's Study",
        "img": "peri.jpg",
          temp: 76,
          relay: 0,
          setpt: [78, 76]
      }
    ]

console.log(zones)  
console.log(zones2)  

var z = zones2.find((x,i)=>{
  return x.id='lr'
})

console.log(z)
console.log(zones2.find((x,i)=>{
  return x.id='lr'
}))

var z2 = zones2.findIndex((x)=>{
  return x.id=='peri'
})
console.log(z2)
console.log(zones2.findIndex((x)=>{
  return x.id=='peri'
}))

const getIdxByObjId =((what, inwhat)=>{
  return inwhat.findIndex((x)=>{
    return x.id==what
  })
})
const getIdxByObjKeyVal =((key, val, arr)=>{
  return arr.findIndex((x)=>{
    return x[key]==val
  })
})

console.log(getIdxByObjId('peri', zones2))
console.log(getIdxByObjKeyVal('id','peri', zones2))

const getArrObjByObjId =((what, inwhat)=>{
  return inwhat.find((x)=>{
    return x.id==what
  })
})
const getArrObjByObjKeyVal =((key, val, arr)=>{
  return arr.find((x)=>{
    return x[key]==val
  })
})

const getIdxYobj=((key, val, arr)=>{
  var idx = getIdxByObjKeyVal(key, val, arr)
  var obj = arr[idx]
  return{idx, obj}
})

console.log(getArrObjByObjId('peri', zones2))
console.log(getArrObjByObjKeyVal('id', 'peri', zones2))

console.log(devs)
//given demes, devs and zones2
var dmes = {
  destinationName: 'CYURD003/srtate', 
  payloadString: '{"id":1, "darr":[67, 1, 76, 73], "new":0}'
}
var topic= 'srstate'

const parseMess = (mess, devs, zones)=>{
  let dt = mess.destinationName.split('/')
  let po = JSON.parse(mess.payloadString)
  let srYlabel =getArrObjByObjKeyVal('sr', po.id , devs[dt[0]])
  console.log(srYlabel)
  let zoi = getIdxYobj('id', srYlabel.label, zones)
  console.log(zoi)
  zoi.obj.temp = po.darr[0]
  zoi.obj.relay = po.darr[1]
  zoi.obj.setPt = Math.floor((po.darr[2]+po.darr[3])/2)
  zoi.obj.ts = new Date()
  console.log(zoi.obj)

  var newzones =zones.slice(0)
  newzones[zoi.idx]=zoi.obj
  return(newzones)
}

const srUpdateZones=(devid, payload, devs, zones)=>{
  let sYl =getArrObjByObjKeyVal('sr', payload.id , devs[devid])
  let zoi = getIdxYobj('id', sYl.label, zones)
  zoi.obj.temp = payload.darr[0]
  zoi.obj.relay = payload.darr[1]
  zoi.obj.setPt = Math.floor((payload.darr[2]+payload.darr[3])/2)
  zoi.obj.ts = new Date()
  var newzones =zones.slice(0)
  newzones[zoi.idx]=zoi.obj
  console.log(newzones)
  return(newzones)
}

console.log(parseMess(dmes, devs, zones))@

const processMqttMessage = (mess, devs, zones)=>{
  let dt = mess.destinationName.split('/')
  let devid = dt[0]
  let topic = dt[1]
  let payload = JSON.parse(mess.payloadString)
  switch(topic) {
    case "srtate" :
      return srUpdateZones(devid, payload, devs, zones)
      break;
    default:
      return zones  
  } 
}

console.log(processMqttMessage(dmes, devs, zones))
console.log(zones)