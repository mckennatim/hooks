function coord2rad(dy,dx){
  var ang
  if(dx==0){
    dy>0 ? ang=pi/2 :ang=3*pi/2
  }else{ang=Math.atan(dy/dx)}
  if(dx>0&&dy<0){
    ang=ang+2*pi
  }else if (dx<0){
    ang=ang+pi
  }
  return ang
}

function drawRadio(orad,r){
  var xo = Math.round(r*Math.cos(orad)+cx)
  var yo = Math.round(-r*Math.sin(orad)+cy)
  var str = `M${cx} ${cy} L${xo} ${yo} `
  console.log(str)
  prad.setAttribute("d", str)
  smcircle.setAttribute("cx", xo)
  smcircle.setAttribute("cy", yo)    
}

const mydog=()=>{
  console.log('my do is ulysses')
}

export{coord2rad, drawRadio, mydog}