import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AuthGuard = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token'); // Or use sessionStorage if preferred

  useEffect(() => {
    const authRoutes = /\/signup|\/login|\/forgot-password/gi;
    const isAuthRoute = authRoutes.test(location.pathname);

    if (!token && !isAuthRoute) {
      // Redirect to login if no token and trying to access a protected route
      navigate('https://etl-application-back.vercel.app/login');
    } else if (token && isAuthRoute) {
      // If a token exists and user is on login, signup, or forgot-password, redirect them to the protected page
      navigate('https://etl-application-back.vercel.app/company-table');
    }
  }, [token, navigate, location]);

  // If a token is found, render the children (protected content)
  return children;
};

export default AuthGuard;
