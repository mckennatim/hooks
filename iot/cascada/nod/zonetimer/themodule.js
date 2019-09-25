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
  const hrXmin = (schedidx)=>{
    return schedidx[0]*60 + schedidx[1]*1
  }
  return {
    centx,centy,inr,outr,pi,width,height,
    v2r: (v)=> (v-b)/m,
    xy2time: xy2time,
    time2xy: time2xy,
    hma2time: hma2time,
    hrXmin: hrXmin,
    calcAng: calcAng,
    rad2x: rad2x,
    rad2y: rad2y,
    largeArcFlag: largeArcFlag,
    hrmin2time: (hrmin)=>{
      const hma = hrmin2arr(hrmin)
      return hma2time(hma)
    },
    setxy: (dx,dy, r) =>{
      const ang = calcAng(dy,dx)
      const x = rad2x(r,ang)
      const y = rad2y(r,ang)
      return{x,y}
    },
    createInterval: (hrmin, dur, sched, idx, temp, isdiff, diff)=>{
      const hma= hrmin2arr(hrmin)
      const min1 = hma[0]*60+hma[1]
      const min2 = (min1+dur)/60
      const min = Math.floor(min2%1*60)
      const hr = Math.floor(min2)
      if(!isdiff){
        hma.push(temp)
        return[hma, [hr,min,sched[idx][2]]]
      }else{
        hma.push(temp+diff/2)
        hma.push(temp-diff/2)
        return[hma, [hr,min,sched[idx][2],sched[idx][3]]]
      }
    },
    insertInterval:(intvl, sched)=>{
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
      /*FIX if inserting from beginning  */
      if (ns[1][0]*60+ns[1][1] <20){
        ns.shift()
        ns[0][1]=0
      }
      return ns
    },
    replaceInterval:(sched, hm, idx, interval)=>{
      let newidx = idx
      console.log('sched.hm,idx: ', JSON.stringify(sched),hm,idx)
      if (idx>=0 && hrXmin(hm.a) > hrXmin(sched[idx])){
        sched[idx][0]=hm.a[0]
        sched[idx][1]=hm.a[1]
      }
      const mintvl = interval.slice(0)
      console.log('before hrXmin sched[idx]: ', JSON.stringify(sched[idx]))
      if(idx>=0 &&  sched.length>idx+1 && hrXmin(sched[idx])>hrXmin(sched[idx+1])){
        console.log('CAUGFJTYTFGF')
        console.log('sched[idx+1].slice(2): ', sched[idx+1].slice(2))
        console.log('sched[idx].slice(0,2): ', sched[idx].slice(0,2))
        const rev = sched[idx].slice(0,2).concat(sched[idx+1].slice(2)) 
        sched[idx]=rev
        mintvl[1]=rev
        console.log('mintvl: ', JSON.stringify(mintvl))
        console.log('sched[idx-1]: ', JSON.stringify(sched[idx-1]))
        console.log('sched[idx]: ', JSON.stringify(sched[idx]))
        console.log('sched[idx+1]: ', JSON.stringify(sched[idx+1]))
        sched.splice(idx+1,1)
        newidx += -1
        if(sched[newidx][2]==sched[newidx+1][2]
          && sched[newidx][3]==sched[newidx+1][3]){
          console.log(' get rid ofsched[idx]: ', JSON.stringify(sched[newidx+1]))
          sched.splice(newidx+1,1)
          if(sched[newidx+1]) mintvl[1]=sched[newidx+1]
          newidx += -1
        }
      }
      console.log('sched: ', JSON.stringify(sched))
      console.log('mintvl: ', JSON.stringify(mintvl))
      return {rsched:sched, rinterval:mintvl, ridx:newidx}
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