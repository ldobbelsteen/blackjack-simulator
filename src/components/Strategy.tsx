import React from "react";
import { EditableStrategy } from "../js/blackjack/strategy";
import { HandType } from "../js/blackjack/hand";

export function Strategy(props: {
  strategy: EditableStrategy;
  setStrategy: (strategy: EditableStrategy) => void;
}) {
  return (
    <>
      <h3>Strategy</h3>
      <p>
        The strategy the player uses is expressed in three tables. The top row is the dealer&apos;s
        upcard and the side row is the player&apos;s total hand value. Hard is the strategy for when
        you have a normal hand, soft is for when you have at least one ace which is compressible to
        1 and pair is for when you have a pair of cards. It can be edited at will, given you use the
        standard letter combinations. Invalid cells are highlighted dark red. The first letter gives
        the preferred move and the second gives the move if the first one is not allowed in a
        particular situation. If neither are possible in the pair strategy (or the cell is empty,
        marked with an x), the simulator falls back to the hard strategy. H = hit, S = stand, D =
        double-down, P = split, R = surrender. The default strategy filled in here is the standard
        basic strategy.
      </p>
      <div id="strategy">
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
  return (
    <div>
      <h3>{HandType[props.type]}</h3>
      <table>
        <tbody>
          <tr>
            <th />
            {props.strategy.columnHeaders().map((header, i) => (
              <th key={i}>{header}</th>
            ))}
          </tr>
          {props.strategy.rowHeaders(props.type).map((header, i) => (
            <tr key={i}>
              <th>{header}</th>
              {props.strategy.columnHeaders().map((_, j) => (
                <td key={j}>
                  <input
                    value={props.strategy.input(i, j, props.type)}
                    placeholder={props.strategy.input(i, j, props.type) === "" ? "x" : undefined}
                    onChange={(e) =>
                      props.setStrategy(
                        props.strategy.withSet(i, j, props.type, e.target.value.toUpperCase()),
                      )
                    }
                    onClick={(e) => e.currentTarget.select()}
                    style={{ backgroundColor: props.strategy.color(i, j, props.type) }}
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
