
let dowb  =[ 
  { devid: 'CYURD001',
    senrel: 0,
    sr: 'lr',
    days: 'def',
    sched:[{time:'6:15am', setpt: 66}, { time: "12:00am", setpt: 64 }, { time: "8:12pm", setpt: 77 }, { time: "10:50pm", setpt: 54 }]
  },
  { devid: 'CYURD001',
    senrel: 0,
    sr: 'lr',
    days: 'M T',
    sched:[{time:'7:15am', setpt: 66}, { time: "12:00am", setpt: 64 }, { time: "8:12am", setpt: 77 }, { time: "10:50pm", setpt: 34 }]
  },
  { devid: 'CYURD001',
    senrel: 0,
    days: 'S Su',
    sr: 'lr',
    sched:[{time:'8:15am', setpt: 66}, { time: "12:00am", setpt: 64 }, { time: "8:12pm", setpt: 42 }, { time: "5:50pm", setpt: 54 }]
  },
  { devid: 'CYURD001',
    senrel: 0,
    days: 'W F',
    sr: 'lr',
    sched:[{time:'9:15am', setpt: 66}, { time: "12:00am", setpt: 64 }, { time: "6:12am", setpt: 77 }, { time: "10:50am", setpt: 54 }]
  },
  { devid: 'CYURD001',
    senrel: 0,
    sr: 'lr',
    days: 'hld',
    sched:[{time:'10:15am', setpt: 66}, { time: "12:00am", setpt: 655 }, { time: "8:12am", setpt: 68 }, { time: "10:50pm", setpt: 67 }]
  }
]


// let dbd =
// [
//   {
//     "id": 1016,
//     "devid": "CYURD001",
//     "senrel": 0,
//     "dow": 8,
//     "sched": "[[0,0,50,51]]",
//     "until": "2018-03-12 10:15",
//     "season": "current"
//   },
//   {
//     "id": 1001,
//     "devid": "CYURD001",
//     "senrel": 0,
//     "dow": 4,
//     "sched": "[[0,0,55,53],[17,12,78,76],[20,50,56,52],[22,50,64,61]]",
//     "until": "0000-00-00 00:00",
//     "season": "current"
//   },
//   {
//     "id": 1019,
//     "devid": "CYURD001",
//     "senrel": 0,
//     "dow": 5,
//     "sched": "[[0,0,55,53],[17,12,78,76],[20,50,56,52],[22,50,64,61]]",
//     "until": "0000-00-00 00:00",
//     "season": "current"
//   },
//   {
//     "id": 1012,
//     "devid": "CYURD001",
//     "senrel": 0,
//     "dow": 0,
//     "sched": "[[0,0,65,63],[20,12,78,76],[22,50,56,52],[23,50,64,61]]",
//     "until": "0000-00-00 00:00",
//     "season": "current"
//   }
// ]

    

let dn =['def', 'M', 'T', 'W', 'Th', 'F', 'S', 'Su', 'hld']
let dn2 =['d', 'M', 'T', 'W', 'Th', 'F', 'S', 'Su', 'h']

export {dn, dn2, dowb}