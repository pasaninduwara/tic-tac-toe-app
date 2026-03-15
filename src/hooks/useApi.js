import React, { createContext, useContext, useCallback } from 'react';
import { useTelegram } from './useTelegram';

const ApiContext = createContext(null);

// API base URL - will be the same origin in production
const API_BASE = '/api';

/**
 * API hook for making authenticated requests
 */
export function ApiProvider({ children }) {
  const { getInitData, user } = useTelegram();

  // Make API request
  const request = useCallback(async (endpoint, options = {}) => {
    const initData = getInitData();
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add init data to body for authentication
    const body = options.body ? 
      { ...JSON.parse(options.body), initData } : 
      { initData };

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
      body: options.method !== 'GET' ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    return data;
  }, [getInitData]);

  // Auth endpoints
  const auth = {
    login: async (startParam) => {
      return request('/auth', {
        method: 'POST',
        body: JSON.stringify({ startParam }),
      });
    },
  };

  // User endpoints
  const userApi = {
    get: async (userId) => {
      return request(`/user?id=${userId}`);
    },
    update: async (userId, data) => {
      return request(`/user?id=${userId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    getStats: async (userId) => {
      return request(`/user/stats?id=${userId}`);
    },
  };

  // Lobby endpoints
  const lobby = {
    list: async () => {
      return request('/lobby');
    },
    create: async (creatorId, creatorName) => {
      return request('/lobby', {
        method: 'POST',
        body: JSON.stringify({ creatorId, creatorName }),
      });
    },
    join: async (lobbyId, playerId, playerName) => {
      return request('/lobby/join', {
        method: 'POST',
        body: JSON.stringify({ lobbyId, playerId, playerName }),
      });
    },
    delete: async (lobbyId, creatorId) => {
      return request(`/lobby?id=${lobbyId}`, {
        method: 'DELETE',
        body: JSON.stringify({ creatorId }),
      });
    },
  };

  // Game endpoints
  const game = {
    get: async (gameId) => {
      return request(`/game?id=${gameId}`);
    },
    makeMove: async (gameId, playerId, row, col) => {
      return request('/game/move', {
        method: 'POST',
        body: JSON.stringify({ gameId, playerId, row, col }),
      });
    },
  };

  // Leaderboard endpoints
  const leaderboard = {
    get: async (period = 'all') => {
      return request(`/leaderboard?period=${period}`);
    },
  };

  // Subscription check
  const subscription = {
    check: async (userId) => {
      return request('/subscription', {
        method: 'POST',
        body: JSON.stringify({ userId }),
      });
    },
  };

  const value = {
    request,
    auth,
    user: userApi,
    lobby,
    game,
    leaderboard,
    subscription,
  };

  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  );
}

export function useApi() {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within ApiProvider');
  }
  return context;
}

export default ApiContext;