/**
 * Leaderboard endpoints
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
  const { period = 'all' } = req.query;

  try {
    let query;
    
    if (period === 'all') {
      query = sql`
        SELECT 
          u.telegram_id,
          u.username,
          u.first_name,
          u.photo_url,
          u.total_score,
          u.games_played,
          u.games_won,
          u.games_lost
        FROM users u
        WHERE u.games_played > 0
        ORDER BY u.total_score DESC, u.games_won DESC
        LIMIT 100
      `;
    } else {
      query = sql`
        SELECT 
          u.telegram_id,
          u.username,
          u.first_name,
          u.photo_url,
          l.score,
          l.games_won,
          u.games_played
        FROM leaderboard l
        JOIN users u ON l.user_id = u.telegram_id
        WHERE l.period = ${period}
        ORDER BY l.score DESC, l.games_won DESC
        LIMIT 100
      `;
    }

    const result = await query;

    const leaderboard = result.rows.map((row, index) => ({
      rank: index + 1,
      id: row.telegram_id,
      username: row.username,
      firstName: row.first_name,
      photoUrl: row.photo_url,
      score: row.total_score || row.score,
      gamesPlayed: row.games_played,
      gamesWon: row.games_won,
      gamesLost: row.games_lost || 0,
    }));

    return res.status(200).json({
      success: true,
      period,
      leaderboard
    });

  } catch (error) {
    console.error('Leaderboard error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}