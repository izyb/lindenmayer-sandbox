import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import './Drawer.css';

const DELAY_TIME = 100;

/**
 * Implementation of Material Design Navigation drawer
 * https://material.io/design/components/navigation-drawer.html
 */
class Drawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      delay: false,
      open: props.open,
    };
    this.handleSlideOut = this.handleSlideOut.bind(this);
    this.handleSlideIn = this.handleSlideIn.bind(this);
    this.handleStartDelay = this.handleStartDelay.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  /**
   * Detects changes in component props. Applies transition css and sets
   * timeout before closing drawer.
   * @param {Object} prevProps - Previous component props.
   */
  componentDidUpdate(prevProps) {
    const { open } = this.props;
    if (open ^ prevProps.open) {
      this.handleStartDelay();
      window.clearTimeout(this.handleSlideIn);
      window.clearTimeout(this.handleSlideOut);
    }
    if (!open && prevProps.open) {
      window.setTimeout(this.handleSlideOut, DELAY_TIME);
    } else if (open && !prevProps.open) {
      window.setTimeout(this.handleSlideIn, 10);
    }
  }

  /**
   * Closes drawer on esc key press.
   * @param {Event} e - keypress event.
   */
  handleKeyUp(e) {
    if (e.keyCode === 27) {
      this.props.onClose();
    }
  }

  /**
   * Sets drawer to open state and adds keypress listener.
   */
  handleSlideIn() {
    window.addEventListener('keypress', this.handleKeyUp);
    this.setState({ delay: false, open: true });
  }

  /**
   * Sets drawer to closed state and removes keypress listener.
   */
  handleSlideOut() {
    window.removeEventListener('keypress', this.handleKeyUp);
    this.setState({ delay: false, open: false });
  }

  /**
   * Sets drawer to transitioning state.
   */
  handleStartDelay() {
    this.setState({ delay: true });
  }

  render() {
    const { delay, open } = this.state;
    const {
      children,
      anchor,
      className,
      onClose,
    } = this.props;

    return (open || delay) ? ReactDOM.createPortal((
      <div className="drwr-wrapper">
        <div
          className={`drwr-backdrop ${(!open || (open && delay)) ? 'drwr-backdrop-fading' : ''}`}
          onClick={onClose}
          aria-hidden="true"
        />
        <div
          className={`drwr drwr-${anchor} ${(!open || (open && delay)) ? `drwr-${anchor}-closed` : ''} ${className}`}
          ref={(node) => { this.containerNode = node; }}
        >
          {children}
        </div>
      </div>
    ), document.body) : null;
  }
}

/**
 * @param {boolean} open - Drawer open state controlling prop.
 * @param {Element} children - Children DOM elements to be rendered in drawer.
 * @param {string} anchor - Drawer screen side anchor.
 * @param {string} className - Additional css class(es).
 * @param {function} onClose - Drawer closing function.
 */
Drawer.propTypes = {
  open: PropTypes.bool,
  children: PropTypes.element,
  anchor: PropTypes.oneOf(['left', 'right', 'top', 'bottom']),
  className: PropTypes.string,
  onClose: PropTypes.func,
};

Drawer.defaultProps = {
  open: false,
  children: null,
  anchor: 'left',
  className: '',
  onClose: null,
};

export default Drawer;
