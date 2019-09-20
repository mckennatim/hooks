import React from 'react'

const Dog = React.memo((props)=>{// eslint-disable-line react/display-name
  console.log('props: ', props)
  return (
    <div>
      <h1>hi dog</h1>
    </div>
  )
})

export{Dog}