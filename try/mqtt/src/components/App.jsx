import React, {useContext, useEffect, useState} from 'react'// eslint-disable-line no-unused-vars
// var Paho = require('paho.mqtt.js')
import {cfg, ls} from '../utilities/getCfg'
//import { Context} from "../../nod/src/context";
import {ClientSocket, Context, connect, monitorFocus} from '../../nod/src/index'
// import { useRawMessage } from '../../nod/src/useRawMessage';
// import {connect,monitorFocus} from '../services/mq'
const lsh = ls.getItem()

const devs = ['CYURD004', 'CYURD006']

const setupSocket=(client, publish, cb)=>{
  publish(client, 'presence', 'doodle do de de')
  subscribe(client, devs)
  req(client, devs, publish )
  cb()
}

function req(client, devs, publish){
  devs.map((dev)=>{
    publish(client, `${dev}/req`,'{"id":2,"req":"flags"}')
    publish(client, `${dev}/req`,'{"id":0,"req":"srstates"}')
    publish(client, `${dev}/req`,'{"id":1,"req":"progs"}')
  })
}

function subscribe(client, devs){
  function subFailure(message){
    console.log('subscribe failure',message)
  }
  devs.map((dev)=>{
    client.subscribe(`${dev}/srstate` , {onFailure: subFailure}) 
    // client.subscribe(`${dev}/devtime` , {onFailure: subFailure}) 
    // client.subscribe(`${dev}/timr` , {onFailure: subFailure}) 
    // client.subscribe(`${dev}/sched` , {onFailure: subFailure}) 
    // client.subscribe(`${dev}/flags` , {onFailure: subFailure}) 
  })
}

const Twitter = () => {
  const [amessage, setMessage]=useState('nada')
  
  function processRawMessage(mess){
    var narr = mess.destinationName.split('/')
    const dev = narr[0]
    const topic = narr[1]
    var pls = mess.payloadString
    console.log(topic+ pls)
    const payload= JSON.parse(pls)
    const message = {dev:dev, topic:topic, payload:payload}
    setMessage(JSON.stringify(message))
  }

  const [client, publish] = useContext(Context);
  client.onMessageArrived= processRawMessage
  useEffect(()=>{
    connect(client, lsh, ()=>setupSocket(client, publish, ()=>console.log('in callback')) )
    return ()=>client.disconnect() 
  },[])

  monitorFocus(window, client, lsh, ()=>setupSocket(client, publish, ()=>console.log('in monitor callback')))

  return (
    <div>
      <h1>hello Twiiter </h1>
      {amessage}
    </div>
  );
};

const App = () => (
  <ClientSocket cfg={cfg}>
    <Twitter />
  </ClientSocket>
);

export{App}

