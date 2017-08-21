import TestLayout from './TestLayout';
import * as React from 'react';
import ReactDOM from 'react-dom';

document.addEventListener("DOMContentLoaded", function(event) {
  var contentDiv = document.getElementById('content');
  ReactDOM.render(React.createElement(TestLayout), contentDiv);
});
