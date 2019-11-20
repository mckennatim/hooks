import React,{useState,useContext, useEffect} from 'react'
import {fetchBigData,useDevSpecs, Context, getDinfo} from'../../npm/mqtt-hooks'
import {cfg, ls} from '../utilities/getCfg'
import { TimeSeries} from "pondjs";
import { Charts, ChartContainer, ChartRow, YAxis, LineChart, styler } from "react-timeseries-charts";

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
  const {devs, zones}= useDevSpecs(ls, cfg, client, (devs, zones)=>{
    console.log('devs', devs, Object.keys(devs))
    console.log('zones: ', zones)
    const dbo = {fro:fdate, too:tdate, devs:Object.keys(devs)}
    // toggleAll()
    fetchBigData(ls,cfg,dbo).then((data)=>prepareTimeSeries(data))
  })
  // console.log('devs, zones, binfo: ', devs, zones, binfo, specs)
  const{responsive}=props

  const[fdate, setFdate]=useState(frdate)
  const[tdate, setTdate]=useState(todate)
  const[allck, setAllck]=useState(true)
  const[rdata,setRdata]=useState(undefined)
  const [out, setOut]=useState(new TimeSeries(blout))
  const [seriarr,setSeriarr]= useState([])

  var elzone = [...document.getElementsByName("zone")];
  // console.log('elzone.length: ', elzone.length)

  const toggleAll = ()=>{
    console.log('allck: ', allck)
    // var elzone = [...document.getElementsByName("zone")];
    console.log('elzone: ', elzone)
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
    setRdata(data)
    const gdata = data.results
      .filter((f)=>f.dev=='CYURD006')
      .map((m)=>{
        const e = new Date(m.timestamp).getTime();
        return [e, m.temp]
      })
    // console.log('gdata: ', JSON.stringify(gdata))  
    const aseries = {
      name: "outside temp",
      columns: ["time", "temp"],
      points: gdata
    }
    const nta = new TimeSeries(aseries)
    console.log('nta: ', nta)
    const cop = seriarr.slice()
    cop.push(aseries)
    setSeriarr(cop) 
    setOut(nta) 
    // prepeareOtherSeries(data)
  }

  const prepareOtherSeries =(data)=>{
    console.log('preparing other')
    console.log('elzone.length: ', elzone.length)
    console.log('rdata: ', rdata)
    console.log('data: ', data)
    const ckzones = elzone
      .map((e)=>{
        if(e.checked) return e.value
      })
      .filter((f)=>f!=undefined)
    console.log('ckzones: ', ckzones)
    const devarr = ckzones.map((z)=>{
      console.log('z, devs: ', z, devs)
      const di = getDinfo(z, devs)
      return di
    })
    console.log('devarr: ', devarr)
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

  for (let i=0; i < out.size(); i++) {
    // console.log(out.at(i).toString());
  }

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

  // console.log('seriarr: ', seriarr)
  // console.log('out: ', out)

  // if(seriarr.length>0){
  //   console.log('seriarr[0].min("temp): ', seriarr[0].min("temp"))
  // }
  // console.log('out: ', out, out.range(), out.min("temp"), out.max("temp"), out.avg("temp"))
  
  const toggleCk = ()=>{
    // console.log('toggleCk')
    toggleAll()
    setAllck(!allck)
    console.log('allck: ', allck)
  }

  const renderZones = ()=>{
    // console.log('zones: ', Object.entries(zones).length)
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
      // const colus = ["temp", "setpt", "calling"]
      const recs=seriarr.map((oj,i)=>{
        console.log('oj: ', oj)
        const o = new TimeSeries(oj)
        console.log('o: ',o)
        console.log('o.name(): ', o.name())
        const cols = oj.columns.slice(1)
        // const cols=["temp"]
        console.log('cols: ', cols)
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
      // const dog = seriarr[0]
      // console.log('dog: ', dog)
      // const nta = new TimeSeries(dog)
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
              {/* <Charts>
                <LineChart 
                  key="x"
                  axis="axis1" 
                  style={style}
                  series={nta}
                  columns={["temp"]}
                /> 
              </Charts> */}
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
        <a href="./">goback</a>
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
      {/* <div style={styles.content}>
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
            <Charts>
              <LineChart 
                key="x"
                axis="axis1" 
                style={style}
                series={out}
                columns={["temp"]}
              /> 
            </Charts>
            
        </ChartRow>
      </ChartContainer>
      </div> */}
    </div>
  )
}

export{BigData}

const styles ={
  content:{
    background: 'white'
  }
}