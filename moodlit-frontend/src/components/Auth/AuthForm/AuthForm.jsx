import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthForm.css';
import { AuthContext } from '../../../context/AuthContext';
import { Alert } from 'react-bootstrap';

const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const API_HOST = process.env.REACT_APP_API_HOST;
  const API_PORT = process.env.REACT_APP_API_PORT;

  const { login } = useContext(AuthContext); 
  const navigate = useNavigate()

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setPasswordError(false);
  };

  const handleEmailPasswordLogin = async (event) => {
    event.preventDefault();
    setError('');
    setPasswordError(false);
    
    try {
      const response = await fetch(`${API_HOST}:${API_PORT}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        await login(email, password);
        navigate('/mood-selection');
      } else {
        if (data.message.includes("User not found")) {
          setError("User not found. Please check your email or sign up.");
        } else if (data.message.includes("Invalid password")) {
          setPasswordError(true);
        } else {
          setError(data.message || "An error occurred during login.");
        }
      }
    } catch (error) {
      setError("Invalid credentials. Please try again.");
    }
  };

  const handleEmailPasswordSignUp = async (event) => {
    event.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch(`${API_HOST}:${API_PORT}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        await login(email, password); 
        navigate('/mood-selection')
      } else {
        if (data.message.includes("email already exists")) {
          setError("Email already in use");
        } else {
          setError(data.message || "Error during registration");
        }
      }
    } catch (error) {
      setError("Error during registration. Please try again.");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_HOST}:${API_PORT}/api/auth/login-google`;
  };

  return (
    <div className="auth-form-container">
      <div className="form-wrapper">
        <h2 className='title-font'>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
        {error && <Alert className='bg-d mx-0 p-1'>{error}</Alert>}
        <form onSubmit={isSignUp ? handleEmailPasswordSignUp : handleEmailPasswordLogin}>
          <div className="input-field">
            <label htmlFor="email">Email:</label>
            <input 
              type="email" 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="input-field">
            <label htmlFor="password">
              Password:
              {passwordError && (
                <span 
                  style={{ color: 'red', marginLeft: '5px', cursor: 'pointer' }} 
                  title="Wrong password"
                >
                  ❗
                </span>
              )}
            </label>
            <input 
              type="password" 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          {isSignUp && (
            <div className="input-field">
              <label htmlFor="confirm-password">Confirm Password:</label>
              <input 
                type="password" 
                id="confirm-password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required 
              />
            </div>
          )}
          <button type="submit" className="btn accent-bg">
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <button onClick={handleGoogleLogin} className="btn btn-google bg-d">
          {isSignUp ? 'Sign Up with Google' : 'Sign In with Google'}
        </button>

        <p className="toggle-form-text">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          <button onClick={toggleForm} className="btn-toggle">
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;