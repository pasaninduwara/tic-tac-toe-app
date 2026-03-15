/**
 * Authentication endpoint
 * Handles Telegram Mini App authentication
 */
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Dynamic imports
    const { sql } = await import('@vercel/postgres');
    const { parseUserData } = await import('../../lib/telegram.js');
    
    const { initData, startParam } = req.body;
    
    if (!initData) {
      return res.status(400).json({ error: 'Missing init data' });
    }

    const user = parseUserData(initData);
    
    if (!user) {
      return res.status(400).json({ error: 'Invalid user data' });
    }

    // Check if user exists
    const existingUser = await sql`
      SELECT * FROM users WHERE telegram_id = ${user.id}
    `;

    let dbUser;
    
    if (existingUser.rows.length === 0) {
      // Create new user
      const insertResult = await sql`
        INSERT INTO users (
          telegram_id, 
          username, 
          first_name, 
          last_name,
          total_score,
          games_played,
          games_won,
          games_lost,
          games_draw,
          created_at,
          updated_at
        ) VALUES (
          ${user.id},
          ${user.username || null},
          ${user.first_name || ''},
          ${user.last_name || ''},
          0, 0, 0, 0, 0,
          NOW(),
          NOW()
        )
        RETURNING *
      `;
      dbUser = insertResult.rows[0];
    } else {
      // Update existing user
      const updateResult = await sql`
        UPDATE users SET
          username = ${user.username || null},
          first_name = ${user.first_name || ''},
          last_name = ${user.last_name || ''},
          updated_at = NOW()
        WHERE telegram_id = ${user.id}
        RETURNING *
      `;
      dbUser = updateResult.rows[0];
    }

    return res.status(200).json({
      success: true,
      user: {
        id: dbUser.telegram_id,
        username: dbUser.username,
        firstName: dbUser.first_name,
        lastName: dbUser.last_name,
        photoUrl: dbUser.photo_url,
        totalScore: dbUser.total_score,
        gamesPlayed: dbUser.games_played,
        gamesWon: dbUser.games_won,
        gamesLost: dbUser.games_lost,
        gamesDraw: dbUser.games_draw,
      },
      startParam: startParam || null,
    });

  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
}