import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
const api_uri = process.env.REACT_APP_API_URI;

const HospProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${api_uri}/api/checkHospitalAuth`, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Cache-Control': 'no-cache' },
        });

        const data = await response.json();
        setIsAuthenticated(data.isAuthenticated);
      } catch (error) {
        console.error("Error checking hospital authentication:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) return <div>Loading...</div>; 

  if (!isAuthenticated) return <Navigate to="/hospital" replace />; 

  return children; 
};

export default HospProtectedRoute;
