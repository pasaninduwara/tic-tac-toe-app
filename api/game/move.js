/**
 * Make a move in a game
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
  const { makeMove, calculateScores, isBoardFull, getWinner } = await import('../../lib/gameLogic.js');

  try {
    const { gameId, playerId, row, col } = req.body;

    if (!gameId || !playerId || row === undefined || col === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get current game state
    const gameResult = await sql`
      SELECT * FROM games WHERE id = ${gameId}
    `;

    if (gameResult.rows.length === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }

    const game = gameResult.rows[0];

    if (game.status !== 'playing') {
      return res.status(400).json({ error: 'Game is not in progress' });
    }

    // Determine player's symbol
    const isPlayerX = game.player_x_id === playerId;
    const isPlayerO = game.player_o_id === playerId;

    if (!isPlayerX && !isPlayerO) {
      return res.status(403).json({ error: 'You are not a player in this game' });
    }

    const playerSymbol = isPlayerX ? 1 : 0;

    // Check if it's player's turn
    const currentTurn = game.current_turn;
    if ((currentTurn === 'X' && !isPlayerX) || (currentTurn === 'O' && !isPlayerO)) {
      return res.status(400).json({ error: 'Not your turn' });
    }

    // Make the move
    const board = game.board;
    const moveResult = makeMove(board, row, col, playerSymbol);

    if (!moveResult.success) {
      return res.status(400).json({ error: moveResult.error });
    }

    const newBoard = moveResult.board;
    const newMovesCount = game.moves_count + 1;

    // Calculate scores
    const { scoreX, scoreO, lines } = calculateScores(newBoard);

    // Check if game is over
    let newStatus = 'playing';
    let winnerId = null;
    let nextTurn = currentTurn === 'X' ? 'O' : 'X';

    if (isBoardFull(newBoard)) {
      newStatus = 'finished';
      const winner = getWinner(scoreX, scoreO);
      
      if (winner === 'X') {
        winnerId = game.player_x_id;
      } else if (winner === 'O') {
        winnerId = game.player_o_id;
      }
      
      nextTurn = null;
    }

    // Update game in database
    const updateResult = await sql`
      UPDATE games SET
        board = ${JSON.stringify(newBoard)}::jsonb,
        current_turn = ${nextTurn},
        status = ${newStatus},
        score_x = ${scoreX},
        score_o = ${scoreO},
        moves_count = ${newMovesCount},
        winner_id = ${winnerId},
        updated_at = NOW()
      WHERE id = ${gameId}
      RETURNING *
    `;

    // If game finished, update player stats
    if (newStatus === 'finished') {
      await sql`
        UPDATE users SET
          total_score = total_score + ${scoreX},
          games_played = games_played + 1,
          games_won = games_won + CASE WHEN ${winnerId === game.player_x_id} THEN 1 ELSE 0 END,
          games_lost = games_lost + CASE WHEN ${winnerId === game.player_o_id} THEN 1 ELSE 0 END,
          games_draw = games_draw + CASE WHEN ${winnerId === null} THEN 1 ELSE 0 END,
          updated_at = NOW()
        WHERE telegram_id = ${game.player_x_id}
      `;

      await sql`
        UPDATE users SET
          total_score = total_score + ${scoreO},
          games_played = games_played + 1,
          games_won = games_won + CASE WHEN ${winnerId === game.player_o_id} THEN 1 ELSE 0 END,
          games_lost = games_lost + CASE WHEN ${winnerId === game.player_x_id} THEN 1 ELSE 0 END,
          games_draw = games_draw + CASE WHEN ${winnerId === null} THEN 1 ELSE 0 END,
          updated_at = NOW()
        WHERE telegram_id = ${game.player_o_id}
      `;

      // Update leaderboard
      await updateLeaderboard(sql, game.player_x_id, scoreX, winnerId === game.player_x_id);
      await updateLeaderboard(sql, game.player_o_id, scoreO, winnerId === game.player_o_id);
    }

    return res.status(200).json({
      success: true,
      game: {
        id: updateResult.rows[0].id,
        board: updateResult.rows[0].board,
        currentTurn: updateResult.rows[0].current_turn,
        status: updateResult.rows[0].status,
        scoreX: updateResult.rows[0].score_x,
        scoreO: updateResult.rows[0].score_o,
        movesCount: updateResult.rows[0].moves_count,
        winnerId: updateResult.rows[0].winner_id,
        newLines: lines.filter(l => l.player === playerSymbol),
      }
    });

  } catch (error) {
    console.error('Move error:', error);
    return res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
}

// Helper function to update leaderboard
async function updateLeaderboard(sql, userId, score, won) {
  const periods = ['today', 'week', 'month', 'year'];

  for (const period of periods) {
    const existing = await sql`
      SELECT * FROM leaderboard 
      WHERE user_id = ${userId} AND period = ${period}
    `;

    if (existing.rows.length > 0) {
      await sql`
        UPDATE leaderboard SET
          score = score + ${score},
          games_won = games_won + CASE WHEN ${won} THEN 1 ELSE 0 END,
          updated_at = NOW()
        WHERE user_id = ${userId} AND period = ${period}
      `;
    } else {
      await sql`
        INSERT INTO leaderboard (user_id, period, score, games_won, updated_at)
        VALUES (${userId}, ${period}, ${score}, CASE WHEN ${won} THEN 1 ELSE 0 END, NOW())
      `;
    }
  }
}