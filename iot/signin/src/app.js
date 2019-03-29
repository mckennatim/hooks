import React from 'react'// eslint-disable-line no-unused-vars
import ReactDOM from 'react-dom';
import { Observable } from 'rxjs';
import {routing} from './routing'
import {App} from './components'// eslint-disable-line no-unused-vars
import { createStore } from './rxred';
import { log } from './utilities/wfuncs';
import {initState} from './store'
import {setDeviceType} from './actions/responsive'

window.onblur = ()=>{
    //setFocus({infocus: false})
}

Observable.fromEvent(window, 'resize')
  .debounceTime(600)
  .subscribe(()=>setDeviceType(window.innerWidth));

const container = document.getElementById('app');
createStore(initState)
  .do(log)
  .subscribe((state) =>{
    return ReactDOM.render(<App {...state} />, container)
  });

var router=routing()

export{router}
