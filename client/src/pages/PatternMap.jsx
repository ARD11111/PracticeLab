import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { problemAPI, patternAPI, analyticsAPI } from '../services/api';

const ROADMAP_SECTIONS = [
  {
    id: 'FOUNDATION',
    title: 'FOUNDATION',
    subtitle: 'Core array processing, pointer manipulation, searching, and window techniques'
  },
  {
    id: 'CORE DATA STRUCTURES',
    title: 'CORE DATA STRUCTURES',
    subtitle: 'Node pointers, hierarchical trees, priority queues, and greedy interval strategies'
  },
  {
    id: 'RECURSION / SEARCH',
    title: 'RECURSION / SEARCH',
    subtitle: 'State-space exploration, combinatorial search, and prefix tree operations'
  },
  {
    id: 'GRAPH FUNDAMENTALS',
    title: 'GRAPH FUNDAMENTALS',
    subtitle: 'Grid traversals, connectivity, shortest paths in unweighted graphs, and topological ordering'
  },
  {
    id: 'ADVANCED GRAPH ALGORITHMS',
    title: 'ADVANCED GRAPH ALGORITHMS',
    subtitle: 'Weighted graph optimizations, minimum spanning trees, and greedy shortest paths'
  },
  {
    id: 'DYNAMIC PROGRAMMING',
    title: 'DYNAMIC PROGRAMMING',
    subtitle: 'Overlapping subproblems, state transitions, and multidimensional optimization'
  },
  {
    id: 'SPECIALIZED / ADVANCED TECHNIQUES',
    title: 'SPECIALIZED / ADVANCED TECHNIQUES',
    subtitle: 'Bitwise operations, in-place matrix transformations, and mathematical digit logic'
  }
];

const CANONICAL_CATEGORIES_METADATA = [
  { name: 'Arrays & Hashing', order: 1, section: 'FOUNDATION', prerequisites: [] },
  { name: 'Two Pointers', order: 2, section: 'FOUNDATION', prerequisites: ['Arrays & Hashing'] },
  { name: 'Sliding Window', order: 3, section: 'FOUNDATION', prerequisites: ['Two Pointers'] },
  { name: 'Stack', order: 4, section: 'FOUNDATION', prerequisites: ['Arrays & Hashing'] },
  { name: 'Binary Search', order: 5, section: 'FOUNDATION', prerequisites: ['Arrays & Hashing'] },

  { name: 'Linked List', order: 6, section: 'CORE DATA STRUCTURES', prerequisites: ['Two Pointers'] },
  { name: 'Trees', order: 7, section: 'CORE DATA STRUCTURES', prerequisites: ['Stack'] },
  { name: 'Heap / Priority Queue', order: 8, section: 'CORE DATA STRUCTURES', prerequisites: ['Trees'] },
  { name: 'Intervals', order: 9, section: 'CORE DATA STRUCTURES', prerequisites: ['Arrays & Hashing'] },
  { name: 'Greedy', order: 10, section: 'CORE DATA STRUCTURES', prerequisites: ['Arrays & Hashing'] },

  { name: 'Backtracking', order: 11, section: 'RECURSION / SEARCH', prerequisites: ['Trees'] },
  { name: 'Tries', order: 12, section: 'RECURSION / SEARCH', prerequisites: ['Trees'] },

  { name: 'Graphs', order: 13, section: 'GRAPH FUNDAMENTALS', prerequisites: ['Trees'] },
  { name: 'Advanced Graphs', order: 14, section: 'ADVANCED GRAPH ALGORITHMS', prerequisites: ['Graphs'] },

  { name: '1-D Dynamic Programming', order: 15, section: 'DYNAMIC PROGRAMMING', prerequisites: ['Backtracking'] },
  { name: '2-D Dynamic Programming', order: 16, section: 'DYNAMIC PROGRAMMING', prerequisites: ['1-D Dynamic Programming'] },

  { name: 'Bit Manipulation', order: 17, section: 'SPECIALIZED / ADVANCED TECHNIQUES', prerequisites: ['Arrays & Hashing'] },
  { name: 'Math & Geometry', order: 18, section: 'SPECIALIZED / ADVANCED TECHNIQUES', prerequisites: ['Arrays & Hashing'] }
];

export default function PatternMap() {
  const [problems, setProblems] = useState([]);
  const [patterns, setPatterns] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [probRes, patRes, anRes] = await Promise.all([
          problemAPI.getProblems({}),
          patternAPI.getPatterns(),
          analyticsAPI.getAnalytics()
        ]);
        setProblems(probRes.data);
        setPatterns(patRes.data);
        setAnalytics(anRes.data);
      } catch (err) {
        console.error('Failed to load Pattern Map data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleCategoryExpand = (catName) => {
    setExpandedCategories(prev => ({
      ...prev,
      [catName]: !prev[catName]
    }));
  };

  // Build stats map per category
  const categoryStatsMap = {};
  CANONICAL_CATEGORIES_METADATA.forEach(cat => {
    categoryStatsMap[cat.name] = {
      ...cat,
      totalProblems: 0,
      practicedProblems: 0,
      masteredProblems: 0,
      patternsList: []
    };
  });

  // Map patterns to categories
  patterns.forEach(pat => {
    const catName = pat.category;
    if (categoryStatsMap[catName]) {
      categoryStatsMap[catName].patternsList.push(pat);
    }
  });

  // Sort pattern list within each category by learningOrder
  Object.values(categoryStatsMap).forEach(catObj => {
    catObj.patternsList.sort((a, b) => (a.learningOrder || 99) - (b.learningOrder || 99));
  });

  // Accumulate problem counts
  problems.forEach(prob => {
    const catName = prob.category;
    if (categoryStatsMap[catName]) {
      categoryStatsMap[catName].totalProblems += 1;
      const status = prob.userState?.status;
      if (status && status !== 'Not Practiced') {
        categoryStatsMap[catName].practicedProblems += 1;
      }
      if (status === 'Mastered') {
        categoryStatsMap[catName].masteredProblems += 1;
      }
    }
  });

  return (
    <MainLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Pattern Learning Roadmap</h1>
          <p className="page-subtitle">
            Recommended step-by-step learning progression from foundational concepts to advanced algorithms
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '40px 0', color: 'var(--text-secondary)', textAlign: 'center' }}>
          Loading algorithmic learning roadmap...
        </div>
      ) : (
        <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {ROADMAP_SECTIONS.map((sectionSpec) => {
            const categoriesInSection = CANONICAL_CATEGORIES_METADATA
              .filter(c => c.section === sectionSpec.id)
              .sort((a, b) => a.order - b.order);

            if (categoriesInSection.length === 0) return null;

            return (
              <div key={sectionSpec.id} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Section Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid var(--border-color)'
                }}>
                  <div style={{
                    backgroundColor: 'rgba(56, 189, 248, 0.15)',
                    color: 'var(--accent-blue)',
                    padding: '4px 12px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '700',
                    letterSpacing: '0.05em'
                  }}>
                    {sectionSpec.title}
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {sectionSpec.subtitle}
                  </span>
                </div>

                {/* Category Nodes */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative' }}>
                  {categoriesInSection.map((catMeta) => {
                    const catData = categoryStatsMap[catMeta.name];
                    const isExpanded = expandedCategories[catMeta.name];
                    const percentComplete = catData.totalProblems > 0
                      ? Math.round((catData.practicedProblems / catData.totalProblems) * 100)
                      : 0;

                    return (
                      <div
                        key={catMeta.name}
                        className="card"
                        style={{
                          padding: 0,
                          overflow: 'hidden',
                          border: '1px solid var(--border-color)',
                          backgroundColor: 'var(--bg-card)',
                          transition: 'border-color 0.15s ease'
                        }}
                      >
                        {/* Node Header */}
                        <div
                          onClick={() => toggleCategoryExpand(catMeta.name)}
                          style={{
                            display: 'flex',
                            justify: 'space-between',
                            alignItems: 'center',
                            padding: '16px 20px',
                            backgroundColor: 'var(--bg-tertiary)',
                            cursor: 'pointer',
                            userSelect: 'none'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
                            {/* Step Number Circle */}
                            <div className="number-badge-circle">
                              {String(catMeta.order).padStart(2, '0')}
                            </div>

                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>
                                  {catMeta.name}
                                </h3>

                                {/* Prerequisite Badges */}
                                {catMeta.prerequisites && catMeta.prerequisites.length > 0 && (
                                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                    {catMeta.prerequisites.map(prereq => (
                                      <span key={prereq} style={{
                                        fontSize: '10px',
                                        color: 'var(--text-muted)',
                                        backgroundColor: 'var(--bg-primary)',
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        border: '1px solid var(--border-color)',
                                        lineHeight: 1
                                      }}>
                                        Requires: {prereq}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '3px' }}>
                                {catData.totalProblems} canonical problems • {catData.patternsList.length} algorithmic patterns
                              </div>
                            </div>
                          </div>

                          {/* Completion Progress & Toggle */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0, marginLeft: '12px' }}>
                            <div style={{ textAlign: 'right', minWidth: '90px' }}>
                              <div style={{ fontSize: '12px', fontWeight: '600', color: percentComplete > 0 ? '#4ade80' : 'var(--text-secondary)' }}>
                                {catData.practicedProblems} / {catData.totalProblems} Solved
                              </div>
                              <div style={{
                                width: '90px',
                                height: '4px',
                                backgroundColor: 'var(--bg-primary)',
                                borderRadius: '2px',
                                marginTop: '4px',
                                overflow: 'hidden'
                              }}>
                                <div style={{ width: `${percentComplete}%`, height: '100%', backgroundColor: '#4ade80' }} />
                              </div>
                            </div>

                            <div className="chevron-btn">
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{
                                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                  transition: 'transform 0.2s ease',
                                  display: 'block'
                                }}
                              >
                                <polyline points="6 9 12 15 18 9" />
                              </svg>
                            </div>
                          </div>
                        </div>

                        {/* Expanded Patterns List */}
                        {isExpanded && (
                          <div style={{
                            padding: '16px 20px',
                            borderTop: '1px solid var(--border-color)',
                            backgroundColor: 'var(--bg-primary)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px'
                          }}>
                            <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
                              Recommended Pattern Learning Sequence inside {catMeta.name}:
                            </div>

                            {catData.patternsList.map((pat, idx) => (
                              <div
                                key={pat._id || pat.name}
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  padding: '10px 14px',
                                  backgroundColor: 'var(--bg-card)',
                                  borderRadius: 'var(--radius-md)',
                                  border: '1px solid var(--border-color)',
                                  gap: '16px'
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                                  <span style={{
                                    fontSize: '11px',
                                    fontWeight: '700',
                                    color: 'var(--text-muted)',
                                    backgroundColor: 'var(--bg-tertiary)',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    flexShrink: 0
                                  }}>
                                    P{idx + 1}
                                  </span>
                                  <div>
                                    <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
                                      {pat.name}
                                    </div>
                                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                                      {pat.description || 'Algorithmic pattern technique'}
                                    </div>
                                  </div>
                                </div>

                                <Link
                                  to={`/library?pattern=${encodeURIComponent(pat.name)}`}
                                  className="btn btn-secondary btn-sm"
                                  style={{ fontSize: '11px', padding: '4px 10px', flexShrink: 0, whiteSpace: 'nowrap' }}
                                >
                                  Practice Pattern
                                </Link>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </MainLayout>
  );
}
