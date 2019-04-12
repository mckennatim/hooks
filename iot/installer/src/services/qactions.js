import {qactionCreator} from './qrxred'

const grabSrstateData = qactionCreator((payload)=>{
  // console.log('grabSrstateData: ',JSON.stringify(payload))
  return{
    type: 'SRSTATE_CHANGED',
    payload
  }
})
const grabSchedData = qactionCreator((payload)=>{
  // console.log('grabSchedData: ',JSON.stringify(payload))
  return{
    type: 'SCHED_CHANGED',
    payload
  }
})
const readyState = qactionCreator((payload)=>{
  return{
    type: 'READY_STATE',
    payload
  }
})

export{grabSrstateData, grabSchedData, readyState}