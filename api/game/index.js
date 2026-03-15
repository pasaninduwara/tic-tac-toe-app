/**
 * Game endpoints - Get game state
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { sql } = await import('@vercel/postgres');
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Game ID required' });
  }

  try {
    const result = await sql`
      SELECT 
        g.*,
        u1.first_name as player_x_name,
        u1.username as player_x_username,
        u2.first_name as player_o_name,
        u2.username as player_o_username
      FROM games g
      LEFT JOIN users u1 ON g.player_x_id = u1.telegram_id
      LEFT JOIN users u2 ON g.player_o_id = u2.telegram_id
      WHERE g.id = ${id}
    `;

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }

    const game = result.rows[0];

    return res.status(200).json({
      success: true,
      game: {
        id: game.id,
        board: game.board,
        currentTurn: game.current_turn,
        status: game.status,
        scoreX: game.score_x,
        scoreO: game.score_o,
        movesCount: game.moves_count,
        winnerId: game.winner_id,
        playerX: {
          id: game.player_x_id,
          firstName: game.player_x_name,
          username: game.player_x_username
        },
        playerO: {
          id: game.player_o_id,
          firstName: game.player_o_name,
          username: game.player_o_username
        },
        createdAt: game.created_at,
        updatedAt: game.updated_at
      }
    });

  } catch (error) {
    console.error('Get game error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}