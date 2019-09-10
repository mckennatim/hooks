const themodule =(range)=>{
  const centx=170
  const centy=200
  const inr=90
  const outr=150
  const pi=Math.PI
  const width=340
  const height=400
  const m = (range[1]-range[0])/(outr-inr) 
  const b = range[0] - (m*inr)
  const hrmin2arr =  (hrmin)=>{
    const hm = hrmin.split(':')
    return[hm[0]*1, hm[1]*1]
  }
  const largeArcFlag = (hma1, hma2)=> {
    const hrdiff = Math.abs((hma1[0]+hma1[1]/60) - (hma2[0]+hma2[1]/60))
    return hrdiff>12 ? 1 : 0 //set large arc flag
  }
  const time2xy=([hr, min], r)=>{
    const nhr = hr>6 ? hr*1-6 : hr*1+18
    const rad = 2*pi*((nhr+(min/60)*1)/24)
    const x = (r*Math.cos(rad)+centx).toFixed(2)*1
    const y = (-r*Math.sin(rad)+centy).toFixed(2)*1
    return [x,y]
  }
  const calcAng= (y,x)=>{
    var ang
    const dx = x-centx
    const dy = y-centy
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
  const rad2x= (r,ang)=>(r*Math.cos(ang)+centx).toFixed(1)
  const rad2y= (r,ang)=>(r*Math.sin(ang)+centy).toFixed(1)
  const xy2time =(x,y)=>{
    const tx = Math.round(x)
    const ty = Math.round(y)
    const ang = calcAng(ty,tx) 
    let dec = (24-ang*3.819719).toFixed(1)
    dec = dec<18 ? dec*1+6 : dec*1-18
    const min = Math.floor(dec%1*60)
    const hr = Math.floor(dec)
    const hms = `${hr}:${min}`
    return{a:[hr,min], s:hms}  
  }
  const hma2time=(hma)=>{
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
  return {
    centx,centy,inr,outr,pi,width,height,
    v2r: (v)=> (v-b)/m,
    xy2time: xy2time,
    time2xy: time2xy,
    hma2time: hma2time,
    calcAng: calcAng,
    largeArcFlag: largeArcFlag,
    setxy: (dx,dy, r) =>{
      const ang = calcAng(dy,dx)
      const x = rad2x(r,ang)
      const y = rad2y(r,ang)
      return{x,y}
    },
    replaceInterval:(sched, hm, idx)=>{
      if (hm.a[0]*60+hm.a[1] > sched[idx-1][0]*60+sched[idx-1][1]){
        sched[idx][0]=hm.a[0]
        sched[idx][1]=hm.a[1]
      }
      return sched
    },
    drawDayNight: (sunrise,sunset)=>{
      const setarr = hrmin2arr(sunset)
      const risearr =hrmin2arr(sunrise)
      const laf = largeArcFlag(setarr, risearr) 
      const sset = time2xy([setarr[0], setarr[1]], outr)
      const srise = time2xy([risearr[0], risearr[1]], outr)  
      const dnight = `M${centx} ${centy} ${sset[0]},${sset[1]} A${outr}, ${outr} 0 ${!laf*1}, 0, ${srise[0]},${srise[1]} Z`
      const dday = `M${centx} ${centy} ${srise[0]},${srise[1]} A${outr}, ${outr} 0 ${laf}, 0, ${sset[0]},${sset[1]} Z`
      const noony = `${centy-outr-5}`
      const midy = `${centy+outr+15}` 
      return {dnight,dday,noony,midy}        
    },
    absorbEvent: (event) =>{
      var e = event || window.event;
      e.preventDefault && e.preventDefault();
      e.stopPropagation && e.stopPropagation();
      e.cancelBubble = true;
      e.returnValue = false;
      return false;
    }
  }
}

export{themodule}