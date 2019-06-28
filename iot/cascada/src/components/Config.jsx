import React, {useContext} from 'react'
import { useDevSpecs, Context } from '@mckennatim/mqtt-hooks'
import {cfg, ls} from '../utilities/getCfg'


const Config =()=>{
  const [client] = useContext(Context);
  const {devs, zones, binfo}= useDevSpecs(ls, cfg, client, (devs)=>console.log('devs: ', devs))
  console.log('devs, zones, binfo: ', devs, zones, binfo)

  return(
    <div>
      <h1>Config</h1>
      <pre>{JSON.stringify(devs, null, 2)}</pre><br/>
      <pre>{JSON.stringify(zones, null, 4)}</pre> <br/>
      <pre>{JSON.stringify(binfo, null, 4)}</pre>
    </div>
  )

}
export{Config}