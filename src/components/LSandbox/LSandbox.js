import React, { Component } from 'react';
import './LSandbox.css';
import {
  Button,
  TextField,
  List,
  ListItem,
  ListItemSecondaryAction,
  IconButton,
  ListItemText,
  Typography,
  Paper,
  Drawer,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Range from '../Range/Range';
import githubMark from '../../GitHub-Mark.svg';
import LCanvas from '../LCanvas/LCanvas';
import Turtle from '../../services/turtle';
import config from '../../config/config.json';

const {
  RESERVED_CHARS,
  MAX_ITERATIONS,
  STEP_LENGTH,
  PREVIEWS,
} = config;

/**
 * Main view for the sandbox. Houses the canvas as well as the input fields.
 */
class LSandbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clientWidth: 0,
      clientHeight: 0,
      initPath: '',
      replaceFn: {},
      alpha: 0,
      iteration: 0,
      stepLength: STEP_LENGTH,
      drawerOpen: false,
    };

    this.updateReplaceFns = this.updateReplaceFns.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleReplaceFn = this.handleReplaceFn.bind(this);
    this.handleReplaceFnToggle = this.handleReplaceFnToggle.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.loadPreview = this.loadPreview.bind(this);
    this.toggleDrawer = this.handleDrawer.bind(this);
  }

  /**
   * Initializes wheel and window resize event listeners, canvas dimensions,
   * and turtle object.
   */
  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    const { clientWidth, clientHeight } = this.wrapper;
    const turtle = new Turtle(clientWidth, clientHeight);
    this.loadPreview(PREVIEWS[0]);
    this.setState({
      iteration: 0,
      clientWidth,
      clientHeight,
      turtle,
    }, this.updateReplaceFns);
  }

  /**
   * Removes all window event listeners to prevent memory leaks.
   */
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('wheel', this.handleScroll);
  }

  /**
   * Loads a preset into the application state.
   * @param {Object} preview - Preview object to be selected.
   */
  loadPreview(preview) {
    this.handleDrawer(false);
    const { initPath, replaceFn, alpha } = preview;
    this.setState({
      initPath,
      replaceFn,
      alpha,
      iteration: 0,
    }, this.updateReplaceFns);
  }

  /**
   * Updates replacement functions and line objects.
   */
  updateReplaceFns() {
    const {
      initPath,
      replaceFn,
      turtle,
      iteration,
      alpha,
      stepLength,
    } = this.state;
    const chars = Object.keys(replaceFn);
    const initChars = initPath.toLowerCase().split('');
    Object.values(replaceFn).forEach((rF) => {
      if (rF.active) {
        initChars.push(...rF.str.toLowerCase().split(''));
      }
    });
    initChars.forEach((character) => {
      const char = character.toLowerCase();
      if (
        !!char.trim()
        && !chars.includes(char)
        && !RESERVED_CHARS.map(c => c.toLowerCase()).includes(char)
      ) {
        replaceFn[char] = {
          str: char,
          mandatory: false,
          active: false,
          drawing: false,
        };
      }
    });
    chars.forEach((character) => {
      const char = character.toLowerCase();
      if (
        !initChars.map(c => c.toLowerCase()).includes(char)
        && !RESERVED_CHARS.map(c => c.toLowerCase()).includes(char)
      ) {
        delete replaceFn[char];
      }
    });
    this.setState({
      lines: turtle.parse(
        initPath,
        replaceFn,
        iteration,
        Number(alpha),
        stepLength,
      ),
    });
  }

  /**
   * Updates state based on user input.
   * @param {Event} e - User input event.
   */
  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value }, this.updateReplaceFns);
  }

  /**
   * Updates specified replacement function object property based on user
   * input.
   * @param {Event} e - User input event.
   * @param {string} char - Replacement string list index.
   */
  handleReplaceFn(e, char) {
    const { replaceFn } = this.state;
    replaceFn[char][e.target.name] = e.target.value;
    this.setState({ replaceFn }, this.updateReplaceFns);
  }

  /**
   * Toggles a boolean property of specified replacement function.
   * @param {Event} e - User input event.
   * @param {string} char - Replacement string list index
   */
  handleReplaceFnToggle(e, char) {
    const { replaceFn } = this.state;
    replaceFn[char][e.target.name] = !replaceFn[char][e.target.name] || replaceFn[char].mandatory;
    this.setState({ replaceFn }, this.updateReplaceFns);
  }

  /**
   * Updates canvas dimensions to match new window dimensions and initializes a
   * new turtle.
   */
  handleResize() {
    const { clientWidth, clientHeight } = this.wrapper;
    const turtle = new Turtle(clientWidth, clientHeight);
    this.setState({
      clientWidth,
      clientHeight,
      turtle,
    }, this.updateReplaceFns);
  }

  /**
   * Sets the example drawer to be open or closed.
   * @param {boolean} open - State to be assigned to example drawer.
   */
  handleDrawer(open) {
    return () => {
      this.setState({ drawerOpen: open });
    };
  }

  render() {
    const {
      initPath,
      replaceFn,
      iteration,
      alpha,
      clientWidth,
      clientHeight,
      lines,
      drawerOpen,
    } = this.state;

    const drawer = (
      <Drawer
        open={drawerOpen}
        onClose={this.handleDrawer(false)}
        variant="persistent"
        anchor="right"
        SlideProps={{
          unmountOnExit: true,
        }}
      >
        <div className="previews-content">
          <div className="previews-headline">
            <Typography variant="subheading">Examples</Typography>
            <IconButton onClick={this.handleDrawer(false)}>
              <ChevronRightIcon />
            </IconButton>
          </div>
          {PREVIEWS.map((preview => (
            <ListItem
              key={preview.path}
              button
              className="preview-wrapper"
              onClick={() => this.loadPreview(preview)}
            >
              <img alt={preview.path.split('.')[1].slice(1)} src={preview.path} />
              <span>{preview.path.split('.')[1].slice(1).replace('_', ' ')}</span>
            </ListItem>
          )
          ))}
        </div>
      </Drawer>
    );


    return (
      <React.Fragment>
        {drawer}
        <div className="sandbox-wrapper">
          <div className="sandbox-panel left">
            <div
              ref={(node) => { this.wrapper = node; }}
              className="sandbox-canvas-wrapper"
            >
              <LCanvas
                lines={lines}
                width={clientWidth}
                height={clientHeight}
              />
            </div>
            <Paper className="panel-content">
              <div className="sandbox-slider">
                <Range
                  value={iteration}
                  name="iteration"
                  min={0}
                  max={MAX_ITERATIONS}
                  onChange={this.handleChange}
                />
              </div>
            </Paper>
          </div>
          <div className="sandbox-panel right">
            <Paper className="panel-content" id="main-params">
              <div id="param-title">
                <Typography variant="title">
                  Main Parameters
                </Typography>
                <Button onClick={this.handleDrawer(true)}>Examples</Button>
              </div>
              <TextField
                className="text-field"
                value={alpha}
                name="alpha"
                onChange={this.handleChange}
                type="number"
                inputProps={{
                  max: 360,
                  min: 0,
                }}
                label="Angle"
              />
              <TextField
                className="text-field"
                value={initPath}
                name="initPath"
                onChange={this.handleChange}
                type="text"
                label="Initial Path"
              />
            </Paper>
            <Paper className="panel-content" id="replacement-strings">
              <Typography variant="title">Replacement strings</Typography>
              <div className="replacement-strings">
                <List dense>
                  {Object.keys(replaceFn).map(char => (
                    <ListItem key={char}>
                      <Button
                        variant="fab"
                        mini
                        onClick={e => this.handleReplaceFnToggle(e, char)}
                        name="drawing"
                        color={replaceFn[char].drawing ? 'primary' : 'default'}
                        disabled={!replaceFn[char].active}
                      >
                        {char}
                      </Button>
                      {replaceFn[char].active ? (
                        <React.Fragment>
                          {!replaceFn[char].mandatory
                            && (
                              <ListItemSecondaryAction>
                                <IconButton
                                  onClick={e => this.handleReplaceFnToggle(e, char)}
                                  name="active"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </ListItemSecondaryAction>
                            )
                          }
                          <ListItemText
                            primary={(
                              <TextField
                                className="text-field"
                                value={replaceFn[char].str}
                                onChange={e => this.handleReplaceFn(e, char)}
                                type="text"
                                name="str"
                                fullWidth
                              />
                            )}
                          />
                        </React.Fragment>
                      )
                        : (
                          <React.Fragment>
                            <ListItemText />
                            <ListItemSecondaryAction>
                              <IconButton
                                onClick={e => this.handleReplaceFnToggle(e, char)}
                                name="active"
                              >
                                <AddIcon />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </React.Fragment>
                        )}
                    </ListItem>
                  ))}
                </List>
              </div>
            </Paper>
          </div>
          <div className="footer">
            {/* <Typography variant="caption" id="github-link">
              Built by&nbsp;
              <a target="blank" href="https://github.com/izyb">izyb</a>
              &nbsp;and&nbsp;
              <a target="blank" href="https://github.com/tiffanyq">tiffanyq</a>
            </Typography> */}
            <a href="https://github.com/izyb/lindenmayer-sandbox" id="repo-link">
              <img className="github-link" alt="github" src={githubMark} />
            </a>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default LSandbox;
