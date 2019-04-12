import React from 'react'

let senrelHOC=(Comp, cfg)=>{
  console.log(cfg)
  return class PP extends React.Component {
    constructor (props){
      super(props);
      this.state= {hoc:{}}
    }

    onChange=(t)=>{
      let nhoc = {}
      nhoc[t.name]=t.value
      this.setState({hoc: nhoc})
    }
    componentDidMount(){
    }
    render() {
      return (
        <Comp {...this.props} {...this.state} xmitChange={this.onChange}/>
      )
    }
  }
}

export{senrelHOC}
