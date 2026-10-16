import React, { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import { analyticsAPI } from '../services/api';

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await analyticsAPI.getAnalytics();
        setData(res.data);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div style={{ padding: '40px 0', color: 'var(--text-secondary)' }}>Loading learning analytics...</div>
      </MainLayout>
    );
  }

  const { totalPracticed, totalMastered, streak, patternStats, activityMap } = data || {};

  // Build 14-day consistency activity list
  const days = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const monthName = d.toLocaleString('en-US', { month: 'short' });
    const dayNum = d.getDate();
    const label = i === 0 ? 'Today' : `${monthName} ${dayNum}`;
    const count = activityMap ? (activityMap[dateStr] || 0) : 0;
    days.push({ dateStr, label, count });
  }

  return (
    <MainLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Learning Analytics</h1>
          <p className="page-subtitle">Practice metrics, pattern mastery breakdown, and consistency tracking</p>
        </div>
      </div>

      {/* Top High-level Stats */}
      <div className="grid grid-3" style={{ marginBottom: '24px' }}>
        <div className="card">
          <div style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Problems Practiced</div>
          <div style={{ fontSize: '32px', fontWeight: '800', marginTop: '4px', color: 'var(--text-primary)' }}>{totalPracticed}</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Mastered Concepts</div>
          <div style={{ fontSize: '32px', fontWeight: '800', marginTop: '4px', color: '#4ade80' }}>{totalMastered}</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Active Streak</div>
          <div style={{ fontSize: '32px', fontWeight: '800', marginTop: '4px', color: 'var(--text-primary)' }}>🔥 {streak} <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>days</span></div>
        </div>
      </div>

      {/* Practice Consistency Tracking */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>Practice Consistency Activity</h3>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Daily consistency record over the last 14 days
        </p>

        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', justifyContent: 'space-between', paddingBottom: '4px' }}>
          {days.map((day) => (
            <div key={day.dateStr} style={{ textAlign: 'center', minWidth: '46px', padding: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                {day.label}
              </div>
              <div style={{ height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {day.count > 0 ? (
                  <span style={{ 
                    width: '20px', 
                    height: '20px', 
                    borderRadius: '50%', 
                    backgroundColor: 'var(--accent-green-bg)', 
                    color: '#4ade80', 
                    border: '1px solid var(--accent-green-border)',
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    justify: 'center', 
                    flexShrink: 0
                  }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                ) : (
                  '😭'
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pattern Mastery Breakdown */}
      <div className="card">
        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          Algorithmic Pattern Mastery
        </h3>

        <div style={{ display: 'grid', gap: '16px' }}>
          {patternStats && patternStats.map((pat) => (
            <div key={pat.id} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-primary)' }}>{pat.name}</span>
                <span style={{ fontWeight: '700', fontSize: '13px', color: 'var(--accent-blue)' }}>{pat.mastery}% Mastery</span>
              </div>

              {/* Progress bar */}
              <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
                <div style={{ width: `${pat.mastery}%`, height: '100%', backgroundColor: 'var(--accent-blue)' }}></div>
              </div>

              <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                <span>Sessions: {pat.total}</span>
                <span>High Confidence: {pat.high}</span>
                <span>Medium Confidence: {pat.medium}</span>
                <span>Low Confidence: {pat.low}</span>
                {pat.lastPracticed && (
                  <span>Last: {new Date(pat.lastPracticed).toLocaleDateString()}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
