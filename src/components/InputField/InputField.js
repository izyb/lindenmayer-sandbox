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

  const inputElementProps = {
    name,
    value: type === 'checkbox' ? '' : value,
    checked: type === 'checkbox' ? value : '',
    type,
    onChange,
  };

  return (
    <div className={`input-field-wrapper ${type}-input`}>
      <input
        {...inputElementProps}
        {...inputProps}
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
  value: '',
  type: 'text',
  inputProps: null,
  onChange: null,
};

export default InputField;
