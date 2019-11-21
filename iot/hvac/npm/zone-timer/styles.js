const styles={
  div:{
    touchAction:'none'
  },
  templines:{
    strokeWidth: .5,
    fill: 'none'
  },
  g:{
    stroke: "#000",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 3,
    fill: "none" 
  },
  t:{
    strokeWidth: 0,
    fill: 'green',
    fontSize: "12",
    pointerEvents: "none"
  },
  wrapper:{
    position: 'absolute',
    top: '0px',
    width: '100%',
    height: '100%',
    margin: 0,
    overflowY: 'hidden',
    overscrollBehaviorY: 'contain'
  }
}

export{styles}