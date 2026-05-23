import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function Courses({ user, navigate, selectedCourseId, setSelectedCourseId }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [detailCourse, setDetailCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  
  // Checkout Modal State
  const [showCheckout, setShowCheckout] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadCourses();
  }, [category]);

  useEffect(() => {
    if (selectedCourseId) {
      loadCourseDetails(selectedCourseId);
    }
  }, [selectedCourseId]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const res = await api.courses.getAll(category, search);
      if (res.success) {
        setCourses(res.courses);
      }
    } catch (err) {
      console.error('Failed to load courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadCourses();
  };

  const loadCourseDetails = async (id) => {
    try {
      const res = await api.courses.getById(id);
      if (res.success) {
        setDetailCourse(res.course);
        setReviews(res.reviews);
      }
    } catch (err) {
      console.error('Error fetching course details:', err);
    }
  };

  const handleToggleBookmark = async (e, courseId) => {
    e.stopPropagation();
    if (!user) {
      navigate('login');
      return;
    }
    try {
      await api.courses.toggleBookmark(courseId);
      // Reload courses to update bookmarked state if we are keeping track of it
      // For simplicity, we just trigger alert or reload details
      if (detailCourse && detailCourse.id === courseId) {
        loadCourseDetails(courseId);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenCheckout = () => {
    if (!user) {
      navigate('login');
      return;
    }
    setPaymentError('');
    setPurchaseSuccess(false);
    setCardNumber('');
    setCouponCode('');
    setShowCheckout(true);
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setPaymentError('');
    setIsSubmitting(true);

    try {
      const res = await api.courses.purchase(detailCourse.id, cardNumber, couponCode);
      if (res.success) {
        setPurchaseSuccess(true);
        setTimeout(() => {
          setShowCheckout(false);
          setDetailCourse(null);
          setSelectedCourseId(null);
          navigate('dashboard');
        }, 2000);
      }
    } catch (err) {
      setPaymentError(err.message || 'Payment simulation failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Store Header & Filters */}
      <section style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem' }}>Digital Course Store</h1>
          <p style={{ color: 'var(--text-muted)' }}>Invest in your skills with our certified curriculum.</p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="Search courses..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field" 
            style={{ width: '220px', padding: '10px 14px' }}
          />
          <button type="submit" className="btn-primary" style={{ padding: '10px 18px' }}>
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </form>
      </section>

      {/* Category selectors */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {['', 'Software Engineering', 'Artificial Intelligence', 'Web Development'].map((cat) => (
          <button 
            key={cat} 
            onClick={() => setCategory(cat)}
            className={category === cat ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            {cat === '' ? 'All Categories' : cat}
          </button>
        ))}
      </div>

      {/* Store Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '3rem', color: 'var(--accent-primary)' }}></i>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px'
        }}>
          {courses.map(course => (
            <div 
              key={course.id} 
              className="glass-panel-interactive" 
              style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
              onClick={() => { setSelectedCourseId(course.id); loadCourseDetails(course.id); }}
            >
              <img src={course.image_url} alt={course.title} style={{ width: '100%', height: '170px', objectFit: 'cover' }} />
              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent-secondary)', fontWeight: 'bold' }}>{course.category}</span>
                  <span style={{ color: '#fbbf24', fontSize: '0.85rem' }}><i className="fa-solid fa-star"></i> {course.rating}</span>
                </div>
                <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{course.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineClamp: 3, height: '60px', overflow: 'hidden' }}>{course.description}</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '15px', borderTop: '1px solid var(--glass-border)' }}>
                  <div>
                    {course.discount_price ? (
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>${course.discount_price}</span>
                        <span style={{ textDecoration: 'line-through', fontSize: '0.8rem', color: 'var(--text-muted)' }}>${course.price}</span>
                      </div>
                    ) : (
                      <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>${course.price}</span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: '600' }}>
                    View details <i className="fa-solid fa-arrow-right"></i>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Course Detail Preview Sidebar/Modal */}
      {detailCourse && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 1100,
          display: 'flex',
          justifyContent: 'flex-end'
        }} onClick={() => { setDetailCourse(null); setSelectedCourseId(null); }}>
          
          <div 
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '550px',
              height: '100%',
              borderRadius: '0',
              overflowY: 'auto',
              padding: '40px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              borderLeft: '1px solid var(--glass-border)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button 
                onClick={() => { setDetailCourse(null); setSelectedCourseId(null); }}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                <i className="fa-solid fa-chevron-left"></i> Back to Catalog
              </button>

              <button 
                onClick={(e) => handleToggleBookmark(e, detailCourse.id)}
                style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontSize: '1.3rem' }}
              >
                <i className="fa-regular fa-bookmark"></i>
              </button>
            </div>

            <img src={detailCourse.image_url} alt={detailCourse.title} style={{ width: '100%', height: '220px', borderRadius: '12px', objectFit: 'cover' }} />

            <div>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--accent-secondary)', fontWeight: 'bold' }}>{detailCourse.category}</span>
              <h2 style={{ fontSize: '1.8rem', margin: '6px 0' }}>{detailCourse.title}</h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Instructor: <strong>{detailCourse.instructor}</strong></p>
            </div>

            <p style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>{detailCourse.description}</p>

            {/* Price & Checkout Trigger */}
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--glass-border)',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Course Value</span>
                <span style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>
                  ${detailCourse.discount_price || detailCourse.price}
                  {detailCourse.discount_price && (
                    <span style={{ textDecoration: 'line-through', fontSize: '1rem', color: 'var(--text-muted)', marginLeft: '10px' }}>
                      ${detailCourse.price}
                    </span>
                  )}
                </span>
              </div>

              <button onClick={handleOpenCheckout} className="btn-primary" style={{ padding: '12px 28px' }}>
                Buy Course Now <i className="fa-solid fa-credit-card"></i>
              </button>
            </div>

            {/* Syllabus breakdown */}
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>Course Syllabus</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {detailCourse.syllabus.map((chapter) => (
                  <div 
                    key={chapter.id}
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <i className={chapter.preview ? "fa-solid fa-circle-play" : "fa-solid fa-lock"} style={{ color: chapter.preview ? 'var(--accent-secondary)' : 'var(--text-muted)' }}></i>
                      <span style={{ fontSize: '0.9rem' }}>{chapter.id}. {chapter.title}</span>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{chapter.duration}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews list */}
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>Student Reviews</h3>
              {reviews.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No reviews yet. Be the first to review after purchasing!</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {reviews.map((rev) => (
                    <div key={rev.id} style={{ background: 'rgba(0,0,0,0.1)', padding: '12px 16px', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <strong>{rev.username}</strong>
                        <span style={{ color: '#fbbf24', fontSize: '0.8rem' }}>
                          {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                        </span>
                      </div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{rev.review_text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Simulated Billing/Checkout Modal */}
      {showCheckout && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(6px)',
          zIndex: 1200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div 
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '450px',
              padding: '30px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}
          >
            {purchaseSuccess ? (
              <div style={{ textAlign: 'center', padding: '40px 10px' }}>
                <i className="fa-solid fa-circle-check" style={{ fontSize: '4.5rem', color: '#10b981', marginBottom: '20px' }}></i>
                <h3 style={{ fontSize: '1.5rem' }}>Payment Approved!</h3>
                <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Enrolling you in {detailCourse.title}...</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.3rem' }}>Simulated Checkout</h3>
                  <button 
                    onClick={() => setShowCheckout(false)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>

                <div style={{ padding: '12px', background: 'rgba(139,92,246,0.1)', border: '1px solid var(--accent-primary-glow)', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  💡 <strong>Test Credentials:</strong>
                  <ul style={{ paddingLeft: '20px', marginTop: '4px' }}>
                    <li>Enter any 16-digit card (e.g. 4242 4242 4242 4242) for success.</li>
                    <li>Enter a card starting with <strong>4002</strong> to trigger Insufficient Funds failure.</li>
                    <li>Use coupon code <strong>STUDENT50</strong> for 50% discount.</li>
                  </ul>
                </div>

                {paymentError && (
                  <div style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    color: '#f87171',
                    padding: '12px',
                    borderRadius: '8px',
                    fontSize: '0.85rem'
                  }}>
                    <i className="fa-solid fa-circle-exclamation"></i> {paymentError}
                  </div>
                )}

                <form onSubmit={handleCheckoutSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Course Title</label>
                    <input type="text" className="input-field" value={detailCourse.title} disabled style={{ background: 'rgba(255,255,255,0.02)' }} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Amount</label>
                      <input type="text" className="input-field" value={`$${detailCourse.discount_price || detailCourse.price}`} disabled style={{ background: 'rgba(255,255,255,0.02)', fontWeight: 'bold' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Discount Code</label>
                      <input 
                        type="text" 
                        placeholder="e.g. STUDENT50" 
                        value={couponCode} 
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="input-field" 
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Credit Card Number</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="4242 4242 4242 4242" 
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="input-field" 
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="btn-primary" 
                    style={{ width: '100%', marginTop: '10px' }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Processing Transaction...' : 'Complete Payment'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
