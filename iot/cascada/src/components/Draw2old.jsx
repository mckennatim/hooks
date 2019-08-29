import React, {useState, useEffect} from 'react'
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'

var centx =170
var centy = 200
var inr =100
var outr =140
var pi=Math.PI
// var asched = [[0,0,0],[3,0,1], [4,30,0], [9,10,1], [10,40,0], [16,0,1],[17,50,0], [20,0,1], [21,30,0]]
var asched = [[0,0,0]]
var sunrise = "6:20"
var sunset= "19:30"

const Draw2 =()=>{

  const[hasCapture, setHasCapture]=useState(false)
  const[knobx, setKnobx ] = useState(270)
  const[knoby, setKnoby ] = useState(200)
  const[hrmin, setHrmin] = useState('6:0')
  const[temp, setTemp] = useState(55)
  const[pointerType, setPointerType] = useState('touch')
  const[isout, setIsOut]= useState(false)
  const [sched,setSched]=useState(asched)
  const [interval, setInterval]=useState([])
  const [delidx, setDelidx] =useState(0)

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
    },
    t:{
      strokeWidth: 0,
      fill: 'green',
      fontSize: "12"
    },
    ul:{
      listStyle: "none",
      background: "white"
    },
    slider:{
      background: "white",
      width:342
    }
  }

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
      //const hr = (24-mrad*3.819719).toFixed(1)
      setKnobx(nx)
      setKnoby(ny)
      const hmarr= xy2time(tx,ty)
      //console.log('hmarr2hrmin(xy2time(tx,ty)): ', hmarr2hrmin(xy2time(tx,ty)))
      setHrmin(hmarr2hrmin(hmarr))
      const didx = sched.findIndex((d)=>{
        return d[0]*60+d[1]*1 > hmarr[0]*60+hmarr[1]*1
      })
      setDelidx(didx-1)
      if(isout){
        console.log('isout: ', isout)
        const idx = sched.findIndex((s)=>{
          return interval[1][0]==s[0] && interval[1][1]==s[1]
        })
        console.log('idx: ', idx)
        console.log('hrmin: ', hrmin)
        console.log('interval: ', JSON.stringify(interval))
        const nsched = replaceInterval(sched, hrmin, idx)
        console.log('nsched: ', JSON.stringify(nsched))
      }
    }
  }

  const handleEnd=(e)=>{
    absorbEvent(e)
    setHasCapture(false)
  }

  const butStart=()=>{
    const intvl=createInterval(hrmin, 20)
    setInterval(intvl)
    const nsched =insertInterval(intvl, sched)
    setSched(nsched)
    const mrad = calcAngle(knoby,knobx) 
    const nx =  (outr*Math.cos(mrad)+centx).toFixed(1)
    const ny = (outr*Math.sin(mrad)+centy).toFixed(1)
    setIsOut(true)
    setKnobx(nx)
    setKnoby(ny)
  }

  const butEnd = ()=>{
    const mrad = calcAngle(knoby,knobx) 
    const nx =  (inr*Math.cos(mrad)+centx).toFixed(1)
    const ny = (inr*Math.sin(mrad)+centy).toFixed(1)
    setIsOut(false)
    setKnobx(nx)
    setKnoby(ny)
  }

  const tapStartEnd =()=>{
    if(isout){
      butEnd()
    }else{
      butStart()
    } 
  }

  const butDel = ()=>{
    console.log('delidx: ', delidx)
    console.log('sched: ', JSON.stringify(sched))
    const nsched =sched.slice(0)
    nsched.splice(delidx,2)
    console.log('nsched: ', JSON.stringify(nsched))
    setSched(nsched)
  }

  const showXY=()=>{
    const hm = hrmin.split(":")
    const xyarr=time2xy([hm[0]*1,hm[1]*1], inr)
    return(
      JSON.stringify(xyarr)
    )
  }

  const handleTempChangeStart=()=>{
    console.log('temp change start')
  }
  const handleTempChange=(value)=>{
    setTemp(value)
  }
  const handleTempChangeComplete=()=>{
    console.log('temp change end')
  }

  const renderNightDay=()=>{
    const setarr = hrmin2arr(sunset)
    const risearr =hrmin2arr(sunrise)
    const laf = largeArcFlag(setarr, risearr)
    const sset = time2xy([setarr[0], setarr[1]], outr)
    const srise = time2xy([risearr[0], risearr[1]], outr)
    const dnight = `M${centx} ${centy} ${sset[0]},${sset[1]} A${outr}, ${outr} 0 ${!laf*1}, 0, ${srise[0]},${srise[1]} Z`
    const dday = `M${centx} ${centy} ${srise[0]},${srise[1]} A${outr}, ${outr} 0 ${laf}, 0, ${sset[0]},${sset[1]} Z`
    const noony = `${centy-outr-5}`
    const midy = `${centy+outr+15}`
    return(
      <g>
        
        <path d={dnight} stroke="black" strokeWidth=".5" fill="#37c7ef"></path>
        <path d={dday} stroke="black" strokeWidth=".5" fill="#f9fc67"></path>
        <text x={centx} y={noony} textAnchor="middle">noon</text>
        <text x={centx} y={midy} textAnchor="middle">midnight</text>
      </g>
    )
  }
 

  const renderSVGsched=(schedarr)=>{// eslint-disable-line 
    // console.log('schedarr: ', JSON.stringify(schedarr))//sched from device
    const sa = schedarr.reduce((acc,s,i)=>{
      const r =s[2]==0 ? inr : outr//THIS WIIL CCHANGE FOR TEMP
      const xy = time2xy([s[0]*1,s[1]*1], r)//get location of sched[i] at r
      // const txtang = calcAngle(xy[1],xy[0])/(2*pi)*360 -180
      // console.log('txtang: ', txtang, s[0], s[1])
      const begarc = `M${xy[0]} ${xy[1]} A${r} ${r}` //beginning of arc path, just data
      /* const no = {r:0||1, s:[hr,min], d:[begarc], xy:[0,0]}*/
      const no = {r:s[2], s:[s[0],s[1]], d:[begarc], xy:[0,0]}
      if(i>0){
        const en = [s[0],s[1]] //end [hr,min]
        const st =acc[i-1].s   //start [hr,min]
        let laf = largeArcFlag(st, en)
        console.log('laf: ', laf)
        acc[i-1].e=en//adds the end [hr,min] to acc
        const xye = time2xy([s[0]*1,s[1]*1], acc[i-1].r==0 ? inr : outr)
        const xyl = time2xy([s[0]*1,s[1]*1], r)
        const xyt = time2xy([s[0]*1,s[1]*1], inr-5)
        const tang = calcAngle(xyt[1],xyt[0])/(2*pi)*360 -180
        console.log('tang: ', tang, s[0], s[1])
                //
        acc[i-1].tang=tang
        acc[i-1].xy=xyt
        let d1 = acc[i-1].d[0]
        d1=`${d1} 0 ${laf},0 ${xye[0]} ${xye[1]}`
        let d2 = `M${xye[0]} ${xye[1]} L${xyl[0]} ${xyl[1]}`
        acc[i-1].d[0]=d1
        acc[i-1].d[1]=d2
      }
      if(i==schedarr.length-1){ //just src ending at [0,0]
        const en = [23,59]
        let st = [0,0]
        if(schedarr.length!=1){
          st =acc[i-1].s   //start [hr,min]
        } 
        const laf = largeArcFlag(st, en)
        no.e=en
        const xyee = time2xy([0,0], r)
        let d2 = no.d[0]
        d2=`${d2} 0 ${laf},0 ${xyee[0]-1} ${xyee[1]}`
        no.d[0]=d2
      }
      acc[i]=no
      return acc
    },[])
    // console.log('sa: ', JSON.stringify(sa))
    // const txtang = [-135,-158,132,109,30,2,-30,-53]
    return(
      <g style={styles.g}>
        {sa.map((s,i)=>{
          const txtang = s.tang ? s.tang : 0
          const trans = `rotate(${txtang},${s.xy[0]},${s.xy[1]})`
          // const trans = `rotate(30,${centx},${centy})`
          
          return(
          <g key={i}>
          <path d={s.d[0]} ></path>
          {s.d[1] && <path d={s.d[1]} ></path>}
          <text style={styles.t} x={s.xy[0]} y={s.xy[1]}  transform={trans}>{hma2time(s.e)}</text>
          </g>
          ) 
        })}
      </g>
    )
  }

  const renderSchedList=(schedarr)=>{
    const sa = schedarr.reduce((acc,s,i)=>{
      const intvl = [s[2],[s[0],s[1]]]
      if(i>0){
        // console.log('acc[i-1]: ', acc[i-1])
        acc[i-1][2]=[s[0],s[1]]
      }
      acc[i]=intvl
      if(i==schedarr.length-1){
        acc[i][2]=[23,59]
      }
      return acc
    },[])
    return(
      <ul style={styles.ul}>
        {sa.map((s,i)=>
          <li key={i}>
            <span>{s[0]}  {hma2time(s[1])}-{hma2time(s[2])}</span>

          </li>
        )}
      </ul>
    )
  }  

  const slist= renderSchedList(sched)
  const schedSVG=renderSVGsched(sched)  
  const renderSVG=()=>{
    return(
      <div>
        <svg id="svg" 
          width="342" 
          height="481" 
          xmlns="http://www.w3.org/2000/svg" version="1.1"
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          >
          <rect style={styles.svg} id ="rect" x="1" y="1" width="340" height="480" fill="none" strokeWidth="2" />
          {renderNightDay()}
          {/* <circle style={styles.inner} id="inner"  /> 
          <circle style={styles.outer} id="outer"  />  */}
          <text x={centx} y="20" textAnchor="middle">{hrmin2time(hrmin)}</text>
          <text x="20" y="25" fontSize="24" fill="green" stroke="red" strokeWidth="1" onClick={tapStartEnd}>{isout ? "end" : "start"}</text>
          <text x="250" y="25" fontSize="24" fill="green" stroke="red" strokeWidth="1" onClick={butDel}>delete</text>
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
      <div className='slider'>
        <Slider
          min={55}
          max={72}
          value={temp}
          onChangeStart={handleTempChangeStart}
          onChange={handleTempChange}
          onChangeComplete={handleTempChangeComplete}        
        />
      </div>
      {pointerType} {hrmin2time(hrmin)} {showXY()}
      <button onClick={butStart}>start</button><button onClick={butEnd}>end</button>
      {delidx}
      <button onClick={butDel}>delete</button>
      {slist}
    </div>
  )
}

export{Draw2}

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
  // console.log('ang: ', ang)
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

// function dec2hrmin(dec){
//   const min = Math.floor(dec%1*60)
//   const hr = Math.floor(dec)
//   return `${hr}:${min}`
// }
function largeArcFlag(hma1, hma2) {
  const hrdiff = Math.abs((hma1[0]+hma1[1]/60) - (hma2[0]+hma2[1]/60))
  // console.log('hrdiff: ', hma1, hma2, hrdiff) 
  return hrdiff>12 ? 1 : 0 //set large arc flag
}

function hrmin2arr(hrmin){
  const hm = hrmin.split(':')
  return[hm[0]*1, hm[1]*1]
}

function hmarr2hrmin(hma){
  return `${hma[0]}:${hma[1]}`
}

function hrmin2time(hrmin){
  const hma = hrmin2arr(hrmin)
  return hma2time(hma)
}

function hma2time(hma){
  let ap = 'am'
  let hr = hma[0]
  let min = hma[1]
  if(hr>12){
    hr = hr-12
    ap = 'pm'
  }
  hr = hr.toString().padStart(2,'')
  min = min.toString().padStart(2,'0')
  return `${hr}:${min} ${ap}`
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
  console.log('sched[idx]: ', JSON.stringify(sched[idx]))
  const hma = hrmin2arr(hrmin)
  console.log('hma: ', JSON.stringify(hma))
  console.log('sched[idx]: ', JSON.stringify(sched[idx]), JSON.stringify(sched[idx-1]))
  if (hma[0]*60+hma[1] > sched[idx-1][0]*60+sched[idx-1][1]){
    sched[idx][0]=hma[0]
    sched[idx][1]=hma[1]
  }
  return sched
}

function time2xy([hr, min], r){
  const nhr = hr>6 ? hr*1-6 : hr*1+18
  const rad = 2*pi*((nhr+(min/60)*1)/24)
  const x = (r*Math.cos(rad)+centx).toFixed(2)*1
  const y = (-r*Math.sin(rad)+centy).toFixed(2)*1
  return [x,y]
}

function xy2time(x,y){
  const tx = Math.round(x)
  const ty = Math.round(y)
  const mrad = calcAngle(ty,tx) 
  let dec = (24-mrad*3.819719).toFixed(1)
  dec = dec<18 ? dec*1+6 : dec*1-18
  // console.log('dec: ', dec)
  const min = Math.floor(dec%1*60)
  const hr = Math.floor(dec)
  return[hr,min]
}

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