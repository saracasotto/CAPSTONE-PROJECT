import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthForm.css';
import { AuthContext } from '../../../context/AuthContext';

const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const API_HOST = process.env.REACT_APP_API_HOST;
  const API_PORT = process.env.REACT_APP_API_PORT;

  const { login } = useContext(AuthContext); 
  const navigate = useNavigate()

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  // Logica per il login con email e password
  const handleEmailPasswordLogin = async (event) => {
    event.preventDefault();
    await login(email, password);
    navigate('/mood-selection');
  };

  // Logica per la registrazione con email e password
  const handleEmailPasswordSignUp = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      return console.error("Le password non coincidono!"); // Controllo se le password combaciano
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
        console.error("Errore durante la registrazione:", data.message);
      }
    } catch (error) {
      console.error("Errore durante la registrazione:", error);
    }
  };

  // Logica per il login con Google
  const handleGoogleLogin = () => {
    window.location.href = `${API_HOST}:${API_PORT}/api/auth/google`; // Reindirizza alla rotta di autenticazione con Google
  };

  return (
    <div className="auth-form-container">
      <div className="form-wrapper">
        <h2 className='title-font'>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
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
            <label htmlFor="password">Password:</label>
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
