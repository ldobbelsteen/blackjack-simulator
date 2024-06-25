import { useState } from "react";
import { EditableStrategy } from "./engine/strategy";
import { Rules } from "./engine/rules";

export function useStrategyPersistent(
  defaultValue: EditableStrategy,
): [EditableStrategy, (newVal: EditableStrategy) => void] {
  const [strategy, setStrategy] = useState(() => {
    try {
      const value = localStorage.getItem("strategy");
      if (value === null) {
        throw new Error("no strategy stored");
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return EditableStrategy.fromObject(JSON.parse(value));
    } catch (e) {
      localStorage.setItem("strategy", JSON.stringify(defaultValue.toObject()));
      return defaultValue;
    }
  });

  const setStrategyWrapper = (newVal: EditableStrategy) => {
    localStorage.setItem("strategy", JSON.stringify(newVal.toObject()));
    setStrategy(newVal);
  };

  return [strategy, setStrategyWrapper];
}

export function useRulesPersistent(defaultValue: Rules): [Rules, (newVal: Rules) => void] {
  const [rules, setRules] = useState(() => {
    try {
      const value = localStorage.getItem("rules");
      if (value === null) {
        throw new Error("no rules stored");
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return Rules.fromObject(JSON.parse(value));
    } catch (e) {
      localStorage.setItem("rules", JSON.stringify(defaultValue.toObject()));
      return defaultValue;
    }
  });

  const setRulesWrapper = (newVal: Rules) => {
    localStorage.setItem("rules", JSON.stringify(newVal.toObject()));
    setRules(newVal);
  };

  return [rules, setRulesWrapper];
}
