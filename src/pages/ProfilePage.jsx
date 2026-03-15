import React, { useState, useEffect } from 'react';
import { useTelegram } from '../hooks/useTelegram';
import { useApi } from '../hooks/useApi';
import './ProfilePage.css';

function ProfilePage({ navigate }) {
  const { user, haptic, showBackButton, hideBackButton, showPopup, webApp } = useTelegram();
  const { user: userApi } = useApi();
  
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    showBackButton();
    return () => hideBackButton();
  }, [showBackButton, hideBackButton]);

  // Fetch user stats
  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) return;
      
      try {
        const result = await userApi.getStats(user.id);
        setStats(result.stats);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user?.id, userApi]);

  // Handle photo change
  const handleChangePhoto = () => {
    haptic('light');
    
    // In Telegram Mini Apps, we can use the MainButton to prompt photo selection
    // For now, show info that Telegram handles profile photos
    showPopup('Profile photos are managed through your Telegram account settings. Update your photo in Telegram to see it here!');
  };

  if (loading) {
    return (
      <div className="profile-page loading">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page error">
        <p>{error}</p>
        <button onClick={() => setLoading(true)}>Retry</button>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar" onClick={handleChangePhoto}>
          {user?.photo_url ? (
            <img src={user.photo_url} alt={user.first_name} />
          ) : (
            <span className="avatar-placeholder">
              {user?.first_name?.[0] || user?.username?.[0] || '?'}
            </span>
          )}
          <div className="avatar-edit">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        <h1 className="profile-name">{user?.first_name || user?.username || 'Player'}</h1>
        {user?.username && (
          <p className="profile-username">@{user.username}</p>
        )}
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="stats-section">
          <h2 className="section-title">Statistics</h2>
          
          <div className="stats-grid">
            <div className="stat-card primary">
              <span className="stat-value">{stats.totalScore}</span>
              <span className="stat-label">Total Score</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{stats.gamesPlayed}</span>
              <span className="stat-label">Games</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{stats.wins}</span>
              <span className="stat-label">Wins</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{stats.losses}</span>
              <span className="stat-label">Losses</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{stats.draws}</span>
              <span className="stat-label">Draws</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{stats.winRate}%</span>
              <span className="stat-label">Win Rate</span>
            </div>
          </div>

          {/* Win/Loss Bar */}
          <div className="win-loss-bar">
            <div className="bar-segment wins" style={{ width: `${stats.winRate}%` }}></div>
            <div className="bar-segment draws" style={{ width: `${(stats.draws / Math.max(stats.gamesPlayed, 1)) * 100}%` }}></div>
          </div>
          <div className="bar-legend">
            <span className="legend-item wins">
              <span className="legend-dot"></span> Wins
            </span>
            <span className="legend-item draws">
              <span className="legend-dot"></span> Draws
            </span>
            <span className="legend-item losses">
              <span className="legend-dot"></span> Losses
            </span>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="actions-section">
        <h2 className="section-title">Quick Actions</h2>
        <button 
          className="action-btn"
          onClick={() => {
            haptic('light');
            navigate('lobby');
          }}
        >
          <span className="action-icon">🎮</span>
          <span className="action-text">Find a Game</span>
          <span className="action-arrow">→</span>
        </button>
        <button 
          className="action-btn"
          onClick={() => {
            haptic('light');
            navigate('leaderboard');
          }}
        >
          <span className="action-icon">🏆</span>
          <span className="action-text">View Leaderboard</span>
          <span className="action-arrow">→</span>
        </button>
      </div>

      {/* Info */}
      <div className="info-section">
        <p className="info-text">
          Tip: Your profile is linked to your Telegram account. 
          Update your photo and name in Telegram to see changes here.
        </p>
      </div>
    </div>
  );
}

export default ProfilePage;