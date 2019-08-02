import React, {useState, useEffect} from 'react'

var centx =170
var centy = 200
var inr =100
var outr =140
var pi=Math.PI
var asched = [[0,0,0],[9,10,1],[10,40,0],[16,0,1],[17,50,0]]

const Draw =()=>{

  const[hasCapture, setHasCapture]=useState(false)
  const[knobx, setKnobx ] = useState(270)
  const[knoby, setKnoby ] = useState(200)
  const[hrmin, setHrmin] = useState('0:0')
  const[pointerType, setPointerType] = useState('touch')
  const[isout, setIsOut]= useState(false)
  const [sched,setSched]=useState(asched)
  const [interval, setInterval]=useState([])

  // drawSched(sched)
  

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
  // console.log('sched2svg(sched): ', JSON.stringify(sched2svg(sched)))

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
    },
    g:{
      stroke: "#000",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: 5,
      fill: "none" 
    }
  }

  const renderSVGsched=(schedarr)=>{// eslint-disable-line 
    const sa = schedarr.reduce((acc,s,i)=>{
      const r =s[2]==0 ? inr : outr
      const xy = time2xy([s[0]*1,s[1]*1], r)
      const str = `<path d="M${xy[0]} ${xy[1]} A${r} ${r}`
      const dstr = `M${xy[0]} ${xy[1]} A${r} ${r}`
      const no = {r:s[2], s:[s[0],s[1]],g:str, d:[dstr] }
      if(i>0){
        acc[i-1].e=[s[0],s[1]]
        
        const xye = time2xy([s[0]*1,s[1]*1], acc[i-1].r==0 ? inr : outr)
        const xyl = time2xy([s[0]*1,s[1]*1], r)
        let gm = acc[i-1].g
        let d1 = acc[i-1].d[0]
        gm=`${gm} 0 0,0 ${xye[0]} ${xye[1]}"></path>`
        d1=`${d1} 0 0,0 ${xye[0]} ${xye[1]}`
        let np = `<path d="M${xye[0]} ${xye[1]} L${xyl[0]} ${xyl[1]}"></path>`
        let d2 = `M${xye[0]} ${xye[1]} L${xyl[0]} ${xyl[1]}`
        gm=`${gm} ${np}`
        acc[i-1].g=gm
        acc[i-1].d[0]=d1
        acc[i-1].d[1]=d2
      }
      if(i==schedarr.length-1){
        no.e=[0,0]
        const xyee = time2xy([0,0], r)
        let gm2 = no.g
        let d2 = no.d[0]
        d2=`${d2} 0 0,0 ${xyee[0]} ${xyee[1]}`
        gm2= `${gm2} 0 0,0 ${xyee[0]} ${xyee[1]}"></path>`
        // console.log('gm2: ', gm2)
        no.g=gm2
        no.d[0]=d2
      }
      acc[i]=no
      return acc
    },[])
    return(
      <g style={styles.g}>
        {sa.map((s,i)=>
          <g key={i}>
          <path d={s.d[0]} ></path>
          {s.d[1] && <path d={s.d[1]} ></path>}
          </g>
          )}
      </g>
    )
  }

  const renderShedList=(schedarr)=>{
    const sa = schedarr.reduce((acc,s,i)=>{
      const intvl = [[s[0],s[1]]]
      if(i>0){

      }
      if(i==schedarr.length-1){

      }
    },[])
  }

  const schedSVG=renderSVGsched(sched)

  const handleStart=(e)=>{
    setHasCapture(true)
    absorbEvent(e)
    // console.log(e.type)
    // console.log('knobx, knoby: ', knobx, knoby)
    // console.log('e.pageX, e.pageY: ', e.pageX, e.pageY)
    // console.log('e.screenX, e.screenY: ', e.screenX, e.screenY)
  }

  const handleMove=(ev)=>{
    let rad = isout ? outr : inr
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
      // const dx = tx-centx
      // const dy = ty-centy
      const mrad = calcAngle(ty,tx) 
      const nx =  (rad*Math.cos(mrad)+centx).toFixed(1)
      const ny = (rad*Math.sin(mrad)+centy).toFixed(1)
      const hr = (24-mrad*3.819719).toFixed(1)
      setKnobx(nx)
      setKnoby(ny)
      setHrmin(dec2hrmin(hr))
      if(isout){
        console.log('isout: ', isout)
        const idx = sched.findIndex((s)=>{
          return interval[1][0]==s[0] && interval[1][1]==s[1]
        })
        console.log('idx: ', idx)
        console.log('hrmin: ', hrmin)
        const nsched = replaceInterval(sched, hrmin, idx)
        console.log('nsched: ', nsched)
        console.log('JSON.stringify(sched): ', JSON.stringify(sched))
      }
    }
  }

  const handleEnd=(e)=>{
    absorbEvent(e)
    setHasCapture(false)
  }

  const butStart=()=>{
    console.log('but start')
    console.log('hrmin2arr(hrmin): ', hrmin2arr(hrmin))
    console.log('createInterval(hrmin, 20): ', createInterval(hrmin, 20))
    const intvl=createInterval(hrmin, 20)
    setInterval(intvl)
    const nsched =insertInterval(intvl, sched)
    console.log('nsched: ', JSON.stringify(nsched))
    setSched(nsched)
    const mrad = calcAngle(knoby,knobx) 
    const nx =  (outr*Math.cos(mrad)+centx).toFixed(1)
    const ny = (outr*Math.sin(mrad)+centy).toFixed(1)
    setIsOut(true)
    setKnobx(nx)
    setKnoby(ny)
  }

  const butEnd = ()=>{
    console.log('but end')
    const mrad = calcAngle(knoby,knobx) 
    const nx =  (inr*Math.cos(mrad)+centx).toFixed(1)
    const ny = (inr*Math.sin(mrad)+centy).toFixed(1)
    setIsOut(false)
    setKnobx(nx)
    setKnoby(ny)
  }

  const showXY=()=>{
    const hm = hrmin.split(":")
    const xyarr=time2xy([hm[0]*1,hm[1]*1], inr)
    return(
      JSON.stringify(xyarr)
    )
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
          /> 
          {schedSVG}
        </svg>  
      </div>
    )
  }

  return(
    <div id="odiv" style={styles.div}>
      {renderSVG()}
      {pointerType} {hrmin} {showXY()}
      <button onClick={butStart}>start</button><button onClick={butEnd}>end</button>
    </div>
  )
}

export{Draw}

// function calcAng(dy,dx){
//   var ang
//   if(dx==0){
//     dy>0 ? ang=pi/2 :ang=3*pi/2
//   }else{ang=Math.atan(dy/dx)}
//   if(dx>0 && dy<0){
//     ang=ang+2*pi
//   }else if (dx<0){
//     ang=ang+pi
//   }
//   return ang
// }

function calcAngle(ty,tx){
  var ang
  const dx = tx-centx
  const dy = ty-centy
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

function dec2hrmin(dec){
  const min = Math.floor(dec%1*60)
  const hr = Math.floor(dec)
  return `${hr}:${min}`
}

function hrmin2arr(hrmin){
  const hm = hrmin.split(':')
  return[hm[0]*1, hm[1]*1]
}

function createInterval(hrmin, dur){
  const hm = hrmin.split(':')
  const hma= [hm[0]*1, hm[1]*1]
  const min1 = hma[0]*60+hma[1]
  const min2 = (min1+dur)/60
  console.log('min2: ', min2)
  const min = Math.floor(min2%1*60)
  const hr = Math.floor(min2)
  hma.push(1)
  return[hma, [hr,min,0]]
}

function insertInterval(intvl, sched){
  var gi = true
  const ns = sched.reduce((acc,s, i)=>{
    if (intvl[0][0] < s[0] && gi){
      acc.push(intvl[0])
      acc.push(intvl[1])
      gi=false
    }
    acc.push(s)
    if (i==sched.length-1 && gi){
      acc.push(intvl[0])
      acc.push(intvl[1])
    }
    return acc
  },[])
  return ns
}

function replaceInterval(sched, hrmin, idx){
  const hma = hrmin2arr(hrmin)
  sched[idx][0]=hma[0]
  sched[idx][1]=hma[1]
  return sched
}

function time2xy([hr, min], r){
  const rad = 2*pi*((hr*1+(min/60)*1)/24)
  const x = (r*Math.cos(rad)+centx).toFixed(2)*1
  const y = (-r*Math.sin(rad)+centy).toFixed(2)*1
  return [x,y]
}

// function xy2time(x,y){
//   const tx = Math.round(x)
//   const ty = Math.round(y)
//   const mrad = calcAngle(ty,tx) 
//   const dec = (24-mrad*3.819719).toFixed(1)
//   const min = Math.floor(dec%1*60)
//   const hr = Math.floor(dec)
//   return[hr,min]
// }

// function drawSched(schedarr){
  // const sa = schedarr.map((s)=>{
  //   const r=s[2]==0 ? 0 : 1
  //   const xyi = time2xy([s[0]*1,s[1]*1], inr)
  //   const xyo = time2xy([s[0]*1,s[1]*1], outr)
  //   return {xyi:xyi, xyo:xyo, r:r, d:`M${xyi[0]}`}
  // })
  // console.log('schedarr: ', schedarr)
  // console.log('sa: ', JSON.stringify(sa))
// }

function redSched(schedarr){// eslint-disable-line 
  const sa = schedarr.reduce((acc,s,i)=>{
    const r =s[2]==0 ? inr : outr
    const xy = time2xy([s[0]*1,s[1]*1], r)
    const str = `<path d="M${xy[0]} ${xy[1]} A${r} ${r}`
    const no = {r:s[2], s:[s[0],s[1]],g:str}
    if(i>0){
      acc[i-1].e=[s[0],s[1]]
      
      const xye = time2xy([s[0]*1,s[1]*1], acc[i-1].r==0 ? inr : outr)
      let gm = acc[i-1].g
      gm=`${gm} 0 0,0 ${xye[0]} ${xye[1]}"></path>`
      console.log('gm: ', gm)
      acc[i-1].g=gm
    }
    if(i==schedarr.length-1){
      no.e=[0,0]
      const xyee = time2xy([0,0], r)
      let gm2 = no.g
      gm2= `${gm2} 0 0,0 ${xyee[0]} ${xyee[1]}"></path>`
      console.log('gm2: ', gm2)
      no.g=gm2
    }
    acc[i]=no
    return acc
  },[])
  console.log('sa: ', sa)
}

function redSched2(schedarr){// eslint-disable-line 
  const sa = schedarr.reduce((acc,s,i)=>{
    const r =s[2]==0 ? inr : outr
    const xy = time2xy([s[0]*1,s[1]*1], r)
    const str = `<path d="M${xy[0]} ${xy[1]} A${r} ${r}`
    const no = {r:s[2], s:[s[0],s[1]],g:str}
    if(i>0){
      acc[i-1].e=[s[0],s[1]]
      
      const xye = time2xy([s[0]*1,s[1]*1], acc[i-1].r==0 ? inr : outr)
      const xyl = time2xy([s[0]*1,s[1]*1], r)
      let gm = acc[i-1].g
      gm=`${gm} 0 0,0 ${xye[0]} ${xye[1]}"></path>`
      let np = `<path d="M${xye[0]} ${xye[1]} L${xyl[0]} ${xyl[1]}"></path>`
      gm=`${gm} ${np}`
      console.log('gm: ', gm)
      acc[i-1].g=gm
    }
    if(i==schedarr.length-1){
      no.e=[0,0]
      const xyee = time2xy([0,0], r)
      let gm2 = no.g
      gm2= `${gm2} 0 0,0 ${xyee[0]} ${xyee[1]}"></path>`
      console.log('gm2: ', gm2)
      no.g=gm2
    }
    acc[i]=no
    return acc
  },[])
  console.log('sa: ', sa)
}

function redSched3(schedarr){ // eslint-disable-line 
  const sa = schedarr.reduce((acc,s,i)=>{
    const r =s[2]==0 ? inr : outr
    const xy = time2xy([s[0]*1,s[1]*1], r)
    const str = `<path d="M${xy[0]} ${xy[1]} A${r} ${r}`
    const no = {r:s[2], s:[s[0],s[1]],g:str}
    if(i>0){
      acc[i-1].e=[s[0],s[1]]
      
      const xye = time2xy([s[0]*1,s[1]*1], acc[i-1].r==0 ? inr : outr)
      const xyl = time2xy([s[0]*1,s[1]*1], r)
      let gm = acc[i-1].g
      gm=`${gm} 0 0,0 ${xye[0]} ${xye[1]}"></path>`
      let np = `<path d="M${xye[0]} ${xye[1]} L${xyl[0]} ${xyl[1]}"></path>`
      gm=`${gm} 
      ${np}`
      console.log('gm: ', gm)
      acc[i-1].g=gm
    }
    if(i==schedarr.length-1){
      no.e=[0,0]
      const xyee = time2xy([0,0], r)
      let gm2 = no.g
      gm2= `${gm2} 0 0,0 ${xyee[0]} ${xyee[1]}"></path>`
      console.log('gm2: ', gm2)
      no.g=gm2
    }
    acc[i]=no
    return acc
  },[])
  console.log('sa: ', sa)
  const sap = sa.reduce((acc, s)=>{
    console.log('s.g: ', s.g)
    return `${acc}
    ${s.g}`
  },``)
  console.log('sap: ', sap)
  return sap
}

function redSched4(schedarr){ // eslint-disable-line 
  const sa = schedarr.reduce((acc,s,i)=>{
    const r =s[2]==0 ? inr : outr
    const xy = time2xy([s[0]*1,s[1]*1], r)
    const str = `<path d="M${xy[0]} ${xy[1]} A${r} ${r}`
    const no = {r:s[2], s:[s[0],s[1]],g:str}
    if(i>0){
      acc[i-1].e=[s[0],s[1]]
      
      const xye = time2xy([s[0]*1,s[1]*1], acc[i-1].r==0 ? inr : outr)
      const xyl = time2xy([s[0]*1,s[1]*1], r)
      let gm = acc[i-1].g
      gm=`${gm} 0 0,0 ${xye[0]} ${xye[1]}"></path>`
      let np = `<path d="M${xye[0]} ${xye[1]} L${xyl[0]} ${xyl[1]}"></path>`
      gm=`${gm} 
      ${np}`
      console.log('gm: ', gm)
      acc[i-1].g=gm
    }
    if(i==schedarr.length-1){
      no.e=[0,0]
      const xyee = time2xy([0,0], r)
      let gm2 = no.g
      gm2= `${gm2} 0 0,0 ${xyee[0]} ${xyee[1]}"></path>`
      console.log('gm2: ', gm2)
      no.g=gm2
    }
    acc[i]=no
    return acc
  },[])
  console.log('sa: ', sa)
  const sap = sa.reduce((acc, s)=>{
    console.log('s.g: ', s.g)
    return `${acc}
    ${s.g}`
  },``)
  console.log('sap: ', sap)
  return sap
}

// function redSched2a(schedarr){// eslint-disable-line 
//   const sa = schedarr.reduce((acc,s,i)=>{
//     const r =s[2]==0 ? inr : outr
//     const xy = time2xy([s[0]*1,s[1]*1], r)
//     const str = `<path d="M${xy[0]} ${xy[1]} A${r} ${r}`
//     const dstr = `M${xy[0]} ${xy[1]} A${r} ${r}`
//     const no = {r:s[2], s:[s[0],s[1]],g:str, d:[dstr] }
//     if(i>0){
//       acc[i-1].e=[s[0],s[1]]
      
//       const xye = time2xy([s[0]*1,s[1]*1], acc[i-1].r==0 ? inr : outr)
//       const xyl = time2xy([s[0]*1,s[1]*1], r)
//       let gm = acc[i-1].g
//       let d1 = acc[i-1].d[0]
//       gm=`${gm} 0 0,0 ${xye[0]} ${xye[1]}"></path>`
//       d1=`${d1} 0 0,0 ${xye[0]} ${xye[1]}`
//       let np = `<path d="M${xye[0]} ${xye[1]} L${xyl[0]} ${xyl[1]}"></path>`
//       let d2 = `M${xye[0]} ${xye[1]} L${xyl[0]} ${xyl[1]}`
//       gm=`${gm} ${np}`
//       console.log('gm: ', gm)
//       acc[i-1].g=gm
//       acc[i-1].d[0]=d1
//       acc[i-1].d[1]=d2
//     }
//     if(i==schedarr.length-1){
//       no.e=[0,0]
//       const xyee = time2xy([0,0], r)
//       let gm2 = no.g
//       gm2= `${gm2} 0 0,0 ${xyee[0]} ${xyee[1]}"></path>`
//       console.log('gm2: ', gm2)
//       no.g=gm2
//     }
//     acc[i]=no
//     return acc
//   },[])
//   console.log('sa: ', sa)
//   return(
//     <g style={styles.g}>
//       <path d="M270 200 A100 100 0 0,0 96.27 132.44" ></path>
//     </g>
//   )
// }