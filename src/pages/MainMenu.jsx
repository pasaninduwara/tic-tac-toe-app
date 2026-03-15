import React, { useEffect } from 'react';
import { useTelegram } from '../hooks/useTelegram';
import { useApi } from '../hooks/useApi';
import './MainMenu.css';

function MainMenu({ navigate }) {
  const { user, haptic, hideBackButton } = useTelegram();
  const { auth } = useApi();

  useEffect(() => {
    hideBackButton();
  }, [hideBackButton]);

  const handleNavigation = (page) => {
    haptic('light');
    navigate(page);
  };

  return (
    <div className="main-menu">
      {/* Header */}
      <div className="menu-header">
        <div className="game-logo">
          <span className="logo-x">X</span>
          <span className="logo-o">O</span>
        </div>
        <h1 className="game-title font-display">Tic-Tac-Toe</h1>
        <p className="game-subtitle">6x6 Challenge</p>
      </div>

      {/* User Card */}
      {user && (
        <div className="user-card">
          <div className="user-avatar">
            {user.first_name?.[0] || user.username?.[0] || '?'}
          </div>
          <div className="user-info">
            <span className="user-name">{user.first_name || user.username}</span>
            <span className="user-welcome">Ready to play?</span>
          </div>
        </div>
      )}

      {/* Menu Buttons */}
      <div className="menu-buttons">
        <button 
          className="menu-btn play-btn"
          onClick={() => handleNavigation('lobby')}
        >
          <span className="btn-icon">🎮</span>
          <span className="btn-text">Play Game</span>
          <span className="btn-arrow">→</span>
        </button>

        <button 
          className="menu-btn"
          onClick={() => handleNavigation('leaderboard')}
        >
          <span className="btn-icon">🏆</span>
          <span className="btn-text">Leaderboard</span>
          <span className="btn-arrow">→</span>
        </button>

        <button 
          className="menu-btn"
          onClick={() => handleNavigation('profile')}
        >
          <span className="btn-icon">👤</span>
          <span className="btn-text">Profile</span>
          <span className="btn-arrow">→</span>
        </button>
      </div>

      {/* Footer */}
      <div className="menu-footer">
        <p className="footer-text">
          Score 5 points for each line of 3
        </p>
        <p className="footer-copyright">
          Powered by Telegram Mini Apps
        </p>
      </div>
    </div>
  );
}

export default MainMenu;