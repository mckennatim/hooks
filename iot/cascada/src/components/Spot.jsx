import React, {useState, useEffect} from 'react'
import {RadioGroup, Radio} from 'react-radio-group'
import {BigButtonA} from './BigButtonA.jsx'
import on100 from '../img/on100.gif'
import off100 from '../img/off100.gif'
import spinning from '../img/loading60.gif'
import timed from '../img/loadno60.gif'
import {spotBut} from '../styles/appstyles'
import {startWhen, endWhen, newInterval, add2sched, m2hm, m2ms} from '@mckennatim/mqtt-hooks'

const Spot=(props)=>{
  const{tzd_tza, data, zinf, dinf, client, publish}= props
  const href = `#sched?${zinf.name}`
  const [onoff, setOnoff]= useState(0)
  const [image, setImage] = useState(off100)
  const [wtext, setWtext] = useState("howlong")
  const [howlong, setHowlong]= useState(1)
  const [delay, setDelay]= useState('0:0')

  const imageToggled = ()=>{
    if (wtext=='settingtimer'){
      const starttime = startWhen(tzd_tza, delay)
      const endtime = endWhen(starttime, m2hm(howlong))
      const nintvl = newInterval(starttime,[1], endtime, [0])
      const sched =data.pro
      const nsched =add2sched(sched, nintvl, tzd_tza)
      const prog =JSON.stringify(nsched)
      const topic = `${dinf.dev}/prg`
      const payload = `{"id":${dinf.sr},"pro":${prog}}`
      publish(client, topic, payload)
      if (delay=='0:0'){
        setWtext('timeron')
        setImage(spinning)
      }
    }
  }

  useEffect(()=>{
    if(data.status=='off'){
      setImage(off100)
      setWtext('')
    }  else if (data.status=='on'){
      setImage(on100)
      setWtext(``)
    } else if (data.status=='timed') {
      setOnoff(1)
      setImage(spinning)
      setWtext(`timeron`)
    }
  }, [data.status])

  const handleRadio =(value)=>{
    if (value == 'on'){
      setImage(spinning)
      setWtext('on')
      setOnoff(0)
      const prog ='[[0,0,1]]'
      const topic = `${dinf.dev}/prg`
      const payload = `{"id":${dinf.sr},"pro":${prog}}`
      publish(client, topic, payload)
    }
    if (value == 'off'){
      setWtext('off')
      setImage(spinning)
      setOnoff(1)
      const prog ='[[0,0,0]]'
      const topic = `${dinf.dev}/prg`
      const payload = `{"id":${dinf.sr},"pro":${prog}}`
      publish(client, topic, payload)
    }
    if(value=='timed'){
      setImage(timed)
      setWtext('settingtimer')
    }
  }

  const setBtext=()=>{
    if (wtext=='settingtimer'){
      return howlong
    }
    if (wtext=='timeron'){
      return m2ms(data.timeleft)
    }
  }
  
  const handleChange = (e)=>{
    setHowlong(e.target.value)
  }

  const handleDelay = (e)=>{
    setDelay(e.target.value)
  }

  const isTimed=()=>wtext=='timeron'? true : false


  return(
    <div>
      <h3 style={{color:'yellow'}}> {zinf.name}</h3>
      <div className="radio-group">
        <RadioGroup
          name={zinf.name}
          selectedValue={data.status}
          onChange={handleRadio}>
          <div>
            <label><Radio value="on" disabled={isTimed()} />On</label>
            <label><Radio value="timed" />Timed</label>
            <label><Radio value="off" />Off</label>
          </div>
        </RadioGroup>
        </div>
      <BigButtonA
        onoff={onoff}
        toggleOnoff={imageToggled}
        image={image}
        btext={setBtext()}
        styles={spotBut}
      ></BigButtonA>
      <div>
        <input className="slider" type="range" min="1" max="120" step="1" value={howlong} onChange={handleChange}></input><br/>
        delay as hr:min <input type="text" size="2" value={delay} onChange={handleDelay}/>
        <br/>
        <span style={{fontSize: ".6em"}}>{JSON.stringify(data.pro)}</span><br/>
        <a href={href}>
          <span style={{fontSize: ".6em"}}>Modify the db schedule for {zinf.name}</span>
        </a><br></br>
      </div>
    </div>
  )
}

export{Spot}
