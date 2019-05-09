import React, {useState} from 'react'// eslint-disable-line no-unused-vars

import { ClientSocket, useSocket } from "../../nod/src/index.js";

const Twitter = () => {
  const [tweets, setTweet] = useState([]);

  useSocket("tweet", newTweet =>
    setTweet([newTweet, ...tweets])
  );

  return tweets.length ? (
    <ul>
      {tweets.map(tweet => (
        <li key={tweet.id}>{tweet.text}</li>
      ))}
    </ul>
  ) : (
    <p>Actually waiting for the websocket server...</p>
  );
};

const App = () => (
  <ClientSocket url="https://socket-io-tweet-stream.now.sh">
    <Twitter />
  </ClientSocket>
);

export{App}