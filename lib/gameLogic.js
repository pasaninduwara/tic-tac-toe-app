/**
 * Game Logic for 6x6 Tic-Tac-Toe
 */

export function createEmptyBoard() {
  return Array(6).fill(null).map(() => Array(6).fill(-1));
}

export function isCellEmpty(board, row, col) {
  return board[row][col] === -1;
}

export function makeMove(board, row, col, player) {
  if (!isCellEmpty(board, row, col)) {
    return { success: false, error: 'Cell is not empty' };
  }
  
  const newBoard = board.map(r => [...r]);
  newBoard[row][col] = player;
  return { success: true, board: newBoard };
}

export function calculateLines(board) {
  const lines = [];
  const directions = [
    { dr: 0, dc: 1, name: 'horizontal' },
    { dr: 1, dc: 0, name: 'vertical' },
    { dr: 1, dc: 1, name: 'diagonal-down' },
    { dr: 1, dc: -1, name: 'diagonal-up' }
  ];
  
  const usedCells = new Set();
  
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 6; col++) {
      if (board[row][col] === -1) continue;
      
      const player = board[row][col];
      
      for (const { dr, dc, name } of directions) {
        const cells = [];
        let valid = true;
        
        for (let i = 0; i < 3; i++) {
          const nr = row + dr * i;
          const nc = col + dc * i;
          
          if (nr < 0 || nr >= 6 || nc < 0 || nc >= 6) {
            valid = false;
            break;
          }
          
          if (board[nr][nc] !== player) {
            valid = false;
            break;
          }
          
          cells.push(`${nr},${nc}`);
        }
        
        if (valid) {
          const hasNewCell = cells.some(c => !usedCells.has(c));
          
          if (hasNewCell) {
            lines.push({
              player,
              cells: cells.map(c => {
                const [r, co] = c.split(',').map(Number);
                return { row: r, col: co };
              }),
              direction: name
            });
            cells.forEach(c => usedCells.add(c));
          }
        }
      }
    }
  }
  
  return lines;
}

export function calculateScores(board) {
  const lines = calculateLines(board);
  let scoreX = 0;
  let scoreO = 0;
  
  for (const line of lines) {
    if (line.player === 1) {
      scoreX += 5;
    } else {
      scoreO += 5;
    }
  }
  
  return { scoreX, scoreO, lines };
}

export function isBoardFull(board) {
  return board.every(row => row.every(cell => cell !== -1));
}

export function isGameOver(board) {
  return isBoardFull(board);
}

export function getWinner(scoreX, scoreO) {
  if (scoreX > scoreO) return 'X';
  if (scoreO > scoreX) return 'O';
  return 'draw';
}

export function generateGameId() {
  return `game_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function generateLobbyId() {
  return `lobby_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}