import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { problemAPI, patternAPI } from '../services/api';

export default function AddProblem() {
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState('LeetCode');
  const [url, setUrl] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [description, setDescription] = useState('');
  const [availablePatterns, setAvailablePatterns] = useState([]);
  const [selectedPatternIds, setSelectedPatternIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const loadPatterns = async () => {
      try {
        const res = await patternAPI.getPatterns();
        setAvailablePatterns(res.data);
      } catch (err) {
        console.error('Failed to load patterns:', err);
      }
    };
    loadPatterns();
  }, []);

  const handlePatternToggle = (patternId) => {
    if (selectedPatternIds.includes(patternId)) {
      setSelectedPatternIds(selectedPatternIds.filter(id => id !== patternId));
    } else {
      setSelectedPatternIds([...selectedPatternIds, patternId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await problemAPI.createProblem({
        title,
        platform,
        url,
        difficulty,
        description,
        patternIds: selectedPatternIds
      });
      const problemId = res.data.problem._id;
      navigate(`/practice/${problemId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating problem.');
    } finally {
      setLoading(false);
    }
  };

  // Group patterns by category
  const groupedPatterns = availablePatterns.reduce((acc, p) => {
    const cat = p.category || 'Algorithmic Patterns';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
  }, {});

  return (
    <MainLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Add Problem Manually</h1>
          <p className="page-subtitle">Add a custom coding problem metadata record to your PracticeLab catalog</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: '700px' }}>
        {error && (
          <div style={{ padding: '10px 12px', backgroundColor: 'var(--accent-red-bg)', border: '1px solid var(--accent-red-border)', borderRadius: '6px', fontSize: '12px', marginBottom: '16px', color: '#f87171' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Problem Title *</label>
            <input 
              type="text" 
              className="form-control" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
              placeholder="e.g. 3Sum, Course Schedule..." 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Platform</label>
              <select className="form-control" value={platform} onChange={(e) => setPlatform(e.target.value)}>
                <option value="LeetCode">LeetCode</option>
                <option value="GeeksforGeeks">GeeksforGeeks</option>
                <option value="HackerRank">HackerRank</option>
                <option value="Codeforces">Codeforces</option>
                <option value="Other">Other Platform</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Difficulty</label>
              <select className="form-control" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Problem URL *</label>
            <input 
              type="url" 
              className="form-control" 
              value={url} 
              onChange={(e) => setUrl(e.target.value)} 
              required 
              placeholder="https://leetcode.com/problems/..." 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Algorithmic Pattern(s)</label>
            <div style={{ display: 'grid', gap: '12px', marginTop: '8px' }}>
              {Object.entries(groupedPatterns).map(([categoryName, patternsInCat]) => (
                <div key={categoryName}>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
                    {categoryName}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {patternsInCat.map(p => {
                      const isSelected = selectedPatternIds.includes(p._id);
                      return (
                        <button
                          key={p._id}
                          type="button"
                          onClick={() => handlePatternToggle(p._id)}
                          className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                          style={{ fontSize: '11px', height: '28px', padding: '0 10px' }}
                        >
                          {p.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Brief Description (Optional)</label>
            <textarea 
              className="form-control" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Summary of problem requirements or constraints..."
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Adding...' : 'Save & Begin Practice'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/library')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
