# sb-rxasred-vigo
##log

https://toddmotto.com/stateful-stateless-components
https://blog.risingstack.com/handling-react-forms-with-mobx-observables/
http://joebuschmann.com/react-by-example-stateless-functional-components/
### rewriting for paho
when device changed it should....
action should 
  type: DEVICE_CONNECTING
  payload: observe the stream then  
        type: DEVICE_LOADED
        payload: {loadedDevice: devId}



### senRel-page
#### architecture
*App* combined with actions/index controls conditional rendering of what occurs under the menu
### sb-iot_storeCopy
I would like to access the store$ or state from other parts of the app not within the DOM. Here's how. In `app.js` `theStore$` observable is created. `theStore$ =createStore(initState)` and is subscribed to by the app. Every time it changes the app re-renders. 

    const domRenderer = theStore$.subscribe((state)=>{
      copyStore(state)
      return ReactDOM.render(<App {...state} />, container)
    })

copyStore also runs
copyStore(props)` updates a `storeCopy` object in `../actions.index.js`

    var storeCopy = {route: {currentDevId: 'instorcopy'}}
    export const copyStore= (props)=>{
      storeCopy = props
    }

So now the store's `currentDevId` can be compared to the one coming from the url route param and disconnecting/reconnecting the mqtt client is avoided.

### fromMqttEvent
#### the problem
The mqttCon code connects to a device when the DevInf page is rendered ala:

    componentDidMount: function() {
      console.log('Devinf mounted')
      this.client = mqttCon(this.currentDev.id, this.props)
    }

so it can be disconnected 

    componentWillUnmount: function(){
      console.log('Devinf unmountd')
      this.client.publish('presence', 'Help, wants to close! ');
      this.client.end();    
    },

The problem with this approach is when you have a big display with both `Devices` and `DevInf` rendered, the mqtt client never reconnects to the right device and reinitialize the data.
#### the solution ->fromMqtt and the curried version fromMqtt$
A wrapper `mqttCon` to turn mqtt into an Subject, ie observer+observable. 

OK, so you've got 2x2 different things going on here. mqtt subscribes to the data coming out of the iot device and publishes commands from the frontend client to the iot device. fromMqtt makes the iot device data observable by the frontend app and acts as observer of the frontend app to see if it wants to send anything to the iotDevice. The frontend app subscribes to that observable to find out whats happening on the iot device and sends the subject data that it is observing via the `mqttCon.next()` callback

Most succinctly described by Łukasz Wojciechowski in [websockets-with-angular2-and-rxjs](https://medium.com/@lwojciechowski/websockets-with-angular2-and-rxjs-8b6c5be02fac#.ugs8kga01)

    function fromMqtt(connectObserver, url, devId){
      ...
      const observable = Observable.create (function (obs) {
        if (connectObserver) {
          client.on('connect', function () {
            ...
            connectObserver.next();
            connectObserver.complete();
      ...      

    const connectObserver = {
      next(value) {},
      error(err) {throw err;},
      complete() {}
    }          

This part of the `fromMqtt` function somehow works at making the observable wait for a mqtt connection before allowing the observer of `fromMqtt` to accept data from the frontend app. I don't know how it works.

The observable gets loaded with data whenever the mqqt client gets some

      client.on('message', function (topic, payload) {
        var pls = payload.toString()
        var plo = JSON.parse(pls)
        console.log(plo)
        obs.next({
          topic: topic,
          payload: plo
        })

since the frontend app subscribes to this Subject it gets the data whenever it arrives 

    mqttCon.subscribe(
      function (e) {
        console.log(e);//the data coming in from the observable 
      });

and when you put something in Subject.next it gets observed by fromMqtt and sent to be published by the mqtt client.

    mqttCon.next(`{\"id\":2,\"req\":\"flags\"}`)

    let observer = {
      next: (data)=>{
        ...          
        client.publish(req, data)
      }    

     mqtt                fromMqtt                 frontend app  
     .on('message') -> data made observable -> mqttCon.subscribe      
     client.publish <- observer.next(data) <- mqttCon.next(data)       

===== currying
const fromMqtt$ = (devId)=>fromMqtt(Observer, url, devId)

### sb-iot_flexbox+condrender
Flexbox does not depend on media queries. Combining it with javascript code for conditional rendering allows for the best of both worlds. 

#### conditional rendering

The devices and sizes are setup in `data/initstate initialBrowser`

    types: ['watch', 'phone', 'phoneL', 'tablet', 'tabletL', 'laptop'],
    sizes: [300, 500, 600, 800, 900, 1800],

A window Observer 

    Observable.fromEvent(window, 'resize')
      .debounceTime(300)
      .subscribe((e)=>setDeviceType(window.innerWidth));

fires a `setDeviceType` action$ to update `props.brow` in the `brow reducer`  The payload is the current device width which looks through and finds its place in the list of sizes and modifies state.brow with values for size and browser

    case 'SET_DEVICE':
      const ws = action.payload
      var idx
      var sum = state.sizes.reduce((prev, curr, i)=>{ 
        if(prev < ws && ws <= curr){idx = i}
        return curr 
      }, 0);  
      const bro = state.types[idx]   
      return {
        ...state, 
        size: action.payload,
        browser: bro
      }

`App` re-renders on change of browser by firing `showrts` which, given no conditional rendering data, returns an array of one element, the render function of the page string that gets placed in `state.route.rtpg`, 

    if(pageList.length==0){
      console.log('no pageList for this rtPage -> 1 screen ')
      const singleElement = React.createElement(cf[rtPage], props)
      elArr.push(singleElement)  

`cf[rtPage]` is `import * as cf from './index'` which is `export {Devices, Cat, Harry, DevInf, App, DeviceList, multi, panes}` from the index.js of the components directory. 

Here is where conditional rendering comes in. `components/idex.js` has two objects that you set up for conditional rendering. `panes` is an array aligned with `state.brow.types` that determines how many panes get displayed `[1,1,2,2,3,3]` for each browser type. `['watch', 'phone', 'phoneL', 'tablet', 'tabletL', 'laptop']`. `multi` tells you which pages todisplay and in what order depending on the device and `panes`. If there is no entry, then just the cf[rtpg] is rendered.

    const multi =[{pri:'Cat', mul:[
                    ['Cat', 'Harry'],
                    ['Harry', 'Cat', 'Devices']]
                   },
                  {pri:'Harry', mul:[
                    ['Harry', 'Cat'],
                    ['Cat', 'Harry', 'Devices']]
                   },
                  {pri:'DevInf', mul:[
                    ['Devices', 'Devinf'],
                    ['Devices', 'Devinf', 'Cat']]
                   }
                  ]

We previously know that if there is no `pageList` entry foe `rtpage` then it just renders `cf[rtpag]` . But if there is, then, given the number of panes you've allowed for a type, it checks if there is an `mul` entry whose for that number of panes. If not, again it just renders `cf[rtpag]`.

But if there is a a `mul` entry whose for that number of panes, then an element is creates for each of them and those elements are pushed into `elArr`

It seems you've got to be in the render function to be able to render each element of `elArr` which is the object returned by `showRt` and that's what 

      {showRt(props).map((el,i)=>{
        return <div className="content item-default" key={i}>{el}</div>
      })}

does.

#### flexbox

Flexbox needs a container with items in it. 

    .container {
      display: flex;
      flex-direction: row; /* generally better */
      flex-wrap: wrap;
      justify-content: center;
      align-content: stretch;
      align-items: stretch;
    }

    .item-default {
      margin: 10px;
      flex-grow: 0;
      flex-shrink: 0;
      flex-basis: 0;
    }  

When the panes squeeze or expand depends on `flex-basis` and `flex-grow` and `flex-shrink`

    .content {
      min-height:200px;
      background-color: green;
      flex-grow: 1;
      flex-shrink: 1; /*can shrink from 300px*/
      flex-basis: 225px;  
    }

A  menu header might stretch over the whole display

    .header{
      height: 100px;
      background-color: green;
      flex-grow: 1;
      flex-shrink: 0;
      flex-basis: 98%; 
    }

Here the classes are assigned to elements

    <div className="container">
      <div className="header item-default">
        { renderNav() }    
        <div id="menu">
          <a href="#/devices" data-navigo>devices </a>        
          <a href="#/cat" data-navigo>cat </a>        
          <a href="#/harry" data-navigo>harry </a>        
        </div>      
        <br />
      </div>
      {showRt(props).map((el,i)=>{
        return <div className="content item-default" key={i}>{el}</div>
      })}
    </div>

### sb-iot_cat-harry-if-phone
### sb-iot_devinf-obs-size
### sb-iot_devinf-pre-css
### sb-iot_DevInf-onmessage
What happens or should happen when user refreshes a devInf page or goes back to it from somewhere else. 

- send token to see if authorized
- get flags
- respond to messages

If any of that causes a state change then re-render. Re-rendering reruns `makeTimrMap` uses flag info to decide what timrs to display and formats the array of numbers into an array of objects 
### sb-iot-rxasred-vigo-2
todo - unpack state data as entries if table

## puzlles to solve
calling a react render function like `changePage(Harry)` changes the state by modifying rtpg changing it to the `Harry` react render function. The `Harry` has `props` that seem to be passed in by magic.

    export default function Harry(props) {
      const { isLoading, name, users, rtpg } = props;
      return (
        <div style={styles.outer}>
          { isLoading ?
            <p>Loading...</p> :
            <h1>{ name }</h1> }
          { renderUsers(users) }
          <button onClick={handleChangeName('Harry')} >Harry</button>
          <button onClick={handleChangeName('Sally')} >Sally</button>
          <br />
          <button className="button primary" onClick={handleLoadFollowers('ryardley')} > Load Followers</button>
        </div>
      );
    }
###solution
have the reducer handle it keeping a currentDev in state then just pass the props you need from state like this

    export default function Devinfo({name, currentDev}){
      console.log('in Devinfo')
      return(
        <div style={styles.outer}>
            <h4>in doDevinfo {name}</h4>
            {currentDev.name} <br/>
            {currentDev.id} <br/>
            {currentDev.desc}
        </div>
        )
    }



without params brings in props


sb rxjs as redux with routing by navigo

## based on rxjs as redux 

A simple effective Redux style framework using Rx https://github.com/ryardley/rxjs-as-redux

*This is an example of how you might create a simple Flux/Redux style framework using nothing other than [RxJS](http://reactivex.io/rxjs)*

http://rudiyardley.com/redux-single-line-of-code-rxjs/

#### on combining reducers
Ok so at the heart of things:

    action$.scan(reducer).subscribe(renderer) 

is cool. How might one combine reducers? I've been thinking I would need to do some kind of merge ala:    

from http://reactivex.io/rxjs/manual/tutorial.html#state-stores I see:

    var state = Rx.Observable.merge(
      increase,
      decrease,
      input
    ).scan((state, changeFn) => changeFn(state), {
      count: 0,
      inputValue: ''
    });

but I can't quite wrap my head around it

