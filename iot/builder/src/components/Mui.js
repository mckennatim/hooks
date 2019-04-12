import React from 'react';// eslint-disable-line no-unused-vars
import Button from 'muicss/lib/react/button';// eslint-disable-line no-unused-vars
import Option from 'muicss/lib/react/option';// eslint-disable-line no-unused-vars
import Select from 'muicss/lib/react/select';// eslint-disable-line no-unused-vars
import {mapClass2Element} from '../hoc'

class Mui extends React.Component {
  state = {
    options: [
      {value: 'option1', label: 'Option 1'},
      {value: 'option2', label: 'Option 2'},
      {value: 'option3', label: 'Option 3'},
      {value: 'option4', label: 'Option 4'}
    ]
  };

  onClick() {
    let options = this.state.options,
        n = options.length + 1;
    
    options.push({value: 'option' + n, label: 'Option ' + n});
    this.setState({options: options});
  }

  render() {
    return (
      <form >
        <Select defaultValue="option2">
          {
            this.state.options.map(function (option, i) {
              return <Option key={i} value={option.value} label={option.label} />;
            })
          }
        </Select>
        <Button variant="raised" onClick={this.onClick.bind(this)}>Add item</Button>
      </form>
    );
  }
}
Mui=mapClass2Element(Mui)

export {Mui}