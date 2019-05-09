import { useState, useEffect } from "react";
var Paho = require('paho.mqtt.js')



const useSocket = (...args) => {
  function publish(topic, payload){
    var message = new Paho.Message(payload);
    message.destinationName = topic;
    socket.send(message)
  }
  const [socket, setSocket] = useState(
    new Paho.Client(...args)
  );
  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, [socket]);
  return [socket, publish, setSocket];
};

export default useSocket;