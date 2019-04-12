import { actionCreator } from '../rxred';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/dom/ajax';
import { map } from 'lodash';
import{fetchDevInfo} from '../services/fetches'


const setFocus = actionCreator((payload) => {
  return {
    type: 'SET_FOCUS',
    payload
  }
});
// const copySchedobj2store = actionCreator((payload) => {
//   //console.log('copying schedobj action')
//   // console.log('payload: ',JSON.stringify(payload))
//   return {
//     type: 'COPY_SCHEDOBJ',
//     payload
//   }
// });
const setDeviceType = actionCreator((payload) => {
  return {
    type: 'SET_DEVICE',
    payload
  }
});

const switchPage = actionCreator((payload) => {
  // console.log('switchPage payload: ',JSON.stringify(payload))
  // if(payload.name=='Edit'){
  //   loadDevInfo({dev:payload.params.dev})
  // }
  return {
    type: 'PAGE_SWITCHED',
    payload
  }
});


const loadDevInfo = actionCreator((payload)=>{
  // console.log(payload.dev)
  return {
    type: 'DEVINFO_LOADING',
    payload: fetchDevInfo(payload.dev)
      .then((devinf)=>{
        // console.log(devinf)
        devInfoLoaded(devinf)
      })
  }
})

const devInfoLoaded =actionCreator((payload)=>{
  return{
    type: 'DEVINFO_LOADED',
    payload    
  }
})

const loadGithubFollowers = actionCreator((payload) => {
  const url = `https://api.github.com/users/${payload}/followers`;
  return {
    type: 'GITHUB_FOLLOWERS_LOADING',
    payload: Observable.ajax(url)
      .map((xhr) => {
        console.log(xhr)
        return map(xhr.response, 'login')
      })
      .map((followers) => {
        console.log(followers)
        return({
          type: 'GITHUB_FOLLOWERS_LOADED',
          payload: followers
        })
      })
  };
});

export{loadGithubFollowers, setDeviceType,  switchPage, setFocus, loadDevInfo}