import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function LearnPage({ user, courseId, navigate }) {
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // AI summary states
  const [summary, setSummary] = useState('');
  const [loadingSummary, setLoadingSummary] = useState(false);

  // AI Quiz states
  const [quiz, setQuiz] = useState(null);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Review states
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  useEffect(() => {
    if (!courseId) {
      navigate('dashboard');
      return;
    }
    loadCourseDetails();
  }, [courseId]);

  const loadCourseDetails = async () => {
    try {
      setLoading(true);
      
      // Get course details (syllabus, resources)
      const detailsRes = await api.courses.getById(courseId);
      
      // Get user dashboard enrollments to extract progress
      const dashboardRes = await api.courses.getDashboard();
      const currentEnrollment = dashboardRes.enrollments.find(e => e.course_id === Number(courseId));

      if (detailsRes.success && currentEnrollment) {
        setCourse(detailsRes.course);
        setEnrollment(currentEnrollment);
        setSelectedChapter(detailsRes.course.syllabus[0]); // default first chapter
      } else {
        // Not enrolled, kick back
        navigate('courses');
      }
    } catch (err) {
      console.error(err);
      navigate('dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleChapterProgress = async (chapterId) => {
    try {
      const res = await api.courses.updateProgress(course.id, chapterId);
      if (res.success) {
        setEnrollment(prev => ({
          ...prev,
          progress: res.progress,
          completed_chapters: res.completedChapters
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGetSummary = async () => {
    setLoadingSummary(true);
    setSummary('');
    try {
      const res = await api.ai.summarize(`Topic: ${selectedChapter.title}. Course Category: ${course.category}`);
      if (res.success) {
        setSummary(res.summary);
      }
    } catch (err) {
      setSummary('Failed to fetch summary: ' + err.message);
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleGenerateQuiz = async () => {
    setLoadingQuiz(true);
    setQuiz(null);
    setQuizAnswers({});
    setQuizSubmitted(false);
    try {
      const res = await api.ai.generateQuiz(selectedChapter.title, course.id);
      if (res.success) {
        setQuiz(res);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingQuiz(false);
    }
  };

  const handleSelectQuizOption = (questionIndex, optionIndex) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };

  const handleSubmitQuiz = () => {
    if (quizSubmitted) return;

    let score = 0;
    quiz.questions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.answer) {
        score += 1;
      }
    });

    setQuizScore(score);
    setQuizSubmitted(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewSuccess('');
    try {
      const res = await api.courses.submitReview(course.id, rating, reviewText);
      if (res.success) {
        setReviewSuccess('Thank you for rating this course!');
        setReviewText('');
        setRating(5);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '3rem', color: 'var(--accent-primary)' }}></i>
        <p style={{ marginTop: '15px', color: 'var(--text-muted)' }}>Opening classroom and syncing AI tutors...</p>
      </div>
    );
  }

  const isCompleted = (chapterId) => enrollment.completed_chapters.includes(chapterId);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '30px', alignItems: 'start' }}>
      
      {/* LEFT SIDEBAR: Chapters index */}
      <aside className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <button onClick={() => navigate('dashboard')} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem', width: '100%', marginBottom: '15px' }}>
            <i className="fa-solid fa-arrow-left-long"></i> Back to Dashboard
          </button>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>Course Syllabus</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{course.title}</p>
        </div>

        <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ width: `${enrollment.progress}%`, height: '100%', background: 'var(--gradient-purple-cyan)' }}></div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {course.syllabus.map((chapter) => {
            const selected = selectedChapter && selectedChapter.id === chapter.id;
            return (
              <div 
                key={chapter.id}
                onClick={() => { setSelectedChapter(chapter); setSummary(''); setQuiz(null); }}
                style={{
                  background: selected ? 'rgba(139, 92, 246, 0.12)' : 'rgba(255,255,255,0.02)',
                  border: '1px solid',
                  borderColor: selected ? 'var(--accent-primary)' : 'var(--glass-border)',
                  borderRadius: '8px',
                  padding: '12px 14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'var(--transition-smooth)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '80%' }}>
                  <input 
                    type="checkbox" 
                    checked={isCompleted(chapter.id)}
                    onChange={(e) => { e.stopPropagation(); handleToggleChapterProgress(chapter.id); }}
                    style={{ cursor: 'pointer', accentColor: 'var(--accent-primary)' }}
                  />
                  <span style={{ fontSize: '0.88rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: selected ? '600' : '400' }}>
                    {chapter.id}. {chapter.title}
                  </span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{chapter.duration}</span>
              </div>
            );
          })}
        </div>
      </aside>

      {/* MIDDLE & RIGHT WRAPPERS */}
      <main style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        
        {/* Course video area & resources */}
        <section style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px', alignItems: 'start', flexWrap: 'wrap' }}>
          
          {/* Middle: Video and active notes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Visual Video Simulator */}
            <div className="glass-panel pulse-glow" style={{
              height: '350px',
              borderRadius: '16px',
              overflow: 'hidden',
              position: 'relative',
              background: '#030206',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              border: '1px solid var(--accent-primary-glow)'
            }}>
              <i className="fa-solid fa-play" style={{ fontSize: '4.5rem', color: 'var(--accent-secondary)', textShadow: '0 0 25px var(--accent-secondary-glow)' }}></i>
              <span style={{ position: 'absolute', bottom: '20px', left: '20px', fontSize: '0.9rem', padding: '4px 10px', background: 'rgba(0,0,0,0.6)', borderRadius: '4px' }}>
                Simulating stream: Chapter {selectedChapter.id} - {selectedChapter.title}
              </span>
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '5px',
                background: 'rgba(255,255,255,0.1)'
              }}>
                <div style={{ width: '35%', height: '100%', background: 'var(--accent-primary)' }}></div>
              </div>
            </div>

            <div>
              <h2>{selectedChapter.title}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '8px' }}>
                You are currently reviewing notes and watching lecture recordings for chapter {selectedChapter.id}. Toggle checkboxes in the sidebar to sync progress reports.
              </p>
            </div>

            {/* Downloadable Resources */}
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>Downloadable Resources</h3>
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                {course.resources.map((res, i) => (
                  <div key={i} className="glass-panel" style={{ padding: '16px', borderRadius: '10px', flex: 1, minWidth: '200px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <i className="fa-regular fa-file-pdf" style={{ fontSize: '1.5rem', color: '#ef4444' }}></i>
                      <div>
                        <h4 style={{ fontSize: '0.9rem' }}>{res.name}</h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{res.size}</span>
                      </div>
                    </div>
                    {/* Simulated download */}
                    <button 
                      onClick={() => alert(`Simulating file download: ${res.name}`)}
                      style={{ background: 'none', border: 'none', color: 'var(--accent-secondary)', cursor: 'pointer', fontSize: '1.1rem' }}
                    >
                      <i className="fa-solid fa-download"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: AI Tools Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* AI Summary Card */}
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Smart Summarizer</h3>
                <button 
                  onClick={handleGetSummary} 
                  className="btn-secondary" 
                  style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                  disabled={loadingSummary}
                >
                  {loadingSummary ? 'Summarizing...' : 'AI Summary'}
                </button>
              </div>

              {summary ? (
                <div style={{ 
                  background: 'rgba(0,0,0,0.2)', 
                  padding: '16px', 
                  borderRadius: '8px', 
                  fontSize: '0.88rem', 
                  lineHeight: '1.5',
                  border: '1px solid var(--glass-border)'
                }}>
                  {summary}
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Click the button above to generate a brief summary of the concepts presented in this lecture.
                </p>
              )}
            </div>

            {/* AI Quiz Generator Card */}
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Topic Quiz Generator</h3>
                <button 
                  onClick={handleGenerateQuiz} 
                  className="btn-primary" 
                  style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                  disabled={loadingQuiz}
                >
                  {loadingQuiz ? 'Generating...' : 'Generate Quiz'}
                </button>
              </div>

              {/* Render generated Quiz */}
              {quiz ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <h4 style={{ fontSize: '0.95rem', color: 'var(--accent-secondary)' }}>Topic: {quiz.topic}</h4>
                  
                  {quiz.questions.map((q, qIdx) => (
                    <div key={qIdx} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <p style={{ fontSize: '0.9rem', fontWeight: '500' }}>Q{qIdx + 1}: {q.question}</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {q.options.map((opt, oIdx) => {
                          const isSelected = quizAnswers[qIdx] === oIdx;
                          const isCorrect = q.answer === oIdx;
                          let optBg = 'rgba(255,255,255,0.02)';
                          let optBorder = 'var(--glass-border)';

                          if (isSelected) {
                            optBg = 'rgba(139,92,246,0.1)';
                            optBorder = 'var(--accent-primary)';
                          }
                          if (quizSubmitted) {
                            if (isCorrect) {
                              optBg = 'rgba(16,185,129,0.15)';
                              optBorder = '#10b981';
                            } else if (isSelected && !isCorrect) {
                              optBg = 'rgba(239,68,68,0.15)';
                              optBorder = '#ef4444';
                            }
                          }

                          return (
                            <button
                              key={oIdx}
                              onClick={() => handleSelectQuizOption(qIdx, oIdx)}
                              style={{
                                background: optBg,
                                border: `1px solid ${optBorder}`,
                                color: 'var(--text-main)',
                                padding: '10px 14px',
                                borderRadius: '8px',
                                textAlign: 'left',
                                cursor: quizSubmitted ? 'default' : 'pointer',
                                fontSize: '0.85rem'
                              }}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {quizSubmitted && (
                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px 12px', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', borderLeft: '3px solid var(--accent-secondary)' }}>
                          <strong>Explanation:</strong> {q.explanation}
                        </div>
                      )}
                    </div>
                  ))}

                  {!quizSubmitted ? (
                    <button 
                      onClick={handleSubmitQuiz} 
                      className="btn-primary" 
                      style={{ width: '100%', padding: '10px', fontSize: '0.85rem' }}
                      disabled={Object.keys(quizAnswers).length < quiz.questions.length}
                    >
                      Submit Answers
                    </button>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '10px', background: 'rgba(139,92,246,0.1)', borderRadius: '8px' }}>
                      <h4 style={{ margin: 0 }}>Score: {quizScore} / {quiz.questions.length}</h4>
                      <button onClick={handleGenerateQuiz} className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem', marginTop: '8px' }}>Retake New Quiz</button>
                    </div>
                  )}
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Generate dynamic multiple choice questions targeting "{selectedChapter.title}" to test your retention.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Student Rating & Review Submit Panel */}
        <section className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <h3>Submit Course Rating</h3>
          {reviewSuccess && (
            <div style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399', padding: '10px 14px', borderRadius: '8px', fontSize: '0.9rem' }}>
              {reviewSuccess}
            </div>
          )}
          <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Rating:</span>
              <div style={{ display: 'flex', gap: '5px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <i 
                    key={star}
                    onClick={() => setRating(star)}
                    className={rating >= star ? "fa-solid fa-star" : "fa-regular fa-star"} 
                    style={{ color: '#fbbf24', fontSize: '1.2rem', cursor: 'pointer' }}
                  ></i>
                ))}
              </div>
            </div>

            <textarea 
              rows="3" 
              required
              placeholder="Write your study experience..." 
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="input-field"
              style={{ resize: 'none' }}
            ></textarea>

            <button type="submit" className="btn-secondary" style={{ alignSelf: 'flex-start', padding: '10px 20px', fontSize: '0.85rem' }}>
              Submit Review
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
