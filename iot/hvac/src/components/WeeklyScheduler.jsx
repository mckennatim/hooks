import React, {useState, useEffect} from 'react'
import {fetchWeekSched, getDinfo} from '../../npm/mqtt-hooks'
import {cfg, ls} from '../utilities/getCfg'
// import Checkbox from '@material-ui/core/Checkbox';
// import FormGroup from '@material-ui/core/FormGroup';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import FormControl from '@material-ui/core/FormControl';
// import FormLabel from '@material-ui/core/FormLabel';
const WeeklyScheduler=(props)=>{
  const{prups}=props.cambio.page
  const {sched, state, zinfo, temp_out, devs }=prups
  const zinf = zinfo[0]
  const initSchdb=[{dow:'current', sched:sched}]

  //[[{dow:31, pro:[[]]}], [{dow:31, pro:[[]]}]]  
  const [schdb, setSchdb] = useState(initSchdb)
  const [holddate,setHolddate]=useState('2019-10-29')

  useEffect(()=>{
    const dinf = devs ? getDinfo(zinf.id, devs): {dev: 'null', sr:-1}
    console.log('dinf: ', dinf)
    fetchWeekSched(ls,cfg, dinf.dev, dinf.sr).then((data)=>{
      console.log('data: ', data)
      const nsched = initSchdb.slice()
      const sc = data.results.map((d)=>{
        return {dow:d.dow, sched:JSON.parse(d.sched)}
      })
      const ns = nsched.concat(sc)
      setSchdb(ns)
    })
  },[])

  console.log('schdb: ', schdb)

  const save2server=()=>{
    var checkboxes = [...document.getElementsByName("days")];
    const savedayarr = []
    const ch = checkboxes
      .map((c)=>{
        if(c.checked){
          if (c.value == 0 || c.value==128){
            savedayarr.push(c.value*1)
          }else{
            return c.value*1
          }
        }
      })
      .filter((d)=>d!=undefined)
      .reduce((acc, e)=>e+acc, 0)
      savedayarr.push(ch)
      console.log('savedayarray: ', savedayarr)

  }

  const upDate=(e)=>{
    console.log('e.target.value: ', e.target.value)
    setHolddate(e.target.value)
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

  const renderSchdb=()=>{
    if(schdb.length>0){
      console.log('schdb: ', schdb)
      const recs = schdb.map((s,i)=>{
        return(
          <li key={i} style={styles.li}>
            <span style={styles.schedstr}>{parseDays(s.dow)}</span><br/>
            <span style={styles.schedstr}>{JSON.stringify(s.sched)}</span>
            <input type="radio"/>
          </li>
        )
      })
      return(
        <ul style={styles.ul}>
          {recs}
        </ul>
      )
    }
  }

  const renderCkboxes = ()=>{
    return(
      <fieldset>      
        <legend>Apply to days</legend>      
        <input type="checkbox" name="days" value="0"/>DEFAULT <br/> 
        <input type="checkbox" name="days" value="1"/>Monday<br/>      
        <input type="checkbox" name="days" value="2"/>Tuesday<br/>      
        <input type="checkbox" name="days" value="4"/>Wednesday<br/>      
        <input type="checkbox" name="days" value="8"/>Thursday<br/>      
        <input type="checkbox" name="days" value="16"/>Friday<br/>      
        <input type="checkbox" name="days" value="32"/>Saturday<br/>      
        <input type="checkbox" name="days" value="64"/>Sunday<br/>      
        <input type="checkbox" name="days" value="128"/>HOLD<br/> 
        <input onChange={upDate} value={holddate}type="date"/>
      </fieldset>
    )  
  }

  return(
    <div>
      {renderHeader()}
    <h3>Schedules</h3>
    {renderSchdb()}
    <button>modify selected</button><br/>
    <span style={styles.schedstr}>{JSON.stringify(sched)}</span><br/>
    {renderCkboxes()}
    <button onClick={save2server}>Save to Server</button>
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
    paddingLeft: 0
  },
  li:{
    borderStyle:'ridge'
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
