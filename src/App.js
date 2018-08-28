import React, { Component } from 'react';
import './App.css';
import GraphComponent from './components/GraphComponent/GraphComponent';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="banner">
          <h1>Lindenmayer Sandbox</h1>
        </div>
        <GraphComponent />
      </div>
    );
  }
}

export default App;
