import React, { useEffect, useRef, useState } from "react";
import { Rules } from "../blackjack/rules";
import {
  addStats,
  emptyStats,
  extractBalance,
  extractGameCount,
  Stats,
} from "../blackjack/stats";
import { EditableStrategy, validateStrategy } from "../blackjack/strategy";
import { BlackjackWorker } from "../blackjack/worker";
import { readableDuration, secondDifference } from "../utils";

export const StatisticsSection = (props: {
  rules: Rules;
  strategy: EditableStrategy;
}) => {
  const [stats, setStats] = useState<Stats>(emptyStats());
  const [isRunning, setIsRunning] = useState(false);
  const [lastStart, setLastStart] = useState<Date>();
  const [lastStop, setLastStop] = useState<Date>();
  const liveStats = useRef<Stats>(emptyStats());
  const workers = useRef<Worker[]>([]);

  /** Refresh the visible stats periodically */
  useEffect(() => {
    const updateStats = () => setStats({ ...liveStats.current });
    const timer = setInterval(updateStats, 1000);
    return () => clearInterval(timer);
  }, []);

  const startSimulation = () => {
    const completeStrategy = validateStrategy(props.strategy);
    if (!completeStrategy) throw "invalid strategy";
    setIsRunning(true);
    setLastStart(new Date());
    for (let i = 0; i < navigator.hardwareConcurrency; i++) {
      const worker = new Worker(
        new URL("../blackjack/worker", import.meta.url),
        { type: "module" }
      ) as BlackjackWorker;
      worker.onmessage = (ev) => {
        const newStats = addStats(liveStats.current, ev.data.stats);
        liveStats.current = newStats;
      };
      worker.postMessage({
        rules: props.rules,
        strategy: completeStrategy,
      });
      workers.current.push(worker);
    }
  };

  const stopSimulation = () => {
    setIsRunning(false);
    setLastStop(new Date());
    while (workers.current.length > 0) {
      workers.current.pop()?.terminate();
    }
  };

  return (
    <div className="statsSection">
      <button
        onClick={() => (isRunning ? stopSimulation() : startSimulation())}
      >
        {isRunning ? "Stop simulation" : "Start simulation"}
      </button>
      {lastStart && (
        <>
          <p>Total games played: {extractGameCount(stats) || "..."}</p>
          <p>
            Total simulation time:{" "}
            {readableDuration(
              secondDifference(
                lastStart,
                isRunning || !lastStop ? new Date() : lastStop
              )
            ) || "..."}
          </p>
          <p>Average games per second: {0 || "..."}</p>
          <p>
            Balance:{" "}
            {extractBalance(stats, props.rules.blackjackPayout) || "..."}
          </p>
          <p>House edge: {0 || "..."}</p>
          <p>Normal wins: {stats.wins || "..."}</p>
          <p>Normal pushes: {stats.pushes || "..."}</p>
          <p>Normal losses: {stats.losses || "..."}</p>
          <p>Double wins: {stats.winsAfterDoubling || "..."}</p>
          <p>Double pushes: {stats.pushesAfterDoubling || "..."}</p>
          <p>Double losses: {stats.lossesAfterDoubling || "..."}</p>
          <p>Blackjacks: {stats.blackjacks || "..."}</p>
          <p>Surrenders: {stats.surrenders || "..."}</p>
          <p>Splits: {stats.splits || "..."}</p>
        </>
      )}
    </div>
  );
};
