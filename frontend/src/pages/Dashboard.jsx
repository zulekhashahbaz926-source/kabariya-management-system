import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function Dashboard({ user, navigate, setSelectedCourseId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.courses.getDashboard();
      if (res.success) {
        setData(res);
      }
    } catch (err) {
      setError('Failed to load dashboard metrics. ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResumeCourse = (courseId) => {
    setSelectedCourseId(courseId);
    navigate('learn');
  };

  const handleViewCourseDetails = (courseId) => {
    setSelectedCourseId(courseId);
    navigate('courses'); // This will trigger selected ID preview in catalog
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '3rem', color: 'var(--accent-primary)' }}></i>
        <p style={{ marginTop: '15px', color: 'var(--text-muted)' }}>Calculating your study profile & recommendations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel" style={{ padding: '30px', margin: '40px 0', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
        <h3>Error loading Dashboard</h3>
        <p>{error}</p>
        <button onClick={loadDashboardData} className="btn-primary" style={{ marginTop: '15px' }}>Retry</button>
      </div>
    );
  }

  const { stats, enrollments, bookmarks, recommendations } = data;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      
      {/* Welcome banner */}
      <section style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem' }}>Student Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Welcome back, <strong style={{ color: 'var(--text-main)' }}>{user.username}</strong>! Track your academic progress.</p>
        </div>
        <button onClick={() => navigate('courses')} className="btn-primary">
          <i className="fa-solid fa-cart-shopping"></i> Visit Store
        </button>
      </section>

      {/* Stats Widgets */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px'
      }}>
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <i className="fa-solid fa-book-open" style={{ fontSize: '2.5rem', color: 'var(--accent-primary)' }}></i>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Enrolled Courses</span>
            <h2 style={{ fontSize: '2rem', marginTop: '2px' }}>{stats.totalCourses}</h2>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <i className="fa-solid fa-circle-check" style={{ fontSize: '2.5rem', color: '#10b981' }}></i>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Completed Courses</span>
            <h2 style={{ fontSize: '2rem', marginTop: '2px' }}>{stats.completedCourses}</h2>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <i className="fa-solid fa-chart-simple" style={{ fontSize: '2.5rem', color: 'var(--accent-secondary)' }}></i>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Average Progress</span>
            <h2 style={{ fontSize: '2rem', marginTop: '2px' }}>{stats.averageProgress}%</h2>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <i className="fa-solid fa-clock" style={{ fontSize: '2.5rem', color: '#f59e0b' }}></i>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Simulated Study Hours</span>
            <h2 style={{ fontSize: '2rem', marginTop: '2px' }}>{stats.studyHours}h</h2>
          </div>
        </div>
      </section>

      {/* Active Enrolled Courses */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h2 style={{ fontSize: '1.6rem' }}><i className="fa-solid fa-graduation-cap"></i> Your Learning Space</h2>
        {enrollments.length === 0 ? (
          <div className="glass-panel" style={{ padding: '50px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p style={{ marginBottom: '15px' }}>You haven't enrolled in any courses yet.</p>
            <button onClick={() => navigate('courses')} className="btn-secondary">Browse Store Catalog</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {enrollments.map((course) => (
              <div 
                key={course.course_id} 
                className="glass-panel"
                style={{
                  padding: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '20px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                  <img 
                    src={course.image_url} 
                    alt={course.title} 
                    style={{ width: '100px', height: '60px', borderRadius: '8px', objectFit: 'cover' }}
                  />
                  <div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{course.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Instructor: {course.instructor}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '30px', flexWrap: 'wrap' }}>
                  <div style={{ width: '180px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                      <span>Syllabus Progress</span>
                      <strong>{course.progress}%</strong>
                    </div>
                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${course.progress}%`, height: '100%', background: 'var(--gradient-purple-cyan)' }}></div>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleResumeCourse(course.course_id)} 
                    className="btn-primary"
                    style={{ padding: '10px 20px', fontSize: '0.9rem' }}
                  >
                    Resume Learning <i className="fa-solid fa-play"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Bookmarks and recommendations split grid */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '30px',
        alignItems: 'start'
      }}>
        {/* Bookmarks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontSize: '1.5rem' }}><i className="fa-solid fa-bookmark"></i> Bookmarked</h2>
          {bookmarks.length === 0 ? (
            <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No saved courses yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {bookmarks.map(course => (
                <div 
                  key={course.id} 
                  className="glass-panel-interactive" 
                  style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  onClick={() => handleViewCourseDetails(course.id)}
                >
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: '600' }}>{course.title}</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)' }}>{course.category}</span>
                  </div>
                  <i className="fa-solid fa-chevron-right" style={{ color: 'var(--text-muted)' }}></i>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Personalized AI Recommendations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontSize: '1.5rem' }}>
            <i className="fa-solid fa-wand-magic-sparkles" style={{ color: 'var(--accent-secondary)' }}></i> AI Recommendations
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {recommendations.map(course => (
              <div 
                key={course.id} 
                className="glass-panel" 
                style={{ 
                  padding: '20px', 
                  borderLeft: '4px solid var(--accent-primary)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent-secondary)', fontWeight: 'bold' }}>{course.category}</span>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      background: 'rgba(139, 92, 246, 0.15)', 
                      color: 'var(--accent-primary)', 
                      padding: '2px 8px', 
                      borderRadius: '12px',
                      fontWeight: 'bold'
                    }}>
                      Match: {Math.round(course.recommendationScore * 10)}%
                    </span>
                  </div>
                  <h4 style={{ fontSize: '1.1rem', margin: '4px 0 2px' }}>{course.title}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{course.recommendationReason}</p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold' }}>${course.price}</span>
                  <button 
                    onClick={() => handleViewCourseDetails(course.id)} 
                    className="btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                  >
                    View Store Page
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
