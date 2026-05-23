import React, { useState } from 'react';
import { api } from '../services/api';

export default function LoginRegister({ onLoginSuccess, navigate }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isLogin) {
        // Sign In
        const data = await api.auth.login(email, password);
        if (data.success) {
          localStorage.setItem('learnhub_token', data.token);
          setSuccessMsg('Signed in successfully! Redirecting...');
          setTimeout(() => {
            onLoginSuccess(data.user);
            navigate('dashboard');
          }, 1000);
        }
      } else {
        // Register
        const data = await api.auth.signup(username, email, password);
        if (data.success) {
          localStorage.setItem('learnhub_token', data.token);
          setSuccessMsg('Registration successful! Redirecting...');
          setTimeout(() => {
            onLoginSuccess(data.user);
            navigate('dashboard');
          }, 1000);
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please verify inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '75vh',
      padding: '40px 0'
    }}>
      <div 
        className="glass-panel" 
        style={{
          width: '100%',
          maxWidth: '450px',
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}
      >
        {/* Tab Toggle */}
        <div style={{
          display: 'flex',
          background: 'rgba(0,0,0,0.2)',
          borderRadius: '10px',
          padding: '4px'
        }}>
          <button 
            type="button"
            onClick={() => { setIsLogin(true); setErrorMsg(''); }}
            style={{
              flex: 1,
              background: isLogin ? 'var(--gradient-purple-cyan)' : 'transparent',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              padding: '10px 0',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'var(--transition-smooth)'
            }}
          >
            Sign In
          </button>
          <button 
            type="button"
            onClick={() => { setIsLogin(false); setErrorMsg(''); }}
            style={{
              flex: 1,
              background: !isLogin ? 'var(--gradient-purple-cyan)' : 'transparent',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              padding: '10px 0',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'var(--transition-smooth)'
            }}
          >
            Register
          </button>
        </div>

        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.8rem' }}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {isLogin ? 'Enter details to access your learning courses.' : 'Join the smart university EdTech portal.'}
          </p>
        </div>

        {/* Display Status Messages */}
        {errorMsg && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#f87171',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <i className="fa-solid fa-circle-exclamation"></i> {errorMsg}
          </div>
        )}

        {successMsg && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            color: '#34d399',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <i className="fa-solid fa-circle-check"></i> {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {!isLogin && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-muted)' }}>Username</label>
              <input 
                type="text" 
                required 
                placeholder="john_doe" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                className="input-field" 
              />
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-muted)' }}>Email Address</label>
            <input 
              type="email" 
              required 
              placeholder="student@university.edu" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="input-field" 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-muted)' }}>Password</label>
            <input 
              type="password" 
              required 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="input-field" 
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: '100%', marginTop: '10px' }}
            disabled={loading}
          >
            {loading ? (
              <span>Processing... <i className="fa-solid fa-spinner fa-spin"></i></span>
            ) : (
              <span>{isLogin ? 'Sign In' : 'Sign Up'}</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
