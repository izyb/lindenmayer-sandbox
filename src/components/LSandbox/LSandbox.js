import React, { Component } from 'react';
import './LSandbox.css';
import InputField from '../InputField/InputField';
import LCanvas from '../LCanvas/LCanvas';
import Turtle from '../../services/turtle';
import config from '../../config/config.json';
import Drawer from '../Drawer/Drawer';

const {
  RESERVED_CHARS,
  MAX_ITERATIONS,
  STEP_LENGTH,
  ALPHA,
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
      initPath: 'FX',
      replaceFn: [
        {
          char: 'F',
          str: 'F',
          mandatory: true,
          active: true,
          drawing: true,
        },
        {
          char: 'f',
          str: 'f',
          mandatory: false,
          active: false,
          drawing: false,
        },
        {
          char: 'X',
          str: 'X+YF+',
          mandatory: false,
          active: true,
          drawing: false,
        },
        {
          char: 'Y',
          str: '-FX-Y',
          mandatory: false,
          active: true,
          drawing: false,
        },
      ],
      stepLength: STEP_LENGTH,
      alpha: ALPHA,
      iteration: 0,
      drawerOpen: false,
    };

    this.updateReplaceFns = this.updateReplaceFns.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleReplaceFn = this.handleReplaceFn.bind(this);
    this.handleReplaceFnToggle = this.handleReplaceFnToggle.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.toggleDrawer = this.toggleDrawer.bind(this);
  }

  /**
   * Initializes wheel and window resize event listeners, canvas dimensions,
   * and turtle object.
   */
  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    const { clientWidth, clientHeight } = this.wrapper;
    const turtle = new Turtle(clientWidth, clientHeight);
    this.setState({
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
    const chars = replaceFn.map(rF => rF.char);
    const initChars = initPath.split('');
    replaceFn.forEach((rF) => {
      if (rF.active) {
        initChars.push(...rF.str.split(''));
      }
    });
    initChars.forEach((char) => {
      if (
        !!char.trim()
        && !chars.includes(char)
        && !RESERVED_CHARS.includes(char)
      ) {
        replaceFn.push({
          char,
          str: char,
          mandatory: false,
          active: false,
          drawing: false,
        });
      }
    });
    chars.forEach((char) => {
      if (!initChars.includes(char) && !RESERVED_CHARS.includes(char)) {
        const j = replaceFn.findIndex(rF => rF.char === char);
        replaceFn.splice(j, 1);
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
   * @param {number} i - Replacement string list index.
   */
  handleReplaceFn(e, i) {
    const { replaceFn } = this.state;
    replaceFn[i][e.target.name] = e.target.value;
    this.setState({ replaceFn }, this.updateReplaceFns);
  }

  /**
   * Toggles a boolean property of specified replacement function.
   * @param {Event} e - User input event.
   * @param {number} i - Replacement string list index
   */
  handleReplaceFnToggle(e, i) {
    const { replaceFn } = this.state;
    replaceFn[i][e.target.name] = !replaceFn[i][e.target.name] || replaceFn[i].mandatory;
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
    });
  }

  toggleDrawer() {
    const { drawerOpen } = this.state;
    this.setState({ drawerOpen: !drawerOpen });
  }

  render() {
    const {
      initPath,
      replaceFn,
      iteration,
      alpha,
      stepLength,
      clientWidth,
      clientHeight,
      lines,
      drawerOpen,
    } = this.state;

    const drawer = (
      <Drawer
        open={drawerOpen}
        anchor="right"
        onClose={this.toggleDrawer}
      >
        <h1>hi</h1>
      </Drawer>
    );

    return (
      <div className="graph-wrapper">
        {drawer}
        <div className="graph-panel left">
          <div
            ref={(node) => { this.wrapper = node; }}
            className="graph-canvas-wrapper"
          >
            <LCanvas
              lines={lines}
              width={clientWidth}
              height={clientHeight}
            />
          </div>
          <div className="panel-content">
            <div className="graph-slider">
              <InputField
                value={iteration}
                name="iteration"
                type="range"
                inputProps={{
                  min: '0',
                  max: MAX_ITERATIONS,
                }}
                onChange={this.handleChange}
              />
            </div>
            <div className="graph-param-toolbar">
              <ul>
                <li>
                  <h5>&alpha;:</h5>
                </li>
                <li>
                  <h5>Step Length:</h5>
                </li>
              </ul>
              <ul>
                <li>
                  <InputField
                    value={alpha}
                    name="alpha"
                    type="number"
                    inputProps={{
                      step: 'any',
                    }}
                    onChange={this.handleChange}
                  />
                </li>
                <li>
                  <InputField
                    value={stepLength}
                    name="stepLength"
                    type="number"
                    onChange={this.handleChange}
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="graph-panel right">
          <div className="graph-core-fields panel-content">
            <h5>Initial Path</h5>
            <InputField
              value={initPath}
              name="initPath"
              onChange={this.handleChange}
              type="text"
            />
          </div>
          <div className="panel-content">
            <h4>Replacement strings</h4>
            <ul>
              {replaceFn.map((rF, i) => (
                <li key={rF.char}>
                  <h5>{`${rF.char}:`}</h5>
                  {rF.active ? (
                    <React.Fragment>
                      <InputField
                        value={rF.str}
                        onChange={e => this.handleReplaceFn(e, i)}
                        type="text"
                        name="str"
                      />
                      {!rF.mandatory
                        && (
                          <button
                            type="button"
                            onClick={e => this.handleReplaceFnToggle(e, i)}
                            name="active"
                          >
                            Deactivate
                          </button>
                        )
                      }
                      <InputField
                        type="checkbox"
                        onChange={e => this.handleReplaceFnToggle(e, i)}
                        value={!!rF.drawing}
                        name="drawing"
                      />
                    </React.Fragment>
                  )
                    : (
                      <button
                        type="button"
                        onClick={e => this.handleReplaceFnToggle(e, i)}
                        name="active"
                      >
                        Activate
                      </button>)}
                </li>
              ))}
            </ul>
            <button type="button" onClick={this.toggleDrawer}>Drawer </button>
          </div>
        </div>
      </div>
    );
  }
}

export default LSandbox;
