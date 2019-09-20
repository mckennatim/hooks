import React, {useEffect, useState, useRef} from 'react'
import usePosition from './usePosition';
import {styles} from './styles'
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'
import{themodule} from './themodule'



const ZoneTimer = (props)=>{
  const {sunrise, sunset, asched, range} =props
  const tm = themodule(props.range)

  let ref = useRef(null);
  let { left, top } = usePosition(ref);
  const[pointerType, setPointerType] = useState('touch')
  const [sidx, setSidx] =useState(0)
  const[hasCapture, setHasCapture]=useState(false)
  const[knobx, setKnobx ] = useState(tm.centx)
  const[knoby, setKnoby ] = useState(tm.centy + tm.v2r(asched[0][2]))
  const[hrmin, setHrmin] = useState('6:0')
  const [sched,setSched] = useState(asched)
  const[isout, setIsOut]= useState(false)
  const [interval, setInterval]=useState([])
  const[temp, setTemp] = useState(range[0])

  useEffect(()=>{
    function detectInputType (e){
      tm.absorbEvent(e)
      setPointerType(e.pointerType)
      console.log('e.pointerType: ', e.pointerType)
      window.removeEventListener('pointerdown', detectInputType);
    }
    window.addEventListener("pointerdown", detectInputType, {passive:false});
    return () => {
      window.removeEventListener('pointerdown', detectInputType);
    }
  },[])

  const handleStart=(e)=>{
    setHasCapture(true)
    tm.absorbEvent(e)
  }

  const handleMove=(ev)=>{
    let r = tm.v2r(sched[sidx][2])
    tm.absorbEvent(ev)
    if(hasCapture){
      const e = pointerType=="mouse" ? ev : ev.touches[0]
      const tx = Math.round(e.pageX)-left
      const ty = Math.round(e.pageY)-top
      const{x,y}=tm.setxy(tx,ty,r)
      setKnobx(x)
      setKnoby(y)
      const hm= tm.xy2time(x,y)
      setHrmin(hm.s)
      let didx = sched.findIndex((d)=>{
        return d[0]*60+d[1]*1 > hm.a[0]*60+hm.a[1]*1
      })
      didx = didx==-1 ? sched.length-1 : didx-1
      setSidx(didx)
      if(isout){
        const idx = sched.findIndex((s)=>{
          return interval[1][0]==s[0] && interval[1][1]==s[1]
        })
        tm.replaceInterval(sched, hm, idx)
      }
    }
  }

  const handleEnd=(e)=>{
    tm.absorbEvent(e)
    setHasCapture(false)
  }

  const handleTempChangeStart=()=>{
    console.log('temp change start')
  }
  const handleTempChange=(value)=>{
    setTemp(value)
    //3*(value-25)
    // console.log('3*(value-25)', temp2rad(value))
  }
  const handleTempChangeComplete=()=>{
    console.log('temp change end')
  }

  const butStart=()=>{
    const intvl=tm.createInterval(hrmin, 20, sched, sidx, temp)
    setInterval(intvl)
    const nsched =tm.insertInterval(intvl, sched)
    setSched(nsched)
    const r= tm.v2r(temp)
    const ang = tm.calcAng(knoby,knobx) 
    const nx =  tm.rad2x(r, ang)
    const ny = tm.rad2y(r, ang)
    setIsOut(true)
    setKnobx(nx)
    setKnoby(ny)
  }

  const butEnd = ()=>{
    const ang = tm.calcAng(knoby,knobx) 
    const nx =  tm.rad2x(tm.inr, ang)
    const ny = tm.rad2y(tm.inr, ang)
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
    const nsched =sched.slice(0)//copy
    console.log('nsched: ', JSON.stringify(nsched))
    nsched.splice(sidx,2)
    if (nsched.length==0) {
      nsched.push([0,0,0])
    }
    console.log('nsched: ', JSON.stringify(nsched))
    setSched(nsched)
    setSidx(nsched.length-1)
  }
  // const saveBack=(dog)=>()=>{
  //   console.log('dog: ', dog)
  // }

  const renderNightDay=()=>{
    const {dnight,dday,noony,midy}=tm.drawDayNight(sunrise, sunset)
    return(
      <g>
        <path d={dnight} stroke="black" strokeWidth=".5" fill="#37c7ef"></path>
        <path d={dday} stroke="black" strokeWidth=".5" fill="#f9fc67"></path>
        <text x={tm.centx} y={noony} textAnchor="middle">noon</text>
        <text x={tm.centx} y={midy} textAnchor="middle">midnight</text>
      </g>
    )
  }

  const renderTempLines=()=>{
    const tcircs = props.templines.map((t,i)=>{
      const rad = tm.v2r(t.v)
      return(
        <g key={i}>
        <circle style={styles.templines}  cx={tm.centx} cy={tm.centy} r={rad} stroke={t.c}/>
        <text fontSize='8' x={tm.centx} y={tm.centy-rad} textAnchor="middle">{t.v}</text>
        </g>
      )
    })
    return(
      <g >
        {tcircs}
      </g>
    )
  }

  styles.knob={
    r:hasCapture ? 14 : 10,
    fill:hasCapture ? 'pink' : 'yellow',
    stroke:"red",
    strokeWidth:3
  }
  styles.svg={
    stroke: 'blue',
    strokeWidth: 2,
    fill: hasCapture ? 'yellow' : 'white'
  }
  styles.rngdiv={
    width: tm.width,
    float:'left',
    background:'white',
    borderStyle: 'solid', 
    borderColor:'blue'
  }

  const renderSVGsched=(schedarr)=>{// eslint-disable-line 
    const sa = schedarr.reduce((acc,s,i)=>{
      // const r =s[2]==0 ? inr : outr//THIS WIIL CCHANGE FOR TEMP
      const r = tm.v2r(s[2])
      const xy = tm.time2xy([s[0]*1,s[1]*1], r)//get location of sched[i] at r
      const begarc = `M${xy[0]} ${xy[1]} A${r} ${r}` //beginning of arc path, just data
      const datarr = {r:r, stHM:[s[0],s[1]], begarc:[begarc], xy:[0,0], xytxt:[0,0]}
      let laf
      if(i>0){
        const endHM = [s[0],s[1]] //end [hr,min]
        const stHM =acc[i-1].stHM   //start [hr,min]
        laf = tm.largeArcFlag(stHM, endHM)
        acc[i-1].endHM=endHM//adds the end [hr,min] to acc
        const xye = tm.time2xy([s[0]*1,s[1]*1], acc[i-1].r)
        const xyl = tm.time2xy([s[0]*1,s[1]*1], r)
        const xytxt = tm.time2xy([s[0]*1,s[1]*1], tm.inr-5)
        const tang = tm.calcAng(xytxt[1],xytxt[0])/(2*tm.pi)*360-180
        acc[i-1].tang=tang
        acc[i-1].xytxt=xytxt
        let begarc = acc[i-1].begarc[0]
        let arc=`${begarc} 0 ${laf},0 ${xye[0]} ${xye[1]}`
        let rayln = `M${xye[0]} ${xye[1]} L${xyl[0]} ${xyl[1]}`
        if(!acc[i-1].d){acc[i-1].d = []}
        acc[i-1].d[0]=arc
        acc[i-1].d[1]=rayln
      }
      if(i==schedarr.length-1){ //just segment ending at [23,59]
        const endHM = [23,59]
        let stHM = [s[0],s[1]]
        laf = schedarr.length==1 ? 1 : tm.largeArcFlag(stHM, endHM)
        datarr.endHM=endHM
        const xyee = tm.time2xy([0,0], r)
        let arc=`${begarc} 0 ${laf},0 ${xyee[0]-1} ${xyee[1]}`
        if(!datarr.d){datarr.d = []}
        datarr.d[0]=arc
      }
      acc[i]=datarr
      return acc
    },[])
    return(
      <g style={styles.g}>
        {sa.map((s,i)=>{
          const txtang = s.tang ? s.tang : 0
          const trans = `rotate(${txtang},${s.xytxt[0]},${s.xytxt[1]})`
          // console.log('sched: ', JSON.stringify(sched))
          return(
          <g key={i}>
          <path d={s.d[0]} ></path>
          {s.d[1] && <path d={s.d[1]} ></path>}
          <text style={styles.t} x={s.xytxt[0]} y={s.xytxt[1]}  transform={trans}>{tm.hma2time(s.endHM)}</text>
          </g>
          ) 
        })}
      </g>
    )
  }
 
  const schedSVG=renderSVGsched(sched)  
  const renderSVG=()=>{
    return(
    <div>
      <svg id="svg" 
        width={tm.width +2} 
        height={tm.height +2} 
        xmlns="http://www.w3.org/2000/svg" version="1.1"
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        >
        <rect style={styles.svg} d ="rect" x="1" y="1" width={tm.width} height={tm.height} />
        <text x={tm.centx} y="20" textAnchor="middle">{sched[sidx] && sched[sidx][2]} &deg; {tm.hrmin2time(hrmin)}</text>
        <text x="20" y="25" fontSize="24" fill="green" stroke="red" strokeWidth="1" onClick={tapStartEnd}>{isout ? "finish" : "set"}</text>
        <text x="250" y="25" fontSize="24" fill="green" stroke="red" strokeWidth="1" onClick={butDel}>delete</text>
        <text x="20" y="40">{temp}</text>
        <text x="250" y={tm.height-20} fontSize="24" fill="green" stroke="red" strokeWidth="1" onClick={props.retNewSched(sched)}>save</text>
        {renderNightDay()}
        {renderTempLines()}
        {schedSVG}
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
        
      </svg>
    </div>
    )
  }

  return (
    <div ref={ref}>
      {renderSVG()}
      <div style={styles.rngdiv}>
        <div className='slider'>
          <Slider
            min={range[0]}
            max={range[1]}
            value={temp}
            onChangeStart={handleTempChangeStart}
            onChange={handleTempChange}
            onChangeComplete={handleTempChangeComplete}        
          />
        </div>
      </div>
    </div>
  )
}

export {ZoneTimer}