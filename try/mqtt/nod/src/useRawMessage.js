// import { useEffect, useState, useContext} from "react";
// var Paho = require('paho.mqtt.js')
// import {useSocket} from './useSocket'
// import {Context} from './context'
// import {ls} from '../../src/utilities/getCfg' 
// const lsh = ls.getItem()

// const [message, setMessage]= useState('')

export function useRawMessage() {
  // const [client, dog] = useContext(Context);
  // const [socket, setSocket]=useState(client)
  // if(!socket.isConnected()){
  //   const socket= useSocket(lsh)
  //   setSocket(socket)
  // }
  // function publish(topic, payload){
  //   var message = new Paho.Message(payload);
  //   message.destinationName = topic;
  //   socket.send(message)
  // }
  // if(socket.isConnected()){
  //   var cmess = `Connected to DOG  on port 39 `
  //   console.log(cmess);
  //   publish('presence', cmess)
  //   const dev = 'CYURD004'
  //   socket.subscribe(`${dev}/srstate` , {onFailure: subFailure})
  //   publish(`${dev}/req`,'{"id":0,"req":"srstates"}')
  // }
  // useEffect(() => {
  //   socket.onMessageArrived=(mess)=>{
  //     var narr = mess.destinationName.split('/')
  //     const dev = narr[0]
  //     const topic = narr[1]
  //     var pls = mess.payloadString
  //     const tw =(`${dev}/${topic} ${pls}`)
  //     console.log('tw: ', tw)
  //     setMessage(tw)
  //   }
  // });  
  // return message
  
}


// function subFailure(message){
//   console.log('subscribe failure',message)
// }