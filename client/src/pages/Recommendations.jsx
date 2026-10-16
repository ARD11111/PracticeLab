import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { recommendationAPI } from '../services/api';

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const res = await recommendationAPI.getRecommendations();
        setRecommendations(res.data);
      } catch (err) {
        console.error('Failed to load recommendations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  return (
    <MainLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Adaptive Recommendations</h1>
          <p className="page-subtitle">Problem recommendations based on pattern mastery and difficulty progression</p>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '40px 0', color: 'var(--text-secondary)' }}>Calculating adaptive problem recommendations...</div>
      ) : recommendations.length === 0 ? (
        <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)' }}>No new recommendations available. Explore the library or practice existing due reviews!</p>
          <Link to="/library" className="btn btn-primary" style={{ marginTop: '16px' }}>Go to Library</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {recommendations.map((item) => (
            <div key={item._id} className="problem-row" style={{ padding: 'var(--space-4) var(--space-5)' }}>
              <div className="problem-row-left">
                <div className="problem-row-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                </div>
                <div className="problem-row-details">
                  <h3 className="problem-row-title">
                    {item.problem.title}
                  </h3>
                  <div className="problem-row-meta">
                    <span>{item.platform}</span>
                    <span className="meta-dot">•</span>
                    <span>{item.pattern}</span>
                    <span className="meta-dot">•</span>
                    <span className={`badge badge-${item.difficulty.toLowerCase()}`}>
                      {item.difficulty}
                    </span>
                  </div>
                </div>
              </div>

              <div className="problem-row-action">
                <Link to={`/practice/${item.problem._id}`} className="btn btn-primary btn-sm">
                  Begin Practice
                </Link>
                <a href={item.problem.url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm" title="View on coding site">
                  ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </MainLayout>
  );
}
