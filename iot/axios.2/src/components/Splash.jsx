import React from 'react'

const Splash = () =>{
  function goprod(){
    console.log("in home goprod")
    // router.navigate('/about');
  }
  return(
    <div>
      <h3> Home </h3>
      <button id="but" onClick={goprod}>goto about</button>
    </div>
  )
}

export{Splash}