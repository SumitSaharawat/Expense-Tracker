import { useState, useContext } from 'react';
import { useAuth } from './Context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Auth.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Post registration data to your Express auth router
      const response = await axios.post('http://localhost:8000/api/user/signup', { 
        email, 
        password 
      });
      // 2. Log the user in immediately using the token returned on successful signup
      login(response.data); 
    } catch (err) {
      // 3. Capture exact validation errors (like from Zod or Mongoose validation)
      // Handles both array errors and single message strings cleanly
      const backendMessage = err.response?.data?.errors 
        ? err.response.data.errors.join(', ') 
        : err.response?.data?.message;
        
      setError(backendMessage || "An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Create an Account</h2>
        <p className="auth-subtitle">Start tracking your transactions and saving goals</p>
        
        {/* Render error banner if any validation fails */}
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
        
        <button type="submit" className="btn-primary full-width" disabled={loading}>
          {loading ? 'Creating Account...' : 'Register'}
        </button>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;