var Paho = require('paho.mqtt.js')
import {cfg, ls} from '../utilities/getCfg'
import {setKeyVal} from '../actions/responsive'


const client = new Paho.Client(cfg.mqtt_server, cfg.mqtt_port, cfg.appid+Math.random());
client.onConnectionLost =onConnectionLost;
client.onMessageArrived = onMessageArrived;  

const lsh = ls.getItem()

const connect=(devs)=>{
  console.log('devs: ', devs)
  client.connect({
    onSuccess: (()=>onConnect(devs)),
    onFailure: function (message) {
      console.log("Connection failed: " + message.errorMessage);
      //dmessage.innerHTML= "Connection failed: " + message.errorMessage;
    },
    useSSL: true,
    userName:lsh.email,
    password:lsh.token
  });
}

export{client, publish, connect, subscribe, onMessageArrived}

function onConnectionLost(responseObject){
  if (responseObject.errorCode !== 0) {
    console.log('Connection Lost ' + responseObject.errorMessage);
  }
}

function onMessageArrived(message){
  var topic = message.destinationName
  var pls = message.payloadString
  console.log(topic+ pls)
  setKeyVal({topic, pls})
}

function onConnect(devs){
  setKeyVal({qconn:true})
  var cmess = `Connected to ${cfg.mqtt_server} on port ${cfg.mqtt_port} `
  console.log(cmess);
  console.log('devs: ', devs)
 // publish('presence', 'Web Client is alive.. Test Ping! '); 
  subscribe(devs) 
  req(devs)
}

function req(devs){
  devs.map((dev)=>{
    publish(`${dev}/req`,'{"id":2,"req":"flags"}')
    publish(`${dev}/req`,'{"id":0,"req":"srstates"}')
    publish(`${dev}/req`,'{"id":1,"req":"progs"}')
  })
}

function publish(topic, payload){
  var message = new Paho.Message(payload);
  message.destinationName = topic;
  client.send(message)
} 

function subscribe(devs){
  devs.map((dev)=>{
    client.subscribe(`${dev}/srstate` , {onFailure: subFailure}) 
    client.subscribe(`${dev}/devtime` , {onFailure: subFailure}) 
    client.subscribe(`${dev}/timr` , {onFailure: subFailure}) 
    client.subscribe(`${dev}/sched` , {onFailure: subFailure}) 
    client.subscribe(`${dev}/flags` , {onFailure: subFailure}) 
  })
}

function subFailure(message){
  console.log('subscribe failure',message)
}