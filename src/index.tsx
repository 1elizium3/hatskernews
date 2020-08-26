import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';

ReactDOM.render(
  <App />, 
  document.getElementById('root') );
// install @types/webpack-env
if (module.hot) {
  module.hot.accept();
};