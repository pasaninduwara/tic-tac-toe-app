/**
 * User profile endpoints
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { sql } = await import('@vercel/postgres');
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      if (!id) {
        return res.status(400).json({ error: 'User ID required' });
      }

      const result = await sql`
        SELECT 
          telegram_id,
          username,
          first_name,
          last_name,
          photo_url,
          total_score,
          games_played,
          games_won,
          games_lost,
          games_draw,
          created_at
        FROM users 
        WHERE telegram_id = ${id}
      `;

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const user = result.rows[0];
      
      return res.status(200).json({
        success: true,
        user: {
          id: user.telegram_id,
          username: user.username,
          firstName: user.first_name,
          lastName: user.last_name,
          photoUrl: user.photo_url,
          totalScore: user.total_score,
          gamesPlayed: user.games_played,
          gamesWon: user.games_won,
          gamesLost: user.games_lost,
          gamesDraw: user.games_draw,
          memberSince: user.created_at,
        }
      });

    } catch (error) {
      console.error('Get user error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'PUT') {
    try {
      if (!id) {
        return res.status(400).json({ error: 'User ID required' });
      }

      const { photoUrl } = req.body;

      const result = await sql`
        UPDATE users SET
          photo_url = ${photoUrl || null},
          updated_at = NOW()
        WHERE telegram_id = ${id}
        RETURNING *
      `;

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json({
        success: true,
        user: result.rows[0]
      });

    } catch (error) {
      console.error('Update user error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}