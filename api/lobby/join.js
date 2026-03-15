/**
 * Join a lobby endpoint
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { sql } = await import('@vercel/postgres');
  const { generateGameId, createEmptyBoard } = await import('../../lib/gameLogic.js');

  try {
    const { lobbyId, playerId, playerName } = req.body;

    if (!lobbyId || !playerId) {
      return res.status(400).json({ error: 'Lobby ID and player ID required' });
    }

    // Check if lobby exists and is waiting
    const lobbyResult = await sql`
      SELECT * FROM lobbies WHERE id = ${lobbyId}
    `;

    if (lobbyResult.rows.length === 0) {
      return res.status(404).json({ error: 'Lobby not found' });
    }

    const lobby = lobbyResult.rows[0];

    if (lobby.status !== 'waiting') {
      return res.status(400).json({ error: 'Lobby is not accepting players' });
    }

    if (lobby.creator_id === playerId) {
      return res.status(400).json({ error: 'Cannot join your own lobby' });
    }

    // Create a new game
    const gameId = generateGameId();
    const initialBoard = JSON.stringify(createEmptyBoard());

    const gameResult = await sql`
      INSERT INTO games (
        id, 
        player_x_id, 
        player_o_id, 
        board, 
        current_turn, 
        status,
        score_x,
        score_o,
        moves_count,
        created_at,
        updated_at
      )
      VALUES (
        ${gameId},
        ${lobby.creator_id},
        ${playerId},
        ${initialBoard}::jsonb,
        'X',
        'playing',
        0,
        0,
        0,
        NOW(),
        NOW()
      )
      RETURNING *
    `;

    // Update lobby status
    await sql`
      UPDATE lobbies SET status = 'playing' WHERE id = ${lobbyId}
    `;

    // Get player names
    const playersResult = await sql`
      SELECT telegram_id, first_name, username FROM users 
      WHERE telegram_id IN (${lobby.creator_id}, ${playerId})
    `;

    const players = {};
    playersResult.rows.forEach(p => {
      players[p.telegram_id] = {
        firstName: p.first_name,
        username: p.username
      };
    });

    return res.status(200).json({
      success: true,
      game: {
        id: gameResult.rows[0].id,
        board: gameResult.rows[0].board,
        currentTurn: gameResult.rows[0].current_turn,
        status: gameResult.rows[0].status,
        scoreX: gameResult.rows[0].score_x,
        scoreO: gameResult.rows[0].score_o,
        playerX: {
          id: lobby.creator_id,
          ...players[lobby.creator_id]
        },
        playerO: {
          id: playerId,
          ...players[playerId]
        }
      }
    });

  } catch (error) {
    console.error('Join lobby error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}