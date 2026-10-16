import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { problemAPI, patternAPI, practiceAPI } from '../services/api';

export default function PracticeSession() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [allPatterns, setAllPatterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [completedResult, setCompletedResult] = useState(null);

  // Form states
  const [recognizedPatternId, setRecognizedPatternId] = useState('');
  const [reasoning, setReasoning] = useState('');
  const [keyIdea, setKeyIdea] = useState('');
  const [mistake, setMistake] = useState('');
  const [recognitionClues, setRecognitionClues] = useState('');
  const [confidence, setConfidence] = useState('High'); // High, Medium, Low
  const [showPreviousNotes, setShowPreviousNotes] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const loadSessionData = async () => {
      try {
        setLoading(true);
        const [probRes, patRes] = await Promise.all([
          problemAPI.getProblemById(id),
          patternAPI.getPatterns()
        ]);
        setData(probRes.data);
        setAllPatterns(patRes.data);
      } catch (err) {
        console.error('Failed to load session context:', err);
      } finally {
        setLoading(false);
      }
    };
    loadSessionData();
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <div style={{ padding: '40px 0', color: 'var(--text-secondary)' }}>Loading active recall practice session...</div>
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

  const { problem, history } = data;
  const lastSession = history && history.length > 0 ? history[0] : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await practiceAPI.createSession({
        problemId: problem._id,
        recognizedPatternId: recognizedPatternId || null,
        reasoning,
        keyIdea,
        mistake,
        recognitionClues,
        confidence
      });
      setCompletedResult(res.data);
    } catch (err) {
      console.error('Failed to complete practice session:', err);
      alert('Error saving practice session. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Group patterns by category for <optgroup>
  const groupedPatterns = allPatterns.reduce((acc, p) => {
    const cat = p.category || 'Algorithmic Patterns';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
  }, {});

  // Completion Summary Screen
  if (completedResult) {
    const { userProblemState, recommendedNext } = completedResult;
    return (
      <MainLayout>
        <div className="card" style={{ maxWidth: '650px', margin: '20px auto', padding: '32px' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '50%', 
              backgroundColor: 'var(--accent-green-bg)', 
              border: '1px solid var(--accent-green-border)', 
              color: '#4ade80', 
              display: 'inline-flex', 
              alignItems: 'center', 
              justify: 'center', 
              fontSize: '24px',
              marginBottom: '12px' 
            }}>
              ✓
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)' }}>Practice Session Completed!</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '13px' }}>
              Your reflection has been recorded and spaced repetition scheduled.
            </p>
          </div>

          <div className="grid grid-2" style={{ marginBottom: '24px' }}>
            <div className="card" style={{ backgroundColor: 'var(--bg-tertiary)', padding: '16px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>
                Next Revision Date
              </div>
              <div style={{ fontSize: '16px', fontWeight: '700', marginTop: '4px', color: 'var(--text-primary)' }}>
                {userProblemState?.nextReview ? new Date(userProblemState.nextReview).toLocaleDateString() : 'Scheduled'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Interval: {userProblemState?.interval} day(s) • Ease: {userProblemState?.easeFactor}
              </div>
            </div>

            <div className="card" style={{ backgroundColor: 'var(--bg-tertiary)', padding: '16px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>
                Updated Status
              </div>
              <div style={{ fontSize: '16px', fontWeight: '700', marginTop: '4px', color: 'var(--text-primary)' }}>
                {userProblemState?.status || 'Practiced'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Review Count: {userProblemState?.reviewCount}
              </div>
            </div>
          </div>

          {/* Adaptive Recommendation Card */}
          {recommendedNext && (
            <div className="card" style={{ marginBottom: '24px', backgroundColor: 'var(--bg-tertiary)' }}>
              <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--accent-blue)', marginBottom: '6px' }}>
                Adaptive Recommendation: What to practice next
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>{recommendedNext.problem.title}</h3>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 16px 0' }}>
                {recommendedNext.platform} • {recommendedNext.pattern} • <span className={`badge badge-${recommendedNext.difficulty.toLowerCase()}`}>{recommendedNext.difficulty}</span>
              </div>
              <Link to={`/practice/${recommendedNext.problem._id}`} onClick={() => setCompletedResult(null)} className="btn btn-primary btn-block">
                Start Recommended Practice →
              </Link>
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px' }}>
            <Link to="/dashboard" className="btn btn-secondary btn-block">
              Return to Dashboard
            </Link>
            <Link to="/library" className="btn btn-secondary btn-block">
              Open Library
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Practice Session Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className={`badge badge-${problem.difficulty.toLowerCase()}`}>{problem.difficulty}</span>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{problem.platform}</span>
          </div>
          <h1 className="page-title">{problem.title}</h1>
        </div>

        <a href={problem.url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
          Open Original Problem ↗
        </a>
      </div>

      {/* Hidden Previous Notes Toggle */}
      {lastSession && (
        <div className="card" style={{ marginBottom: '20px', backgroundColor: 'var(--bg-tertiary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>Previous Notes from Last Session</span>
            <button className="btn btn-secondary btn-sm" onClick={() => setShowPreviousNotes(!showPreviousNotes)}>
              {showPreviousNotes ? 'Hide Notes' : 'Reveal Notes'}
            </button>
          </div>

          {showPreviousNotes && (
            <div style={{ marginTop: '12px', fontSize: '13px', borderTop: '1px solid var(--border-color)', paddingTop: '12px', color: 'var(--text-secondary)' }}>
              <p><strong style={{ color: 'var(--text-primary)' }}>Key Idea:</strong> {lastSession.keyIdea}</p>
              <p style={{ marginTop: '4px' }}><strong style={{ color: 'var(--text-primary)' }}>Mistake:</strong> {lastSession.mistake || 'None'}</p>
              <p style={{ marginTop: '4px' }}><strong style={{ color: 'var(--text-primary)' }}>Recognition Clues:</strong> {lastSession.recognitionClues}</p>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* STEP 1: RECOGNIZE */}
        <div className="practice-step-card">
          <div className="step-header">
            <div className="step-number">1</div>
            <div className="step-title">STEP 1: RECOGNIZE - What pattern do you think applies?</div>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Active Recall: Test your pattern recognition intuition before coding.
          </p>

          <div className="form-group">
            <label className="form-label">Select Pattern</label>
            <select 
              className="form-control" 
              value={recognizedPatternId} 
              onChange={(e) => setRecognizedPatternId(e.target.value)}
              required
            >
              <option value="">Choose algorithmic pattern</option>
              {Object.entries(groupedPatterns).map(([categoryName, patternsInCat]) => (
                <optgroup key={categoryName} label={categoryName}>
                  {patternsInCat.map(p => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>

        {/* STEP 2: REASON */}
        <div className="practice-step-card">
          <div className="step-header">
            <div className="step-number">2</div>
            <div className="step-title">STEP 2: REASON - Why does this pattern apply?</div>
          </div>
          <div className="form-group">
            <label className="form-label">Explain your mental model & approach</label>
            <textarea 
              className="form-control" 
              placeholder="e.g. Needs O(1) lookups for complements, array is unsorted..."
              value={reasoning} 
              onChange={(e) => setReasoning(e.target.value)} 
              required
            />
          </div>
        </div>

        {/* STEP 3: SOLVE */}
        <div className="practice-step-card">
          <div className="step-header">
            <div className="step-number">3</div>
            <div className="step-title">STEP 3: SOLVE - Execute on Original Coding Platform</div>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Open the coding platform, write your solution, and verify test cases. PracticeLab records your learning process around the code.
          </p>
          <a href={problem.url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-lg">
            Solve {problem.title} on {problem.platform} ↗
          </a>
        </div>

        {/* STEP 4: REFLECT */}
        <div className="practice-step-card">
          <div className="step-header">
            <div className="step-number">4</div>
            <div className="step-title">STEP 4: REFLECT - Post-Solve Insights</div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Key Idea / Core Insight</label>
            <textarea 
              className="form-control" 
              placeholder="What was the essential trick or insight to solve this problem?"
              value={keyIdea} 
              onChange={(e) => setKeyIdea(e.target.value)} 
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mistake I Made / Edge Cases Missed</label>
            <textarea 
              className="form-control" 
              placeholder="Did you hit TLE, off-by-one errors, or boundary bug?"
              value={mistake} 
              onChange={(e) => setMistake(e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label className="form-label">When to Use This / Recognition Clues</label>
            <textarea 
              className="form-control" 
              placeholder="What keywords or problem structure hint that this pattern applies?"
              value={recognitionClues} 
              onChange={(e) => setRecognitionClues(e.target.value)} 
            />
          </div>
        </div>

        {/* STEP 5: CONFIDENCE */}
        <div className="practice-step-card">
          <div className="step-header">
            <div className="step-number">5</div>
            <div className="step-title">STEP 5: CONFIDENCE - How confident are you?</div>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            This self-rating directly drives the SM-2 Spaced Repetition interval and adaptive recommendation engine.
          </p>

          <div className="confidence-group">
            <div 
              className={`confidence-btn ${confidence === 'High' ? 'selected' : ''}`}
              onClick={() => setConfidence('High')}
            >
              <span className="title">Yes / High</span>
              <span className="subtitle">Solved easily without hints</span>
            </div>

            <div 
              className={`confidence-btn ${confidence === 'Medium' ? 'selected' : ''}`}
              onClick={() => setConfidence('Medium')}
            >
              <span className="title">Maybe / Medium</span>
              <span className="subtitle">Solved with minor struggle</span>
            </div>

            <div 
              className={`confidence-btn ${confidence === 'Low' ? 'selected' : ''}`}
              onClick={() => setConfidence('Low')}
            >
              <span className="title">No / Low</span>
              <span className="subtitle">Struggled or needed solution</span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '24px', marginBottom: '60px' }}>
          <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={submitting}>
            {submitting ? 'Saving Session...' : 'Complete Practice & Update Spaced Repetition'}
          </button>
        </div>
      </form>
    </MainLayout>
  );
}
