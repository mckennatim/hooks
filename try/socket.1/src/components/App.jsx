import React, {useState} from 'react'// eslint-disable-line no-unused-vars
import useSocket from '../../nod/src/index.js';


const App=()=>{
  //You can treat "useSocket" as "io"
  const [socket] = useSocket('https://socket-io-tweet-stream.now.sh');
  const [tweets, setTweet] = useState([]);  
  //connect socket
  socket.connect();

  //add event
  socket.on("tweet",(text)=>{
    console.log(text);
    setTweet([text, ...tweets])
  });

  //emit
  socket.emit('message','this is demo..');
  return tweets.length ? (
    <ul>
      {tweets.map(tweet => (
        <li key={tweet.id}>{tweet.text}</li>
      ))}
    </ul>
  ) : (
    <p>Actually waiting for the websocket server...</p>
  );

}

export{App}