import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [loading, setLoading] = useState(true);  // Chờ load token từ localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load token từ localStorage khi F5
  useEffect(() => {
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');

    if (storedAccessToken && storedRefreshToken) {
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
      setIsAuthenticated(true);  // => Đã có token -> login OK
    } else {
      setIsAuthenticated(false);
    }
    setLoading(false);
  }, []);

  // Auto refresh token mỗi 5 phút
  useEffect(() => {
    if (!refreshToken) return;
    const interval = setInterval(() => {
      refreshAccessToken();
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [refreshToken]);

  const refreshAccessToken = async () => {
    if (!refreshToken) return false;
    try {
      const res = await fetch('http://localhost:5000/auth/refresh-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });

      const data = await res.json();
      if (data.status === 200) {
        setAccessToken(data.data.accessToken);
        localStorage.setItem('accessToken', data.data.accessToken);
        setIsAuthenticated(true);
        return true;
      } else {
        logout();
        return false;
      }
    } catch (err) {
      console.error('Refresh token failed:', err);
      logout();
      return false;
    }
  };

  const loginSuccess = (accessToken, refreshToken) => {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setAccessToken('');
    setRefreshToken('');
    setIsAuthenticated(false);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  if (loading) return <div>Loading...</div>;  // Chặn render App cho tới khi check xong token

  return (
    <AuthContext.Provider value={{ accessToken, refreshAccessToken, logout, loginSuccess, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
