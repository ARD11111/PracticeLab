import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { practiceAPI } from '../services/api';

export default function PracticeHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await practiceAPI.getHistory();
        setHistory(res.data);
      } catch (err) {
        console.error('Failed to load history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <MainLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Practice History Log</h1>
          <p className="page-subtitle">Chronological record of all active recall practice sessions</p>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '40px 0', color: 'var(--text-secondary)' }}>Loading history log...</div>
      ) : history.length === 0 ? (
        <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)' }}>No practice sessions recorded yet.</p>
          <Link to="/library" className="btn btn-primary" style={{ marginTop: '16px' }}>Start Practicing</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '14px' }}>
          {history.map((sess) => {
            const prob = sess.problemId;
            if (!prob) return null;

            return (
              <div key={sess._id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {new Date(sess.createdAt).toLocaleString()}
                    </span>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', marginTop: '2px', color: 'var(--text-primary)' }}>
                      <Link to={`/problem/${prob._id}`}>{prob.title}</Link>
                    </h3>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span className="badge" style={{ 
                      backgroundColor: sess.confidence === 'High' ? 'var(--accent-green-bg)' : sess.confidence === 'Medium' ? 'var(--accent-amber-bg)' : 'var(--accent-red-bg)',
                      borderColor: sess.confidence === 'High' ? 'var(--accent-green-border)' : sess.confidence === 'Medium' ? 'var(--accent-amber-border)' : 'var(--accent-red-border)',
                      color: sess.confidence === 'High' ? '#4ade80' : sess.confidence === 'Medium' ? '#fbbf24' : '#f87171'
                    }}>
                      Confidence: {sess.confidence}
                    </span>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      {prob.platform} • {prob.difficulty}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '13px', display: 'grid', gap: '6px', borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '8px', color: 'var(--text-secondary)' }}>
                  <div>
                    <strong style={{ color: 'var(--text-primary)' }}>Recognized Pattern:</strong> {sess.recognizedPatternId?.name || 'Unspecified'}
                  </div>
                  {sess.reasoning && (
                    <div><strong style={{ color: 'var(--text-primary)' }}>Reasoning:</strong> {sess.reasoning}</div>
                  )}
                  {sess.keyIdea && (
                    <div><strong style={{ color: 'var(--text-primary)' }}>Key Idea:</strong> {sess.keyIdea}</div>
                  )}
                  {sess.mistake && (
                    <div><strong style={{ color: 'var(--text-primary)' }}>Mistake:</strong> {sess.mistake}</div>
                  )}
                  {sess.recognitionClues && (
                    <div><strong style={{ color: 'var(--text-primary)' }}>Recognition Clues:</strong> {sess.recognitionClues}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </MainLayout>
  );
}
