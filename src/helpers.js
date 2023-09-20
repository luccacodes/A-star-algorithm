// find the position of a tile
export const findTile = (state, tile) => {
  for (let i = 0; i < state.length; i++) {
    for (let j = 0; j < state[i].length; j++) {
      if (state[i][j] === tile) {
        return [i, j];
      }
    }
  }
  return null;
};

// find the Manhattan distance between two coordinates
export const findManhattanDistance = (a, b) => {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
};