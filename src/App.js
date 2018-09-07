import React, { Component } from 'react';
import './App.css';
import githubMark from './GitHub-Mark-32px.png';
import LSandbox from './components/LSandbox/LSandbox';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="banner">
          <h1>Lindenmayer Sandbox</h1>
          <a href="https://github.com/izyb/lindenmayer-sandbox">
            <img className="github-link" alt="github" src={githubMark} />
          </a>
        </div>
        <LSandbox />
      </div>
    );
  }
}

export default App;
