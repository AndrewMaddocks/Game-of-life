function make2DArray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}
let grid;
let cols; //25
let rows; //25
let resolution = 40;
function setup() {
  createCanvas(400, 400); // using p5 js
  cols = width / resolutions;
  rows = height / resolution;
  grid = make2DArray(10, 10);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = floor(random(2));
    }
  }
}
//gives me a nested loop
function draw() {
  background(0);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * resolution;
      let y = j * resolution;
      if (grid[i][j] == 1) {
        fill(255);
        stroke(0);
        rect(x, y, resolution - 1, resolution - 1);
      }
    }
  }
}
let next = make2DArray(cols, rows);
// Compute next based on grid
for (let i = 0; i < cols; i++) {
  for (let j = 0; j < rows; j++) {
    let state = grid[i][j];
    //Count live neighbors!
    let sum = 0;
    let neighbors = countNeighbors(grid, i, j);
    if (state === 0 && neighbors === 3) {
      next[i][j] = 1;
    } else if (state === 1 && (neighbors < 2 || neighbors > 3)) {
      next[i][j] = 0;
    } else {
      next[i][j] = state;
    }
  }
}
grid = next;
function countNeighbors(grid, x, y) {
  let sum = 0;
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      //wrapping
      let col = (x + i + cols) % cols;
      let row = (y + 1 + rows) % rows;
      sum += grid[col][row];
    }
  }
  sum -= grid[x][y];
  return sum;
}
//don't make a 2d array each time
// cell as object
