// components/FormField.jsx
import React from 'react';
import './FormField.css';

const FormField = ({ 
  label, 
  name, 
  value, 
  onChange, 
  placeholder, 
  multiline = false, 
  rows = 2, 
  required = false,
  icon
}) => {
  return (
    <div className="form-field">
      <label className="form-field-label" htmlFor={name}>
        {label} {required && <span className="required-mark">*</span>}
      </label>
      
      <div className="input-container">
        {icon && <div className="input-icon">{icon}</div>}
        
        {multiline ? (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            required={required}
            className="form-field-textarea"
          />
        ) : (
          <input
            id={name}
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className="form-field-input"
          />
        )}
      </div>
    </div>
  );
};

export default FormField;