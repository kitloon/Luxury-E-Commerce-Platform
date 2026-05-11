import { useState } from 'react';
import axios from 'axios';
import styles, { tokens, font } from '../styles';

const API = "http://127.0.0.1:8000";

export default function Signup({ onSuccess, onGoLogin, onBack }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API}/signup`, form);
      alert("Account created. Please sign in.");
      onSuccess();
    } catch (err) {
      alert(err.response?.data?.detail || "Registration failed.");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: font, backgroundColor: tokens.white }}>
      {/* Nav */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px', height: '48px', borderBottom: `1px solid ${tokens.gray200}` }}>
        <span style={{ fontFamily: font, fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', cursor: 'pointer' }} onClick={onBack}>
          ATELIER
        </span>
        <span style={{ fontFamily: font, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: tokens.gray600, cursor: 'pointer' }} onClick={onBack}>
          ← Back
        </span>
      </div>

      <div style={{ flex: 1, display: 'flex' }}>
        {/* Left image */}
        <div className="auth-img" style={{ flex: 1, position: 'relative', overflow: 'hidden', backgroundColor: '#111' }}>
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200"
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5, filter: 'grayscale(30%)' }}
          />
          <div style={{ position: 'absolute', bottom: '60px', left: '48px', right: '48px' }}>
            <p style={{
              fontFamily: font,
              fontSize: 'clamp(40px, 6vw, 80px)',
              fontWeight: 700,
              color: tokens.white,
              textTransform: 'uppercase',
              lineHeight: 0.95,
              letterSpacing: '-1px',
              margin: 0,
            }}>
              THE<br />HOUSE
            </p>
          </div>
        </div>

        {/* Right form */}
        <div style={{ width: 'min(480px, 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '64px 48px', borderLeft: `1px solid ${tokens.gray200}` }}>
          <p style={{ fontFamily: font, fontSize: '10px', letterSpacing: '1.5px', color: tokens.gray600, textTransform: 'uppercase', marginBottom: '8px' }}>New Member</p>
          <h1 style={{ fontFamily: font, fontSize: '28px', fontWeight: 700, color: tokens.black, marginBottom: '48px', textTransform: 'uppercase', letterSpacing: '-0.5px', lineHeight: 1 }}>
            Create Account
          </h1>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '4px' }}>
              <label style={{ fontFamily: font, fontSize: '10px', letterSpacing: '1px', color: tokens.gray600, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Username</label>
              <input placeholder="" style={{ ...styles.input }} onChange={e => setForm({ ...form, username: e.target.value })} required />
            </div>
            <div style={{ marginBottom: '32px' }}>
              <label style={{ fontFamily: font, fontSize: '10px', letterSpacing: '1px', color: tokens.gray600, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Password</label>
              <input type="password" placeholder="" style={{ ...styles.input }} onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{ ...styles.btnBlack, width: '100%', height: '44px', fontSize: '11px', letterSpacing: '1.5px', opacity: loading ? 0.5 : 1 }}
            >
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>

          <div style={{ marginTop: '32px', paddingTop: '32px', borderTop: `1px solid ${tokens.gray200}` }}>
            <p style={{ fontFamily: font, fontSize: '11px', color: tokens.gray600, textAlign: 'center', letterSpacing: '0.3px' }}>
              Already a member?{' '}
              <span onClick={onGoLogin} style={{ color: tokens.black, cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '2px' }}>
                Sign In
              </span>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .auth-img { display: none !important; } }
      `}</style>
    </div>
  );
}
