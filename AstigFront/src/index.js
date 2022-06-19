import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Windmill } from '@windmill/react-ui'
import loft16Theme from './Theme/loft16Theme';

import {Provider} from 'react-redux'
import store from "./app/store"

require('dotenv').config()

ReactDOM.render(
  <Provider store={store}>
    <Windmill dark={false} theme={loft16Theme}>
        <App />
    </Windmill>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();