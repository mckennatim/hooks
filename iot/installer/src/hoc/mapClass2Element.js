import React from 'react'

function mapClass2Element(aClassElement){
  // eslint-disable-next-line react/display-name
  return (store)=>{
    const props= store
    return React.createElement(aClassElement, props)
  }
}

export{mapClass2Element}
