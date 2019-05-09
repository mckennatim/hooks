import { useEffect } from "react";
var Paho = require('paho.mqtt.js')
import {cfg, ls} from '../utilities/getCfg'

const lsh = ls.getItem()

const usePaho = () => {
  function publish(topic, payload){
    var message = new Paho.Message(payload);
    message.destinationName = topic;
    socket.send(message)
  }
  const socket= new Paho.Client(cfg.mqtt_server, cfg.mqtt_port, cfg.appid+Math.random())
  
  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, [socket]);
  return [socket, publish];
};

const useSocket=()=>{
  const[socket, publish]= usePaho

  const connect=(devs)=>{
    console.log('devs: ', devs)
    socket.connect({
      onSuccess: (()=>{
        var cmess = `Connected to ${cfg.mqtt_server} on port ${cfg.mqtt_port} `
        console.log(cmess);
      }),
      onFailure: function (message) {
        console.log("Connection failed: " + message.errorMessage);
        //dmessage.innerHTML= "Connection failed: " + message.errorMessage;
      },
      useSSL: true,
      userName:lsh.email,
      password:lsh.token
    });
  }
  return [socket, publish, connect]
}

const useMessage=()=>{

}

export {usePaho, useSocket, useMessage}