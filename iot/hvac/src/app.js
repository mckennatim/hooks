import ReactDOM from 'react-dom';
import React from 'react'
import { fromEvent } from 'rxjs';
import {setDeviceType} from './actions/responsive'
import {debounceTime,tap} from 'rxjs/operators'
import { createStore } from './rxred';
import { log } from './utilities/wfuncs';
import {initState} from './store'
import {routing,routes} from './routing'
import {setPageProps} from '../src/actions/responsive'

fromEvent(window, 'resize')
  .pipe(
    debounceTime(600),
  ).subscribe(()=>setDeviceType(window.innerWidth))

import {App} from './components'

// let state={dog:'Ulysses'}
const container = document.getElementById('app');

createStore(initState)
  .pipe(
    tap(log)
  )
  .subscribe((state) =>{
    // eslint-disable-next-line react/no-render-return-value
    return ReactDOM.render(<App {...state} />, container)
  });

  var router=routing()

  const nav2 = (name, prups, qry)=>{
    console.log('name: ', name)
    const rt = routes.filter((r)=>r.page==name)
    // console.log('prups: ', JSON.stringify(prups))
    setPageProps(prups)
    const navstr = qry ? `/${rt[0].path}?${qry}` : `/${rt[0].path}`
    router.navigate(navstr)
  }

  export{router, nav2}

