/**
 * Database helper functions
 */
export async function getSql() {
  const { sql } = await import('@vercel/postgres');
  return sql;
}

export async function initializeDatabase() {
  const sql = await getSql();
  
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id BIGINT PRIMARY KEY,
        telegram_id BIGINT UNIQUE NOT NULL,
        username VARCHAR(255),
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        photo_url TEXT,
        total_score INTEGER DEFAULT 0,
        games_played INTEGER DEFAULT 0,
        games_won INTEGER DEFAULT 0,
        games_lost INTEGER DEFAULT 0,
        games_draw INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS games (
        id VARCHAR(255) PRIMARY KEY,
        player_x_id BIGINT REFERENCES users(telegram_id),
        player_o_id BIGINT REFERENCES users(telegram_id),
        board JSONB DEFAULT '[[-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1]]'::jsonb,
        current_turn VARCHAR(1) DEFAULT 'X',
        status VARCHAR(50) DEFAULT 'waiting',
        score_x INTEGER DEFAULT 0,
        score_o INTEGER DEFAULT 0,
        moves_count INTEGER DEFAULT 0,
        winner_id BIGINT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS lobbies (
        id VARCHAR(255) PRIMARY KEY,
        creator_id BIGINT REFERENCES users(telegram_id),
        creator_name VARCHAR(255),
        status VARCHAR(50) DEFAULT 'waiting',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS leaderboard (
        id SERIAL PRIMARY KEY,
        user_id BIGINT REFERENCES users(telegram_id),
        period VARCHAR(20),
        score INTEGER DEFAULT 0,
        games_won INTEGER DEFAULT 0,
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, period)
      )
    `;

    await sql`CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON users(telegram_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_games_status ON games(status)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_leaderboard_period ON leaderboard(period)`;

    return { success: true };
  } catch (error) {
    console.error('Database initialization error:', error);
    return { success: false, error: error.message };
  }
}