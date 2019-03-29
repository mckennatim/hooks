import React from 'react'// eslint-disable-line no-unused-vars
import{useState, useEffect, useRef} from 'react'

const App = () =>{
  const [count, setCount] = useState(0);
  const [delay, setDelay] = useState(1000);
  const [fruit, setFruit] = useState('banana');
  const [isRunning, setIsRunning] = useState(true);
  
  const doFruit =()=>{
    setFruit('apple')
  }

  useInterval (()=>{
    setCount(count+1);
  }, isRunning ? delay : null, 'count')

  useInterval (()=>{
    if (delay>200){
      setDelay(delay/2)
      //setIsRunning(true)
    }else{
      setIsRunning(false)
    }
  }, 1000, 'delay')

  return(
    <div>
      <p>delay:{delay}</p>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button><br/>
      <button onClick={() => setDelay(delay + 1000)}>
        Add Delay
      </button>
      <p>{fruit}</p>
      <button onClick={doFruit}>change fruit</button>
    </div>
  )
}

export{App}

function useInterval(callback, delay, wha) {
  const savedCallback = useRef();

  // Remember the latest function.
  useEffect(() => {
    savedCallback.current = callback;
  });

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      console.log('wha: ', wha)
      let id = setInterval(tick, delay);
      return () => {
        console.log('in callback', delay, wha)
        clearInterval(id)
      };
    }
  }, [delay]);
}

/*  from: https://overreacted.io/making-setinterval-declarative-with-react-hooks/
    version: 1 before being extracted as custom hook

const App = () =>{
  const [count, setCount] = useState(0);
  const [delay, setDelay] = useState(1000);
  const [fruit, setFruit] = useState('banana');
  
  const doFruit =()=>{
    setFruit('apple')
  }

  const savedCallback = useRef();
  function callback() {
    setCount(count + 1);
  }

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    let id = setInterval(tick, 1000);
    return () => {
      console.log('in callback: ')
      clearInterval(id);
    }
  }, []);

  return(
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button><br/>
      <button onClick={() => setDelay(delay + 1000)}>
        Add Delay
      </button>
      <p>{fruit}</p>
      <button onClick={doFruit}>change fruit</button>
    </div>
  )
}
*/