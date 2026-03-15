import React, { useState, useEffect, useCallback } from 'react';
import { useTelegram } from '../hooks/useTelegram';
import { useApi } from '../hooks/useApi';
import './LobbyPage.css';

function LobbyPage({ navigate }) {
  const { user, haptic, showBackButton, hideBackButton, showPopup, webApp } = useTelegram();
  const { lobby } = useApi();
  
  const [lobbies, setLobbies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [joiningLobby, setJoiningLobby] = useState(null);
  const [error, setError] = useState(null);
  const [myLobbyId, setMyLobbyId] = useState(null);

  useEffect(() => {
    showBackButton();
    return () => hideBackButton();
  }, [showBackButton, hideBackButton]);

  // Fetch lobbies
  const fetchLobbies = useCallback(async () => {
    try {
      const result = await lobby.list();
      setLobbies(result.lobbies || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch lobbies:', err);
      setError('Failed to load lobbies');
    } finally {
      setLoading(false);
    }
  }, [lobby]);

  useEffect(() => {
    fetchLobbies();
    // Poll for updates
    const interval = setInterval(fetchLobbies, 5000);
    return () => clearInterval(interval);
  }, [fetchLobbies]);

  // Create new lobby
  const handleCreateLobby = async () => {
    if (!user) return;
    
    haptic('medium');
    setCreating(true);
    
    try {
      const result = await lobby.create(user.id, user.first_name || user.username);
      setMyLobbyId(result.lobby.id);
      haptic('success');
      
      // Generate invite link
      const appUrl = process.env.REACT_APP_URL || window.location.origin;
      const inviteLink = `https://t.me/share/url?url=${appUrl}?startapp=${result.lobby.id}&text=Join my Tic-Tac-Toe game!`;
      
      // Show share options
      if (webApp) {
        webApp.openTelegramLink(inviteLink);
      }
      
      // Refresh lobbies
      await fetchLobbies();
    } catch (err) {
      console.error('Failed to create lobby:', err);
      showPopup('Failed to create lobby. Please try again.');
      haptic('error');
    } finally {
      setCreating(false);
    }
  };

  // Join a lobby
  const handleJoinLobby = async (lobbyId) => {
    if (!user) return;
    
    haptic('medium');
    setJoiningLobby(lobbyId);
    
    try {
      const result = await lobby.join(lobbyId, user.id, user.first_name || user.username);
      haptic('success');
      
      // Navigate to game
      navigate('game', { id: result.game.id });
    } catch (err) {
      console.error('Failed to join lobby:', err);
      showPopup(err.message || 'Failed to join lobby');
      haptic('error');
      setJoiningLobby(null);
    }
  };

  // Cancel own lobby
  const handleCancelLobby = async (lobbyId) => {
    haptic('light');
    try {
      await lobby.delete(lobbyId, user.id);
      setMyLobbyId(null);
      await fetchLobbies();
    } catch (err) {
      console.error('Failed to cancel lobby:', err);
    }
  };

  return (
    <div className="lobby-page">
      <div className="lobby-header">
        <h1 className="page-title font-display">Game Lobby</h1>
        <p className="page-subtitle">Create a game or join an existing one</p>
      </div>

      {/* Create Game Button */}
      <button 
        className="create-game-btn"
        onClick={handleCreateLobby}
        disabled={creating || myLobbyId}
      >
        {creating ? (
          <>
            <span className="btn-spinner"></span>
            <span>Creating...</span>
          </>
        ) : (
          <>
            <span className="btn-icon">✨</span>
            <span>{myLobbyId ? 'Lobby Created!' : 'Create New Game'}</span>
          </>
        )}
      </button>

      {myLobbyId && (
        <div className="my-lobby-card">
          <div className="my-lobby-info">
            <span className="lobby-label">Your lobby is ready!</span>
            <span className="lobby-id">ID: {myLobbyId}</span>
          </div>
          <button 
            className="cancel-btn"
            onClick={() => handleCancelLobby(myLobbyId)}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Lobbies List */}
      <div className="lobbies-section">
        <h2 className="section-title">Available Games</h2>
        
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading games...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>{error}</p>
            <button onClick={fetchLobbies}>Retry</button>
          </div>
        ) : lobbies.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🎲</span>
            <p>No games available</p>
            <p className="empty-hint">Create one and invite friends!</p>
          </div>
        ) : (
          <div className="lobbies-list">
            {lobbies.map((l) => (
              <div 
                key={l.id} 
                className={`lobby-card ${l.id === myLobbyId ? 'own-lobby' : ''}`}
              >
                <div className="lobby-info">
                  <span className="lobby-creator">{l.creator_name}</span>
                  <span className="lobby-status">Waiting for opponent...</span>
                </div>
                {l.id !== myLobbyId && (
                  <button 
                    className="join-btn"
                    onClick={() => handleJoinLobby(l.id)}
                    disabled={joiningLobby === l.id}
                  >
                    {joiningLobby === l.id ? (
                      <span className="btn-spinner small"></span>
                    ) : (
                      'Join'
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Game Rules */}
      <div className="rules-card">
        <h3 className="rules-title">📜 How to Play</h3>
        <ul className="rules-list">
          <li>6x6 grid board</li>
          <li>Take turns placing X or O</li>
          <li>Earn 5 points per line of 3</li>
          <li>Most points wins!</li>
        </ul>
      </div>
    </div>
  );
}

export default LobbyPage;