import { actionCreator } from '../rxred';

const setFocus = actionCreator((payload) => {
  return {
    type: 'SET_FOCUS',
    payload
  }
});
const setDeviceType = actionCreator((payload) => {
  return {
    type: 'SET_DEVICE',
    payload
  }
});

const switchPage = actionCreator((payload) => {
  return {
    type: 'PAGE_SWITCHED',
    payload
  }
});

export{setDeviceType,  switchPage, setFocus}