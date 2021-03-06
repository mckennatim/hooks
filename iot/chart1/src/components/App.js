import React from 'react'
import { TimeSeries, Index } from "pondjs";
import {
  Resizable,
  Charts,
  ChartContainer,
  ChartRow,
  YAxis,
  LineChart,
  styler
} from "react-timeseries-charts";
import data from "./data";



// const da = [
//   [1418274060000, 61.2],
//   [1418274420000, 61.3],
//   [1418274780000, 61.3],
//   [1418275140000, 61.3],
//   [1418275500000, 61.2],
//   [1418275800000, 61.1],
//   [1418276160000, 61],
//   [1418276520000, 61],
//   [1418276880000, 61.2],
//   [1418277180000, 61.6],
//   [1418277540000, 62.1],
//   [1418277900000, 62.3],
//   [1418278260000, 62.5],
//   [1418278560000, 62.6],
//   [1418278920000, 62.8],
//   [1418279280000, 62.8],
//   [1418279640000, 62.8],
//   [1418280000000, 62.8],
//   [1418280360000, 62.8],
//   [1418280720000, 62.8],
//   [1418281080000, 62.8],
//   [1418281380000, 62.8],
//   [1418281680000, 62.8],
//   [1418281980000, 62.8],
//   [1418282220000, 62.8],
//   [1418282520000, 62.7],
//   [1418282820000, 62.8],
//   [1418283120000, 62.8],
//   [1418283420000, 62.8],
//   [1418283720000, 62.9],
//   [1418284020000, 62.9],
//   [1418284320000, 62.8]
// ]  
//  const se = {
//   name: "hilo_rainfall",
//   columns: ["index", "precip"],
//   points: da
//  }
//  console.log('da: ', da)

// const ser = new TimeSeries(se);
const wdata=  [["2019-11-11T13:27:07.000Z",45],["2019-11-11T15:02:32.000Z",47],["2019-11-11T15:40:24.000Z",49],["2019-11-11T15:55:33.000Z",51],["2019-11-11T16:02:18.000Z",53],["2019-11-11T16:22:52.000Z",55],["2019-11-11T17:45:27.000Z",53],["2019-11-11T18:10:41.000Z",55],["2019-11-11T18:21:50.000Z",53],["2019-11-11T18:29:28.000Z",55],["2019-11-11T18:36:36.000Z",53],["2019-11-11T19:14:39.000Z",51],["2019-11-11T20:06:16.000Z",49],["2019-11-11T21:11:03.000Z",47],["2019-11-12T02:26:44.000Z",45],["2019-11-12T03:27:38.000Z",43],["2019-11-12T05:05:11.000Z",41],["2019-11-12T05:47:00.000Z",39],["2019-11-12T08:41:51.000Z",37],["2019-11-12T11:59:14.000Z",39],["2019-11-12T14:05:38.000Z",41],["2019-11-12T15:13:55.000Z",39],["2019-11-12T16:44:36.000Z",41],["2019-11-12T17:50:35.000Z",39],["2019-11-12T18:03:10.000Z",37],["2019-11-12T18:27:53.000Z",35],["2019-11-12T19:30:11.000Z",33],["2019-11-12T20:05:29.000Z",31],["2019-11-12T21:40:46.000Z",29],["2019-11-13T00:21:09.000Z",27],["2019-11-13T02:19:05.000Z",25],["2019-11-13T03:09:25.000Z",23],["2019-11-13T04:19:02.000Z",21],["2019-11-13T05:30:37.000Z",19],["2019-11-13T07:34:18.000Z",17],["2019-11-13T10:19:46.000Z",15],["2019-11-13T12:39:23.000Z",17],["2019-11-13T13:26:10.000Z",19],["2019-11-13T14:11:18.000Z",21],["2019-11-13T14:44:47.000Z",23],["2019-11-13T15:33:32.000Z",25],["2019-11-13T16:15:29.000Z",27],["2019-11-13T17:10:07.000Z",29],["2019-11-13T20:29:56.000Z",27],["2019-11-13T21:06:35.000Z",25],["2019-11-13T22:10:57.000Z",23],["2019-11-13T23:45:48.000Z",21],["2019-11-14T02:03:43.000Z",19],["2019-11-14T06:47:11.000Z",17],["2019-11-14T12:04:20.000Z",19],["2019-11-14T12:42:43.000Z",21],["2019-11-14T12:57:03.000Z",23],["2019-11-14T13:19:18.000Z",25],["2019-11-14T13:32:42.000Z",27],["2019-11-14T13:57:31.000Z",29],["2019-11-14T14:10:10.000Z",31],["2019-11-14T14:40:53.000Z",33],["2019-11-14T15:04:58.000Z",35],["2019-11-14T15:56:42.000Z",37],["2019-11-14T16:51:18.000Z",39],["2019-11-14T17:20:03.000Z",41],["2019-11-14T19:19:27.000Z",39],["2019-11-14T20:30:29.000Z",37]]

const xdata = wdata.map((w)=>{
  const d = w[0].split('.')[0]
  const e = d.replace("T", " ")
  return[e,w[1]]
})
console.log('xdata: ', xdata)
const v = {
  name: "hilo_rainfall",
  columns: ["index", "precip"],
  points: xdata
 }

const vr = new TimeSeries(v);

const App =()=>{

  const daseries={
    name: "hilo_rainfall",
    columns: ["index", "precip"],
    points: data.values.map(([d, value]) => [
      Index.getIndexString("1h", new Date(d)),
      value
    ])
  }

  console.log('daseries: ', daseries)

  const series = new TimeSeries(daseries);

  console.log("series is ", vr);
  const style = styler([
    {
      key: "precip",
      color: "red",
      selected: "#2CB1CF"
    }
  ]);

  return(
    <div>
      <h1>hell</h1>
      <Resizable>
        <ChartContainer timeRange={vr.range()}>
          <ChartRow height="150">
            <YAxis
              id="rain"
              label="Rainfall (inches/hr)"
              min={20}
              max={80}
              width="70"
              type="linear"
            />
            <Charts>
              {/* <BarChart
                axis="rain"
                style={style}
                spacing={1}
                columns={["precip"]}
                series={series}
                minBarHeight={1}
              /> */}
              <LineChart 
                axis="rain"
                style={style}
                series={vr}
                columns={["precip"]}
              />     
            </Charts>
          </ChartRow>
        </ChartContainer>
      </Resizable>
    </div>
  )
}

export{App}