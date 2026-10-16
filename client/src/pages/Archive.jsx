import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { problemAPI, reviewAPI } from '../services/api';

export default function Archive() {
  const [archivedProblems, setArchivedProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchArchived = async () => {
    try {
      setLoading(true);
      const res = await problemAPI.getProblems({ status: 'Archived' });
      setArchivedProblems(res.data);
    } catch (err) {
      console.error('Failed to load archived problems:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArchived();
  }, []);

  const handleRestore = async (problemId) => {
    try {
      await reviewAPI.toggleArchive(problemId);
      fetchArchived();
    } catch (err) {
      console.error('Restore failed:', err);
    }
  };

  return (
    <MainLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Problem Archive</h1>
          <p className="page-subtitle">Archived problems remain saved in your database and retain all history</p>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '40px 0', color: 'var(--text-secondary)' }}>Loading archived problems...</div>
      ) : archivedProblems.length === 0 ? (
        <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)' }}>No problems currently archived.</p>
        </div>
      ) : (
        <div className="grid grid-2">
          {archivedProblems.map((prob) => (
            <div key={prob._id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span className={`badge badge-${prob.difficulty.toLowerCase()}`}>{prob.difficulty}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{prob.platform}</span>
                </div>

                <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px', color: 'var(--text-primary)' }}>
                  <Link to={`/problem/${prob._id}`}>{prob.title}</Link>
                </h3>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                <button className="btn btn-secondary btn-block" onClick={() => handleRestore(prob._id)}>
                  Restore to Library
                </button>
                <Link to={`/practice/${prob._id}`} className="btn btn-primary btn-block">
                  Practice
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </MainLayout>
  );
}
