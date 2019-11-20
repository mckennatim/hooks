import React,{useState} from 'react'
import {fetchBigData} from'../../npm/mqtt-hooks'
import {cfg, ls} from '../utilities/getCfg'
import { TimeSeries} from "pondjs";
import { Charts, ChartContainer, ChartRow, YAxis, LineChart, styler } from "react-timeseries-charts";

const dt = new Date()
const pd = new Date()
pd.setHours(pd.getHours()-80)

const totime = dt.toTimeString().split(' ')[0]
const todate =dt.toJSON().split('T')[0]
const frtime = pd.toTimeString().split(' ')[0]
const frdate =pd.toJSON().split('T')[0]

const blout = {
  name: "temps",
  columns: ["time", "temp"],
  points: [["2019-11-06T19:15:31.000Z",67]]
}

const BigData = (props)=>{
  const{responsive, cambio}=props
  
  const[fdate, setFdate]=useState(frdate)
  const[tdate, setTdate]=useState(todate)
  const[ttime, setTtime]=useState(totime) 
  const[ftime, setFtime]=useState(frtime) 
  const [out, setOut]=useState(new TimeSeries(blout))

  const getData = ()=>{
    
    const{devs,zones} =cambio.page.prups
    const fro = `${fdate}T${ftime}`
    const too = `${tdate}T${ttime}`
    console.log('fro: ', fro, too)
    console.log('devs, zones: ', devs, zones, Object.keys(devs))
    const dbo = {fro, too, devs:Object.keys(devs)}
    fetchBigData(ls,cfg,dbo).then((data)=>{
      console.log('data: ', data)
      const gdata = data.results
        .filter((f)=>f.dev=='CYURD006')
        .map((m)=>{
          // const d = m.timestamp.split('.')[0]
          // const e = d.replace("T", " ")
          const e = new Date(m.timestamp).getTime();
          return [e, m.temp]
        })
      console.log('gdata: ', JSON.stringify(gdata))  
      const aseries = {
        name: "temps",
        columns: ["time", "temp"],
        points: gdata
      }
      // const bseries =new TimeSeries(aseries)
      setOut(new TimeSeries(aseries))
    })
  }

  for (let i=0; i < out.size(); i++) {
    console.log(out.at(i).toString());
  }

  const style = styler([
    {
      key: "temp",
      color: "red",
      selected: "#2CB1CF"
    }
  ]);


    console.log('out: ', out, out.range(), out.min("temp"), out.max("temp"), out.avg("temp"))

  return(
    <div>
      <header>
        <h4>BIG data</h4>
      </header>
      <div>
        <fieldset>
        <legend>choose time range</legend>
        <input type="date" value={fdate} onChange={e=>setFdate(e.target.value)} />
        <input type="time" value={ftime} onChange={e=>setFtime(e.target.value)}/><br/>
        <input type="date" value={tdate} onChange={e=>setTdate(e.target.value)}/>
        <input type="time" value={ttime} onChange={e=>setTtime(e.target.value)}/>
        <button onClick={getData}>get data</button>
        </fieldset>
      </div>
      <div style={styles.content}>
      <ChartContainer timeRange={out.timerange()} width={responsive.size}>
        <ChartRow height="250">
            <YAxis 
              id="axis1" 
              label="temperature" 
              min={0} 
              max={70} 
              width="50"
              type="linear" />
            <Charts>
              <LineChart 
                axis="axis1" 
                style={style}
                series={out}
                columns={["temp"]}
              />
            </Charts>
        </ChartRow>
      </ChartContainer>
      </div>
    </div>
  )
}

export{BigData}

const styles ={
  content:{
    background: 'white'
  }
}