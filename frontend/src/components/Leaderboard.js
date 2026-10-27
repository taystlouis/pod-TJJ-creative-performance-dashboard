import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Leaderboard.css';

function Leaderboard({ filters, apiBase }) {
  const [briefers, setBriefers] = useState([]);
  const [editors, setEditors] = useState([]);
  const [activeRole, setActiveRole] = useState('briefer');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const brieferRes = await axios.get(`${apiBase}/leaderboard/creators`, {
          params: { role: 'briefer' }
        });
        const editorRes = await axios.get(`${apiBase}/leaderboard/creators`, {
          params: { role: 'editor' }
        });

        setBriefers(brieferRes.data);
        setEditors(editorRes.data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [apiBase]);

  if (loading) return <div className="loading">Loading leaderboard...</div>;

  const data = activeRole === 'briefer' ? briefers : editors;

  return (
    <div className="leaderboard">
      <div className="role-tabs">
        <button
          className={`role-tab ${activeRole === 'briefer' ? 'active' : ''}`}
          onClick={() => setActiveRole('briefer')}
        >
          Briefers
        </button>
        <button
          className={`role-tab ${activeRole === 'editor' ? 'active' : ''}`}
          onClick={() => setActiveRole('editor')}
        >
          Editors
        </button>
      </div>

      {data.length === 0 ? (
        <p>No data available</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Total Creatives</th>
              <th>True Winners</th>
              <th>Emerging Winners</th>
              <th>Avg CPL</th>
              <th>Avg CPS</th>
              <th>Total Sales</th>
            </tr>
          </thead>
          <tbody>
            {data.map((creator, idx) => (
              <tr key={idx} className={idx < 3 ? 'top-performer' : ''}>
                <td className="rank">
                  {idx === 0 && '🥇'}
                  {idx === 1 && '🥈'}
                  {idx === 2 && '🥉'}
                  {idx >= 3 && idx + 1}
                </td>
                <td className="name">{creator.name || creator.email}</td>
                <td>{creator.total_creatives}</td>
                <td className="winners">
                  <strong>{creator.true_winners}</strong>
                </td>
                <td className="emerging">
                  {creator.emerging_winners}
                </td>
                <td>${creator.avg_cpl?.toFixed(2) || 'N/A'}</td>
                <td>${creator.avg_cps?.toFixed(2) || 'N/A'}</td>
                <td>{creator.total_sales || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Leaderboard;
