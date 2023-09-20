import { useEffect, useState } from 'react';
import './App.css';
import { findTile, findManhattanDistance } from './helpers';

function App() {
  const [puzzle, setPuzzle] = useState([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 0],
  ]);
  const [solvedPuzzle, setSolvedPuzzle] = useState(null);
  const [solving, setSolving] = useState(false);
  const [visitedNodes, setVisitedNodes] = useState(0);

  useEffect(() => {
    // starts solving the puzzle and calculates the time taken
    if (solving) {
      console.time('solvePuzzleExecution');
      const solution = solvePuzzle(puzzle);
      setSolvedPuzzle(solution);
      setSolving(false);
      console.timeEnd('solvePuzzleExecution');
    }
  }, [puzzle, solving]);

  const renderCell = (value) => {
    //  checks for empty tile
    if (value === 0) return ' ';
    return value;
  };

  const delay = (milliseconds) => {
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
  }

  const renderBoard = (board) => {
    // console.log(board)
    // console.log(typeof board)

    if (board.length >= 10) {
      return (
        <div className='board'>
          {board.map((item, index) => {
            delay(1000);

            return (
              <>
                <>{index+1}</>
                <div className="board-column">
                  {item.map((row, rowIndex) => (
                    <div className="row" key={rowIndex}>
                      {row.map((cell, colIndex) => (
                        <div className="cell" key={colIndex}>
                          {renderCell(cell)}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </>
            )
          })}  
        </div>
      );
    }

    return (
      <div className='board'>
        <div className="board-column">
        {board.map((row, rowIndex) => (
          <div className="row" key={rowIndex}>
            {row.map((cell, colIndex) => (
              <div className="cell" key={colIndex}>
                {renderCell(cell)}
              </div>
            ))}
          </div>
        ))}
        </div>
      </div>
    );
  };

  const shuffleBoard = async () => {
    const boardSize = puzzle.length;
    const flattenedPuzzle = [].concat(...puzzle);
    let shuffledPuzzle = [...flattenedPuzzle];
  
    // create a series of random moves
    for (let i = 0; i < 1000; i++) {
      const emptyIndex = shuffledPuzzle.indexOf(0);
      const neighbors = [];
  
      // check the neighbors of the empty cell
      if (emptyIndex - boardSize >= 0) neighbors.push(emptyIndex - boardSize); // Up
      if (emptyIndex + boardSize < boardSize * boardSize) neighbors.push(emptyIndex + boardSize); // Down
      if (emptyIndex % boardSize !== 0) neighbors.push(emptyIndex - 1); // Left
      if ((emptyIndex + 1) % boardSize !== 0) neighbors.push(emptyIndex + 1); // Right
  
      // choose a random neighbor to swap with the empty cell
      const randomNeighborIndex = neighbors[Math.floor(Math.random() * neighbors.length)];
      [shuffledPuzzle[emptyIndex], shuffledPuzzle[randomNeighborIndex]] = [
        shuffledPuzzle[randomNeighborIndex],
        shuffledPuzzle[emptyIndex],
      ];
    }
  
    // convert the array back to a puzzle
    const newPuzzle = [];
    for (let i = 0; i < boardSize; i++) {
      newPuzzle.push(shuffledPuzzle.slice(i * boardSize, (i + 1) * boardSize));
    }

    // renderBoard(newPuzzle);
    console.log("New puzzle:", newPuzzle)
    setPuzzle(newPuzzle)
    renderBoard(puzzle)
  };

  const solvePuzzle = (initialPuzzle) => {
    const goalState = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 0],
    ];
    let visitedNodes = 0;

    class Node {

      // we can remove heuristic from the cost sum but it lowers performance and visits way more nodes
      constructor(state, parent = null, action = null, depth = 0) {
        this.state = state;
        this.parent = parent;
        this.action = action;
        this.depth = depth;
        this.heuristic = this.calculateHeuristic();
        this.cost = this.depth + this.heuristic;
      }

      // todo: we could guarantee that we won't return to the same node for better heuristics
      calculateHeuristic() {
        // calculate the sum of Manhattan distances for each tile
        let heuristic = 0;
        for (let i = 0; i < this.state.length; i++) {
          for (let j = 0; j < this.state[i].length; j++) {
            if (this.state[i][j] !== 0) {
              const goalPosition = findTile(goalState, this.state[i][j]);
              heuristic += findManhattanDistance([i, j], goalPosition);
            }
          }
        }
        return heuristic;
      }
  
      // generate child nodes applying valid movements
      expand() {
        const actions = ["left", "right", "up", "down"];
        const children = [];
        const [emptyRow, emptyCol] = findTile(this.state, 0);
        // const biggestDepth = []
  
        for (const action of actions) {
          const newState = this.applyAction(action, emptyRow, emptyCol);
          if (newState) {
            children.push(
              new Node(newState, this, action, this.depth + 1)
            );
            // console.log("depth: ", this.depth)
          }
        }
        return children;
      }
  
      // apply the swap movement
      applyAction(action, emptyRow, emptyCol) {
        const newState = [...this.state.map(row => [...row])];
        switch (action) {
          case "left":
            if (emptyCol > 0) {
              [newState[emptyRow][emptyCol], newState[emptyRow][emptyCol - 1]] =
                [newState[emptyRow][emptyCol - 1], newState[emptyRow][emptyCol]];
              return newState;
            }
            break;
          case "right":
            if (emptyCol < 2) {
              [newState[emptyRow][emptyCol], newState[emptyRow][emptyCol + 1]] =
                [newState[emptyRow][emptyCol + 1], newState[emptyRow][emptyCol]];
              return newState;
            }
            break;
          case "up":
            if (emptyRow > 0) {
              [newState[emptyRow][emptyCol], newState[emptyRow - 1][emptyCol]] =
                [newState[emptyRow - 1][emptyCol], newState[emptyRow][emptyCol]];
              return newState;
            }
            break;
          case "down":
            if (emptyRow < 2) {
              [newState[emptyRow][emptyCol], newState[emptyRow + 1][emptyCol]] =
                [newState[emptyRow + 1][emptyCol], newState[emptyRow][emptyCol]];
              return newState;
            }
            break;
          default:
            break;
        }

        return null;
      }
    }
  
    // A* search
    const openSet = [new Node(initialPuzzle)];
    const closedSet = new Set();
  
    while (openSet.length > 0) {
      openSet.sort((a, b) => a.cost - b.cost);
      const currentNode = openSet.shift();
      const currentState = currentNode.state.toString();

      visitedNodes++;
      setVisitedNodes(visitedNodes)
      // console.log('VISITED NODE:', visitedNodes);
  
      if (currentState === goalState.toString()) {
        // reconstruct solution path
        const path = [];
        let current = currentNode;
        while (current !== null) {
          path.unshift(current.state);
          current = current.parent;
        }
        return path;
      }
  
      // checks if state is in closedSet
      if (!closedSet.has(currentState)) {
        closedSet.add(currentState);
        const children = currentNode.expand();
        // if not in closedSet, add to openSet for them to be explored
        for (const child of children) {
          if (!closedSet.has(child.state.toString())) {
            openSet.push(child);
          }
        }
      }
    }
  
    return null;
  };

  const handleShuffleClick = async () => {
    if (!solving) {
      // setPuzzle(shuffleBoard());
      shuffleBoard()
      setSolvedPuzzle(null);
    }
  };

  const handleSolveClick = () => {
    if (!solving) {
      setSolving(true);
    }
  };

  return (
    <div className="App">
      <h1>A* Search Algorithm</h1>
      <div className="buttons">
        <button onClick={handleShuffleClick}>Shuffle</button>
        <button onClick={handleSolveClick}>Solve</button>
      </div>
      {renderBoard(puzzle)}
      {/* <Board board={puzzle}/> */}
      {solvedPuzzle && <div className="solution"><>Visited nodes: {visitedNodes}</>{renderBoard(solvedPuzzle)}</div>}
      {/* {solvedPuzzle && <div className="solution"><Board board={solvedPuzzle}/></div>} */}
    </div>
  );
}

export default App;
