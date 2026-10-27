import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './WinnerStats.css';

function WinnerStats({ filters, apiBase }) {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [winnerType, setWinnerType] = useState('all');

  useEffect(() => {
    const fetchWinners = async () => {
      try {
        setLoading(true);
        const params = { account: filters.account };
        if (winnerType !== 'all') params.type = winnerType;

        const res = await axios.get(`${apiBase}/winners`, { params });
        setWinners(res.data);
      } catch (error) {
        console.error('Error fetching winners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWinners();
  }, [filters, apiBase, winnerType]);

  if (loading) return <div className="loading">Loading winners...</div>;

  return (
    <div className="winner-stats">
      <div className="filter-group">
        <label>Winner Type</label>
        <select value={winnerType} onChange={(e) => setWinnerType(e.target.value)}>
          <option value="all">All Winners</option>
          <option value="true_winner">True Winners</option>
          <option value="emerging_winner">Emerging Winners</option>
        </select>
      </div>

      <div className="winners-list">
        {winners.length === 0 ? (
          <p>No winners found for this account</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>CRTV ID</th>
                <th>Type</th>
                <th>CPL</th>
                <th>CPS</th>
                <th>Sales</th>
                <th>Briefer</th>
                <th>Brief Type</th>
              </tr>
            </thead>
            <tbody>
              {winners.map((winner, idx) => (
                <tr key={idx} className={`winner-row winner-${winner.winner_type}`}>
                  <td className="crtv-id">{winner.crtv_id}</td>
                  <td>
                    <span className={`badge badge-${winner.winner_type}`}>
                      {winner.winner_type === 'true_winner' ? 'True Winner' : 'Emerging'}
                    </span>
                  </td>
                  <td>${winner.cpl?.toFixed(2)}</td>
                  <td>${winner.cps?.toFixed(2)}</td>
                  <td>{winner.sales}</td>
                  <td>{winner.briefer_name}</td>
                  <td>{winner.brief_type || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default WinnerStats;
