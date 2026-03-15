import React, { useState, useEffect } from 'react';
import { useTelegram } from '../hooks/useTelegram';
import { useApi } from '../hooks/useApi';
import './LeaderboardPage.css';

function LeaderboardPage({ navigate }) {
  const { user, haptic, showBackButton, hideBackButton } = useTelegram();
  const { leaderboard } = useApi();
  
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('all');
  const [error, setError] = useState(null);

  useEffect(() => {
    showBackButton();
    return () => hideBackButton();
  }, [showBackButton, hideBackButton]);

  // Fetch leaderboard data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await leaderboard.get(period);
        setEntries(result.leaderboard || []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
        setError('Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period, leaderboard]);

  // Handle period change
  const handlePeriodChange = (newPeriod) => {
    haptic('light');
    setPeriod(newPeriod);
  };

  // Get rank display
  const getRankDisplay = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  };

  // Check if entry is current user
  const isCurrentUser = (entry) => user && entry.id === user.id;

  return (
    <div className="leaderboard-page">
      {/* Header */}
      <div className="leaderboard-header">
        <h1 className="page-title font-display">🏆 Leaderboard</h1>
        <p className="page-subtitle">Top players rankings</p>
      </div>

      {/* Period Tabs */}
      <div className="period-tabs">
        {[
          { key: 'all', label: 'All Time' },
          { key: 'today', label: 'Today' },
          { key: 'week', label: 'Week' },
          { key: 'month', label: 'Month' },
          { key: 'year', label: 'Year' },
        ].map((tab) => (
          <button
            key={tab.key}
            className={`period-tab ${period === tab.key ? 'active' : ''}`}
            onClick={() => handlePeriodChange(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Leaderboard List */}
      <div className="leaderboard-list">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading rankings...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>{error}</p>
            <button onClick={() => setPeriod(period)}>Retry</button>
          </div>
        ) : entries.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📊</span>
            <p>No data for this period</p>
          </div>
        ) : (
          entries.map((entry, index) => (
            <div
              key={entry.id}
              className={`leaderboard-entry ${isCurrentUser(entry) ? 'current-user' : ''}`}
            >
              <div className="entry-rank">
                {getRankDisplay(index + 1)}
              </div>
              <div className="entry-avatar">
                {entry.firstName?.[0] || entry.username?.[0] || '?'}
              </div>
              <div className="entry-info">
                <span className="entry-name">
                  {entry.firstName || entry.username || 'Player'}
                  {isCurrentUser(entry) && ' (You)'}
                </span>
                <span className="entry-stats">
                  {entry.gamesWon}W - {entry.gamesLost}L
                </span>
              </div>
              <div className="entry-score">
                <span className="score-value">{entry.score}</span>
                <span className="score-label">pts</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* User's Rank (if not in top 100) */}
      {user && !entries.some(e => e.id === user.id) && (
        <div className="user-rank-card">
          <p>Play more games to appear on the leaderboard!</p>
        </div>
      )}
    </div>
  );
}

export default LeaderboardPage;