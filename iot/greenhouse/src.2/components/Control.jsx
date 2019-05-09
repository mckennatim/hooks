import React, {useEffect, useState}from 'react'
//import{publish,connect, client }from '../services/mq'
import {fetchDevZones} from '../services/fetches'

const Control = (props)=>{
  console.log('props: ', props)
  const {cambio}= props
  const{qconn}=cambio
  console.log('qconn: ', qconn)

  const [specs, setSpecs] = useState({});
  const [devs,setDevs] = useState(undefined)

  console.log('specs: ', specs)
  useEffect(() => {
    console.log('fetchDevZones effect is running')
    let didCancel=false
    if(!didCancel){
      fetchDevZones().then((data)=>{
        setSpecs(data)
        const devs = Object.keys(data.devs)
        console.log('devs: ', devs)
        setDevs(devs)
        // connect(devs)
      })
    }
    return ()=>{
      didCancel=true
    }
  }, []);

  console.log('devs: ', devs)
  // useEffect(()=>{
  //   console.log('running connect effect')
  //   console.log('devs: ', devs)
  //   connect(devs)
  //   return qconn ? client.disconnect() : undefined
  // },[])

  // window.onfocus = ()=>{
  //   console.log('focused')
  //   connect(devs)
  // }

  // window.onblur= ()=>{
  //   console.log('unfocused')
  //   try{
  //     client.disconnect()
  //   }catch(err){
  //     console.log(err)
  //   }
  // }

  // if(qconn){
  //   console.log('in publish')
  //   publish('presence', 'Dogs and cats forever ');
  // }
  return(
    <div specs={specs} >
      {JSON.stringify(props)}
      <h3>in Control</h3>
    </div>
  )
}

export{Control}