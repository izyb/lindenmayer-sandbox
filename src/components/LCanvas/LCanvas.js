import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './LCanvas.css';
import Line from '../../models/line';
import config from '../../config/config.json';

const {
  SCALE_FACTOR,
} = config;

/**
 * Line Canvas component - given a collection of lines represented as:
 */
class LCanvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      offsetX: 0,
      offsetY: 0,
      fOffsetX: 0,
      fOffsetY: 0,
      context: null,
      scale: 1,
    };

    this.animate = this.animate.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  /**
   * Initializes wheel and window resize event listeners, canvas dimensions,
   * and turtle object.
   */
  componentDidMount() {
    const context = this.canvas.getContext('2d');
    this.setState({
      context,
      fOffsetX: 0,
      fOffsetY: 0,
    });
  }

  componentDidUpdate(prevProps) {
    const { lines, width, height } = this.props;
    if (prevProps.lines !== lines || height !== prevProps.height || width !== prevProps.width) {
      this.animate();
    }
  }

  /**
   * Clears canvas and draws lines onto it.
   */
  animate() {
    const {
      context,
      offsetX,
      offsetY,
      fOffsetX,
      fOffsetY,
      scale,
    } = this.state;
    const {
      lines,
      width,
      height,
    } = this.props;
    context.clearRect(0, 0, width, height);
    lines.forEach((line) => {
      context.beginPath();
      context.moveTo(
        scale * (offsetX + fOffsetX + line.x1),
        scale * (offsetY + fOffsetY + line.y1),
      );
      context.lineTo(
        scale * (offsetX + fOffsetX + line.x2),
        scale * (offsetY + fOffsetY + line.y2),
      );
      context.stroke();
    });
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
   * Adds scroll event listener.
   */
  handleMouseEnter() {
    window.addEventListener('wheel', this.handleScroll);
  }

  /**
   * Removes scroll event listener.
   */
  handleMouseLeave() {
    window.removeEventListener('wheel', this.handleScroll);
  }

  /**
   * Updates the scale factor on user wheel.
   * @param {Event} e - User input event.
   */
  handleScroll(e) {
    e.preventDefault();
    const { scale } = this.state;
    this.setState({
      scale: e.deltaY < 0
        ? scale * SCALE_FACTOR
        : scale / SCALE_FACTOR,
    }, this.animate);
  }

  render() {
    const {
      width,
      height,
      className,
      lines,
      ...others
    } = this.props;

    return (
      <div
        tabIndex={0}
        role="button"
        className={`L-canvas-wrapper ${className || ''}`}
        onMouseDown={this.handleDragStart}
        onMouseUp={this.handleDragEnd}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        {...others}
      >
        <canvas
          ref={(node) => { this.canvas = node; }}
          width={width - 8}
          height={height - 8}
          className="L-canvas"
        />
      </div>
    );
  }
}

/**
 * @param {number} width - canvas width, default 500px.
 * @param {number} height - canvas height, default 500px.
 * @param {Array<Object<Object<number>>} lines - Collection of lines to draw on
 * canvas.
 * @param {string} className - CSS class name to pass on to canvas wrapper div
 * element.
 */
LCanvas.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  lines: PropTypes.arrayOf(
    Line.isLine,
  ),
  className: PropTypes.string,
};

LCanvas.defaultProps = {
  lines: [],
  className: null,
};

export default LCanvas;
