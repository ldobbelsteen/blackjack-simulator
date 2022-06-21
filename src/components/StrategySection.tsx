import React from "react";
import { EditableStrategy } from "../blackjack/strategy";
import { StrategyTable } from "./StrategyTable";

export const StrategySection = (props: {
  strategy: EditableStrategy;
  setStrategy: (strategy: EditableStrategy) => void;
}) => {
  return (
    <div className="strategySection">
      <StrategyTable
        title={"Hard"}
        table={props.strategy.hard}
        setTable={(t) => props.setStrategy({ ...props.strategy, hard: t })}
      />
      <StrategyTable
        title={"Soft"}
        table={props.strategy.soft}
        setTable={(t) => props.setStrategy({ ...props.strategy, soft: t })}
      />
      <StrategyTable
        title={"Pair"}
        table={props.strategy.pair}
        setTable={(t) => props.setStrategy({ ...props.strategy, pair: t })}
      />
    </div>
  );
};
