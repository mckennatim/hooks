import React, {useState} from 'react'
import '../css/but.css'


const BigButton = (props)=>{
  const {image, btext, styles} = props
  const siz = styles.size
  const [face, setFace]= useState({...siz, backgroundImage:`url(${image})`})

  if (face.backgroundImage !=`url(${image})`){
    setFace({...face, backgroundImage: `url(${image})`})
  }

  const handleClick = ()=>{
    props.toggleOnoff()
  }

  return(
    <div >
    <a onClick={handleClick}>
      <div className="but" style={face}>
        <span style={styles.text}>{btext}&deg;</span>
      </div>
    </a>
    </div>
  )
}

export {BigButton}

