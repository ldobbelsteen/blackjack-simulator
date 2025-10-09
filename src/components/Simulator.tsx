import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { Rules } from "../engine/rules";
import { Stats } from "../engine/stats";
import type { CompleteStrategy, EditableStrategy } from "../engine/strategy";
import type { BlackjackWorker } from "../engine/worker";
import { timeDiffString } from "../misc";
import { BorderedBox } from "./BorderedBox";
import { Button } from "./Button";

const REFRESH_INTERVAL = 1000;

export function Simulator(props: { rules: Rules; strategy: EditableStrategy }) {
  const [running, setRunning] = useState(false);

  const [stats, setStats] = useState(Stats.empty());
  const [lastStart, setLastStart] = useState(new Date());
  const [lastStop, setLastStop] = useState(lastStart);

  /** When we start running, spawn the engine workers. */
  useEffect(() => {
    if (running) {
      let completeStrategy: CompleteStrategy;
      try {
        completeStrategy = props.strategy.toComplete();
      } catch (e) {
        toast.error("Strategy is not valid");
        console.error(e);
        setRunning(false);
        return;
      }

      setLastStart(new Date());
      const liveStats = Stats.empty();
      const workers: BlackjackWorker[] = [];

      for (let i = 0; i < props.rules.threadCount; i += 1) {
        const worker: BlackjackWorker = new Worker(
          new URL("../engine/worker", import.meta.url),
          {
            type: "module",
          },
        );

        worker.onmessage = (ev) => {
          liveStats.add(Stats.fromObject(ev.data.stats));
        };

        worker.postMessage({
          rules: props.rules.toObject(),
          strategy: completeStrategy.toObject(),
        });

        workers.push(worker);
      }

      const refreshStats = () => {
        setStats(liveStats.copy());
      };
      const refreshInterval = setInterval(refreshStats, REFRESH_INTERVAL);
      refreshStats();

      return () => {
        clearInterval(refreshInterval);
        for (const worker of workers) {
          worker.terminate();
        }
      };
    }
  }, [props.rules, props.strategy, running]);

  /** When stopping, update the stop time. */
  useEffect(() => {
    if (!running) {
      setLastStop(new Date());
    }
  }, [running]);

  const simulationTimeMs =
    (running ? new Date() : lastStop).getTime() - lastStart.getTime();

  return (
    <>
      <h2>Simulator</h2>

      <p className="my-2">
        The simulation can be started below. It will run until explicitly
        stopped. The live results are shown below. The balance is relative to
        the starting capital given you bet 1 unit each game as a base bet. The
        house edge is the average percentage of your base bet you lose/win to
        the house per game. Note that these two metrics converge to a stable
        value after a while, and that they represent loss/winnings given the
        house rules and your strategy in the real-world (assuming the simulator
        is perfect, which it might not be).
      </p>

      <BorderedBox>
        <Button
          onClick={() => {
            setRunning((prev) => !prev);
          }}
          fullWidth={true}
        >
          {running
            ? "Stop simulation"
            : stats.gameCount() === 0
              ? "Start simulation"
              : "Restart simulation"}
        </Button>
        <div className="[&_p]:my-2">
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
      </BorderedBox>
    </>
  );
}
