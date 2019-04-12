var mStyle = {
  li: {
    display: 'inline',
    padding: '2px',
    paddingRight: '4px',
    backgroundColor: '#FFFFCC'
  },
  ul: {
  },
  span:{
    color: 'yellow'
  },
  div: {
    height: '1200',
    background: 'green'
  },
  a: {
    textDecoration: 'none',
    color: 'green'
  },
  likebutton: {
    appearance: 'button',
    textDecoration: 'none', 
    color: 'green',
    display: 'inline-block', 
    padding: '2px 8px',
    backgroundColor: 'white',
    borderRadius: '4px'  
  }
};

const pStyle= {
  outer: {
    display: 'flex',
    flexDirection: 'column',
    background:'#C4A265',
    height: 900,
    textAlign: 'center'    
  },
  inner: {
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    background: '#FFF28E',
    height: 840,
    color: 'red',
    textAlign: 'center',
    fontSize: '300%'
  }
}

export {mStyle, pStyle}