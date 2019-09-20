import React from 'react'
import {makeHref}from '../utilities/getCfg'

const Splash = () =>{
  const signin = makeHref(window.location.hostname, 'signin', '')
  return (
    <div>
      <h1>splash</h1>
      <a href="#control">control</a><br/>
      <a href={signin}>signin</a>
      
    </div>
  );
}

export{Splash}