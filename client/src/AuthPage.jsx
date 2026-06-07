import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { motion } from 'framer-motion';

// const BASE = 'http://localhost:5000';
const BASE = 'https://paper-star-jar.onrender.com';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', password: '', email: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    try {
      const res = await fetch(`${BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        login(data.token, data.username);
      } else {
        setError(data.msg || 'Authentication failed');
      }
    } catch (err) {
      setError('Could not reach the server. Is it running on port 5000?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5ede0',
      backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: "'EB Garamond', Georgia, serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Courier+Prime&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          width: '100%',
          maxWidth: 440,
          background: '#fdf6ee',
          border: '1px solid #d4b896',
          padding: '48px 44px',
          boxShadow: '0 8px 40px rgba(124,74,30,0.12), 4px 4px 0 #c9956a',
          position: 'relative',
        }}
      >
        {/* Decorative corner lines */}
        <div style={{ position: 'absolute', top: 10, left: 10, width: 24, height: 24, borderTop: '1px solid #d4b896', borderLeft: '1px solid #d4b896' }} aria-hidden="true" />
        <div style={{ position: 'absolute', top: 10, right: 10, width: 24, height: 24, borderTop: '1px solid #d4b896', borderRight: '1px solid #d4b896' }} aria-hidden="true" />
        <div style={{ position: 'absolute', bottom: 10, left: 10, width: 24, height: 24, borderBottom: '1px solid #d4b896', borderLeft: '1px solid #d4b896' }} aria-hidden="true" />
        <div style={{ position: 'absolute', bottom: 10, right: 10, width: 24, height: 24, borderBottom: '1px solid #d4b896', borderRight: '1px solid #d4b896' }} aria-hidden="true" />

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ marginBottom: 16 }}>
            <svg width="48" height="36" viewBox="0 0 48 36" fill="none" aria-label="Starmail envelope icon">
              <rect x="1" y="1" width="46" height="34" rx="3" fill="#f5ede0" stroke="#c9956a" strokeWidth="1.5"/>
              <path d="M1 5 L24 22 L47 5" stroke="#c9956a" strokeWidth="1.2" fill="none"/>
              <line x1="1" y1="35" x2="16" y2="22" stroke="#c9956a" strokeWidth="1" opacity="0.4"/>
              <line x1="47" y1="35" x2="32" y2="22" stroke="#c9956a" strokeWidth="1" opacity="0.4"/>
            </svg>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: '#3d2410', letterSpacing: 1, marginBottom: 6 }}>
            Starmail
          </h1>
          <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', color: '#a07850' }}>
            Letters across time
          </p>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
          <div style={{ flex: 1, height: 1, background: '#e8d5be' }} />
          <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: '#c4a882' }}>
            {isLogin ? 'Sign in' : 'Create account'}
          </span>
          <div style={{ flex: 1, height: 1, background: '#e8d5be' }} />
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={{ display: 'block', fontFamily: "'Courier Prime', monospace", fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: '#a07850', marginBottom: 6 }}>
              Username
            </label>
            <input
              type="text" required placeholder="Choose a name"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              style={{ width: '100%', background: '#f5ede0', border: '1px solid #d4b896', color: '#3d2410', fontFamily: "'EB Garamond', Georgia, serif", fontSize: 18, padding: '10px 14px', outline: 'none', transition: 'border-color .2s' }}
              onFocus={(e) => e.target.style.borderColor = '#7c4a1e'}
              onBlur={(e) => e.target.style.borderColor = '#d4b896'}
            />
          </div>

          {!isLogin && (
            <div>
              <label style={{ display: 'block', fontFamily: "'Courier Prime', monospace", fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: '#a07850', marginBottom: 6 }}>
                Email
              </label>
              <input
                type="email" placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{ width: '100%', background: '#f5ede0', border: '1px solid #d4b896', color: '#3d2410', fontFamily: "'EB Garamond', Georgia, serif", fontSize: 18, padding: '10px 14px', outline: 'none', transition: 'border-color .2s' }}
                onFocus={(e) => e.target.style.borderColor = '#7c4a1e'}
                onBlur={(e) => e.target.style.borderColor = '#d4b896'}
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontFamily: "'Courier Prime', monospace", fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: '#a07850', marginBottom: 6 }}>
              Password
            </label>
            <input
              type="password" required placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              style={{ width: '100%', background: '#f5ede0', border: '1px solid #d4b896', color: '#3d2410', fontFamily: "'EB Garamond', Georgia, serif", fontSize: 18, padding: '10px 14px', outline: 'none', transition: 'border-color .2s' }}
              onFocus={(e) => e.target.style.borderColor = '#7c4a1e'}
              onBlur={(e) => e.target.style.borderColor = '#d4b896'}
            />
          </div>

          {error && (
            <div style={{ background: '#fdf0ee', border: '1px solid #e8a8a8', color: '#8a2020', padding: '10px 14px', fontSize: 14, fontStyle: 'italic' }}>
              {error}
            </div>
          )}

          <motion.button
            type="submit" disabled={loading}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            style={{ marginTop: 6, width: '100%', background: '#7c4a1e', color: '#fdf6ee', border: 'none', fontFamily: "'Courier Prime', monospace", fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', padding: '14px', cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.6 : 1, transition: 'background .2s' }}
          >
            {loading ? 'One moment…' : isLogin ? 'Enter vault' : 'Create account'}
          </motion.button>
        </form>

        <div style={{ marginTop: 28, textAlign: 'center', paddingTop: 20, borderTop: '1px solid #e8d5be' }}>
          <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: 12, color: '#a07850', marginBottom: 10 }}>
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
          </p>
          <button
            onClick={() => { setIsLogin(!isLogin); setError(''); setFormData({ username: '', email: '', password: '' }); }}
            style={{ background: 'none', border: 'none', fontFamily: "'Courier Prime', monospace", fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: '#7c4a1e', cursor: 'pointer', textDecoration: 'underline', textDecorationStyle: 'dotted' }}
          >
            {isLogin ? 'Register here' : 'Sign in instead'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}