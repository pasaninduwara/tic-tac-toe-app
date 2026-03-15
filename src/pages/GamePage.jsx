import React, { useState, useEffect, useCallback } from 'react';
import { useTelegram } from '../hooks/useTelegram';
import { useApi } from '../hooks/useApi';
import GameBoard from '../components/GameBoard';
import './GamePage.css';

function GamePage({ navigate, gameId: propGameId }) {
  const { user, haptic, showBackButton, hideBackButton, showPopup, startParam } = useTelegram();
  const { game } = useApi();
  
  const [gameState, setGameState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [makingMove, setMakingMove] = useState(false);
  const [highlightedCells, setHighlightedCells] = useState([]);

  // Determine game ID (from props or start param)
  const activeGameId = propGameId || startParam;

  // Fetch game state
  const fetchGameState = useCallback(async () => {
    if (!activeGameId) {
      setError('No game ID provided');
      setLoading(false);
      return;
    }

    try {
      const result = await game.get(activeGameId);
      setGameState(result.game);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch game:', err);
      setError('Failed to load game');
    } finally {
      setLoading(false);
    }
  }, [activeGameId, game]);

  useEffect(() => {
    fetchGameState();
    // Poll for updates every 3 seconds
    const interval = setInterval(fetchGameState, 3000);
    return () => clearInterval(interval);
  }, [fetchGameState]);

  // Handle back button
  useEffect(() => {
    showBackButton();
    return () => hideBackButton();
  }, [showBackButton, hideBackButton]);

  // Handle move
  const handleCellClick = async (row, col) => {
    if (!gameState || !user) return;
    
    // Check if game is still in progress
    if (gameState.status !== 'playing') {
      showPopup('Game is over!');
      return;
    }

    // Check if it's player's turn
    const isPlayerX = gameState.playerX.id === user.id;
    const isPlayerO = gameState.playerO.id === user.id;
    
    if (!isPlayerX && !isPlayerO) {
      showPopup('You are not a player in this game');
      return;
    }

    const isMyTurn = (gameState.currentTurn === 'X' && isPlayerX) || 
                     (gameState.currentTurn === 'O' && isPlayerO);
    
    if (!isMyTurn) {
      showPopup("It's not your turn!");
      return;
    }

    // Check if cell is empty
    if (gameState.board[row][col] !== -1) {
      showPopup('Cell is already taken');
      return;
    }

    haptic('light');
    setMakingMove(true);

    try {
      const result = await game.makeMove(activeGameId, user.id, row, col);
      
      // Update game state
      setGameState(prev => ({
        ...prev,
        board: result.game.board,
        currentTurn: result.game.currentTurn,
        status: result.game.status,
        scoreX: result.game.scoreX,
        scoreO: result.game.scoreO,
        movesCount: result.game.movesCount,
        winnerId: result.game.winnerId,
      }));

      // Highlight new lines
      if (result.game.newLines && result.game.newLines.length > 0) {
        haptic('success');
        const cells = result.game.newLines.flatMap(line => line.cells);
        setHighlightedCells(cells);
        setTimeout(() => setHighlightedCells([]), 2000);
      }

      // Check for game over
      if (result.game.status === 'finished') {
        haptic('heavy');
        if (result.game.winnerId === user.id) {
          showPopup('🎉 Congratulations! You won!');
        } else if (result.game.winnerId === null) {
          showPopup("It's a draw!");
        } else {
          showPopup('Better luck next time!');
        }
      }
    } catch (err) {
      console.error('Move failed:', err);
      showPopup(err.message || 'Failed to make move');
      haptic('error');
    } finally {
      setMakingMove(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="game-page loading">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p>Loading game...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !gameState) {
    return (
      <div className="game-page error">
        <div className="error-content">
          <span className="error-icon">⚠️</span>
          <p>{error || 'Game not found'}</p>
          <button onClick={() => navigate('lobby')}>Back to Lobby</button>
        </div>
      </div>
    );
  }

  // Determine player info
  const isPlayerX = user && gameState.playerX.id === user.id;
  const isPlayerO = user && gameState.playerO.id === user.id;
  const isMyTurn = (gameState.currentTurn === 'X' && isPlayerX) || 
                   (gameState.currentTurn === 'O' && isPlayerO);

  return (
    <div className="game-page">
      {/* Game Header */}
      <div className="game-header">
        <h1 className="game-title font-display">Tic-Tac-Toe</h1>
        <div className="game-status">
          {gameState.status === 'playing' ? (
            isMyTurn ? 'Your turn!' : `Waiting for ${gameState.currentTurn === 'X' ? gameState.playerX.firstName : gameState.playerO.firstName}...`
          ) : (
            gameState.winnerId === null ? 'Draw!' :
            gameState.winnerId === user?.id ? 'You Win! 🎉' : 'You Lose!'
          )}
        </div>
      </div>

      {/* Score Board */}
      <div className="score-board">
        <div className={`player-score ${gameState.currentTurn === 'X' ? 'active' : ''} ${isPlayerX ? 'current-player' : ''}`}>
          <span className="player-symbol x">X</span>
          <span className="player-name">{gameState.playerX.firstName || 'Player X'}</span>
          <span className="player-points">{gameState.scoreX} pts</span>
        </div>
        <div className="score-divider">VS</div>
        <div className={`player-score ${gameState.currentTurn === 'O' ? 'active' : ''} ${isPlayerO ? 'current-player' : ''}`}>
          <span className="player-symbol o">O</span>
          <span className="player-name">{gameState.playerO.firstName || 'Player O'}</span>
          <span className="player-points">{gameState.scoreO} pts</span>
        </div>
      </div>

      {/* Game Board */}
      <div className="board-container">
        <GameBoard 
          board={gameState.board}
          onCellClick={handleCellClick}
          disabled={makingMove || gameState.status !== 'playing' || !isMyTurn}
          highlightedCells={highlightedCells}
        />
      </div>

      {/* Game Over Actions */}
      {gameState.status === 'finished' && (
        <div className="game-over-actions">
          <button 
            className="play-again-btn"
            onClick={() => navigate('lobby')}
          >
            Play Again
          </button>
        </div>
      )}

      {/* Game Info */}
      <div className="game-info">
        <span className="moves-count">Moves: {gameState.movesCount}</span>
        <span className="game-id">Game ID: {activeGameId?.slice(0, 8)}...</span>
      </div>
    </div>
  );
}

export default GamePage;