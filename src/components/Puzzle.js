import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function Puzzle() {
  const { id } = useParams();
  const [puzzle, setPuzzle] = useState(null);
  const [grid, setGrid] = useState([]);
  const [emptyCell, setEmptyCell] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const puzzles = JSON.parse(localStorage.getItem("puzzles") || "[]");
    const selectedPuzzle = puzzles.find((p) => p.id === Number(id));
    if (selectedPuzzle) {
      setPuzzle(selectedPuzzle);
      setGrid(JSON.parse(JSON.stringify(selectedPuzzle.grid))); // Deep copy
      const emptyPos = findEmptyCell(selectedPuzzle.grid);
      setEmptyCell(emptyPos);
    } else {
      setPuzzle(null);
    }
  }, [id]);

  const findEmptyCell = (grid) => {
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        if (grid[row][col] === null) return { row, col };
      }
    }
    return null;
  };

  const handleMove = (row, col) => {
    if (!emptyCell) return;

    const dx = Math.abs(row - emptyCell.row);
    const dy = Math.abs(col - emptyCell.col);

    if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
      const newGrid = [...grid];
      newGrid[emptyCell.row][emptyCell.col] = newGrid[row][col];
      newGrid[row][col] = null;
      setGrid(newGrid);
      setEmptyCell({ row, col });
    }
  };

  const checkSolution = () => {
    if (!puzzle) return;

    try {
      const evaluate = new Function("grid", puzzle.evaluationFunction);
      const result = evaluate(grid);
      setMessage(result ? "Puzzle solved successfully!" : "Incorrect solution. Try again.");
    } catch (error) {
      setMessage("Error in evaluation function. Please check the function code.");
    }
  };

  const resetPuzzle = () => {
    if (!puzzle) return;
    setGrid(JSON.parse(JSON.stringify(puzzle.grid))); // Deep copy
    const emptyPos = findEmptyCell(puzzle.grid);
    setEmptyCell(emptyPos);
    setMessage(""); // Clear feedback
  };

  if (!puzzle) {
    return <div>Loading puzzle or puzzle not found...</div>;
  }

  return (
    <div>
      <h1>Sliding Puzzle</h1>
      <div
        style={{
          display: "grid",
          gridTemplateRows: `repeat(${puzzle.rows}, ${puzzle.cellHeight}px)`,
          gridTemplateColumns: `repeat(${puzzle.cols}, ${puzzle.cellWidth}px)`,
          gap: "5px",
        }}
      >
        {grid.map((row, rowIdx) =>
          row.map((cell, colIdx) => (
            <div
              key={`${rowIdx}-${colIdx}`}
              onClick={() => handleMove(rowIdx, colIdx)}
              style={{
                width: `${puzzle.cellWidth}px`,
                height: `${puzzle.cellHeight}px`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: cell === null ? "lightgray" : "white",
                border: "1px solid black",
                cursor: cell === null ? "default" : "pointer",
              }}
            >
              {cell}
            </div>
          ))
        )}
      </div>
      <button onClick={checkSolution}>Submit Solution</button>
      <button onClick={resetPuzzle}>Reset Puzzle</button>
      <p>{message}</p>
    </div>
  );
}

export default Puzzle;
