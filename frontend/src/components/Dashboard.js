import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

function Dashboard({ filters, apiBase }) {
  const [stats, setStats] = useState({
    totalCreatives: 0,
    trueWinners: 0,
    emergingWinners: 0,
    avgCPL: 0,
  });
  const [topPerformers, setTopPerformers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        // Fetch winner stats
        const winnerRes = await axios.get(`${apiBase}/winners/stats/${filters.account}`);
        const statsData = winnerRes.data;

        const trueWinnersCount = statsData.find(s => s.winner_type === 'true_winner')?.count || 0;
        const emergingWinnersCount = statsData.find(s => s.winner_type === 'emerging_winner')?.count || 0;

        setStats({
          trueWinners: trueWinnersCount,
          emergingWinners: emergingWinnersCount,
        });

        // Fetch top performers
        const topRes = await axios.get(`${apiBase}/leaderboard/top-performers`, {
          params: { limit: 5 }
        });
        setTopPerformers(topRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [filters, apiBase]);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <div className="stats-grid">
        <div className="stat-card">
          <h3>True Winners</h3>
          <p className="stat-number">{stats.trueWinners}</p>
        </div>
        <div className="stat-card">
          <h3>Emerging Winners</h3>
          <p className="stat-number">{stats.emergingWinners}</p>
        </div>
        <div className="stat-card">
          <h3>Total Winners</h3>
          <p className="stat-number">{stats.trueWinners + stats.emergingWinners}</p>
        </div>
      </div>

      <div className="top-performers">
        <h2>Top Performers</h2>
        {topPerformers.length === 0 ? (
          <p>No data available</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Creative ID</th>
                <th>Client</th>
                <th>CPL</th>
                <th>CPS</th>
                <th>Sales</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {topPerformers.map((perf, idx) => (
                <tr key={idx}>
                  <td className="crtv-id">{perf.crtv_id}</td>
                  <td>{perf.client}</td>
                  <td>${perf.cpl?.toFixed(2) || 'N/A'}</td>
                  <td>${perf.cps?.toFixed(2) || 'N/A'}</td>
                  <td>{perf.sales || 0}</td>
                  <td>
                    <span className={`badge badge-${perf.winner_type}`}>
                      {perf.winner_type === 'true_winner' ? '✓ Winner' : 'Emerging'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
