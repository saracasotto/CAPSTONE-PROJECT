import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';


const PrivateRoute = ({ element }) => {
  const { user } = useContext(AuthContext); // Cambia da isAuthenticated a user

  console.log("user:", user); // Verifica se l'utente è presente

  // Controlla se l'utente è autenticato
  return user ? element : <Navigate to="/" />;
};



export default PrivateRoute;