import React, { KeyboardEvent, useRef } from "react";
import { EditableStrategy } from "../engine/strategy";
import { HandType } from "../engine/hand";
import toast from "react-hot-toast";
import { Button } from "./Button";

export function Strategy(props: {
  strategy: EditableStrategy;
  setStrategy: (strategy: EditableStrategy) => void;
}) {
  return (
    <>
      <div className="flex items-center gap-2">
        <h3>Strategy</h3>
        <Button
          fullWidth={false}
          onClick={() => {
            props.setStrategy(EditableStrategy.default());
            toast.success("Strategy reset");
          }}
        >
          Reset
        </Button>
      </div>

      <p className="mb-4 mt-2">
        The strategy the player uses is expressed in three tables. The top row is the dealer&apos;s
        upcard and the side row is the player&apos;s total hand value. Hard is the strategy for when
        you have a normal hand, soft is for when you have at least one ace which is compressible to
        1 and pair is for when you have a pair of cards. It can be edited at will, given you use the
        standard letter combinations. Invalid cells are highlighted dark red. The first letter gives
        the preferred move and the second gives the move if the first one is not allowed in a
        particular situation. If neither are possible in the pair strategy (or the cell is empty,
        marked with an x), the simulator falls back to the other tables. H = hit, S = stand, D =
        double-down, P = split, R = surrender. The default strategy filled in here is the standard
        basic strategy.
      </p>

      <div className="flex flex-wrap justify-center gap-2">
        <StrategyTable
          type={HandType.Hard}
          strategy={props.strategy}
          setStrategy={props.setStrategy}
        />
        <StrategyTable
          type={HandType.Soft}
          strategy={props.strategy}
          setStrategy={props.setStrategy}
        />
        <StrategyTable
          type={HandType.Pair}
          strategy={props.strategy}
          setStrategy={props.setStrategy}
        />
      </div>
    </>
  );
}

function StrategyTable(props: {
  type: HandType;
  strategy: EditableStrategy;
  setStrategy: (strategy: EditableStrategy) => void;
}) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const columnHeaders = props.strategy.columnHeaders();
  const rowHeaders = props.strategy.rowHeaders(props.type);

  const rows = rowHeaders.length;
  const cols = columnHeaders.length;

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, row: number, col: number) => {
    let input: HTMLInputElement | null = null;
    switch (e.key) {
      case "ArrowUp":
        if (row > 0) {
          input = inputsRef.current[(row - 1) * cols + col];
        }
        break;
      case "ArrowDown":
        if (row < rows - 1) {
          input = inputsRef.current[(row + 1) * cols + col];
        }
        break;
      case "ArrowLeft":
        if (col > 0) {
          input = inputsRef.current[row * cols + (col - 1)];
        }
        break;
      case "ArrowRight":
        if (col < cols - 1) {
          input = inputsRef.current[row * cols + (col + 1)];
        }
        break;
      default:
        break;
    }
    if (input) {
      e.preventDefault();
      input.focus();
      input.select();
    }
  };

  return (
    <div className="bg-darkgray p-2">
      <h3 className="text-center">{HandType[props.type]}</h3>
      <table>
        <tbody>
          <tr>
            <th />
            {columnHeaders.map((header, i) => (
              <th key={i}>{header}</th>
            ))}
          </tr>
          {rowHeaders.map((header, i) => (
            <tr key={i}>
              <th>{header}</th>
              {props.strategy.columnHeaders().map((_, j) => (
                <td key={j}>
                  <input
                    className="size-7 text-center align-middle"
                    value={props.strategy.input(i, j, props.type)}
                    placeholder={props.strategy.input(i, j, props.type) === "" ? "x" : undefined}
                    onChange={(e) =>
                      props.setStrategy(
                        props.strategy.withSet(i, j, props.type, e.target.value.toUpperCase()),
                      )
                    }
                    onClick={(e) => e.currentTarget.select()}
                    style={{ backgroundColor: props.strategy.color(i, j, props.type) }}
                    ref={(el) => (inputsRef.current[i * cols + j] = el)}
                    onKeyDown={(e) => handleKeyDown(e, i, j)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
