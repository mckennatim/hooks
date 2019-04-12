import { Subject, from } from 'rxjs'
import {scan, flatMap, startWith } from 'rxjs/operators'// eslint-disable-line no-unused-vars
import { isObservable } from './utilities/ofuncs';
import {rootReducer} from './reducers';
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


export{actionCreator, createStore}