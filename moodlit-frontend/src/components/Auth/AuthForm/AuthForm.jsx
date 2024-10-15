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
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  const API_URL = process.env.REACT_APP_API_URL

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
    setIsLoading(true);
    setLoadingMessage('Logging in...');
    
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailPasswordSignUp = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);
    setLoadingMessage('Signing up...');
    
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setLoadingMessage('Logging in with Google...');
    window.location.href = `${API_URL}/api/auth/login-google`;
  };

  if (isLoading) {
    return (
      <div className="auth-form-container">
        <div className="form-wrapper">
          <h5 className='title-font'>{loadingMessage}</h5>
        </div>
      </div>
    );
  }

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
              Password
              {passwordError && (
                <span 
                  style={{ color: 'red', marginLeft: '5px', cursor: 'pointer' }} 
                  title="Wrong password"
                >
                  invalid
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