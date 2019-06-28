import React, {useState}from 'react'// eslint-disable-line no-unused-vars


var centx =170
var centy = 200
var centr =100
var pi=Math.PI

const App= () => {
  const[hasCapture, setHasCapture]=useState(false)
  const[knobx, setKnobx ] = useState(80)
  const[knoby, setKnoby ] = useState(80)
  const[isDragging, setIsDragging ] = useState(false)
  const[prevx, setPrevx]=useState(0)
  const[prevy, setPrevy]=useState(0)

  const onDown = event => {
    setIsDragging(true);
    event.target.setPointerCapture(event.pointerId);
    extractPositionDelta(event);
  };

  const onMove = event => {
    if (!isDragging) {
      return;
    }
    const {left, top} = extractPositionDelta(event);
    setKnobx(knobx+left)
    setKnoby(knoby+top)
  };

  const onUp = () => setIsDragging(false);
  const onGotCapture = () => setHasCapture(true);
  const onLostCapture = () =>setHasCapture(false);

  const extractPositionDelta = event => {
    const left = event.pageX;
    const top = event.pageY;
    const delta = {
      left: left - prevx,
      top: top - prevy,
    };
    setPrevx(left);
    setPrevy(top);
    return delta;
  };

    const boxStyle = {
      border: '1px solid #d9d9d9',
      margin: '10px 0 20px',
      minHeight: 400,
      width: '100%',
      position: 'relative',
    };

    const styles={
      svg: {
        stroke: 'blue',
        fill: hasCapture ? 'yellow' : 'white',
      },
      inner:{
        cx: centx,
        cy: centy,
        r: 100,
        fill: 'none',
        stroke: 'blue',
        strokeWidth: 5,
        padding: "10px"
      },
      knob:{
        r:12,
        fill:hasCapture ? 'pink' : 'yellow',
        stroke:"red",
        strokeWidth:3,
        padding: "40px"
      }
    }

    return (
      <div style={boxStyle}>
        <svg id="svg" width="342" height="420" xmlns="http://www.w3.org/2000/svg" version="1.1" >
          <rect style={styles.svg} id ="rect" x="1" y="1" width="340" height="400" fill="none" stroke="red" strokeWidth="5" />
          <circle style={styles.inner} id="inner"  /> 
          <circle 
            style={styles.knob} 
            id="knob"  
            cx={knobx}
            cy={knoby}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            onGotPointerCapture={onGotCapture}
            onLostPointerCapture={onLostCapture}
          /> 
        </svg> 
      </div>
    );

}

export{App}