import ReactDOM from 'react-dom';
import React from 'react'// eslint-disable-line no-unused-vars

import {App} from './components'// eslint-disable-line no-unused-vars

let state={dog:'Ulysses'}
const container = document.getElementById('app');

ReactDOM.render(<App {...state} />, container)

