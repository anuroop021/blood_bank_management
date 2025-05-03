import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/checkAdminAuth", {
          method: "GET",
          credentials: "include",
          headers: { "Cache-Control": "no-cache" },
        });

        const data = await response.json();
        console.log("Admin Auth Check:", data); // Debugging
        setIsAuthenticated(data.isAuthenticated);
      } catch (error) {
        console.error("Error checking admin authentication:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) return null; 

  if (!isAuthenticated) return <Navigate to="/adminLogin" replace />;

  if (isAuthenticated && location.pathname === "/adminLogin") {
    return <Navigate to="/Admin/Home" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
