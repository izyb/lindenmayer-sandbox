import React from 'react';
import PropTypes from 'prop-types';
import './InputField.css';

function InputField(props) {
  const {
    name,
    value,
    type,
    inputProps,
    onChange,
  } = props;

  const className = `input-field-wrapper ${
    type === 'range' ? 'no-underline' : ''}`;

  return (
    <div className={className}>
      <input
        name={name}
        value={value}
        type={type}
        {...inputProps}
        onChange={onChange}
      />
    </div>
  );
}

InputField.propTypes = {
  name: PropTypes.string,
  value: PropTypes.any,
  type: PropTypes.string,
  inputProps: PropTypes.object,
  onChange: PropTypes.func,
};

InputField.defaultProps = {
  name: null,
  value: null,
  type: 'text',
  inputProps: null,
  onChange: null,
};

export default InputField;
