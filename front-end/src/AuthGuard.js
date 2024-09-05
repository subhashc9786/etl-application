import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthGuard = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // Or use sessionStorage if preferred

  useEffect(() => {
    if (!token) {
    
      navigate('/login');
    }else{
      navigate('/company-table')
    }
  }, [token, navigate]);

  // If a token is found, render the children (protected content)
  return children;
};

export default AuthGuard;
