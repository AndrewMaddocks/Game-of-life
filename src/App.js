import React, { useState, useCallback, useRef } from "react";
import produce from "immer";
import "./App.css";

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

function App() {
  // const [cols, setCols] = useState(105);
  // const [rows, setRows] = useState(35);
  const numRows = 35;
  const numCols = 105;
  // function handleRows(e) {
  //   setRows(Number(e.target.value));
  //   console.log(rows);
  // }
  // function handleCols(e) {
  //   setCols(Number(e.target.value));
  // }
  const generateEmptyGrid = () => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0));
    }
    return rows;
  };

  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });

  const [running, setRunning] = useState(false);
  let [count, setCount] = useState(0);
  const [speed, setSpeed] = useState(1000);

  function changeInt(e) {
    setSpeed(Number(e.target.value));
    console.log(e.target.value);
    console.log(speed);
  }
  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }
    setCount((count) => (count += 1));
    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbors = 0;
            //compute the number of neighbors
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              //edges, state changhes if it passes this edge case
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbors += g[newI][newK];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0; //dies
            } else if (g[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1; //lives
            }
          }
        }
      });
    });

    setTimeout(runSimulation, speed);
  }, [speed]);

  let rgb = [];
  for (var i = 0; i < 3; i++) {
    let r = Math.floor(Math.random() * 256);
    rgb.push(r);
  }

  return (
    <>
      <h1 style={{ textAlign: "center" }}>Conaway's Game Of Life</h1>
      <section>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${numCols}, 20px)`,
          }}
        >
          {grid.map((rows, i) =>
            rows.map((col, k) => (
              <div
                id="cell"
                key={`${i}-${k}`}
                onClick={() => {
                  const newGrid = produce(grid, (gridCopy) => {
                    gridCopy[i][k] = grid[i][k] ? 0 : 1;
                  });
                  setGrid(newGrid);
                }}
                style={{
                  width: "20px",
                  height: "20px",
                  border: `solid .5px rgb(${rgb})`,
                  backgroundColor: grid[i][k] ? `rgb(${rgb})` : undefined,
                }}
              />
            ))
          )}
        </div>
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
            }}
          >
            <button
              onClick={() => {
                setRunning(!running);
                if (!running) {
                  runningRef.current = true;
                  runSimulation();
                }
              }}
            >
              {running ? "STOP" : "START"}
            </button>
            <button
              onClick={() => {
                const rows = [];
                for (let i = 0; i < numRows; i++) {
                  rows.push(
                    Array.from(Array(numCols), () =>
                      Math.random() > 0.7 ? 1 : 0
                    )
                  );
                }

                setGrid(rows);
              }}
            >
              RANDOM
            </button>
            <button
              onClick={() => {
                setGrid(generateEmptyGrid());
                setCount(0);
              }}
            >
              CLEAR
            </button>
          </div>
        </div>
        <h2>Speed</h2>
        <input
          type="range"
          min="0"
          max="1000"
          value={speed}
          onChange={changeInt}
          title={speed}
        />
        {/* <h2>Columns</h2>
        <input type="number" value={cols} onChange={handleCols} name={cols} />
        <h2>Rows</h2>
        <input type="number" value={rows} onChange={handleRows} name={rows} /> */}
        <h3>{`# of Generations ${count}`}</h3>

        <div>
          <h2>Rules</h2>
          <ul>
            <li>
              Any live cell with fewer than two live neighbors dies, as if by
              underpopulation.
            </li>
            <li>
              Any live cell with two or three live neighbors lives on to the
              next generation.
            </li>
            <li>
              Any live cell with more than three live neighbors dies, as if by
              overpopulation.
            </li>
            <li>
              Any dead cell with exactly three live neighbors becomes a live
              cell, as if by reproduction.
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}

export default App;
