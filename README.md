
# hooks


## log
## 08-mqtt-hooks_utility4cascada

## 07-cascada

### authentication process
signin gets a token  with appid signin from soauth. It uses that preliminary token to get a list of locations then a list of apps at that location

### 06-factor_out_mqtt-hooks

npm package @mckennatim/mqtt-hooks now being used

A custom package used by https://sitebuilt.net/qr/ to add Context provider and hooks to react apps that connect to esp8266 and esp32 based sensor/relays/timers. Applications can use any subset of sensors, relays and timers from one or more devices. Talks to both mqtt broker and to server providing application configuration for a particulr location and device owner. Uses apikey provided from authentication and location


### 05-try-mqtt-beta0
### 04-try-mqtt-messageReducer-mqtt.3
Now it is in the future npm /nod/proccessMessage.js. Got rid of the switch reducer and put `messageReducer` in the npm. Everything you will filter from the messages is determined by the initial state of fhe useState functions.
### 03-try-mqtt-subscribed
Most everything works with the code handling mqtt residing in what should become an npm library. 
`
    import {ClientSocket, 
      Context, 
      monitorFocus, 
      processRawMessage, 
      useDevSpecs,  
      processMessage, 
      getZinfo, 
      subscribe, 
      req} from '../../nod/src/index'
`

Besides the component you are using you need to `sertupSocket` and a `messageReducer` that updates the stae based upon which zones you need for that component

### 02try-mqtt-useDevSpecs
brought in useDevsSpecs which fetches from db and connects once.
### 01-try-mqtt
Got to the point where device data diplays in app. mqtt/

Trying to separated shit into a future node_module library. now it is in hooks/try/mqtt/nod and includes `import {ClientSocket, Context, connect, monitorFocus} from '../../nod/src/index'`

The setup has a provider(ClientSocket) instantiating a new Paho client that wraps around the Twitter. Twitter uses the Context for `const [client, publish] = useContext(Context);`. `useEffect` working as componentDidMount runs once calling `connect` from the library. The other thing in the library is `monitorFocus`. `setUpSocket, subscribe and req`  run outside the React but `processRawMessage` is inside so it can `setMessage` using useState.



npm i eslint eslint-loader eslint-plugin-import html-loader html-webpack-plugin clean-webpack-plugin --save-dev


## been read

https://www.valentinog.com/blog/webpack-tutorial/

https://overreacted.io/a-complete-guide-to-useeffect/

https://www.robinwieruch.de/react-hooks-fetch-data/

https://overreacted.io/react-as-a-ui-runtime/

https://overreacted.io/writing-resilient-components/

https://blog.bitsrc.io/6-tricks-with-resting-and-spreading-javascript-objects-68d585bdc83