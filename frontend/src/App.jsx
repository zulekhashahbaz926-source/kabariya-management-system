import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import Courses from './pages/Courses';
import LoginRegister from './pages/LoginRegister';
import Dashboard from './pages/Dashboard';
import LearnPage from './pages/LearnPage';
import { api } from './services/api';

export default function App() {
  const [page, setPage] = useState('home'); // home, courses, login, dashboard, learn
  const [user, setUser] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // Authenticate user on page load
  useEffect(() => {
    checkUserAuth();
  }, []);

  const checkUserAuth = async () => {
    const token = localStorage.getItem('learnhub_token');
    if (!token) {
      setInitializing(false);
      return;
    }
    try {
      const res = await api.auth.getProfile();
      if (res.success) {
        setUser(res.user);
      } else {
        localStorage.removeItem('learnhub_token');
      }
    } catch (err) {
      console.warn('Failed to verify token:', err.message);
      localStorage.removeItem('learnhub_token');
    } finally {
      setInitializing(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('learnhub_token');
    setUser(null);
    setSelectedCourseId(null);
    setPage('home');
  };

  const handleNavigate = (targetPage) => {
    setPage(targetPage);
  };

  if (initializing) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--bg-primary)'
      }}>
        <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '3.5rem', color: 'var(--accent-primary)' }}></i>
        <p style={{ marginTop: '20px', color: 'var(--text-muted)', fontFamily: 'var(--font-family-title)' }}>Initializing AI LearnHub Portal...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Global Navigation Header */}
      <Navbar user={user} onLogout={handleLogout} navigate={handleNavigate} />

      {/* Main Page Layout Wrapper */}
      <main className="main-content">
        {page === 'home' && <Home navigate={handleNavigate} user={user} />}
        {page === 'courses' && (
          <Courses 
            user={user} 
            navigate={handleNavigate} 
            selectedCourseId={selectedCourseId}
            setSelectedCourseId={setSelectedCourseId}
          />
        )}
        {page === 'login' && (
          <LoginRegister 
            onLoginSuccess={(userData) => setUser(userData)} 
            navigate={handleNavigate} 
          />
        )}
        {page === 'dashboard' && (
          <Dashboard 
            user={user} 
            navigate={handleNavigate} 
            setSelectedCourseId={setSelectedCourseId}
          />
        )}
        {page === 'learn' && (
          <LearnPage 
            user={user} 
            courseId={selectedCourseId} 
            navigate={handleNavigate} 
          />
        )}
      </main>

      {/* Global Floating AI Tutor drawer (Only visible for signed in students) */}
      <Chatbot user={user} />

      {/* Futuristic footer */}
      <footer style={{
        textAlign: 'center',
        padding: '30px 24px',
        marginTop: '60px',
        borderTop: '1px solid var(--glass-border)',
        fontSize: '0.85rem',
        color: 'var(--text-muted)'
      }}>
        <p>© 2026 AI LearnHub Platform. Created for Software Construction & Development Course.</p>
        <p style={{ fontSize: '0.75rem', marginTop: '6px', color: 'var(--accent-secondary)' }}>
          🔒 Automated Environment Secure | Built with React, Express, & SQLite.
        </p>
      </footer>
    </div>
  );
}
