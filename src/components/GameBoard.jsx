import React from 'react';
import './GameBoard.css';

/**
 * 6x6 Game Board Component
 */
function GameBoard({ board, onCellClick, disabled, highlightedCells }) {
  // Get cell content
  const getCellContent = (value) => {
    if (value === 1) return 'X';
    if (value === 0) return 'O';
    return '';
  };

  // Get cell class
  const getCellClass = (row, col, value) => {
    const classes = ['cell'];
    
    if (value === 1) classes.push('x');
    if (value === 0) classes.push('o');
    
    // Check if cell is highlighted
    if (highlightedCells && highlightedCells.some(c => c.row === row && c.col === col)) {
      classes.push('highlighted');
    }
    
    return classes.join(' ');
  };

  // Handle cell click
  const handleClick = (row, col) => {
    if (disabled) return;
    if (board[row][col] !== -1) return;
    onCellClick(row, col);
  };

  return (
    <div className="game-board">
      {/* Grid lines overlay */}
      <div className="grid-overlay">
        {Array(5).fill(null).map((_, i) => (
          <React.Fragment key={i}>
            <div className="grid-line horizontal" style={{ top: `${(i + 1) * 16.67}%` }} />
            <div className="grid-line vertical" style={{ left: `${(i + 1) * 16.67}%` }} />
          </React.Fragment>
        ))}
      </div>
      
      {/* Board cells */}
      <div className="board-cells">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="board-row">
            {row.map((cell, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                className={getCellClass(rowIndex, colIndex, cell)}
                onClick={() => handleClick(rowIndex, colIndex)}
                disabled={disabled || cell !== -1}
              >
                <span className="cell-content">{getCellContent(cell)}</span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default GameBoard;