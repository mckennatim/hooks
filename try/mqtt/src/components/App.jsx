import React, {useContext, useEffect, useState} from 'react'// eslint-disable-line no-unused-vars
// var Paho = require('paho.mqtt.js')
import {cfg, ls} from '../utilities/getCfg'
//import { Context} from "../../nod/src/context";
import {ClientSocket, Context, monitorFocus, processRawMessage, useDevSpecs} from '../../nod/src/index'
// import { useRawMessage } from '../../nod/src/useRawMessage';
// import {connect,monitorFocus} from '../services/mq'
const lsh = ls.getItem()

//const devs = ['CYURD004', 'CYURD006']

const setupSocket=(client, devs, publish, subscribe, req, cb)=>{
  console.log('devs: ', devs)
  const thedevs = Object.keys(devs)
  const topics  = ['srstate', 'sched', 'flags', 'timr'] 
  console.log('thedevs: ', thedevs)
  publish(client, 'presence', 'doodle do de de')
  subscribe(client, thedevs, topics)
  req(client, thedevs, publish, topics )
  cb()
}

function req(client, devs, publish, topics){
  devs.map((dev)=>{
    topics.map((top, idx)=>publish(client, `${dev}/req`,`{"id":${idx},"req":"${top}"}`))
  })
}

function subscribe(client, devs, toparr){
  function subFailure(message){
    console.log('subscribe failure',message)
  }
  devs.map((dev)=>{
    toparr.map((top)=>client.subscribe(`${dev}/${top}` , {onFailure: subFailure}) )
  })
}

const Twitter = () => {
  const [client, publish] = useContext(Context);
  client.onMessageArrived= onMessageArrived

  const [amessage, setMessage]=useState('nada')
  const [state, dispatch] = useReducer(dataFetchReducer, {})

  const {devs, zones, binfo}= useDevSpecs(ls, cfg, client, (client, devs)=>{
    setupSocket(client, devs, publish, subscribe, req, ()=>console.log('in callback'))
  })
  
  function onMessageArrived(mess){
    const message = processRawMessage(mess)
    setMessage(JSON.stringify(message))
  }

  monitorFocus(window, client, lsh, ()=>{
    setupSocket(client, devs, publish, subscribe, req, ()=>console.log('in monitor callback'))
  })

  return (
    <div>
      <h1>hello Twiiter </h1>
      {amessage} <br/>
      <pre>{JSON.stringify(devs, null, 2)}</pre><br/>
      <pre>{JSON.stringify(zones, null, 4)}</pre> <br/>
      <pre>{JSON.stringify(binfo, null, 4)}</pre>
    </div>
  );
};

const App = () => (
  <ClientSocket cfg={cfg}>
    <Twitter />
  </ClientSocket>
);

export{App}

