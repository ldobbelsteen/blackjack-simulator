import React from "react";
import logoLightUrl from "../assets/logo-light.svg";
import { Settings } from "./Settings";
import { Strategy } from "./Strategy";
import { Results } from "./Results";
import { EditableStrategy } from "../engine/strategy";
import { Rules } from "../engine/rules";
import { Toaster } from "react-hot-toast";
import { useRulesPersistent, useStrategyPersistent } from "../storage";

export function Index() {
  const [rules, setRules] = useRulesPersistent(Rules.default());
  const [strategy, setStrategy] = useStrategyPersistent(EditableStrategy.default());

  return (
    <main>
      <Toaster />
      <header>
        <img alt="Logo" src={logoLightUrl} />
        <h1>Blackjack Simulator</h1>
      </header>
      <p>
        A simulator for the popular card game blackjack. It simulates millions of blackjack games in
        seconds and calculates your average profit/loss and other statistics, given the strategy you
        play with and the house rules you are using. It implements the game of blackjack to a very
        detailed level so the results are representative of real-world results. Do realise, however,
        that these results are only achieved on the long-term and on the short-term your results
        will vary wildly. The simulator speed is dependent on your device&apos;s processing power as
        it is run locally. Only modern browsers are supported. This project is open source and can
        be found on <a href="https://github.com/ldobbelsteen/blackjack-simulator">GitHub</a>.
      </p>
      <Settings rules={rules} setRules={setRules} />
      <Strategy strategy={strategy} setStrategy={setStrategy} />
      <Results strategy={strategy} rules={rules} />
    </main>
  );
}
