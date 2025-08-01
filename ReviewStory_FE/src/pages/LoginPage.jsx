import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { AuthContext } from '../context/AuthContext';  // << Import context
import '../index.css';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { loginSuccess } = useContext(AuthContext);  // << Lấy loginSuccess từ Context

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(username, password);
    if (res.status === 200) {
      const { accessToken, refreshToken, user } = res.data;

      // GỌI loginSuccess để cập nhật Context
      loginSuccess(accessToken, refreshToken);

      localStorage.setItem('userRole', user.role);  // Nếu cần giữ role
      navigate('/home');
    } else {
      setError(res.message || 'Login failed');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="container">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
        <div className="text-center">
          Don't have an account? <a href="/register">Register</a>
        </div>
      </div>
    </div>
  );
}
