
# hooks
## questions
Why does double control no longer work

https://x-team.com/blog/rxjs-observables/

Does the pcb work?
Yes if you leave out the diode. Why? not sure

Why does srstate publish from device when nothing has changed?

Somehow a cicuit connected to the pin matters.

cmd works. What's up with Sched? Actually for [[0,0,1]] it does change srstate darr[1] but it doesn't publish a new state (so app never knows about it). For [[0,0,0]] it does change srstate darr[0] and then it keeps publishing like for all darr[0] srstates
   


When Pkt: CYURD004/cmd {"id":3,"sra":[1]} is sent srstates do not repeat but when CYURD004/cmd {"id":3,"sra":[0]} srstate keeps publishing even with no change


What files using @mckennatim/mqtt-hooks in cascada?
- App.jsx
- Control.jsx
- SchedMod.jsx
- Pond.JSX
- Spot.jsx
- Config.jsx

Where is app name kept?  
- in denv.json

## log 

## 18-hvac
HVAC is based upon greenhouse. It uses a local mqtt-hooks and has made a couple of changes to that. `processMessage` no longer has a `zones` parameter. `bigstate` is a poorly named parameter that tells mqtt-hooks which sensors and which sensor keys the local app wants to pay attention to. The others just fly by.

`Zone` is another component (besides Control) that uses the mqtt `Context`. it connects when the component mounts using  `useEffect`. once connected it subscribes and `setUpSocket`

`monitorFocus` also connects or not depending if the page is `focused` or `blurred`. It's callback also then `setUpSocket`.

The best thing that changed from `cascada` is getting rid all the `case` statements in `onMessageArrived`. At the same time both `Control` and `Zone` are using useReducer instead of useState. So now `onMessageArrived` just dispatches an action of type sensorname and payload the mqtt payload. The reducer just updates the relavant part of state, leaving the rest as is.

## 17-hvac-blank

## 16-ZoneTimer-Draw2-Draw3
Modified the originally digital ZoneTimer and themodule to have Zonetimer work for analog values of hilimit and lolimit used in temperature, humidity... type sensors as well.

There were a number of hackky steps involved.

`dif` and `difrange` were added as props parameters, `dif` is the default difference between hilimit and lolimit. `difrange` give the max of possible values of `dif` you can choose in the now apearing `DiffSlider`

Some were in rendering differently. On every render `isdiff` is set as `asched[0].length>3 ? true : false`. That is used on line ~303 in `renderSVG` where `{isdiff && <text x="20" y="53">{temp+diff/2}-{temp-diff/2}</text>}` to show a range instaed of a single value. It is also used in `renderSVGsched` and anywhere `r` is set like in line ~243 `let r = isdiff ? tm.v2r((s[2]+s[3])/2) : tm.v2r(s[2])` and line ~340 in `renderDiffSlider`
      

In `handleMove` where the device value is turned into an SVG radius value. When isdiff then `r` is an average of the hilimit and lolimit values.

    if (isdiff){
      r  = tm.v2r((sched[sidx][2]+sched[sidx][3])/2)
    }

In `butStart` when adding a new interval `butStart` creates a 20 minute interval. `tm.createInterval` gets `isdiff` as a parameter and changes the process of creating an interval by pushing two values instead of one onto the new interval

`butDelete` has a number of cases to consider. 

* For both analog and digital deleting the `first interval` deletes the [0,0,x,? ] entry and replaces the hour, min of the new first entry with 0,0.
* If you are deleting the `last interval` then you just delete 1, the one before it will now run til 23:59:59
* Otherwise (for the in between cases) 
  * for digital where the previous interval always equals the following interval always delete two schedule entries
  * for analog if the hilimit and lolomit values of the interval before are the same as those of the interval after then you delete 2 entries otherwise you just delete one
* The last case is if the interval you are deleting is the only interval. It has to be replaced with something. For digital it is repalced by range[0] which is 0. For analog it is replaced by `[0,0,midrange+diff/2,midrange-diff/2]`

`tm.replaceInterval` got changed a lot both to accomodate analog and to fix the common problem of what happens when you are adding an interval and you sweep past a subsequent change (into the next + next interval). `replaceInteval` fires from `handleMove` when `isout`, that is when you are in the process of adding a new interval and are moving around from the 20 minute default start. The desired behavior has the sweep vacuuming up any old values and overiding them leavin only a new swept schedule. Some of what happened was to prevent idx=-1 not found values from causing errors. That is why you now see a bunch of `if(idx>=0 &&... `. That shouldn't happen anyway so this is a HACK that might already be fixed upriver. As soon as you have run into the next interval so that `hrXmin(sched[idx])>hrXmin(sched[idx+1]` you have to revise sched[idx] AND interval[1] with the values (analog or digital) from the idx+1 interval leaving the sched[idx] hr and min alone. Then you get rid of sched[idx+1] (and reduce the idx). Finally, if the values (of the new current sched[newidx] are the same as the ones you are sweeping over sched[newidx+1] then you can get rid of that next sched so you can go one sweeping any where you want forward. Once you are out of the function then you set the new values for sched, interval and sidx.

oh dog


## 15-cascada-control-sched-ZoneTimer
ZoneTimer now works with cascada. When in ZoneTimer and you hit save the prop function `onClick={props.retNewSched(sched)}>save<` sends it to setNewSched in SchedMod component which runs `nav2(ret2page, {locdata, sched}, query)()` which puts locdata and sched in cambio.page.prups and navigates to ret2page which takes its value from prups.from which got set to `Control` on the way to SchedMod from Pond.

Once back in `Control`, the app reconnects to the mqtt client and gets fresh data from the device. At the same time updateFrom() runs and if the hash is like `#/control?pond` then it prepares to send the new schedule to the device. It waits a couple of secondes until the current schedules come in over the line and then publishes the new CYURD002/prg.pro to the device. Once activated on the device, the new schedule is then published by the device (CYURD002/sched). That gets parsed by `mqtt-hooks` and a message arrives with ponds new schedule which causes a rerender of Pond.

It looks like a success. One control instead of 2. One codebase for both analag and digital ZoneTimers.

## 14-cascada-draw2b
for temp, now to generalize and create an api

## 13-cascada-drawB
still a mess with lots of global variables and functions. on to draw2 for temp.

## 12-cascada-draw
`renderSVGsched` takes a schedule array and creates an svg image of that schedule. It reduces the schedarray to another array that creates a set of intervals. It is still hacky

`renderSchedList` also reduces the schedarray to another array that creates a set of intervals

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