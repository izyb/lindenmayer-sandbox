import React, { Component } from 'react';
import './GraphComponent.css';
import InputField from '../InputField/InputField';
import Turtle from '../../services/turtle';
import config from '../../config/config.json';

const {
  RESERVED_CHARS,
  MAX_ITERATIONS,
  SCALE_FACTOR,
} = config;

/**
 * Main view for the sandbox. Houses the canvas as well as the input fields.
 */
class GraphComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clientWidth: 0,
      clientHeight: 0,
      offsetX: 0,
      offsetY: 0,
      fOffsetX: 0,
      fOffsetY: 0,
      context: null,
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
      stepLength: 50,
      alpha: Math.PI / 2,
      iteration: 0,
      scale: 1,
    };

    this.animate = this.animate.bind(this);
    this.updateLines = this.updateLines.bind(this);
    this.updateReplaceFns = this.updateReplaceFns.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleReplaceFn = this.handleReplaceFn.bind(this);
    this.handleReplaceFnToggle = this.handleReplaceFnToggle.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  /**
   * Initializes wheel and window resize event listeners, canvas dimensions,
   * and turtle object.
   */
  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('wheel', this.handleScroll);
    const { clientWidth, clientHeight } = this.wrapper;
    const turtle = new Turtle(clientWidth, clientHeight);
    const context = this.canvas.getContext('2d');
    this.setState({
      context,
      clientWidth,
      clientHeight,
      turtle,
      fOffsetX: 0,
      fOffsetY: 0,
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
   * Clears canvas and draws lines onto it.
   */
  animate() {
    const {
      lines,
      context,
      clientWidth,
      clientHeight,
      offsetX,
      offsetY,
      fOffsetX,
      fOffsetY,
      scale,
    } = this.state;
    context.clearRect(0, 0, clientWidth, clientHeight);
    lines.forEach((line) => {
      context.beginPath();
      context.moveTo(
        scale * (offsetX + fOffsetX + line.start.x),
        scale * (offsetY + fOffsetY + line.start.y),
      );
      context.lineTo(
        scale * (offsetX + fOffsetX + line.end.x),
        scale * (offsetY + fOffsetY + line.end.y),
      );
      context.stroke();
    });
  }

  /**
   * Parses current state and updates line objects.
   */
  updateLines() {
    const {
      turtle,
      replaceFn,
      initPath,
      iteration,
      alpha,
      stepLength,
    } = this.state;
    this.setState({
      lines: turtle.parse(
        initPath,
        replaceFn,
        iteration,
        Number(alpha),
        stepLength,
      ),
    }, this.animate);
  }

  /**
   * Adds replacement string entries if a new character has been typed. Removes
   * replacement strings whose chars no longer have any occurrences.
   */
  updateReplaceFns() {
    const { initPath, replaceFn } = this.state;
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
    this.setState({ replaceFn }, this.updateLines);
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
   * Storese initial drag location and adds event listener for mouse movement.
   * @param {Event} e - User input event.
   */
  handleDragStart(e) {
    const position = this.canvas.getBoundingClientRect();
    this.setState({
      startX: e.pageX - position.x,
      startY: e.pageY - position.y,
    });
    window.addEventListener('mousemove', this.handleDrag);
  }

  /**
   * Updates drag offset distance.
   * @param {Event} e - User input event.
   */
  handleDrag(e) {
    const { scale, startX, startY } = this.state;
    const position = this.canvas.getBoundingClientRect();
    const offsetX = (e.pageX - position.x - startX) / scale;
    const offsetY = (e.pageY - position.y - startY) / scale;
    this.setState({ offsetX, offsetY }, this.animate);
  }

  /**
   * Copies current drag offset distance to fixed offset distance, then sets
   * current drag offset distance to (0,0).
   */
  handleDragEnd() {
    const {
      offsetX,
      offsetY,
      fOffsetX,
      fOffsetY,
    } = this.state;
    this.setState({
      fOffsetX: offsetX + fOffsetX,
      fOffsetY: offsetY + fOffsetY,
      offsetX: 0,
      offsetY: 0,
    });
    window.removeEventListener('mousemove', this.handleDrag);
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
    }, this.animate);
  }

  /**
   * Updates the scale factor on user wheel.
   * @param {Event} e - User input event.
   */
  handleScroll(e) {
    const { scale } = this.state;
    this.setState({
      scale: e.deltaY < 0
        ? scale * SCALE_FACTOR
        : scale / SCALE_FACTOR,
    }, this.animate);
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
    } = this.state;

    return (
      <div className="graph-wrapper">
        <div className="graph-panel left">
          <div
            tabIndex={0}
            role="button"
            className="graph-canvas-wrapper"
            ref={(node) => { this.wrapper = node; }}
            onMouseDown={this.handleDragStart}
            onMouseUp={this.handleDragEnd}
          >
            <canvas
              ref={(node) => { this.canvas = node; }}
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
          </div>
        </div>
      </div>
    );
  }
}

export default GraphComponent;
