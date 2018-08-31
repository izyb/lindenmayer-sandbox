import React, { Component } from 'react';
import './App.css';
import LSandbox from './components/LSandbox/LSandbox';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="banner">
          <h1>Lindenmayer Sandbox</h1>
        </div>
        <LSandbox />
      </div>
    );
  }
}

export default App;
