import React from "react";
import { Rules } from "../blackjack/rules";

export const RuleSection = (props: {
  rules: Rules;
  setRules: (rules: Rules) => void;
}) => {
  return (
    <div className="rulesSection">
      <p>{JSON.stringify(props.rules, null, 2)}</p>
    </div>
  );
};
