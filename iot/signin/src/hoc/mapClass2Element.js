import React from 'react'

function mapClass2Element(aClassElement){
  return (store)=>{
    const props= store
    return React.createElement(aClassElement, props)
  }
}

export{mapClass2Element}
