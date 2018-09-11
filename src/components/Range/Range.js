import React from 'react';
import PropTypes from 'prop-types';
import './Range.css';

function Range(props) {
  const {
    name,
    value,
    onChange,
    max,
    min,
  } = props;

  const inputElementProps = {
    name,
    value,
    onChange,
    max,
    min,
  };

  return (
    <div className="range-wrapper">
      <input
        type="range"
        {...inputElementProps}
      />
    </div>
  );
}

Range.propTypes = {
  name: PropTypes.string,
  value: PropTypes.any,
  max: PropTypes.number,
  min: PropTypes.number,
  onChange: PropTypes.func,
};

Range.defaultProps = {
  name: null,
  value: '',
  max: 100,
  min: 0,
  onChange: null,
};

export default Range;
