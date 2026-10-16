import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const { user } = useAuth();

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '60px 20px', textAlign: 'center' }}>
      <header style={{ marginBottom: '60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: '700', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
          PracticeLab
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {user ? (
            <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary">Login</Link>
              <Link to="/register" className="btn btn-primary">Get Started</Link>
            </>
          )}
        </div>
      </header>

      <main>
        <div style={{ marginBottom: '48px', maxWidth: '720px', margin: '0 auto 48px auto' }}>
          <h1 style={{ fontSize: '48px', fontWeight: '800', letterSpacing: '-1.5px', lineHeight: '1.1', marginBottom: '20px' }}>
            Train your thinking, not your memory.
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            PracticeLab is an adaptive learning platform for algorithmic problem solving. Build long-term pattern recognition using active recall, spaced repetition, and intelligent problem recommendations.
          </p>
          <div style={{ marginTop: '32px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link to={user ? "/dashboard" : "/register"} className="btn btn-primary btn-lg">
              Start Structured Practice
            </Link>
            <Link to={user ? "/library" : "/login"} className="btn btn-secondary btn-lg">
              Browse Practice Library
            </Link>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '60px', marginTop: '60px' }}>
          <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '32px' }}>
            Core Active Recall Workflow
          </h3>

          <div className="grid grid-4" style={{ textAlign: 'left' }}>
            <div className="card">
              <div style={{ fontWeight: '700', fontSize: '16px', marginBottom: '8px' }}>1. Recognize</div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Identify the underlying algorithmic pattern before viewing any notes or solutions.</p>
            </div>
            <div className="card">
              <div style={{ fontWeight: '700', fontSize: '16px', marginBottom: '8px' }}>2. Reason & Solve</div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Explain why the pattern fits, then write code directly on LeetCode/HackerRank.</p>
            </div>
            <div className="card">
              <div style={{ fontWeight: '700', fontSize: '16px', marginBottom: '8px' }}>3. Reflect</div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Record key ideas, mistakes made, recognition clues, and rate your confidence.</p>
            </div>
            <div className="card">
              <div style={{ fontWeight: '700', fontSize: '16px', marginBottom: '8px' }}>4. Adapt</div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Spaced repetition schedules revision; the adaptive engine recommends similar problems.</p>
            </div>
          </div>
        </div>
      </main>

      <footer style={{ marginTop: '100px', borderTop: '1px solid var(--border-color)', paddingTop: '30px', color: 'var(--text-muted)', fontSize: '12px' }}>
        PracticeLab &copy; {new Date().getFullYear()}: Structured Algorithmic Practice Platform
      </footer>
    </div>
  );
}
