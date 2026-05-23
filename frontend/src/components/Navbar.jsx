import React from 'react';

export default function Navbar({ user, onLogout, navigate }) {
  return (
    <nav className="glass-panel" style={{
      position: 'fixed',
      top: '15px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'calc(100% - 40px)',
      maxWidth: '1240px',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 30px',
      borderRadius: '16px'
    }}>
      <div 
        onClick={() => navigate('home')} 
        style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
      >
        <span style={{
          background: 'var(--gradient-purple-cyan)',
          padding: '8px 12px',
          borderRadius: '10px',
          color: '#fff',
          fontWeight: '800',
          fontSize: '1.2rem',
          boxShadow: '0 0 15px rgba(139,92,246,0.3)'
        }}>🎓</span>
        <h2 style={{ fontSize: '1.4rem', margin: 0 }} className="gradient-text">AI LearnHub</h2>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
        <span 
          onClick={() => navigate('home')} 
          style={{ cursor: 'pointer', fontWeight: '500', color: 'var(--text-main)', transition: 'var(--transition-smooth)' }}
          className="nav-link"
        >Home</span>
        <span 
          onClick={() => navigate('courses')} 
          style={{ cursor: 'pointer', fontWeight: '500', color: 'var(--text-main)', transition: 'var(--transition-smooth)' }}
          className="nav-link"
        >Course Store</span>
        
        {user ? (
          <>
            <span 
              onClick={() => navigate('dashboard')} 
              style={{ cursor: 'pointer', fontWeight: '500', color: 'var(--text-main)', transition: 'var(--transition-smooth)' }}
              className="nav-link"
            >Dashboard</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginLeft: '10px' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Welcome, <strong style={{ color: 'var(--accent-secondary)' }}>{user.username}</strong>
              </span>
              <button 
                onClick={onLogout} 
                className="btn-secondary" 
                style={{ padding: '8px 16px', fontSize: '0.9rem' }}
              >
                <i className="fa-solid fa-arrow-right-from-bracket"></i> Logout
              </button>
            </div>
          </>
        ) : (
          <button 
            onClick={() => navigate('login')} 
            className="btn-primary" 
            style={{ padding: '10px 20px', fontSize: '0.9rem' }}
          >
            <i className="fa-solid fa-user-lock"></i> Student Sign In
          </button>
        )}
      </div>
    </nav>
  );
}
