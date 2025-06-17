import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router';
import authService from '../../services/authService';

const AdminRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = authService.isAuthenticated();

        if (authenticated) {
          // Vérifier si le token est encore valide
          const tokenValid = await authService.getUser();
          setIsAuthenticated(tokenValid);

          if (tokenValid) {
            const adminStatus = authService.isAdmin();
            setIsAdmin(adminStatus);
          }
        } else {
          setIsAuthenticated(false);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Erreur de vérification d\'authentification:', error);
        setIsAuthenticated(false);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <p>Vérification des droits d'administration...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isAuthenticated && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;