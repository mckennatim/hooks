import React,{useState,useContext, useEffect} from 'react'
// import {fetchBigData,useDevSpecs, Context, getDinfo} from'../../npm/mqtt-hooks'
import {fetchBigData,useDevSpecs, Context, getDinfo} from'@mckennatim/mqtt-hooks'
import {cfg, ls} from '../utilities/getCfg'
import { TimeSeries} from "pondjs";
import { Charts, ChartContainer, ChartRow, YAxis, LineChart, styler } from "react-timeseries-charts";
import Icon from '@material-ui/core/Icon';

const dt = new Date()
console.log('dt: ', dt)
const pd = new Date()
pd.setHours(pd.getHours()-80)

const todate =dt.toJSON().split('T')[0]
const frdate =pd.toJSON().split('T')[0]

const blout = {
  name: "temps",
  columns: ["time", "temp", "setpt", "calling"],
  points: [["2019-11-06T19:15:31.000Z",67,68,1]]
}

const BigData = (props)=>{
  const [client] = useContext(Context);
  const {devs, zones}= useDevSpecs(ls, cfg, client, (devs)=>{
    const dbo = {fro:fdate, too:tdate, devs:Object.keys(devs)}
    fetchBigData(ls,cfg,dbo).then((data)=>prepareTimeSeries(data))
  })
  const{responsive}=props

  const[fdate, setFdate]=useState(frdate)
  const[tdate, setTdate]=useState(todate)
  const[allck, setAllck]=useState(true)
  // const[rdata,setRdata]=useState(undefined)
  const [out, setOut]=useState(new TimeSeries(blout))
  const [seriarr,setSeriarr]= useState([])

  var elzone = [...document.getElementsByName("zone")];

  const toggleAll = ()=>{
    elzone.map((z)=>{
      z.checked=!allck
    })
  }

  useEffect(()=>{
    console.log('in useEffect')
    console.log('allck: ', allck)
    toggleAll()
  },[elzone.length])

  const getData = ()=>{
    console.log('devs, zones: ', devs, Object.keys(devs))
    const dbo = {fro:fdate, too:tdate, devs:Object.keys(devs)}
    fetchBigData(ls,cfg,dbo).then((data)=>{
      prepareTimeSeries(data)
      prepareOtherSeries(data)
    })
  }

  const prepareTimeSeries = (data)=>{
    const gdata = data.results
      .filter((f)=>f.dev=='CYURD006')
      .map((m)=>{
        const e = new Date(m.timestamp).getTime();
        return [e, m.temp]
      })
    const aseries = {
      name: "outside temp",
      columns: ["time", "temp"],
      points: gdata
    }
    const nta = new TimeSeries(aseries)
    const cop = seriarr.slice()
    cop.push(aseries)
    setSeriarr(cop) 
    setOut(nta) 
  }

  const prepareOtherSeries =(data)=>{
    const ckzones = elzone
      .map((e)=>{
        if(e.checked) return e.value
      })
      .filter((f)=>f!=undefined)
    const devarr = ckzones.map((z)=>{
      const di = getDinfo(z, devs)
      return di
    })
    const oser = devarr.map((v)=>{
      const fdata = data.results
        .filter((f)=>f.dev==v.dev&&f.sr==v.sr)
        .map((m)=>{
          const e = new Date(m.timestamp).getTime();
          return [e, m.temp, m.setpt]
        })
      const obj = {
        name: v.label,
        columns:["time", "temp", "setpt"],
        points:fdata
      }
      return obj          
    })
    setSeriarr(oser)
  }

  /* for checking contents of time series
  for (let i=0; i < out.size(); i++) {
    console.log(out.at(i).toString());
  }
  */

  const style = styler([
    {
      key: "temp",
      color: "red",
      selected: "#2CB1CF"
    },
    {
      key: "setpt",
      color: "blue",
      selected: "#2CB1CF"      
    }
  ]);
  
  const toggleCk = ()=>{
    toggleAll()
    setAllck(!allck)
  }

  const renderZones = ()=>{
    if(Object.entries(zones).length!=0){
      const zck = zones
      .filter((f)=>f.id!='timer')
      .map((z,i)=>{
        return(
          <div key={i}> 
            <input type="checkbox" name="zone" value={z.id}/>{z.name} <br/> 
          </div>
        )
      })
      return (
        <fieldset>
          <legend>Display zones</legend>
          {zck}
          <span>All/None </span>
          <input 
            type="checkbox" 
            name="allzone" 
            value="all" 
            checked={allck}
            onChange={toggleCk}/> <br/>
        </fieldset>
      )
    }
  }    

  const renderCharts =()=>{
    console.log('seriarr.length: ', seriarr.length)
    if (seriarr.length>0){
      const recs=seriarr.map((oj,i)=>{
        const o = new TimeSeries(oj)
        oj.columns.slice(1)
        return(
          <LineChart 
            key={i}
            axis="axis1" 
            style={style}
            series={o}
            columns={["temp"]}
          />        
        )
      })
      return(
        <Charts>
          {recs}
        </Charts>
      )
    }else{
      return(
        <Charts></Charts>
      )
    }
  }

  const renderChartContainer = ()=>{
    if(seriarr.length>0){
      return(
        <div style={styles.content}>
        <ChartContainer timeRange={out.timerange()} width={responsive.size}>
          <ChartRow height="250">
              <YAxis 
                id="axis1" 
                label="temperature" 
                min={0} 
                max={70} 
                width="50"
                type="linear" 
              />
              {renderCharts()}
          </ChartRow>
        </ChartContainer>
        </div>  
        )  
    }
  }



  return(
    <div>
      <header>
        <h4>BIG data</h4>
        <a style={styles.ico} href="./"><Icon>arrow_back</Icon><Icon>house</Icon></a>
      </header>
      <div>
        <fieldset>
        <legend>choose date range</legend>
        <input type="date" value={fdate} onChange={e=>setFdate(e.target.value)} />
        <input type="date" value={tdate} onChange={e=>setTdate(e.target.value)}/>
        <button onClick={getData}>get data</button>
        </fieldset>
      </div>
      {renderZones()}
      {renderChartContainer()}
    </div>
  )
}

export{BigData}

const styles ={
  content:{
    background: 'white'
  },
  ico:{
    color:'white'
  }
}