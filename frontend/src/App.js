import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Dashboard from './components/Dashboard';
import WinnerStats from './components/WinnerStats';
import Leaderboard from './components/Leaderboard';
import CreativesList from './components/CreativesList';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [filters, setFilters] = useState({
    account: 'Express Flooring',
    dateRange: 'last7days',
  });

  return (
    <div className="App">
      <header className="app-header">
        <h1>Pod TJJ Creative Performance Dashboard</h1>
        <nav className="tabs">
          <button
            className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`tab ${activeTab === 'winners' ? 'active' : ''}`}
            onClick={() => setActiveTab('winners')}
          >
            Winners
          </button>
          <button
            className={`tab ${activeTab === 'leaderboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('leaderboard')}
          >
            Leaderboard
          </button>
          <button
            className={`tab ${activeTab === 'creatives' ? 'active' : ''}`}
            onClick={() => setActiveTab('creatives')}
          >
            All Creatives
          </button>
        </nav>
      </header>

      <div className="filters">
        <div className="filter-group">
          <label>Account</label>
          <select
            value={filters.account}
            onChange={(e) => setFilters({ ...filters, account: e.target.value })}
          >
            <option value="Express Flooring">Express Flooring</option>
            <option value="Matrix Home Basement">Matrix Home Basement</option>
            <option value="Long Home Siding">Long Home Siding</option>
            <option value="ImproveIt Kitchen">ImproveIt Kitchen</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Date Range</label>
          <select
            value={filters.dateRange}
            onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
          >
            <option value="last7days">Last 7 Days</option>
            <option value="last14days">Last 14 Days</option>
            <option value="last42days">Last 42 Days</option>
            <option value="last30days">Last 30 Days</option>
            <option value="alltime">All Time</option>
          </select>
        </div>
      </div>

      <main className="content">
        {activeTab === 'dashboard' && <Dashboard filters={filters} apiBase={API_BASE} />}
        {activeTab === 'winners' && <WinnerStats filters={filters} apiBase={API_BASE} />}
        {activeTab === 'leaderboard' && <Leaderboard filters={filters} apiBase={API_BASE} />}
        {activeTab === 'creatives' && <CreativesList filters={filters} apiBase={API_BASE} />}
      </main>
    </div>
  );
}

export default App;
