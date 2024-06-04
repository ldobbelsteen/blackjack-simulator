import React, { useEffect, useRef, useState } from "react";
import { Rules } from "../engine/rules";
import { CompleteStrategy, EditableStrategy } from "../engine/strategy";
import { Stats } from "../engine/stats";
import { BlackjackWorker } from "../engine/worker";
import { timeDiffString } from "../misc";
import toast from "react-hot-toast";

const REFRESH_INTERVAL = 1000;

export function Results(props: { rules: Rules; strategy: EditableStrategy }) {
  const [stats, setStats] = useState(Stats.empty());
  const [lastStart, setLastStart] = useState(new Date());
  const [lastStop, setLastStop] = useState<Date | null>(lastStart);
  const liveStats = useRef(Stats.empty());
  const workers = useRef<Worker[]>([]);

  /** Refresh the rendered stats periodically when running. */
  useEffect(() => {
    const refreshStats = () => setStats(liveStats.current.copy());
    refreshStats();
    if (lastStop === null) {
      const timer = setInterval(refreshStats, REFRESH_INTERVAL);
      return () => clearInterval(timer);
    }
  }, [lastStop]);

  const startSimulation = () => {
    let completeStrategy: CompleteStrategy;
    try {
      completeStrategy = props.strategy.toComplete();
    } catch (e) {
      toast.error("Strategy is not valid");
      return;
    }

    setLastStart(new Date());
    liveStats.current = Stats.empty();
    setLastStop(null);

    for (let i = 0; i < props.rules.threadCount; i += 1) {
      const worker = new Worker(new URL("../engine/worker", import.meta.url), {
        type: "module",
      }) as BlackjackWorker;
      worker.onmessage = (ev) => liveStats.current.add(Stats.fromObject(ev.data.stats));
      worker.postMessage({
        rules: props.rules.toObject(),
        strategy: completeStrategy.toObject(),
      });
      workers.current.push(worker);
    }
  };

  const stopSimulation = () => {
    setLastStop(new Date());
    workers.current.forEach((w) => (w.onmessage = null));
    workers.current.forEach((w) => w.terminate());
    workers.current = [];
  };

  const simulationTimeMs = (lastStop ?? new Date()).getTime() - lastStart.getTime();

  return (
    <>
      <h3>Results</h3>
      <p>
        The simulation can be started below. It will run until explicitly stopped. The live results
        are shown below. The balance is relative to the starting capital given you bet 1 unit each
        game as a base bet. The house edge is the average percentage of your base bet you lose/win
        to the house per game. Note that these two metrics converge to a stable value after a while,
        and that they represent loss/winnings given the house rules and your strategy in the
        real-world (assuming the simulator is perfect, which it might not be).
      </p>
      <div id="results">
        <button onClick={() => (lastStop === null ? stopSimulation() : startSimulation())}>
          {lastStop === null
            ? "Stop simulation"
            : stats.gameCount() === 0
              ? "Start simulation"
              : "Restart simulation"}
        </button>
        <p>{`Simulation time: ${timeDiffString(simulationTimeMs)}`}</p>
        <p>{`House edge: ${stats.houseEdge(props.rules.blackjackPayout).toLocaleString()}%`}</p>
        <p>{`Average games per second: ${Math.round(stats.gamesPerSecond(simulationTimeMs)).toLocaleString()}`}</p>
        <p>{`Games played: ${stats.gameCount().toLocaleString()}`}</p>
        <p>{`Balance: ${stats.balance(props.rules.blackjackPayout).toLocaleString()}`}</p>
        <p>{`Normal wins: ${stats.wins.toLocaleString()}`}</p>
        <p>{`Normal pushes: ${stats.pushes.toLocaleString()}`}</p>
        <p>{`Normal losses: ${stats.losses.toLocaleString()}`}</p>
        <p>{`Wins after doubling: ${stats.winsAfterDoubling.toLocaleString()}`}</p>
        <p>{`Pushes after doubling: ${stats.pushesAfterDoubling.toLocaleString()}`}</p>
        <p>{`Losses after doubling: ${stats.lossesAfterDoubling.toLocaleString()}`}</p>
        <p>{`Blackjacks: ${stats.blackjacks.toLocaleString()}`}</p>
        <p>{`Surrenders: ${stats.surrenders.toLocaleString()}`}</p>
        <p>{`Splits: ${stats.splits.toLocaleString()}`}</p>
      </div>
    </>
  );
}
