import React, {useState, useEffect} from 'react'

var centx =170
var centy = 200
var inr =100
var outr =140
var pi=Math.PI
var sched = [[0,0,0],[9,10,1],[9,40,0],[17,0,1],[17,50,0]]

const Disc =()=>{

  const[hasCapture, setHasCapture]=useState(false)
  const[knobx, setKnobx ] = useState(270)
  const[knoby, setKnoby ] = useState(200)
  const[hrmin, setHrmin] = useState('0:0')
  const[pointerType, setPointerType] = useState('touch')

  const dec2hrmin=(dec)=>{
    const min = Math.floor(dec%1*60)
    const hr = Math.floor(dec)
    return `${hr}:${min}`
  }

  useEffect(()=>{
    function detectInputType (e){
      absorbEvent(e)
      setPointerType(e.pointerType)
      console.log('e.pointerType: ', e.pointerType)
      window.removeEventListener('pointerdown', detectInputType);
    }
    window.addEventListener("pointerdown", detectInputType, {passive:false});
    return () => {
      window.removeEventListener('pointerdown', detectInputType);
    }
  },[])

  const sched2svg = (sched)=>{
    return sched
  }
  sched2svg(sched)
  console.log('sched2svg(sched): ', JSON.stringify(sched2svg(sched)))

  const styles={
    div:{
      touchAction:'none'
    },
    svg: {
      stroke: 'blue',
      fill: hasCapture ? 'yellow' : 'white',
    },
    inner:{
      cx: centx,
      cy: centy,
      r: inr,
      fill: 'none',
      stroke: 'blue',
      strokeWidth: .5,
    },
    outer:{
      cx: centx,
      cy: centy,
      r: outr,
      fill: 'none',
      stroke: 'blue',
      strokeWidth: .5,
    },
    knob:{
      r:hasCapture ? 14 : 10,
      fill:hasCapture ? 'pink' : 'yellow',
      stroke:"red",
      strokeWidth:3,
    }
  }

  const handleStart=(e)=>{
    setHasCapture(true)
    absorbEvent(e)
    console.log(e.type)
  }

  const handleMove=(ev)=>{
    absorbEvent(ev)
    if(hasCapture){
      var e
      if(pointerType=="mouse"){
        e= ev
      }else{
        e=ev.touches[0]
      }
      const tx = Math.round(e.pageX)
      const ty = Math.round(e.pageY)
      const dx = tx-centx
      const dy = ty-centy
      const mrad = calcAng(dy,dx) 
      const nx =  (inr*Math.cos(mrad)+centx).toFixed(1)
      const ny = (inr*Math.sin(mrad)+centy).toFixed(1)
      const hr = (24-mrad*3.819719).toFixed(1)
      setKnobx(nx)
      setKnoby(ny)
      setHrmin(dec2hrmin(hr))
    }
  }

  const handleEnd=(e)=>{
    absorbEvent(e)
    setHasCapture(false)
  }

  const renderSVG=()=>{
    return(
      <div>
        <svg id="svg" 
          width="342" 
          height="420" 
          xmlns="http://www.w3.org/2000/svg" version="1.1"
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          >
          <rect style={styles.svg} id ="rect" x="1" y="1" width="340" height="400" fill="none" stroke="red" strokeWidth="5" />
          <circle style={styles.inner} id="inner"  /> 
          <circle style={styles.outer} id="outer"  /> 
          <circle 
            style={styles.knob} 
            id="knob"  
            cx={knobx}
            cy={knoby}
            onTouchEnd={handleEnd}
            onTouchMove={handleMove}
            onTouchStart={handleStart}
            onMouseDown={handleStart}
            //onMouseMove={handleMove}
            
          /> 
        </svg>  
      </div>
    )
  }

  return(
    <div id="odiv" style={styles.div}>
      {renderSVG()}
      {pointerType} {hrmin} 
      <button>start</button><button>end</button>
    </div>
  )
}

export{Disc}

function calcAng(dy,dx){
  var ang
  if(dx==0){
    dy>0 ? ang=pi/2 :ang=3*pi/2
  }else{ang=Math.atan(dy/dx)}
  if(dx>0 && dy<0){
    ang=ang+2*pi
  }else if (dx<0){
    ang=ang+pi
  }
  return ang
}

function absorbEvent(event) {
  var e = event || window.event;
  e.preventDefault && e.preventDefault();
  e.stopPropagation && e.stopPropagation();
  e.cancelBubble = true;
  e.returnValue = false;
  return false;
}