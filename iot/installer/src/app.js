import React from 'react'// eslint-disable-line no-unused-vars
import ReactDOM from 'react-dom';// eslint-disable-line no-unused-vars
import { fromEvent } from 'rxjs';
import {debounceTime, tap} from 'rxjs/operators'
import {routing} from './routing'
import {App} from './components' // eslint-disable-line no-unused-vars
import { createStore } from './rxred';
import { log } from './utilities/wfuncs';
import {initState} from './store'
import {setDeviceType, setFocus} from './actions/responsive'
// import {setFocus} from './services/qactions'

window.focus()

window.onblur = ()=>{
    setFocus({infocus: false})
}

window.onfocus = ()=>{
    setFocus({infocus: true})
}

fromEvent(window, 'resize')
  .pipe(
    debounceTime(600),
  ).subscribe(()=>setDeviceType(window.innerWidth))

const container = document.getElementById('app');

let store1 = createStore(initState)
//console.log(store1)

store1
.pipe(
  tap(log)
).subscribe((state) =>{
  // eslint-disable-next-line react/no-render-return-value
  return ReactDOM.render(<App {...state} />, container)
});

var router=routing()

export{router}
