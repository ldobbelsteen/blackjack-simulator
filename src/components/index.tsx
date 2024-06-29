import React from "react";
import logoLightUrl from "../assets/logo-light.svg";
import { Settings } from "./Settings";
import { Strategy } from "./Strategy";
import { Simulator } from "./Simulator";
import { EditableStrategy } from "../engine/strategy";
import { Rules } from "../engine/rules";
import { Toaster } from "react-hot-toast";
import { useRulesPersistent, useStrategyPersistent } from "../storage";
import { Optimizer } from "./Optimizer";

export function Index() {
  const [rules, setRules] = useRulesPersistent(Rules.default());
  const [strategy, setStrategy] = useStrategyPersistent(EditableStrategy.default());

  return (
    <main className="m-auto max-w-3xl shrink-0 grow overflow-hidden">
      <Toaster />
      <header className="m-4 flex items-center justify-center">
        <img className="size-8" alt="Logo" src={logoLightUrl} />
        <h1 className="ml-2">Blackjack Simulator</h1>
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
      <br />
      <Settings rules={rules} setRules={setRules} />
      <br />
      <Strategy strategy={strategy} setStrategy={setStrategy} />
      <br />
      <Simulator strategy={strategy} rules={rules} />
      <br />
      <Optimizer rules={rules} base={strategy} />
    </main>
  );
}
