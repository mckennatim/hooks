import React from 'react'// eslint-disable-line no-unused-vars
import{useState, useEffect} from 'react'

const App = () =>{
  const [count, setCount] = useState(0);
  const [fruit, setFruit] = useState('banana');
  
  const doFruit =()=>{
    setFruit('apple')
  }

  setInterval(()=>{ setCount(count+1); }, 1000);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  return(
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
      <p>{fruit}</p>
      <button onClick={doFruit}>change fruit</button>
    </div>
  )
}

export{App}