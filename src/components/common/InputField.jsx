// ============================================================
// InputField Component
// ============================================================
import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

/**
 * @param {string} id - unique id for the input
 * @param {string} label - visible label text
 * @param {string} type - input type (text, email, password, etc.)
 * @param {React.ReactNode} leftIcon - icon rendered inside on the left
 * @param {string} error - error message
 * @param {string} hint - helper text below input
 */
export function InputField({
  id,
  label,
  type = 'text',
  leftIcon,
  error,
  hint,
  className = '',
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
        </label>
      )}
      <div className="input-wrapper">
        {leftIcon && <span className="input-icon-left">{leftIcon}</span>}
        <input
          id={id}
          type={resolvedType}
          className={`input${leftIcon ? ' has-left-icon' : ''}${isPassword ? ' has-right-icon' : ''}${error ? ' input-error' : ''}`}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          aria-invalid={!!error}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            className="input-icon-right"
            onClick={() => setShowPassword((v) => !v)}
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="input-error-msg" role="alert">
          <AlertCircle size={12} />
          {error}
        </p>
      )}
      {!error && hint && (
        <p id={`${id}-hint`} className="input-hint">
          {hint}
        </p>
      )}
    </div>
  );
}
