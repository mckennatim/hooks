import ReactDOM from 'react-dom';
import React from 'react'
import{App} from './components/App'



let state={dog:'Ulysses'}
const container = document.getElementById('app');

ReactDOM.render(<App {...state} />, container)


