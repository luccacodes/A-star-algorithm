/* TEST

import { useEffect } from "react";

export const Board = (board) => {
    // const [boardToRender, setBoardToRender] = useState(null);

    const renderCell = (value) => {
        //  Empty cell
        if (value === 0) return ' ';
        return value;
      };

    // useEffect(() => {
    //     // Introduce a one-second delay before rendering the board
    //     const timer = setTimeout(() => {
    //     renderBoard(board);
    //     }, 1000); // Delay for one second (1000 milliseconds)

    //     return () => clearTimeout(timer); // Clear the timer if the component unmounts
    // }, [board]);

    const renderBoard = (board) => {
        console.log(board)
        console.log(typeof board)
    
        return (
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
        );
      };

    return (
        <>
          {renderBoard}
        </>
      );
} */