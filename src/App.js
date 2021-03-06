import React, { Component } from 'react';
import './App.css';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import LSandbox from './components/LSandbox/LSandbox';

const theme = createMuiTheme({
  palette: {
    primary: { main: 'rgb(175, 14, 22)' },
    secondary: { main: 'rgba(24, 98, 148, 0.637)' },
  },
});
class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div className="App">
          <div className="banner">
            <Typography variant="headline">lindenmayer sandbox</Typography>
          </div>
          <div className="main-content">
            <LSandbox />
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
