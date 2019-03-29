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

const addPage = actionCreator((payload) => {
  return {
    type: 'ADD_PAGE',
    payload
  }
});

const removePage = actionCreator((payload) => {
  return {
    type: 'REMOVE_PAGE',
    payload
  }
});

export{setDeviceType,  switchPage, setFocus, addPage, removePage}