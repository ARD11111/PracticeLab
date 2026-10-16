import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { reviewAPI } from '../services/api';

export default function ReviewQueue() {
  const [activeTab, setActiveTab] = useState('dueToday'); // dueToday, upcoming, completed
  const [queueData, setQueueData] = useState({ dueToday: [], upcoming: [], completed: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        setLoading(true);
        const res = await reviewAPI.getReviewQueue();
        setQueueData(res.data);
      } catch (err) {
        console.error('Failed to load review queue:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchQueue();
  }, []);

  const items = queueData[activeTab] || [];

  return (
    <MainLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Spaced Repetition Queue</h1>
          <p className="page-subtitle">SM-2 algorithm scheduled revision queue for long-term retention</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        <button
          className={`btn ${activeTab === 'dueToday' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('dueToday')}
        >
          Due Today ({queueData.dueToday?.length || 0})
        </button>

        <button
          className={`btn ${activeTab === 'upcoming' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming ({queueData.upcoming?.length || 0})
        </button>

        <button
          className={`btn ${activeTab === 'completed' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed / Mastered ({queueData.completed?.length || 0})
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '40px 0', color: 'var(--text-secondary)' }}>Loading spaced repetition queue...</div>
      ) : items.length === 0 ? (
        <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)' }}>
            {activeTab === 'dueToday'
              ? 'No reviews due today! You are all caught up.'
              : 'No items in this queue category.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {items.map((state) => {
            const prob = state.problemId;
            if (!prob) return null;
            const patternName = prob.patternIds && prob.patternIds.length > 0 ? prob.patternIds[0].name : 'General';

            return (
              <div key={state._id} className="problem-row" style={{ padding: 'var(--space-4) var(--space-5)' }}>
                <div className="problem-row-left">
                  <div className="problem-row-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  </div>
                  <div className="problem-row-details">
                    <h3 className="problem-row-title">
                      <Link to={`/problem/${prob._id}`}>{prob.title}</Link>
                    </h3>
                    <div className="problem-row-meta">
                      <span>{prob.platform}</span>
                      <span className="meta-dot">•</span>
                      <span>{patternName}</span>
                      <span className="meta-dot">•</span>
                      <span className={`badge badge-${prob.difficulty.toLowerCase()}`}>{prob.difficulty}</span>
                      <span className="meta-dot">•</span>
                      <span>Next Review: {new Date(state.nextReview).toLocaleDateString()}</span>
                      <span className="meta-dot">•</span>
                      <span>Interval: {state.interval}d</span>
                    </div>
                  </div>
                </div>

                <div className="problem-row-action">
                  <Link to={`/practice/${prob._id}`} className="btn btn-primary btn-sm">
                    Begin Practice
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </MainLayout>
  );
}
