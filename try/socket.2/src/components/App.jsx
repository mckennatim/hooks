import React, {useState} from 'react'// eslint-disable-line no-unused-vars
import useSocket from '../../nod/src/index.js';

const cfg ={
    "superapp": "iot",
    "appid": "lightsoff",
    "mqtt_server": "services.sitebuilt.net/iotb/wss",
    "mqtt_port": 4333,
    "url": {
      "soauth": "https://services.sitebuilt.net/soauth",
      "api": "https://services.sitebuilt.net/iotex/api"
    },
    "cbPath": "#locs"
  }

const lsh={
  email: "mckenna.tim@gmail.com",
  token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhcHAiOiJsaWdodHNvZmYiLCJlbWFpbCI6Im1ja2VubmEudGltQGdtYWlsLmNvbSIsImxvYyI6IjEyUGFybGV5VmFsZSIsInJvbGUiOiJhZG1pbiIsImV4cCI6MTU1ODgxMTgzMzM3MX0.4R0HGXOCLBMjJZdl65Ep_WmiHF_HC3htsa0pz5RP0Nk"
}

const App=()=>{
  function onConnect(){
    var cmess = `Connected to ${cfg.mqtt_server} on port ${cfg.mqtt_port} `
    console.log(cmess);
    publish('presence', 'Web Client is alive.. Test Ping! '); 
    // subscribe(devs) 
    socket.subscribe(`CYURD004/timr` , {onFailure: ()=>console.log('failure: ')})
    // req(devs)
  }
  const [socket, publish] = useSocket(cfg.mqtt_server, cfg.mqtt_port, cfg.appid+Math.random());
  const [messages, setMessage] = useState([]);  
  //connect socket
  socket.connect({
    onSuccess: (()=>onConnect()),
    onFailure: function (message) {
      console.log("Connection failed: " + message.errorMessage);
      //dmessage.innerHTML= "Connection failed: " + message.errorMessage;
    },
    useSSL: true,
    userName:lsh.email,
    password:lsh.token  
  });

  socket.onConnectionLost= (responseObject)=>{
    if (responseObject.errorCode !== 0) {
      console.log('Connection Lost ' + responseObject.errorMessage);
    }
  }
  socket.onMessageArrived = (message)=>{
    var topic = message.destinationName
    var pls = message.payloadString
    console.log(topic+ pls)
    setMessage(messages.push(topic))
    console.log('messages: ', JSON.stringify(messages,2))
  }  
  return messages.length ? (
    <div>
      <p>dog</p>
    </div>
  ) : (
    <p>Actually waiting for the websocket server...</p>
  );

}

export{App}