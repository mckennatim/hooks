//var console = require('tracer').console();
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from'; // eslint-disable-line no-unused-vars
import {filter} from 'rxjs/add/operator/filter';// eslint-disable-line no-unused-vars
import {map} from 'rxjs/add/operator/map';// eslint-disable-line no-unused-vars

const array = [1, 2, 3, 4, 5, 6]
const evenNumbers = Observable.from(array)
  .filter(x => {
    return x % 2===0
  })

const isObservable = obs => obs instanceof Observable;

export{isObservable, evenNumbers}
