import React from "react";
import { moveToColor } from "../blackjack/move";
import { MoveWithInput } from "../blackjack/strategy";

export const StrategyTable = <T extends MoveWithInput[][]>(props: {
  title: string;
  table: T;
  setTable: (table: T) => void;
}) => {
  return (
    <div className="strategyTable">
      <h3>{props.title}</h3>
      <table>
        <tbody>
          {props.table.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <th key={j}>
                  <input
                    type="text"
                    maxLength={2}
                    value={cell.input}
                    onChange={(ev) => {
                      props.table[i][j].input = ev.target.value;
                      props.setTable(props.table);
                    }}
                    style={{
                      backgroundColor: cell.move
                        ? moveToColor(cell.move)
                        : "red",
                    }}
                  />
                </th>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
