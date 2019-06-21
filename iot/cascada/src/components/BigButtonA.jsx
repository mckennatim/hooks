import React, {useState} from 'react'
import '../styles/but.css'


const BigButtonA = (props)=>{
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
        <span style={styles.text}>{btext}</span>
      </div>
    </a>
    </div>
  )
}

export {BigButtonA}


// const pondBut ={
//   size:{
//     height:"110px",
//     width: "110px"
//   }, 
//   text:{
//     color: "white",
//     position: "relative",
//     left: "3%",
//     top: "3%",
//     margin: "6px",
//     fontSize: "1.0em",
//     textShadow: "blue 2px 2px"
//   }
// }