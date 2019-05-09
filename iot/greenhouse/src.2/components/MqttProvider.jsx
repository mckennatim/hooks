import React, { useEffect, useState } from 'react'
var Paho = require('paho.mqtt.js')
import MqttContext from '../contexts/MqttContext'
import {cfg, ls} from '../utilities/getCfg'
const lsh = ls.getItem()

const MqttProvider = (props) => {
  const [isConnected, setConnected]=useState(false)
  let errorMessage=''
  const client = new Paho.Client(cfg.mqtt_server, cfg.mqtt_port, cfg.appid+Math.random());
  useEffect(() => { 
    console.log('dog is dead')
    client.connect({
      onSuccess: (()=>{
        console.log('in on success')
        setConnected(true)
        return isConnected
      }),
      onFailure: function (message) {
        errorMessage = "Connection failed: " + message.errorMessage
        setConnected(false)
      },
      useSSL: true,
      userName:lsh.email,
      password:lsh.token
    }) 
  }, [])
  console.log('isConnected: ', isConnected)
  return (
    <MqttContext.Provider value={{client:client, isConnected: isConnected, errorMessage:errorMessage}}>
      { props.children }
    </MqttContext.Provider>
   )
 }


export default MqttProvider