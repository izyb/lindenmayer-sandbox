import React from 'react';
import PropTypes from 'prop-types';
import './Range.css';

function Range(props) {
  const {
    name,
    value,
    type,
    inputProps,
    onChange,
  } = props;

  const inputElementProps = {
    name,
    value: type === 'checkbox' ? '' : value,
    checked: type === 'checkbox' ? value : '',
    type,
    onChange,
  };

  return (
    <div className="range-wrapper">
      <input
        {...inputElementProps}
        {...inputProps}
      />
    </div>
  );
}

Range.propTypes = {
  name: PropTypes.string,
  value: PropTypes.any,
  type: PropTypes.string,
  inputProps: PropTypes.object,
  onChange: PropTypes.func,
};

Range.defaultProps = {
  name: null,
  value: '',
  type: 'text',
  inputProps: null,
  onChange: null,
};

export default Range;
