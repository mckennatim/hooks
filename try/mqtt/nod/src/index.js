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


export const ClientSocket = ProviderLib;
export const processMessage = processMessageLib;
export const useDevSpecs = useDevSpecsLib
export {Context, connect, monitorFocus, processRawMessage, getZinfo, subscribe, req}