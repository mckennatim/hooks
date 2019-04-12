import React from 'react'
import {parseQuery}from '../utilities/wfuncs'
import {fetchLocs} from '../services/fetches'
import { map } from 'rxjs/operators';

const FromAuth = (props)=>{

  console.log('props: ', props)

  const qry = parseQuery(props.cambio.page.params.query)
  const email= (qry.email)
  const message=(decodeURIComponent(qry.message))
  const token =(qry.token)

  console.log('qry,email,message,token: ', !qry.email,email,message,token)

  const getLocs =()=>{
    console.log('getting locs: ')
    fetchLocs(token).then((locs)=>{
      console.log(locs)
      return locs
    })
  }

  const dowhat =()=>{
    console.log('message: ', message)
    if (!qry.email){
      return(
        <div>
        <h4>You shit outta luck</h4>
        <p>There is no data</p>
        </div>
      )
    } else if (token===undefined){
      return(
        <div>
        <h4>You shit outta luck</h4>
        <span>{message}</span>
        </div>
      )
    } else {
      const data = getLocs()
      console.log('data: ', data)
      return(
        <div>
        <h4>You have apps at at least one location</h4>
        <ul>
        {data && data.map((d,i)=>(
          <li key={i}>d</li>
        ))}
        </ul>
        <button onClick={getLocs}>get locations you have apps at</button>
        </div>
      )
    }
  }

  return(
    <div>
      <h4>{email}, you have returned form social/email authentication </h4>
      {dowhat()}
    </div>
    
  )
}

export{FromAuth}