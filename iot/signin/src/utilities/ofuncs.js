//var console = require('tracer').console();
import { Observable,from} from 'rxjs';// eslint-disable-line no-unused-vars
import {filter, map} from 'rxjs/operators';// eslint-disable-line no-unused-vars

const array = [1, 2, 3, 4, 5, 6]
const evenNumbers = from(array)
  .pipe(filter((x)=>x%2))

const isObservable = obs => obs instanceof Observable;

export{isObservable, evenNumbers}
