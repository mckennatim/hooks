
# hooks
https://x-team.com/blog/rxjs-observables/

files using @mckennatim/mqtt-hooks

- App.jsx
- Control.jsx
- SchedMod.jsx
- 

## log
## 11-cascada-disc
touch and drag working on pc,android and iphone
## 10-setRelayStatus-useEffect
Created a `data.status` property onMessageArrived and watched that from Spot.jsx in a useEffect hook that runs whenever `data.status` changes.

Re-renders can happen either because props of a component change coming in from above or state changes by a hook. 

How when a prop changes can you use that change to change some local state?

One way is to have a function run on every re-render that listens for the prop change and then changes some local state.

BUT HERE IS THE RUB
When you change local state you cause a re-render. Since the prop you were listening for has maybe not yet changed back, then that function that runs on re-render goes infinite.

## 09-spot-onoff
cleaned up so spot only goes on and off. deployed

## 08-mqtt-hooks_utility4cascada

wtf does a  `add2sched` do????

```js
    const add2sched = (sched, nintvl, tzd_tza)=>{
      let i = 0
      let [hr, min ]= getNow(tzd_tza)
      const newsched = sched.reduce((acc, intvl, idx)=>{
        if(i==0){/*before the start of the new interval is processed */
          if(hm2m(intvl)<hm2m(last(acc))){ 
            acc.push(acc.pop().slice(0,2).concat(intvl.slice(2)))
              /*takes the first 2 entries of  the sched entry as minutes. If sched entry is less than now at init or last(acc) then it pop/push replaces the value. It keeps doing that (replacing the value) until it reaches a sched entry that is later than the last(acc)  */
          }else if(hm2m(intvl)>hm2m(last(acc))){ 
              /* if the current sched entry is for later than the last(acc) */
            if(hm2m(last(acc)) === hm2m(nintvl[i])){
                /*check if new entry[0??] time happens to equal last(acc)'s*/
              acc.push(acc.pop().slice(0,2).concat(nintvl[i].slice(2)))
            }else{
              acc.push(nintvl[0])
            }
            i+=1
          }
          if(sched.length==1){i+=1} /*like [[0,0,1]] */ 
        }
        if( i==1){/*add end of interval after the start of the interval is added */
          acc.push(nintvl[1])
          i+=1
        } 
        if(i==2){/*process the remainder of the sched */
          if(hm2m(intvl) > hm2m(nintvl[1])){/*once you have reduced past the end of the new interval add the remainder of the sched to acc*/
            const acctot = acc.concat(sched.slice(idx))
            i+=1 /*once i=3, the rest of the iterations through the sched are ignored */
            return acctot
          }
        }
        return acc
      }, [[hr, min]])
      return newsched
    }
```    

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