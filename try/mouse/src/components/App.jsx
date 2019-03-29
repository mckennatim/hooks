import React from 'react'// eslint-disable-line no-unused-vars
import{useState, useEffect} from 'react'

const App = () =>{
  const position = useMousePosition();

  return (
    <div>
      {position.x}:{position.y}
    </div>
  );
};

export{App}

//https://codedaily.io/tutorials/60/Create-a-useMousePosition-Hook-with-useEffect-and-useState-in-React

const useMousePosition = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const setFromEvent = e => setPosition({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", setFromEvent);

    return () => {
      window.removeEventListener("mousemove", setFromEvent);
    };
  }, [setPosition]);

  return position;
};

