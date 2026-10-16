import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { problemAPI, reviewAPI } from '../services/api';

export default function ProblemDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [showNotes, setShowNotes] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await problemAPI.getProblemById(id);
      setData(res.data);
    } catch (err) {
      console.error('Error fetching problem details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <div style={{ padding: '40px 0', color: 'var(--text-secondary)' }}>Loading problem details...</div>
      </MainLayout>
    );
  }

  if (!data || !data.problem) {
    return (
      <MainLayout>
        <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
          <h2>Problem Not Found</h2>
          <Link to="/library" className="btn btn-primary" style={{ marginTop: '16px' }}>Back to Library</Link>
        </div>
      </MainLayout>
    );
  }

  const { problem, userState, history } = data;
  const patternsList = problem.patternIds?.map(p => p.name).join(', ') || 'General';
  const latestSession = history && history.length > 0 ? history[0] : null;

  const handleToggleArchive = async () => {
    try {
      await reviewAPI.toggleArchive(problem._id);
      fetchDetails();
    } catch (err) {
      console.error('Archive failed:', err);
    }
  };

  return (
    <MainLayout>
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className={`badge badge-${problem.difficulty.toLowerCase()}`}>{problem.difficulty}</span>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{problem.platform}</span>
            <span style={{ fontSize: '12px', fontWeight: '600' }}>• {patternsList}</span>
          </div>
          <h1 className="page-title">{problem.title}</h1>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link to={`/practice/${problem._id}`} className="btn btn-primary">
            Practice Again
          </Link>
          <a href={problem.url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
            Open Original Site ↗
          </a>
          <button className="btn btn-secondary" onClick={handleToggleArchive}>
            {userState?.status === 'Archived' ? 'Restore' : 'Archive'}
          </button>
        </div>
      </div>

      <div className="grid grid-3" style={{ marginBottom: '28px' }}>
        <div className="card">
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>Current Status</div>
          <div style={{ fontSize: '20px', fontWeight: '700', marginTop: '4px' }}>{userState?.status || 'Not Practiced'}</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>Last Practiced</div>
          <div style={{ fontSize: '16px', fontWeight: '600', marginTop: '4px' }}>
            {userState?.lastPracticedAt ? new Date(userState.lastPracticedAt).toLocaleDateString() : 'Never'}
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>Next Spaced Review</div>
          <div style={{ fontSize: '16px', fontWeight: '600', marginTop: '4px' }}>
            {userState?.nextReview ? new Date(userState.nextReview).toLocaleDateString() : 'N/A'}
          </div>
        </div>
      </div>

      {problem.description && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>Description</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{problem.description}</p>
        </div>
      )}

      {/* Hidden Notes / Reflection Toggle Section */}
      <div className="card" style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Previous Practice Reflection Notes</h3>
          <button className="btn btn-secondary btn-sm" onClick={() => setShowNotes(!showNotes)}>
            {showNotes ? 'Hide Previous Notes' : 'Reveal Previous Notes'}
          </button>
        </div>

        {!showNotes ? (
          <div style={{ padding: '16px', backgroundColor: 'var(--bg-tertiary)', border: '1px dashed var(--border-color)', borderRadius: '6px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            🔒 Previous notes hidden to protect active recall. Click <strong>"Reveal Previous Notes"</strong> to inspect.
          </div>
        ) : !latestSession ? (
          <p style={{ color: 'var(--text-secondary)' }}>No previous practice reflections recorded for this problem yet.</p>
        ) : (
          <div style={{ display: 'grid', gap: '12px', marginTop: '12px' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)' }}>Key Idea:</div>
              <p style={{ color: 'var(--text-secondary)' }}>{latestSession.keyIdea || 'N/A'}</p>
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)' }}>Mistake Made:</div>
              <p style={{ color: 'var(--text-secondary)' }}>{latestSession.mistake || 'None'}</p>
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)' }}>Recognition Clues / When to Use:</div>
              <p style={{ color: 'var(--text-secondary)' }}>{latestSession.recognitionClues || 'N/A'}</p>
            </div>
          </div>
        )}
      </div>

      {/* Chronological History Timeline */}
      <div className="card">
        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
          Practice History Timeline
        </h3>
        {history.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No practice sessions recorded yet.</p>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {history.map((sess) => (
              <div key={sess._id} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  <span>{new Date(sess.createdAt).toLocaleString()}</span>
                  <span style={{ fontWeight: '700', color: '#000' }}>Confidence: {sess.confidence}</span>
                </div>
                <div style={{ fontWeight: '600', marginTop: '4px' }}>
                  Recognized Pattern: {sess.recognizedPatternId?.name || 'Unspecified'}
                </div>
                {sess.reasoning && (
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    <strong>Reasoning:</strong> {sess.reasoning}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
