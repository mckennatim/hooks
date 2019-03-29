import React from 'react'// eslint-disable-line no-unused-vars
import{useState, useEffect} from 'react'

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(co=>co + 5);
    }, 1000);
    console.log('id: ', id)
    return () => clearInterval(id);
  }, []);

  return (
    <div onClick={() => setCount(count + 1)}>
      <h1>{count}</h1>;
      Parent clicked {count} times
      <Child />
    </div>
  )
}


function Child() {
  let [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Child clicked {count} times
    </button>
  );
}

export{App}

