import { Subject, from } from 'rxjs'
import {scan, flatMap, startWith } from 'rxjs/operators'// eslint-disable-line no-unused-vars
import {rootReducer} from './reducers';
import { isObservable } from './utilities/ofuncs';

const action$ = new Subject();

const createStore = (initState) =>
  action$
    .pipe(
      flatMap((action) => isObservable(action) ? action : from([action])),
      startWith(initState),
      scan(rootReducer)
    )

const actionCreator = (func) => (...args) => {
  const action = func.call(null, ...args);
  action$.next(action);
  if (isObservable(action.payload))
    action$.next(action.payload);
  return action;
};

// function combineReducers(reducersObject) {
//   const keys = Object.keys(reducersObject);
//   //console.log(keys)
//   return (state = {}, action) => keys.reduce((currState, key) => {
//     const reducer = reducersObject[key];
//     return {
//       ...currState,
//       [key]: reducer(currState[key], action)
//     };
//   }, state);
// }

export{actionCreator, createStore}
