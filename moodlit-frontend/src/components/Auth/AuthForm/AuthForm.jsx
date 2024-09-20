import React, { useState } from 'react';
import './AuthForm.css'

const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  const handleGoogleLogin = () => {
    // Integrazione con Google Login qui
    console.log('Login con Google');
  };

  const handleEmailPasswordLogin = (event) => {
    event.preventDefault();
    // Logica di login con email e password
    console.log('Login con Email e Password');
  };

  const handleEmailPasswordSignUp = (event) => {
    event.preventDefault();
    // Logica di registrazione con email e password
    console.log('Registrazione con Email e Password');
  };

  return (
    <div className="auth-form-container">
      <div className="form-wrapper">
        <h2 className='title-font'>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
        <form onSubmit={isSignUp ? handleEmailPasswordSignUp : handleEmailPasswordLogin}>
          <div className="input-field">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" required />
          </div>
          <div className="input-field">
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" required />
          </div>
          {isSignUp && (
            <div className="input-field">
              <label htmlFor="confirm-password">Confirm Password:</label>
              <input type="password" id="confirm-password" required />
            </div>
          )}
          <button type="submit" className="btn interactive-bg">
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <button onClick={handleGoogleLogin} className="btn btn-google accent-bg">
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
