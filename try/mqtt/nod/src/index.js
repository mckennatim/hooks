import ProviderLib from "./provider";
import { useSocket as useSocketLib } from "./useSocket";
import { useDevSpecs as useDevSpecsLib} from './useDevSpecs'
import {Context}from './context'
import {connect, monitorFocus} from './mq'

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


export const ClientSocket = ProviderLib;
export const useSocket = useSocketLib;
export const useDevSpecs = useDevSpecsLib
export {Context, connect, monitorFocus, processRawMessage}