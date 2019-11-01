import React, {useState, useEffect} from 'react'
import {fetchWeekSched, getDinfo} from '../../npm/mqtt-hooks'
import {cfg, ls} from '../utilities/getCfg'
import {nav2} from '../app'
import {CondensedSched} from './CondensedSched.jsx'

const dat = new Date().toISOString().split('T')[0]
console.log('dat: ', dat)

// const CondensedSched = ({sch})=>{
//   const asched = sch.map((s,i)=>{
//     const ti = hma2time(s)
//     return (
//       <span key={i} style={styles.schedstr}>
//         <span> {ti} </span>
//         <span > {s[3]}&deg; </span>
//       </span>
//     )
//   })
// return (<span>{asched}</span>)
// }

const WeeklyScheduler=(props)=>{
  const{prups}=props.cambio.page
  const {sched, state, zinfo, temp_out, devs }=prups
  const zinf = zinfo[0]
  const dinfo = devs ? getDinfo(zinf.id, devs): {dev: 'null', sr:-1}
  const initSchdb=[{dow:'current', sched:sched}]

  //[[{dow:31, pro:[[]]}], [{dow:31, pro:[[]]}]]  
  const [schdb, setSchdb] = useState(initSchdb)
  const [holddate,setHolddate]=useState(dat)
  const [edsched, setEdsched] = useState(sched)
  const [radiock, setRadiock] = useState(0)

  useEffect(()=>{
    // const dinf = devs ? getDinfo(zinf.id, devs): {dev: 'null', sr:-1}
    fetchWeekSched(ls,cfg, dinfo.dev, dinfo.sr).then((data)=>{
      console.log('data: ', data)
      const nsched = initSchdb.slice()
      const sc = data.results.map((d)=>{
        return {dow:d.dow, sched:JSON.parse(d.sched)}
      })
      const ns = nsched.concat(sc)
      setSchdb(ns)
    })
  },[])

  const save2server=()=>{
    var checkboxes = [...document.getElementsByName("days")];
    const dowarr = []
    const ch = checkboxes
      .map((c)=>{
        if(c.checked){
          if (c.value == 0 || c.value==128){
            dowarr.push(c.value*1)
          }else{
            return c.value*1
          }
        }
      })
      .filter((d)=>d!=undefined)
      .reduce((acc, e)=>e+acc, 0)
      dowarr.push(ch)
      dinfo.dowarr=dowarr
      dinfo.sched=edsched
      dinfo.until = dowarr.includes(128) ? holddate : '0000-00-00'
      const bits = dowarr.pop()
      let rsched = schdb
        .filter((d)=>d.dow!='current')
        .map((s)=>{
          const band = s.dow & bits
          if(band>0){
            const nb =~band & s.dow
            if (nb>0){
              s.dow=nb
              s.until='0000-00-00'
              return s
            }
          }else{
            s.until='0000-00-00'
            return s
          }
        })
        .filter((f)=>f!=null)
      const newsched = {dow:bits, sched:edsched, until:'0000-00-00'}
      rsched.push(newsched)
      if (dowarr.includes(0)){
        rsched = rsched.map((r)=>{
          if(r.dow==0){
            r.sched=edsched
          }
          return r
        })
      }
      if (dowarr.includes(128)){
        rsched= rsched.filter((f)=>f.dow!=128)
        const holdsched ={dow:128, sched:edsched, until:holddate}
        rsched.push(holdsched)
      }
      rsched.sort((a,b)=>a-b)
      setSchdb(rsched)
      const dsched =rsched.slice()
      const keys = ['devid', 'senrel'].concat(Object.keys(dsched[0]))
      const values = dsched.map((e)=>{
        const d = {...e}
        d.sched = JSON.stringify(d.sched)
        return  [dinfo.dev, dinfo.sr].concat(Object.values(d))
      })
      console.log('keys: ', keys)
      console.log('values: ', values)
  }

  const upDate=(e)=>{
    console.log('e.target.value: ', e.target.value)
    setHolddate(e.target.value)
  }

  const modifySelected=()=>{
    nav2('DailyScheduler', {...prups, zinfo, asched:edsched, from:'WeeklyScheduler'}, zinf.id)
  }

  const changeRadio=(i)=>(e)=>{
    // console.log('e: ', e,target.value)
    // console.log('i: ', i)
    const psched = JSON.parse(e.target.value)
    // const psched = e.target.value
    setRadiock(i)
    setEdsched(psched)
  }

  const renderHeader=()=>{
    if(state){
      const ima = `./img/${zinf.img}`
      const zst = state[zinf.id]
      return(
        <header>
          <img src={ima} alt="a kid"/>
          <span>  {zinf.name}</span>
          <span> {zst.darr[0]}</span>
          <div>outside:{temp_out}</div>
          <div>set@{(zst.darr[2]+zst.darr[3])/2}</div>
        </header>
      )
    }
      return(
        <header>got no head</header>
      )

  }

  // const renderSchedStr = (sch)=>{
  //   const asched = sch.map((s,i)=>{
  //     const ti = hma2time(s)
  //     return (
  //       <span key={i} style={styles.schedstr}>
  //         <span> {ti} </span>
  //         <span > {s[3]}&deg;, </span>
  //       </span>
  //     )
  //   })
  //   return asched
  // }

  const renderAsched = (sch, idx)=>{
    return(
      <div>
        {/* {renderSchedStr(sch)} */}
        <CondensedSched sch={sch}/>
        <input name="radiosch" value={JSON.stringify(sch)} type="radio" 
          onChange={changeRadio(idx)} 
          checked={idx==radiock}
        />
      </div>
    )
  }

  const renderSchdb=()=>{
    if(schdb.length>0){
      const recs = schdb.map((s,i)=>{
        return(
          <li key={i} style={styles.li}>
            <span style={styles.schedstr}>{parseDays(s.dow)}</span><br/>
            {/* <span style={styles.schedstr}>{s.sched}</span> */}
            {renderAsched(s.sched, i)}
            {/* <input name="radiosch" value={JSON.stringify(s.sched)} type="radio" 
              onChange={changeRadio(i)} 
              checked={i==radiock}
            /> */}
          </li>
        )
      })
      return(
        <fieldset style={styles.fieldset}>
          <legend>Saved Schedules</legend>
        <ul style={styles.ul}>
          {recs}
        </ul>
        <button onClick={modifySelected}>modify selected</button><br/>
        </fieldset>
      )
    }
  }

  const renderCkboxes = ()=>{
    return(
      <fieldset>      
        <legend>Apply to days</legend>
        {/* <span style={styles.schedstr}>{renderSchedStr(edsched,0)}</span> */}
        <CondensedSched sch={edsched}/><br/>
        <input type="checkbox" name="days" value="0"/>DEFAULT <br/> 
        <input type="checkbox" name="days" value="1"/>Monday<br/>      
        <input type="checkbox" name="days" value="2"/>Tuesday<br/>      
        <input type="checkbox" name="days" value="4"/>Wednesday<br/>      
        <input type="checkbox" name="days" value="8"/>Thursday<br/>      
        <input type="checkbox" name="days" value="16"/>Friday<br/>      
        <input type="checkbox" name="days" value="32"/>Saturday<br/>      
        <input type="checkbox" name="days" value="64"/>Sunday<br/>      
        <input type="checkbox" name="days" value="128"/>HOLD until 
        <input onChange={upDate} value={holddate}type="date"/><br/>
        <button onClick={save2server}>Save to Server</button>
      </fieldset>
    )  
  }

  return(
    <div>
    {renderHeader()}
    {renderSchdb()}
    {renderCkboxes()}
    </div>
  )
}

export {WeeklyScheduler}

const styles={
  schedstr:{
    fontSize: 10
  },
  ul: {
    listStyleType:'none',
    listStylePosition: 'inside',
    paddingLeft: 0,
    margin:4
  },
  li:{
    borderStyle:'ridge'
  },
  fieldset:{
    paddingLeft: 4,
    paddingRight: 4
  }
}

const dows =['M', 'T', 'W', 'Th', 'F', 'S', 'Su']
const bdays=[1,2,4,8,16,32,64,128]

const parseDays=(n)=>{
  if(n==0){return 'default'}
  else if(n>=128) {return 'Hold'}
  else if(n=='current')return 'current'
  else{
    const idays= bdays
    .filter((d)=>d&n)
    .map((f)=>dows[Math.log2(f)])
    .reduce((acc, r)=>acc+','+r)
    return idays
  }
}
