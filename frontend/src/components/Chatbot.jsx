import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';

export default function Chatbot({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Load chat history when user logs in and opens chatbot
  useEffect(() => {
    if (user && isOpen) {
      loadHistory();
    }
  }, [user, isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadHistory = async () => {
    try {
      const data = await api.ai.getChatHistory();
      if (data.success) {
        const formatted = [];
        data.history.forEach(item => {
          formatted.push({ sender: 'student', text: item.message });
          formatted.push({ sender: 'ai', text: item.response });
        });
        setMessages(formatted);
      }
    } catch (err) {
      console.error('Failed to load chat history:', err);
    }
  };

  const handleSendMessage = async (textToSend) => {
    const messageText = textToSend || inputText;
    if (!messageText.trim()) return;

    if (!textToSend) setInputText('');
    setMessages(prev => [...prev, { sender: 'student', text: messageText }]);
    setLoading(true);

    try {
      const res = await api.ai.sendChatMessage(messageText);
      if (res.success) {
        setMessages(prev => [...prev, { sender: 'ai', text: res.response }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'ai', text: `⚠️ Connection failed: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const triggerPreset = (topic) => {
    let text = '';
    if (topic === 'solid') text = 'Can you explain the SOLID principles with a code example?';
    if (topic === 'react') text = 'What is the difference between React Server and Client Components?';
    if (topic === 'devops') text = 'How do I write a simple GitHub Actions CI/CD configuration?';
    handleSendMessage(text);
  };

  if (!user) return null; // Only available for logged-in users

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="pulse-glow"
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'var(--gradient-purple-cyan)',
            border: 'none',
            color: '#fff',
            fontSize: '1.6rem',
            cursor: 'pointer',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 30px rgba(139,92,246,0.4)',
            transition: 'var(--transition-smooth)'
          }}
        >
          <i className="fa-solid fa-robot"></i>
        </button>
      )}

      {/* Chat Drawer */}
      {isOpen && (
        <div 
          className="glass-panel"
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            width: '400px',
            height: '600px',
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: '1px solid var(--accent-primary-glow)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
          }}
        >
          {/* Chat Header */}
          <div style={{
            background: 'rgba(139,92,246,0.1)',
            padding: '16px 20px',
            borderBottom: '1px solid var(--glass-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{
                background: 'var(--gradient-purple-cyan)',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                display: 'inline-block'
              }}></span>
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>AI Tutor Copilot</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '1.1rem'
              }}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          {/* Quick topics */}
          <div style={{
            padding: '10px 15px',
            background: 'rgba(0,0,0,0.2)',
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            borderBottom: '1px solid var(--glass-border)'
          }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', width: '100%' }}>Ask AI Tutor:</span>
            <button onClick={() => triggerPreset('solid')} className="btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem', borderRadius: '6px' }}>SOLID Principles</button>
            <button onClick={() => triggerPreset('react')} className="btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem', borderRadius: '6px' }}>React RSCs</button>
            <button onClick={() => triggerPreset('devops')} className="btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem', borderRadius: '6px' }}>DevOps pipeline</button>
          </div>

          {/* Chat message body */}
          <div style={{
            flex: 1,
            padding: '20px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            background: 'rgba(5, 4, 10, 0.4)'
          }}>
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--text-muted)' }}>
                <i className="fa-solid fa-comments" style={{ fontSize: '3rem', color: 'var(--accent-primary-glow)', marginBottom: '15px' }}></i>
                <p style={{ fontSize: '0.95rem' }}>Ask your AI study tutor questions about software engineering, react architecture, or pipelines!</p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div 
                key={i} 
                style={{
                  alignSelf: msg.sender === 'student' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  background: msg.sender === 'student' ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.04)',
                  border: '1px solid',
                  borderColor: msg.sender === 'student' ? 'rgba(139,92,246,0.3)' : 'var(--glass-border)',
                  padding: '12px 16px',
                  borderRadius: msg.sender === 'student' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  fontSize: '0.9rem',
                  lineHeight: '1.5'
                }}
              >
                {msg.sender === 'ai' ? (
                  // Simple renderer for headers and code blocks
                  <div style={{ whiteSpace: 'pre-wrap' }}>
                    {msg.text}
                  </div>
                ) : (
                  <div>{msg.text}</div>
                )}
              </div>
            ))}

            {loading && (
              <div style={{
                alignSelf: 'flex-start',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--glass-border)',
                padding: '12px 20px',
                borderRadius: '16px 16px 16px 4px',
                display: 'flex',
                gap: '5px'
              }}>
                <span className="dot" style={{ width: '8px', height: '8px', background: 'var(--accent-primary)', borderRadius: '50%', display: 'inline-block', animation: 'float 1s infinite alternate' }}></span>
                <span className="dot" style={{ width: '8px', height: '8px', background: 'var(--accent-secondary)', borderRadius: '50%', display: 'inline-block', animation: 'float 1s infinite alternate 0.2s' }}></span>
                <span className="dot" style={{ width: '8px', height: '8px', background: 'var(--text-muted)', borderRadius: '50%', display: 'inline-block', animation: 'float 1s infinite alternate 0.4s' }}></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat input footer */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            style={{
              padding: '15px',
              borderTop: '1px solid var(--glass-border)',
              display: 'flex',
              gap: '10px',
              background: 'rgba(0,0,0,0.3)'
            }}
          >
            <input 
              type="text" 
              placeholder="Ask anything..." 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="input-field"
              style={{ padding: '10px 14px', fontSize: '0.9rem' }}
              disabled={loading}
            />
            <button 
              type="submit" 
              className="btn-primary" 
              style={{ width: '45px', height: '40px', padding: 0 }}
              disabled={loading}
            >
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
