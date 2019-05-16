import ProviderLib from "./provider";
import { processMessage as processMessageLib } from "./processMessage";
import { useDevSpecs as useDevSpecsLib} from './useDevSpecs'
import {Context}from './context'
import {connect, monitorFocus, subscribe, req} from './mq'

const processRawMessage= (mess)=>{
  var narr = mess.destinationName.split('/')
  const dev = narr[0]
  const topic = narr[1]
  var pls = mess.payloadString
  console.log(topic+ pls)
  const payload= JSON.parse(pls)
  const message = {dev:dev, topic:topic, payload:payload}
  return message
}

const getZinfo=(label,zones)=>zones.find((zone)=>zone.id==label)

const getDinfo=(label, devs)=>{
  let found = {}
  Object.keys(devs).map((dev)=>{
    devs[dev].map((a)=>{
      if(a.label==label){
        found.dev = dev
        found.sr = a.sr
        found.label= a.label
        return found
      }
    })
  })
  return found
}


export const ClientSocket = ProviderLib;
export const processMessage = processMessageLib;
export const useDevSpecs = useDevSpecsLib
export {Context, connect, monitorFocus, processRawMessage, getZinfo, getDinfo, subscribe, req}