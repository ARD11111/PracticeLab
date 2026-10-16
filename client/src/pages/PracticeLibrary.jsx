import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { problemAPI, patternAPI, reviewAPI } from '../services/api';

const DIFFICULTY_ORDER = {
  'Easy': 1,
  'Medium': 2,
  'Hard': 3
};

const CANONICAL_CATEGORIES = [
  'Arrays & Hashing',
  'Two Pointers',
  'Sliding Window',
  'Stack',
  'Binary Search',
  'Linked List',
  'Trees',
  'Tries',
  'Heap / Priority Queue',
  'Backtracking',
  'Graphs',
  'Advanced Graphs',
  '1-D Dynamic Programming',
  '2-D Dynamic Programming',
  'Greedy',
  'Intervals',
  'Math & Geometry',
  'Bit Manipulation'
];

export default function PracticeLibrary() {
  const location = useLocation();
  const navigate = useNavigate();

  const [problems, setProblems] = useState([]);
  const [patterns, setPatterns] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPattern, setSelectedPattern] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const [collapsedPatterns, setCollapsedPatterns] = useState({});

  const fetchLibrary = async () => {
    try {
      setLoading(true);
      const [probRes, patRes] = await Promise.all([
        problemAPI.getProblems({
          search,
          category: selectedCategory,
          pattern: selectedPattern,
          difficulty: selectedDifficulty,
          status: selectedStatus
        }),
        patternAPI.getPatterns()
      ]);
      setProblems(probRes.data);
      setPatterns(patRes.data);
    } catch (err) {
      console.error('Error fetching library:', err);
    } finally {
      setLoading(false);
    }
  };

  // Sync URL search params once or when location changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlPattern = params.get('pattern');
    const urlCategory = params.get('category');
    const urlSearch = params.get('search');

    if (urlPattern) setSelectedPattern(urlPattern);
    if (urlCategory) setSelectedCategory(urlCategory);
    if (urlSearch !== null) setSearch(urlSearch);
  }, [location.search]);

  // Fetch library whenever any filter or search state changes
  useEffect(() => {
    fetchLibrary();
  }, [search, selectedCategory, selectedPattern, selectedDifficulty, selectedStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchLibrary();
  };

  const handleClearFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSelectedPattern('All');
    setSelectedDifficulty('All');
    setSelectedStatus('All');
    if (location.search) {
      navigate('/library', { replace: true });
    }
  };

  const handleToggleArchive = async (problemId) => {
    try {
      await reviewAPI.toggleArchive(problemId);
      fetchLibrary();
    } catch (err) {
      console.error('Archive failed:', err);
    }
  };

  const togglePatternCollapse = (patternName) => {
    setCollapsedPatterns(prev => ({
      ...prev,
      [patternName]: !prev[patternName]
    }));
  };

  const toggleAllCollapse = (collapseAll) => {
    const nextState = {};
    if (collapseAll) {
      groupedByPattern.forEach(g => {
        nextState[g.name] = true;
      });
    }
    setCollapsedPatterns(nextState);
  };

  // Group fetched problems by Primary Pattern Name
  const patternGroupsMap = {};

  problems.forEach(prob => {
    let patName = 'General / Core Algorithmic';
    if (prob.primaryPatternId && prob.primaryPatternId.name) {
      patName = prob.primaryPatternId.name;
    } else if (prob.patternIds && prob.patternIds.length > 0 && prob.patternIds[0].name) {
      patName = prob.patternIds[0].name;
    } else if (prob.category) {
      patName = prob.category;
    }

    if (!patternGroupsMap[patName]) {
      patternGroupsMap[patName] = [];
    }
    patternGroupsMap[patName].push(prob);
  });

  // Convert to array of groups & sort problems inside each group by Easy -> Medium -> Hard
  const groupedByPattern = Object.keys(patternGroupsMap).map(patName => {
    const groupProblems = patternGroupsMap[patName];

    // Sort strictly by Easy (1) -> Medium (2) -> Hard (3) -> Title
    const sortedProblems = [...groupProblems].sort((a, b) => {
      const orderA = DIFFICULTY_ORDER[a.difficulty] || 99;
      const orderB = DIFFICULTY_ORDER[b.difficulty] || 99;
      if (orderA !== orderB) return orderA - orderB;
      return a.title.localeCompare(b.title);
    });

    const easyCount = sortedProblems.filter(p => p.difficulty === 'Easy').length;
    const mediumCount = sortedProblems.filter(p => p.difficulty === 'Medium').length;
    const hardCount = sortedProblems.filter(p => p.difficulty === 'Hard').length;

    return {
      name: patName,
      problems: sortedProblems,
      easyCount,
      mediumCount,
      hardCount
    };
  });

  // Sort pattern groups alphabetically
  groupedByPattern.sort((a, b) => a.name.localeCompare(b.name));

  const isFiltered = search !== '' || selectedCategory !== 'All' || selectedPattern !== 'All' || selectedDifficulty !== 'All' || selectedStatus !== 'All';

  return (
    <MainLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Practice Library</h1>
          <p className="page-subtitle">Algorithmic pattern groups sorted by Easy → Medium → Hard</p>
        </div>
        <Link to="/add-problem" className="btn btn-primary">
          + Add Problem Manually
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto auto', gap: 'var(--space-3)', alignItems: 'end' }}>
          <div>
            <label className="form-label">Search</label>
            <input
              type="text"
              className="form-control"
              placeholder="Title, pattern, category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div>
            <label className="form-label">Category</label>
            <select className="form-control" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="All">All Categories</option>
              {CANONICAL_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Algorithmic Pattern</label>
            <select className="form-control" value={selectedPattern} onChange={(e) => setSelectedPattern(e.target.value)}>
              <option value="All">All Patterns</option>
              {patterns.map(p => (
                <option key={p._id} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Difficulty</label>
            <select className="form-control" value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)}>
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="form-label">Status</label>
            <select className="form-control" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
              <option value="All">All Statuses</option>
              <option value="Not Practiced">Not Practiced</option>
              <option value="Practiced">Practiced</option>
              <option value="Due">Due for Review</option>
              <option value="Mastered">Mastered</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary">
            Filter
          </button>
          
          {isFiltered && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClearFilters}
              title="Clear all active filters"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Global Actions for Pattern Accordions */}
      {!loading && groupedByPattern.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Showing <strong style={{ color: 'var(--text-primary)' }}>{groupedByPattern.length}</strong> pattern {groupedByPattern.length === 1 ? 'group' : 'groups'} ({problems.length} total problems)
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => toggleAllCollapse(false)}
            >
              Expand All
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => toggleAllCollapse(true)}
            >
              Collapse All
            </button>
          </div>
        </div>
      )}

      {/* Grouped Pattern Accordions */}
      {loading ? (
        <div style={{ padding: '40px 0', color: 'var(--text-secondary)', textAlign: 'center' }}>Loading problem catalog...</div>
      ) : groupedByPattern.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>No problems found matching selected criteria.</p>
          <button className="btn btn-secondary btn-sm" onClick={handleClearFilters}>
            Clear Filters & Search
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {groupedByPattern.map((group) => {
            const isCollapsed = collapsedPatterns[group.name];

            return (
              <div
                key={group.name}
                className="card"
                style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border-color)' }}
              >
                {/* Pattern Dropdown Header */}
                <div
                  onClick={() => togglePatternCollapse(group.name)}
                  style={{
                    display: 'flex',
                    justify: 'space-between',
                    alignItems: 'center',
                    padding: '16px 20px',
                    backgroundColor: 'var(--bg-tertiary)',
                    cursor: 'pointer',
                    userSelect: 'none',
                    borderBottom: isCollapsed ? 'none' : '1px solid var(--border-color)',
                    transition: 'background-color 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div className="chevron-btn">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{
                          transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s ease',
                          display: 'block'
                        }}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>
                      {group.name}
                    </h3>
                    <span style={{
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      backgroundColor: 'var(--bg-primary)',
                      padding: '2px 10px',
                      borderRadius: '12px',
                      border: '1px solid var(--border-color)'
                    }}>
                      {group.problems.length} {group.problems.length === 1 ? 'problem' : 'problems'}
                    </span>
                  </div>

                  {/* Difficulty count indicators */}
                  <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                    {group.easyCount > 0 && (
                      <span className="badge badge-easy" style={{ fontSize: '11px', padding: '3px 8px' }}>
                        {group.easyCount} Easy
                      </span>
                    )}
                    {group.mediumCount > 0 && (
                      <span className="badge badge-medium" style={{ fontSize: '11px', padding: '3px 8px' }}>
                        {group.mediumCount} Medium
                      </span>
                    )}
                    {group.hardCount > 0 && (
                      <span className="badge badge-hard" style={{ fontSize: '11px', padding: '3px 8px' }}>
                        {group.hardCount} Hard
                      </span>
                    )}
                  </div>
                </div>

                {/* Dropdown Body: Problems Table */}
                {!isCollapsed && (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', backgroundColor: 'var(--bg-primary)' }}>
                          <th style={{ padding: '12px 20px', fontWeight: '600', width: '30%' }}>Problem Title</th>
                          <th style={{ padding: '12px 16px', fontWeight: '600' }}>Category</th>
                          <th style={{ padding: '12px 16px', fontWeight: '600' }}>Data Structures</th>
                          <th style={{ padding: '12px 16px', fontWeight: '600' }}>Difficulty</th>
                          <th style={{ padding: '12px 16px', fontWeight: '600' }}>Status</th>
                          <th style={{ padding: '12px 20px', fontWeight: '600', textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.problems.map((prob) => {
                          const status = prob.userState?.status || 'Not Practiced';
                          const dsText = prob.dataStructures && prob.dataStructures.length > 0
                            ? prob.dataStructures.join(', ')
                            : '—';

                          return (
                            <tr key={prob._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                              <td style={{ padding: '14px 20px', fontWeight: '600' }}>
                                <Link to={`/problem/${prob._id}`} style={{ color: 'var(--text-primary)' }}>
                                  {prob.title}
                                </Link>
                              </td>
                              <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                                <span style={{
                                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                                  padding: '3px 8px',
                                  borderRadius: '4px',
                                  fontSize: '12px',
                                  border: '1px solid var(--border-color)'
                                }}>
                                  {prob.category || 'General'}
                                </span>
                              </td>
                              <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: '12px' }}>
                                {dsText}
                              </td>
                              <td style={{ padding: '14px 16px' }}>
                                <span className={`badge badge-${prob.difficulty.toLowerCase()}`}>
                                  {prob.difficulty}
                                </span>
                              </td>
                              <td style={{ padding: '14px 16px' }}>
                                <span style={{
                                  fontWeight: '600',
                                  color: status === 'Mastered' ? '#4ade80' : status === 'Due' ? 'var(--accent-blue)' : 'var(--text-secondary)'
                                }}>
                                  {status}
                                </span>
                              </td>
                              <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                                <div style={{ display: 'inline-flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                                  <Link to={`/practice/${prob._id}`} className="btn btn-primary btn-sm">
                                    Begin Practice
                                  </Link>
                                  <Link to={`/problem/${prob._id}`} className="btn btn-secondary btn-sm">
                                    Details
                                  </Link>
                                  <button
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => handleToggleArchive(prob._id)}
                                    title={status === 'Archived' ? 'Restore' : 'Archive'}
                                  >
                                    {status === 'Archived' ? 'Restore' : 'Archive'}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </MainLayout>
  );
}


