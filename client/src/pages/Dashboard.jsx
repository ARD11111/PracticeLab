import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import MonthCalendar from '../components/MonthCalendar';
import { useAuth } from '../context/AuthContext';
import { analyticsAPI, reviewAPI, recommendationAPI } from '../services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [reviewQueue, setReviewQueue] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [anRes, revRes, recRes] = await Promise.all([
          analyticsAPI.getAnalytics(),
          reviewAPI.getReviewQueue(),
          recommendationAPI.getRecommendations()
        ]);
        setAnalytics(anRes.data);
        setReviewQueue(revRes.data);
        setRecommendations(recRes.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div style={{ padding: '40px 0', color: 'var(--text-secondary)' }}>Loading practice dashboard...</div>
      </MainLayout>
    );
  }

  const dueQueue = reviewQueue?.dueToday || [];
  const dueCount = reviewQueue?.dueTodayCount || dueQueue.length || 0;
  const streak = analytics?.streak || 0;
  const totalPracticed = analytics?.totalPracticed || 0;
  const totalMastered = analytics?.totalMastered || 0;

  // Next problem due for Today's Practice card
  const todayProblemState = dueQueue.length > 0 ? dueQueue[0] : null;
  const todayProblem = todayProblemState?.problemId || (recommendations.length > 0 ? recommendations[0].problem : null);
  const todayPlatform = todayProblemState ? todayProblem?.platform : (recommendations.length > 0 ? recommendations[0].platform : '');
  const todayPattern = todayProblemState ? (todayProblem?.patternIds?.[0]?.name || 'General') : (recommendations.length > 0 ? recommendations[0].pattern : '');
  const todayDifficulty = todayProblem?.difficulty || 'Easy';

  return (
    <MainLayout>
      <div className="dashboard-layout">
        {/* Main Content (Center) */}
        <div className="dashboard-main">
          {/* Header */}
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <h1 className="page-title">Welcome back, {user?.name || 'Algorithmic Student'}!</h1>
            <p className="page-subtitle">
              Keep your practice consistent. You have {dueCount} problem{dueCount === 1 ? '' : 's'} due today.
            </p>
          </div>

          {/* Top Statistics Cards Grid */}
          <div className="stat-grid">
            {/* Due Today */}
            <div className="stat-card">
              <div className="stat-card-header">
                <div className="stat-icon-wrapper">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                </div>
                <div className="stat-card-info">
                  <span className="stat-label">Due Today</span>
                  <span className="stat-value">{dueCount}</span>
                </div>
              </div>
              <div className="stat-card-footer">
                <Link to="/reviews" className="stat-link">
                  Review now
                </Link>
              </div>
            </div>

            {/* Recommended */}
            <div className="stat-card">
              <div className="stat-card-header">
                <div className="stat-icon-wrapper">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                </div>
                <div className="stat-card-info">
                  <span className="stat-label">Recommended</span>
                  <span className="stat-value">{recommendations.length}</span>
                </div>
              </div>
              <div className="stat-card-footer">
                <Link to="/recommendations" className="stat-link">
                  View recommendations
                </Link>
              </div>
            </div>

            {/* Current Streak */}
            <div className="stat-card">
              <div className="stat-card-header">
                <div className="stat-icon-wrapper flame">
                  🔥
                </div>
                <div className="stat-card-info">
                  <span className="stat-label">Current Streak</span>
                  <span className="stat-value">🔥 {streak} days</span>
                </div>
              </div>
              <div className="stat-card-footer">
                <span className="stat-link" style={{ cursor: 'default' }}>
                  Keep going!
                </span>
              </div>
            </div>

            {/* Problems Practiced */}
            <div className="stat-card">
              <div className="stat-card-header">
                <div className="stat-icon-wrapper">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                </div>
                <div className="stat-card-info">
                  <span className="stat-label">Problems Practiced</span>
                  <span className="stat-value">{totalPracticed}</span>
                </div>
              </div>
              <div className="stat-card-footer">
                <span className="stat-subtext">
                  {totalMastered} mastered
                </span>
              </div>
            </div>
          </div>

          {/* TODAY'S PRACTICE SECTION */}
          <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <div className="stat-icon-wrapper">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                </div>
                <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>Today's Practice</h2>
              </div>
              <Link to="/reviews" style={{ fontSize: '12px', color: 'var(--accent-blue)', fontWeight: '600' }}>
                View all
              </Link>
            </div>

            {todayProblem ? (
              <div className="problem-row">
                <div className="problem-row-left">
                  <div className="problem-row-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                  </div>
                  <div className="problem-row-details">
                    <h3 className="problem-row-title">
                      {todayProblem.title}
                    </h3>
                    <div className="problem-row-meta">
                      <span>{todayPlatform || 'LeetCode'}</span>
                      <span className="meta-dot">•</span>
                      <span>{todayPattern}</span>
                      <span className="meta-dot">•</span>
                      <span className={`badge badge-${todayDifficulty.toLowerCase()}`}>
                        {todayDifficulty}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="problem-row-action">
                  <Link to={`/practice/${todayProblem._id}`} className="btn btn-primary btn-sm">
                    Begin Practice
                  </Link>
                </div>
              </div>
            ) : (
              <div style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                No reviews due today! Check out recommended problems below to build pattern mastery.
              </div>
            )}
          </div>

          {/* RECOMMENDED FOR YOU SECTION */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <div className="stat-icon-wrapper">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                </div>
                <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>Recommended for You</h2>
              </div>
              <Link to="/recommendations" style={{ fontSize: '12px', color: 'var(--accent-blue)', fontWeight: '600' }}>
                View all
              </Link>
            </div>

            {recommendations.length === 0 ? (
              <div style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No problem recommendations available. Explore the Practice Library!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {recommendations.slice(0, 4).map((item) => (
                  <div key={item._id} className="problem-row">
                    <div className="problem-row-left">
                      <div className="problem-row-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
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
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Full Month Practice Calendar */}
        <div className="dashboard-sidebar-right">
          <MonthCalendar activityMap={analytics?.activityMap} />
        </div>
      </div>
    </MainLayout>
  );
}
