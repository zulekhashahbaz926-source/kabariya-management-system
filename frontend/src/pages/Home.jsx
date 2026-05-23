import React from 'react';

export default function Home({ navigate, user }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
      
      {/* Hero Section */}
      <section style={{
        padding: '80px 0 40px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px'
      }}>
        <div style={{
          background: 'rgba(139, 92, 246, 0.1)',
          border: '1px solid var(--accent-primary-glow)',
          padding: '8px 16px',
          borderRadius: '50px',
          fontSize: '0.9rem',
          fontWeight: '600',
          color: 'var(--accent-secondary)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px'
        }} className="pulse-glow">
          <i className="fa-solid fa-sparkles"></i> Next-Gen AI Learning Ecosystem
        </div>

        <h1 style={{
          fontSize: '3.8rem',
          lineHeight: '1.1',
          maxWidth: '850px',
          fontWeight: '800'
        }}>
          Master Software Engineering & AI with <span className="gradient-text">Interactive AI Tutor</span>
        </h1>

        <p style={{
          fontSize: '1.2rem',
          color: 'var(--text-muted)',
          maxWidth: '650px',
          lineHeight: '1.6'
        }}>
          Explore professional engineering courses, take automated customized quizzes, summarize notes, and learn alongside a dedicated AI study copilot.
        </p>

        <div style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
          {user ? (
            <button onClick={() => navigate('dashboard')} className="btn-primary" style={{ padding: '14px 32px', fontSize: '1.05rem' }}>
              Go to Student Dashboard <i className="fa-solid fa-arrow-right"></i>
            </button>
          ) : (
            <button onClick={() => navigate('login')} className="btn-primary" style={{ padding: '14px 32px', fontSize: '1.05rem' }}>
              Get Started Instantly <i className="fa-solid fa-right-to-bracket"></i>
            </button>
          )}
          <button onClick={() => navigate('courses')} className="btn-secondary" style={{ padding: '14px 32px', fontSize: '1.05rem' }}>
            Browse Courses Store
          </button>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        <h2 style={{ fontSize: '2rem', textAlign: 'center' }}>How AI LearnHub Elevates Studies</h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <span style={{
              background: 'rgba(139, 92, 246, 0.15)',
              color: 'var(--accent-primary)',
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}>
              <i className="fa-solid fa-robot"></i>
            </span>
            <h3>AI Tutor Copilot</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Chat with an on-demand AI assistant to explain coding patterns, debug errors, or write configurations in markdown.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <span style={{
              background: 'rgba(6, 182, 212, 0.15)',
              color: 'var(--accent-secondary)',
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}>
              <i className="fa-solid fa-receipt"></i>
            </span>
            <h3>AI Quiz Generator</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Test your knowledge instantly. The AI generates contextual multiple-choice questions from any technical topic dynamically.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <span style={{
              background: 'rgba(139, 92, 246, 0.15)',
              color: 'var(--accent-primary)',
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}>
              <i className="fa-solid fa-chart-line"></i>
            </span>
            <h3>Smart Progress Tracking</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Monitor course completion rates, active study times, bookmarks, and average progress scores in a visual hub.
            </p>
          </div>
        </div>
      </section>

      {/* Course Highlights */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '40px', paddingBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h2 style={{ fontSize: '2.2rem' }}>Featured Digital Courses</h2>
            <p style={{ color: 'var(--text-muted)' }}>Explore certified resources written by industry-leading instructors.</p>
          </div>
          <button onClick={() => navigate('courses')} className="btn-secondary">
            View Store Catalog <i className="fa-solid fa-shop"></i>
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '30px'
        }}>
          {/* Mock Featured Courses */}
          <div className="glass-panel-interactive" style={{ overflow: 'hidden' }} onClick={() => navigate('courses')}>
            <img src="https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=600&q=80" alt="Course" style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--accent-secondary)', fontWeight: 'bold' }}>Software Engineering</span>
              <h3 style={{ fontSize: '1.2rem' }}>Software Architecture Masterclass</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', height: '65px', overflow: 'hidden' }}>Master clean architecture, SOLID principles, design patterns and robust testing cycles.</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <span style={{ fontWeight: '700', fontSize: '1.2rem', color: 'var(--text-main)' }}>$79.99 <span style={{ textDecoration: 'line-through', fontSize: '0.9rem', color: 'var(--text-muted)' }}>$99.99</span></span>
                <span style={{ color: '#fbbf24', fontSize: '0.9rem' }}><i className="fa-solid fa-star"></i> 4.8</span>
              </div>
            </div>
          </div>

          <div className="glass-panel-interactive" style={{ overflow: 'hidden' }} onClick={() => navigate('courses')}>
            <img src="https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=600&q=80" alt="Course" style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--accent-secondary)', fontWeight: 'bold' }}>Artificial Intelligence</span>
              <h3 style={{ fontSize: '1.2rem' }}>AI Engineering & Deep Learning BootCamp</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', height: '65px', overflow: 'hidden' }}>Build and deploy LLMs, RAG applications, Neural Networks, and fine-tuned embeddings.</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <span style={{ fontWeight: '700', fontSize: '1.2rem', color: 'var(--text-main)' }}>$119.99 <span style={{ textDecoration: 'line-through', fontSize: '0.9rem', color: 'var(--text-muted)' }}>$149.99</span></span>
                <span style={{ color: '#fbbf24', fontSize: '0.9rem' }}><i className="fa-solid fa-star"></i> 4.9</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
