import { useState, useContext } from 'react';
import axios from 'axios';
import { useAuth } from './Context/AuthContext';
import { Link } from 'react-router-dom';
import '../styles/Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post('http://localhost:8000/api/user/login', { email, password });
      
      // response.data contains the { email, token } sent by your Express server
      login(response.data); 
    } catch (err) {
      // Catches validation or credential errors (e.g., 400 Bad Request) from your backend
      setError(err.response?.data?.message || "An error occurred during login");
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Log In</h2>
        <p className="auth-subtitle">Welcome back! Please enter your details.</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="input-group">
          <label>Email Address</label>
          <input 
            type="email" 
            placeholder="name@example.com" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        
        <div className="input-group">
          <label>Password</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        
        <button type="submit" className="btn-primary full-width">Sign In</button>

        <p className="auth-footer">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;