import "../styles.scss";
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { defaultRules } from "../blackjack/rules";
import { defaultEditableStrategy } from "../blackjack/strategy";
import Logo from "../static/logo.svg";
import { RuleSection } from "./RuleSection";
import { StatisticsSection } from "./StatisticsSection";
import { StrategySection } from "./StrategySection";

const App = () => {
  const [rules, setRules] = useState(defaultRules());
  const [strategy, setStrategy] = useState(defaultEditableStrategy());

  return (
    <>
      <header>
        <a href="/">
          <img alt="Logo" src={Logo}></img>
          <h1>Blackjack Simulator</h1>
        </a>
      </header>
      <main>
        <p>
          A simulator for the popular card game blackjack. It simulates millions
          of blackjack games in seconds and calculates your average profit/loss
          and other statistics, given the strategy you play with and the house
          rules you&quot;re using. It implements the game of blackjack to a very
          detailed level so the results are representative of real-world
          results. Do realise, however, that these results are only achieved on
          the long-term and on the short-term your results will vary wildly. The
          simulator&quot;s speed is dependent on your device&quot;s processing
          power as it is run locally. Only modern browsers are supported. This
          project is open source and can be found on{" "}
          <a href="https://github.com/ldobbelsteen/blackjack-simulator">
            GitHub
          </a>
          .
        </p>
        <RuleSection rules={rules} setRules={setRules} />
        <StrategySection strategy={strategy} setStrategy={setStrategy} />
        <StatisticsSection rules={rules} strategy={strategy} />
      </main>
    </>
  );
};

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
