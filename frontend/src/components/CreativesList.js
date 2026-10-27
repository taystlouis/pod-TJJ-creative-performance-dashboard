import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CreativesList.css';

function CreativesList({ filters, apiBase }) {
  const [creatives, setCreatives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('cpl');

  useEffect(() => {
    const fetchCreatives = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${apiBase}/creatives`, {
          params: { account: filters.account }
        });
        setCreatives(res.data);
      } catch (error) {
        console.error('Error fetching creatives:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCreatives();
  }, [filters, apiBase]);

  if (loading) return <div className="loading">Loading creatives...</div>;

  const sorted = [...creatives].sort((a, b) => {
    if (sortBy === 'cpl') return (a.cpl || 999) - (b.cpl || 999);
    if (sortBy === 'sales') return (b.sales || 0) - (a.sales || 0);
    if (sortBy === 'recent') return new Date(b.created_at) - new Date(a.created_at);
    return 0;
  });

  return (
    <div className="creatives-list">
      <div className="sort-controls">
        <label>Sort by:</label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="cpl">CPL (Low to High)</option>
          <option value="sales">Sales (High to Low)</option>
          <option value="recent">Most Recent</option>
        </select>
      </div>

      {sorted.length === 0 ? (
        <p>No creatives found</p>
      ) : (
        <div className="creatives-grid">
          {sorted.map((creative, idx) => (
            <div key={idx} className={`creative-card ${creative.winner_type ? 'winner' : ''}`}>
              <div className="creative-header">
                <h3>{creative.crtv_id}</h3>
                {creative.winner_type && (
                  <span className={`winner-badge badge-${creative.winner_type}`}>
                    {creative.winner_type === 'true_winner' ? '✓ WINNER' : 'EMERGING'}
                  </span>
                )}
              </div>
              <div className="creative-details">
                <div className="detail">
                  <span className="label">CPL</span>
                  <span className="value">${creative.cpl?.toFixed(2) || 'N/A'}</span>
                </div>
                <div className="detail">
                  <span className="label">CPS</span>
                  <span className="value">${creative.cps?.toFixed(2) || 'N/A'}</span>
                </div>
                <div className="detail">
                  <span className="label">Sales</span>
                  <span className="value">{creative.sales || 0}</span>
                </div>
              </div>
              <div className="creative-meta">
                <p>
                  <strong>Client:</strong> {creative.client}
                </p>
                <p>
                  <strong>Briefer:</strong> {creative.briefer_name || 'N/A'}
                </p>
                <p>
                  <strong>Type:</strong> {creative.brief_type || 'N/A'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CreativesList;
