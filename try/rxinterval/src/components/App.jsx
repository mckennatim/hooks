import React from 'react'// eslint-disable-line no-unused-vars
import { useObservable } from "rxjs-hooks";
import { interval } from "rxjs";
import { map } from "rxjs/operators";

const App = () =>{
  const value = useObservable(() => interval(500).pipe(map(val => val * 3)));

  return (
    <div className="App">
      <h1>Incremental number: {value}</h1>
    </div>
  );
}

export{App}
