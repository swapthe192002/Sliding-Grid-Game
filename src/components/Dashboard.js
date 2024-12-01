import React, { useState, useEffect } from "react";

function Dashboard() {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [cellWidth, setCellWidth] = useState(50);
  const [cellHeight, setCellHeight] = useState(50);
  const [grid, setGrid] = useState([]);
  const [evaluationFunction, setEvaluationFunction] = useState(
    "function evaluate(grid) { const flat = grid.flat(); return flat.every((x, i) => x === null || x === i); }"
  );
  const [savedPuzzles, setSavedPuzzles] = useState([]);

  useEffect(() => {
    const puzzles = JSON.parse(localStorage.getItem("puzzles") || "[]");
    setSavedPuzzles(puzzles);
    initializeGrid();
  }, []);

  const initializeGrid = () => {
    const emptyGrid = Array.from({ length: rows }, () =>
      Array(cols).fill(null)
    );
    setGrid(emptyGrid);
  };

  const handleCellInput = (rowIdx, colIdx, value) => {
    const newGrid = [...grid];
    if (value === "") {
      newGrid[rowIdx][colIdx] = null;
    } else if (!isNaN(value) && Number(value) > 0) {
      newGrid[rowIdx][colIdx] = Number(value);
    }
    setGrid(newGrid);
  };

  const savePuzzle = () => {
    const emptyCells = grid.flat().filter((cell) => cell === null).length;
    const uniqueValues = new Set(grid.flat().filter((cell) => cell !== null));
    const isValid =
      emptyCells === 1 && uniqueValues.size === rows * cols - 1;

    if (!isValid) {
      alert("Invalid puzzle configuration: Ensure one empty cell and unique numbers.");
      return;
    }

    const puzzle = {
      id: Date.now(),
      rows,
      cols,
      cellWidth,
      cellHeight,
      grid,
      evaluationFunction,
    };

    const puzzles = [...savedPuzzles, puzzle];
    localStorage.setItem("puzzles", JSON.stringify(puzzles));
    setSavedPuzzles(puzzles);
    alert("Puzzle saved successfully!");
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <h2>Grid Settings</h2>
        <label>
          Rows:
          <input
            type="number"
            min="2"
            max="10"
            value={rows}
            onChange={(e) => setRows(Number(e.target.value))}
          />
        </label>
        <label>
          Columns:
          <input
            type="number"
            min="2"
            max="10"
            value={cols}
            onChange={(e) => setCols(Number(e.target.value))}
          />
        </label>
        <label>
          Cell Width (px):
          <input
            type="number"
            value={cellWidth}
            onChange={(e) => setCellWidth(Number(e.target.value))}
          />
        </label>
        <label>
          Cell Height (px):
          <input
            type="number"
            value={cellHeight}
            onChange={(e) => setCellHeight(Number(e.target.value))}
          />
        </label>
        <button onClick={initializeGrid}>Update Grid</button>
      </div>
      <div>
        <h2>Populate Grid</h2>
        <div
          style={{
            display: "grid",
            gridTemplateRows: `repeat(${rows}, ${cellHeight}px)`,
            gridTemplateColumns: `repeat(${cols}, ${cellWidth}px)`,
            gap: "5px",
          }}
        >
          {grid.map((row, rowIdx) =>
            row.map((cell, colIdx) => (
              <input
                key={`${rowIdx}-${colIdx}`}
                value={cell === null ? "" : cell}
                onChange={(e) =>
                  handleCellInput(rowIdx, colIdx, e.target.value)
                }
                style={{
                  width: `${cellWidth}px`,
                  height: `${cellHeight}px`,
                  textAlign: "center",
                }}
              />
            ))
          )}
        </div>
      </div>
      <div>
        <h2>Evaluation Function</h2>
        <textarea
          rows="5"
          value={evaluationFunction}
          onChange={(e) => setEvaluationFunction(e.target.value)}
        />
      </div>
      <button onClick={savePuzzle}>Save Puzzle</button>
      <div>
        <h2>Saved Puzzles</h2>
        <ul>
          {savedPuzzles.map((puzzle) => (
            <li key={puzzle.id}>
              <a href={`/puzzle/${puzzle.id}`}>Puzzle {puzzle.id}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
