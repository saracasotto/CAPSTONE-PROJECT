import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext'


const PrivateRoute = ({ element }) => {
  const { isAuthenticated } = useContext(AuthContext);

  console.log("isAuthenticated:", isAuthenticated);

  return isAuthenticated ? element : <Navigate to="/" />;
};

export default PrivateRoute;