import {coord2rad, drawRadio, mydog} from './utility.js'

var cx=200;
var cy=200;
var r=100
var pi=Math.PI
var pointerType
var bx,by, orad, erad, eang, oang;
var inner = document.getElementById('inner');
var svg = document.getElementById('svg');
var time = document.getElementById('time');
var rect = document.getElementById('rect');
var prad = document.getElementById('prad');
var circle = document.getElementById('circle');
var smcircle = document.getElementById('smcircle');
var mes = document.getElementById('mes');
var mes1 = document.getElementById('mes1');

smcircle.addEventListener("touchcancel", handleCancel, false);

window.addEventListener("pointerdown", detectInputType, false);
//pointerType="touch"
function detectInputType(e){
  console.log('detecting ', e.pointerType)
  //mes.innerHTML=e.width+e.pointerType
  pointerType=e.pointerType
  if(pointerType=="mouse"){
    smcircle.addEventListener("mousedown", handleStart, false);
    svg.addEventListener("mousemove", handleMove, false); 
    svg.addEventListener("mouseup", handleEnd, false); 
  }else{
    smcircle.addEventListener("touchstart", handleStart, false);
    smcircle.addEventListener("touchmove", handleMove, false);    
    smcircle.addEventListener("touchend", handleEnd, false);
  }    
}

function handleStart(e){
  console.log("in handle start")
  e.preventDefault();
  console.log(e.target.id)
  console.log(e.type)
  bx = Math.round(smcircle.getAttribute("cx"))
  by = Math.round(smcircle.getAttribute("cy"))
  console.log('center '+bx+','+by)
  var dex = bx-cx
  var dey = cy-by
  orad = calcAng(dey,dex)  
  oang = (orad*180/Math.PI).toFixed(1)
  var rlen = (Math.sqrt(Math.pow(dex,2)+Math.pow(dey,2)))
  if (rlen > r+1){
    console.log('on the outside')
    rect.setAttribute("fill", "bisque")
    appendDecan("svg", orad, r, rlen, 3)
  }else{
    console.log("on the circle")
    smcircle.setAttribute("r", 10)
    rect.setAttribute("fill", "yellow")
  }
  mes.innerHTML=oang
  console.log("start ang ", orad, "rlen", rlen)
}

function calcAng(dy,dx){
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

function handleEnd(e){
  e.preventDefault();
  rect.setAttribute("fill", "none")
  var ex, ey 
  if(pointerType=="mouse"){
    svg.removeEventListener("mousemove",handleMove, false);
    ex  = Math.round(e.clientX)
    ey = Math.round(e.clientY) 
  }else{
    var touchobj = e.changedTouches[0]
    ex = Math.round(touchobj.pageX)
    ey = Math.round(touchobj.pageY)    
  }  
  var dex = ex-cx
  var dey = cy-ey
  var dist = (Math.sqrt(Math.pow(bx-ex,2)+Math.pow(by-ey,2)))
  erad = calcAng(dey,dex)
  eang =(erad*180/Math.PI).toFixed(1)
  // var erad = (Math.atan2(dey,dex)*180/Math.PI).toFixed(1)      
  smcircle.setAttribute("r", 12)
  mes1.innerHTML="angend "+eang+" angbeg "+oang+" dist "+dist.toFixed(1)
  if(Math.abs(eang-oang)<20 && dist>30){
    console.log("is a swipe")
    mes.innerHTML="Swiped "
    drawRadius(orad)
  }
  console.log("handleEnd")
}

function drawRadius(orad){
  var xo = Math.round(r*1.4*Math.cos(orad)+cx)
  var yo = Math.round(-r*1.4*Math.sin(orad)+cy)
  var str = `M${cx} ${cy} L${xo} ${yo} `
  console.log(str)
  prad.setAttribute("d", str)
  smcircle.setAttribute("cx", xo)
  smcircle.setAttribute("cy", yo)    
}

function handleCancel(e){
  e.preventDefault();
  smcircle.setAttribute("r", 12)
  mes1.innerHTML="LOSTit"
  console.log("handleCancel")
}
var tx, ty, dx, dy, nx, ny, ang, fang, mrad;


function handleMove(ev){
  ev.preventDefault();
  var e
  if(pointerType=="mouse"){
    e= ev
  }else{
    e=ev.touches[0]
  }
  tx = Math.round(e.clientX)
  ty = Math.round(e.clientY)
  dx = tx-cx
  dy = ty-cy
  mrad = calcAng(dy,dx) 
  console.log(mrad)
  nx =  (r*Math.cos(mrad)+cx).toFixed(1)
  ny = (r*Math.sin(mrad)+cy).toFixed(1)
  mes1.innerHTML = (24-mrad*3.819719).toFixed(1)
  time.innerHTML = (24-mrad*3.819719).toFixed(1)
  smcircle.setAttribute("cx", nx)
  smcircle.setAttribute("cy", ny)
}

const handleClick = (e)=>{
  console.log('clicked')
  console.log('e: ', e.path[1].id)
  const rn = document.getElementById( e.path[1].id)
  console.log('rn: ', rn)
  svg.removeChild(e.path[1])
}

function appendDecan(el, ang, rfrom, rto, hrs){
  //create paths
  var stx = rfrom*Math.cos(ang)+cx
  var sty = -rfrom*Math.sin(ang)+cy
  var sox = rto*Math.cos(ang)+cx
  var soy = -rto*Math.sin(ang)+cy
  var nang = ang +hrs/24*Math.PI*2
  if (nang > Math.PI*2){
    nang =nang-Math.PI*2
  }
  var etx = rfrom*Math.cos(nang)+cx
  var ety = -rfrom*Math.sin(nang)+cy
  var eox = rto*Math.cos(nang)+cx
  var eoy = -rto*Math.sin(nang)+cy
  var leg1d = `M${stx} ${sty} L${sox} ${soy} `
  var leg2d = `M${etx} ${ety} L${eox} ${eoy} `
  var mid = `M${sox} ${soy} A${rto}, ${rto} 0 0,0 ${eox}, ${eoy} `
  console.log('nang',nang,'legid',leg1d)
  mydog()
  //insert into DOM
  var svgURI = 'http://www.w3.org/2000/svg';
  var g1 = document.createElementNS( svgURI, 'g' );
  var seg1 = document.createElementNS( svgURI, 'path' );
  var seg2 = document.createElementNS( svgURI, 'path' );
  var seg = document.createElementNS( svgURI, 'path' );
  //createCorner(x,y,r)
  seg1.setAttribute( 'd', leg1d)
  seg2.setAttribute( 'd', leg2d)
  seg.setAttribute( 'd', mid)
  g1.setAttribute( 'stroke-width', "5")
  g1.setAttribute( 'stroke', "firebrick")
  g1.setAttribute( 'fill', "none")
  g1.setAttribute('id', 'dobo')
  g1.addEventListener('click', handleClick)
  g1.appendChild(seg1)
  g1.appendChild(seg)
  g1.appendChild(seg2)
  svg.appendChild(g1)
}