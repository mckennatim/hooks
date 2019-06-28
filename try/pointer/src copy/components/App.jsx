import React, {useState}from 'react'// eslint-disable-line no-unused-vars


const CIRCLE_SIZE = 85;

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

    const circleStyle = {
      width: CIRCLE_SIZE,
      height: CIRCLE_SIZE,
      borderRadius: CIRCLE_SIZE / 2,
      position: 'absolute',
      left: knobx,
      top: knoby,
      backgroundColor: hasCapture ? 'blue' : 'green',
      touchAction: 'none',
    };

    return (
      <div style={boxStyle}>
        <div
          style={circleStyle}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onGotPointerCapture={onGotCapture}
          onLostPointerCapture={onLostCapture}
        />
      </div>
    );

}

export{App}