/**
 * Lobby management endpoints
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { sql } = await import('@vercel/postgres');
  const { generateLobbyId } = await import('../../lib/gameLogic.js');

  // GET - List available lobbies
  if (req.method === 'GET') {
    try {
      const result = await sql`
        SELECT 
          l.id,
          l.creator_id,
          l.creator_name,
          l.status,
          l.created_at
        FROM lobbies l
        WHERE l.status = 'waiting'
        ORDER BY l.created_at DESC
        LIMIT 20
      `;

      return res.status(200).json({
        success: true,
        lobbies: result.rows
      });

    } catch (error) {
      console.error('Get lobbies error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // POST - Create a new lobby
  if (req.method === 'POST') {
    try {
      const { creatorId, creatorName } = req.body;

      if (!creatorId) {
        return res.status(400).json({ error: 'Creator ID required' });
      }

      const lobbyId = generateLobbyId();

      const result = await sql`
        INSERT INTO lobbies (id, creator_id, creator_name, status, created_at)
        VALUES (${lobbyId}, ${creatorId}, ${creatorName || 'Player'}, 'waiting', NOW())
        RETURNING *
      `;

      return res.status(201).json({
        success: true,
        lobby: result.rows[0]
      });

    } catch (error) {
      console.error('Create lobby error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // DELETE - Remove a lobby
  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      const { creatorId } = req.body;

      if (!id || !creatorId) {
        return res.status(400).json({ error: 'Lobby ID and creator ID required' });
      }

      await sql`
        DELETE FROM lobbies 
        WHERE id = ${id} AND creator_id = ${creatorId}
      `;

      return res.status(200).json({
        success: true,
        message: 'Lobby deleted'
      });

    } catch (error) {
      console.error('Delete lobby error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}