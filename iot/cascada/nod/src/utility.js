
const asched = [[0,0,0], [9,10,1], [9,50,0], [17,20,1], [17,40,0]]
const atm = [[9,40,1], [10,15,0]]

const des = [[9,40,1], [10,15,0],[17,20,1], [17,40,0] ]

const now = [9,15]

const des2 = [[9,15,1],[10,15,0],[17,20,1], [17,40,0] ]

const conc =asched.concat(atm)

const getNow=(tzd_tza)=>{
  const d = new Date()
  let hr = d.getHours()*1+tzd_tza
  let min = d.getMinutes()*1
  hr = hr>=24 ? 23 : hr
  hr = hr<0 ? 24+hr : hr
  return [hr, min]
}

const startWhen = (tzdif, delay )=> {
  let [hr, min ]= getNow(tzdif)
  const de = delay ? delay.split(':') : [0,0]
  hr += de[0]*1
  min += de[1]*1
  if (min>=60){min=min-60; hr=hr+1;}
  if (hr>=24){hr=23; min = 59}
  hr = hr<1 ? 24+hr : hr
  return [hr, min]
}

const endWhen = (start, dur)=>{
  const add = dur.split(':')
  let min = start[1]+add[1]*1
  let hr = start[0]+add[0]*1
  if(min>60) {min+=60; hr+=1}
  if(hr>=24) {hr=23; min=59}
  return [hr, min]
}

const min2hrmin =(dur)=>{
  const hrs= Math.floor(dur/60)
  const min= dur - hrs*60
  return `${hrs}:${min}`
}

const newInterval = (starttime, startval, endtime, endval)=>{
  const st = starttime.concat(startval)
  const en = endtime.concat(endval)
  return [st, en]
}

const add2sched = (sched, ninterval, tzd_tza)=>{
  let [hr, min ]= getNow(tzd_tza)
  const newsched = sched.reduce((acc, intvl)=>{
    
    if(intv[0]>acc[0]){
      //
    }

  }, [hr, min])
  return newsched
}

export{startWhen, endWhen, newInterval}

