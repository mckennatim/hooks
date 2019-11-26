import React, {useState, useEffect} from 'react'
// import {fetchWeekSched, getDinfo, replaceWeekSched, replaceZoneScheds} from '../../npm/mqtt-hooks'
import {fetchWeekSched, getDinfo, replaceWeekSched, replaceZoneScheds} from '@mckennatim/mqtt-hooks'
import {cfg, ls} from '../utilities/getCfg'
import {nav2} from '../app'
import {CondensedSched} from './CondensedSched.jsx'
import Icon from '@material-ui/core/Icon';

const dat = new Date().toISOString().split('T')[0]

const WeeklyScheduler=(props)=>{
  const{prups}=props.cambio.page
  const {sched, state, zinfo, temp_out, devs, from, zones, mess }=prups
  const query = props.cambio.page.params.query
  const zinf = zinfo[0]
  
  const dinfo = devs ? getDinfo(zinf.id, devs): {dev: 'null', sr:-1}
  const initSchdb=[{dow:'current', sched:sched}]

  const [schdb, setSchdb] = useState(initSchdb)
  const [holddate,setHolddate]=useState(dat)
  const [edsched, setEdsched] = useState(sched)
  const [radiock, setRadiock] = useState(0)

  useEffect(()=>{
    fetchWeekSched(ls,cfg, dinfo.dev, dinfo.sr).then((data)=>{
      const nsched = initSchdb.slice()
      const sc = data.results.map((d)=>{
        return {dow:d.dow, sched:JSON.parse(d.sched)}
      })
      const ns = nsched.concat(sc)
      setSchdb(ns)
    })
  },[])

  const setNewSched=()=>{
    nav2(from, {...prups, sched:edsched, doupd:true}, query)
  }

  const createDowarr = ()=>{
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
    return dowarr
  }

  const copy2zones = ()=>{
    var dowarr = createDowarr()
    var elzone = [...document.getElementsByName("zone")];
    const ckzones = elzone
      .map((e)=>{
        if(e.checked) return e.value
      })
      .filter((f)=>f!=undefined)
    const devarr = ckzones.map((z)=>{
      const di = getDinfo(z, devs)
      return di
    })
    replaceZoneScheds(ls,cfg,{dowarr, devarr, edsched, holddate, season:'fall'}).then((r)=>console.log('r: ', r))
  }

  const save2server=()=>{
      const dowarr = createDowarr()
      dinfo.dowarr=dowarr
      dinfo.sched=edsched
      dinfo.until = dowarr.includes(128) ? holddate : '0000-00-00'
      const bits = dowarr.pop()
      //go through schedules and get modify dow's that exist
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
      //if dowarr includes zero and zero is in schedule edit it else add it
      if (dowarr.includes(0)){
        var foundit = false
        rsched = rsched.map((r)=>{
          if(r.dow==0){//change if exists
            foundit=true
            console.log('it exists')
            r.sched=edsched
          }
          return r
        })            
        if (!foundit){
          console.log('adding another')
          const zerosched = {dow:0,sched:edsched, until:'0000-00-00'}
          rsched.push(zerosched)
        }
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
      replaceWeekSched(ls,cfg,{dev:dinfo.dev, sr:dinfo.sr, keys,values})
  }

  const upDate=(e)=>{
    setHolddate(e.target.value)
  }

  const modifySelected=()=>{
    nav2('DailyScheduler', {...prups, zinfo, asched:edsched, from:'WeeklyScheduler'}, zinf.id)
  }

  const changeRadio=(i)=>(e)=>{
    const psched = JSON.parse(e.target.value)
    setRadiock(i)
    setEdsched(psched)
  }

  const renderHeader=()=>{
    if(state){
      const ima = `./img/${zinf.img}`
      const zst = state[zinf.id]
      const da = zst.darr
      const temp = da[0]
      const set = (da[2]+da[3])/2
      const onoff = da[1]
      const rt = {
        outer:{
          float:"right",
          margin: '6px',
        },
        up:{
          fontSize:'12px',
          fontFamily: 'Helvetica,Arial,sans-serif',
          float:'right',
          width: '42px',
          padding: '2px',
          borderRadius: '3px',
          background: onoff ? 'red' : 'rgba(38, 162, 43, 0.75)'
        },
        dn:{
          fontFamily: 'Helvetica,Arial,sans-serif',
          fontStretch: 'ultra-condensed',
          float:'right',
          fontSize: '8px'
        }
      }
      return(
        <header style={styles.header}>
          <div className='container'>
            <div className='item-img'>
              <img src={ima} alt={ima} width="70" height="70"/>
            </div>
            <div className='item-temp'>
              {temp} &deg;F
            </div>
            <div className='item-name'>
              {zinfo[0].name}
            </div> 
            <div className='item-setpt'>
              <div style={rt.up}>
                <span>{set} &deg;F</span><br/>
              </div><br/>
              <span style={rt.dn}>{mess}</span>
            </div> 
            <div className='item-til'>
              <div style={rt.dn}>
                {temp_out} &deg;F<a href="./"><Icon>arrow_back</Icon><Icon>house</Icon></a>
              </div>
            </div>                       
          </div>
        </header>   
        )
    }
      return(
        <header>
          no data: 
          <a href="./"><Icon>arrow_back</Icon><Icon>house</Icon></a>
        </header>
      )

  }

  const renderAsched = (sch, idx)=>{
    return(
      <div>
        <CondensedSched sch={sch} fontsz="9"/>
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
            {renderAsched(s.sched, i)}
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
        <CondensedSched sch={edsched}/><button onClick={setNewSched}>Change today</button><br/>
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

  const renderZones = ()=>{
    if(zones){
      const zck = zones
      .filter((f)=>f.id!='temp_out')
      .map((z,i)=>{
        return(
          <div key={i}> 
            <input type="checkbox" name="zone" value={z.id}/>{z.name} <br/> 
          </div>
        )
      })
      return (
        <fieldset>
          <legend>Apply to zones</legend>
          {zck}
          <button onClick={copy2zones}>Copy to Zones</button>
        </fieldset>
      )
    }
  }

  return(
    <div>
    {renderHeader()}
    {renderSchdb()}
    {renderCkboxes()}
    {renderZones()}
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
  },
  header:{
    // position: '-webkit-sticky',
    position: 'sticky',
    top: 0,
    backgroundImage: 'linear-gradient( #3c3c3c,#111 )'
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
