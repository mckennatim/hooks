import React, {useContext} from 'react'
import { useDevSpecs, Context } from '@mckennatim/mqtt-hooks'
// import { useDevSpecs, Context } from '../../npm/mqtt-hooks'
import {cfg, ls} from '../utilities/getCfg'


const Config =()=>{
  const [client] = useContext(Context);
  const {devs, zones, binfo, specs}= useDevSpecs(ls, cfg, client, (devs)=>console.log('devs: ', devs))

  const renderSpecs = () =>{
    const thespecs = specs.map((s,i)=>{
      const server = JSON.parse(s.server)
      const spec = JSON.parse(s.specs)
      return(
        <li key={i}>{s.devid} <br/> 
        {s.description} <br/> 
        owner: {s.owner} <br/>
        hysteresis: {spec.hysteresis} <br/>
        <pre>{JSON.stringify(server, null, 4)}</pre>
        <pre>{JSON.stringify(spec, null, 4)}</pre>
        </li>
      )
    })
    return(
      <div>
      <ul>
        {thespecs}
      </ul>
      </div>
    )
  }

  return(
    <div>
      <h1>Config</h1>
      <pre>{JSON.stringify(devs, null, 2)}</pre><br/>
      <pre>{JSON.stringify(zones, null, 4)}</pre> <br/>
      <pre>{JSON.stringify(binfo, null, 4)}</pre>
      {specs && renderSpecs()}
    </div>
  )

}
export{Config}