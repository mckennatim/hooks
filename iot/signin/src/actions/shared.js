import { actionCreator } from '../rxred';

const setEdit = actionCreator((payload) => {
  return {
    type: 'SET_EDIT',
    payload
  }
});
const setKeyVal = actionCreator((payload) => {
  return {
    type: 'SET_KEY_VAL',
    payload
  }
});

export{setEdit, setKeyVal}