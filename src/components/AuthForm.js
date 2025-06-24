import React, { useState } from 'react';
import ClickSpark from './ClickSpark';
import './AuthForm.css';

const AuthForm = ({ onLogin, onSignup, isLoading }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLoginMode && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (isLoginMode) {
      onLogin(formData.email, formData.password);
    } else {
      onSignup(formData.email, formData.password);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setFormData({
      email: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
  };

  return (
    <ClickSpark
      sparkColor="#58bc82"
      sparkSize={12}
      sparkRadius={20}
      sparkCount={10}
      duration={500}
    >
      <div className="wrapper">
        <div className="auth-container">
          <h1 className="auth-title">CredHex</h1>
          <p className="auth-subtitle">Digital Certificate Management</p>
          
          <div className="toggle-container">
            <button
              type="button"
              className={`toggle-button ${isLoginMode ? 'active' : ''}`}
              onClick={() => setIsLoginMode(true)}
              disabled={isLoading}
            >
              Login
            </button>
            <button
              type="button"
              className={`toggle-button ${!isLoginMode ? 'active' : ''}`}
              onClick={() => setIsLoginMode(false)}
              disabled={isLoading}
            >
              Sign Up
            </button>
          </div>

          <form className="form" onSubmit={handleSubmit}>
            <div className="input-span">
              <label className="label">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
              }
            </div>
            
            <div className="input-span">
              <label className="label">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              {errors.password && <span className="error-text">{errors.password}</span>}
              }
            </div>
            
            {!isLoginMode && (
              <div className="input-span">
                <label className="label">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                }
              </div>
            )}
            
            <button className="submit" type="submit" disabled={isLoading}>
              {isLoading ? (isLoginMode ? 'Signing in...' : 'Creating account...') : (isLoginMode ? 'Login' : 'Sign Up')}
            </button>
          </form>
        </div>
      </div>
    </ClickSpark>
  );
};

export default AuthForm;