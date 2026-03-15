/**
 * User statistics endpoint
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
    return res.status(400).json({ error: 'User ID required' });
  }

  try {
    const userResult = await sql`
      SELECT 
        total_score,
        games_played,
        games_won,
        games_lost,
        games_draw
      FROM users 
      WHERE telegram_id = ${id}
    `;

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    const recentGamesResult = await sql`
      SELECT 
        g.id,
        g.score_x,
        g.score_o,
        g.status,
        g.winner_id,
        g.created_at,
        u1.first_name as player_x_name,
        u2.first_name as player_o_name,
        CASE 
          WHEN g.player_x_id = ${id} THEN 'X'
          ELSE 'O'
        END as player_role
      FROM games g
      LEFT JOIN users u1 ON g.player_x_id = u1.telegram_id
      LEFT JOIN users u2 ON g.player_o_id = u2.telegram_id
      WHERE (g.player_x_id = ${id} OR g.player_o_id = ${id})
        AND g.status = 'finished'
      ORDER BY g.updated_at DESC
      LIMIT 10
    `;

    const winRate = user.games_played > 0 
      ? Math.round((user.games_won / user.games_played) * 100) 
      : 0;

    const avgScorePerGame = user.games_played > 0
      ? Math.round(user.total_score / user.games_played)
      : 0;

    return res.status(200).json({
      success: true,
      stats: {
        totalScore: user.total_score,
        gamesPlayed: user.games_played,
        wins: user.games_won,
        losses: user.games_lost,
        draws: user.games_draw,
        winRate,
        avgScorePerGame,
      },
      recentGames: recentGamesResult.rows.map(game => ({
        id: game.id,
        playerXName: game.player_x_name,
        playerOName: game.player_o_name,
        scoreX: game.score_x,
        scoreO: game.score_o,
        playerRole: game.player_role,
        won: game.winner_id === parseInt(id),
        isDraw: game.winner_id === null,
        playedAt: game.created_at,
      }))
    });

  } catch (error) {
    console.error('Get stats error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}