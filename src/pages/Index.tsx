
import React, { useEffect, useState } from 'react';
import WeatherDashboard from '@/components/WeatherDashboard';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem('weatherUser');
      setIsLoggedIn(!!user);
    };
    
    checkAuth();
    
    // Listen for auth changes
    window.addEventListener('authChange', checkAuth);
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('authChange', checkAuth);
      window.removeEventListener('storage', checkAuth);
    };
  }, [navigate]);

  return <WeatherDashboard />;
};

export default Index;
