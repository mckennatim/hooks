import React from 'react'
import {fetchDevZones} from '../services/fetches'

const AppLoc = (props)=>{
  console.log('props: ', props)
  const{page}=props.cambio

  const getSpecZones=()=>{
    if(page.params && page.params.query){
      fetchDevZones(page.params.query).then((data)=>{
        console.log('data: ', data)
      })
    }
  }

  getSpecZones()


  return(
    <h1>AppLoc</h1>
  )
}

export{AppLoc}