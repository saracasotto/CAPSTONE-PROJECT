import React, { createContext, useState, useEffect, useCallback } from 'react';
import {jwtDecode} from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_HOST = process.env.REACT_APP_API_HOST;
  const API_PORT = process.env.REACT_APP_API_PORT;

  // Funzione per verificare lo stato di autenticazione
  const verifyToken = useCallback(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded); // Imposta i dettagli dell'utente
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Token non valido:", error);
        setIsAuthenticated(false);
        setUser(null);
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
    setLoading(false);
  }, []); // Nessuna dipendenza perché non usiamo variabili esterne

  // Funzione per recuperare il token dalla query parameter e salvarlo in localStorage
  const handleGoogleCallback = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      localStorage.setItem('token', token);
      verifyToken();
      window.history.replaceState({}, document.title, "/"); // Rimuove il token dall'URL
    }
  }, [verifyToken]); // Dipende solo da verifyToken

  useEffect(() => {
    handleGoogleCallback();
    verifyToken();
  }, [handleGoogleCallback, verifyToken]);

  // Funzione di login
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_HOST}:${API_PORT}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        console.error("Errore di autenticazione:", data.message);
      }
    } catch (error) {
      console.error("Errore durante il login:", error);
    }
  };

  // Funzione di logout
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  if (loading) {
    return <div>Caricamento...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
