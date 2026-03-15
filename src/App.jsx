import React, { useState, useEffect, useCallback } from 'react';
import MainMenu from './pages/MainMenu';
import LobbyPage from './pages/LobbyPage';
import GamePage from './pages/GamePage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import SubscriptionCheck from './components/SubscriptionCheck';
import { TelegramProvider, useTelegram } from './hooks/useTelegram';
import { ApiProvider } from './hooks/useApi';
import './styles/globals.css';

// Page router - simple hash-based routing
function AppRouter() {
  const [currentPage, setCurrentPage] = useState('menu');
  const [routeParams, setRouteParams] = useState({});
  const { isReady, user } = useTelegram();

  // Handle routing
  const navigate = useCallback((page, params = {}) => {
    setCurrentPage(page);
    setRouteParams(params);
  }, []);

  // Parse initial route from Telegram start param
  useEffect(() => {
    if (isReady) {
      const hash = window.location.hash.slice(1);
      if (hash && ['lobby', 'game'].includes(hash.split('/')[0])) {
        const [page, id] = hash.split('/');
        navigate(page, { id });
      }
    }
  }, [isReady, navigate]);

  // Show loading or subscription check
  if (!isReady) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <AuthenticatingScreen />;
  }

  // Render current page
  const renderPage = () => {
    switch (currentPage) {
      case 'lobby':
        return <LobbyPage navigate={navigate} />;
      case 'game':
        return <GamePage navigate={navigate} gameId={routeParams.id} />;
      case 'leaderboard':
        return <LeaderboardPage navigate={navigate} />;
      case 'profile':
        return <ProfilePage navigate={navigate} />;
      default:
        return <MainMenu navigate={navigate} />;
    }
  };

  return (
    <div className="app-container">
      <SubscriptionCheck>
        {renderPage()}
      </SubscriptionCheck>
    </div>
  );
}

// Main App with providers
function App() {
  return (
    <TelegramProvider>
      <ApiProvider>
        <AppRouter />
      </ApiProvider>
    </TelegramProvider>
  );
}

// Loading screen component
function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-spinner"></div>
        <h2 className="loading-title font-display">Loading...</h2>
        <p className="loading-text">Preparing your game</p>
      </div>
    </div>
  );
}

// Authenticating screen
function AuthenticatingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-spinner"></div>
        <h2 className="loading-title font-display">Authenticating</h2>
        <p className="loading-text">Verifying your Telegram account</p>
      </div>
    </div>
  );
}

export default App;