import React, { useEffect, useState } from "react";
import { Rules } from "../engine/rules";
import { CompleteStrategy, EditableStrategy } from "../engine/strategy";
import toast from "react-hot-toast";
import { HandType } from "../engine/hand";
import { Move } from "../engine/move";
import { Stats } from "../engine/stats";
import { BlackjackWorker } from "../engine/worker";
import { basicShuffle } from "../misc";
import { Button } from "./Button";
import { BorderedBox } from "./BorderedBox";

interface Job {
  changeId: string;
  strategy: CompleteStrategy;
}

function accumulateJobs(
  base: CompleteStrategy,
  includeHard: boolean,
  includeSoft: boolean,
  includePair: boolean,
  shuffle: boolean,
) {
  const jobs: Job[] = [];
  const editableBase = base.toEditable();

  if (includeHard) {
    for (let row = 0; row < editableBase.hard.length; row += 1) {
      for (let col = 0; col < editableBase.hard[row].length; col += 1) {
        const existingMove = editableBase.hard[row][col].toString();
        for (const move of Move.hardValidStr) {
          if (move !== existingMove) {
            const dealerCard = editableBase.columnHeaders()[col];
            const playerHand = editableBase.rowHeaders(HandType.Hard)[row];
            const changeId = `hard player ${playerHand} vs. dealer ${dealerCard} to ${move}`;
            jobs.push({
              changeId: changeId,
              strategy: editableBase.withSet(row, col, HandType.Hard, move).toComplete(),
            });
          }
        }
      }
    }
  }

  if (includeSoft) {
    for (let row = 0; row < editableBase.soft.length; row += 1) {
      for (let col = 0; col < editableBase.soft[row].length; col += 1) {
        const existingMove = editableBase.soft[row][col].toString();
        for (const move of Move.softValidStr) {
          if (move !== existingMove) {
            const dealerCard = editableBase.columnHeaders()[col];
            const playerHand = editableBase.rowHeaders(HandType.Soft)[row];
            const changeId = `soft player ${playerHand} vs. dealer ${dealerCard} to ${move}`;
            jobs.push({
              changeId: changeId,
              strategy: editableBase.withSet(row, col, HandType.Soft, move).toComplete(),
            });
          }
        }
      }
    }
  }

  if (includePair) {
    for (let row = 0; row < editableBase.pair.length; row += 1) {
      for (let col = 0; col < editableBase.pair[row].length; col += 1) {
        const existingMove = editableBase.pair[row][col].toString();
        for (const move of Move.pairValidStr) {
          if (move !== existingMove) {
            const dealerCard = editableBase.columnHeaders()[col];
            const playerHand = editableBase.rowHeaders(HandType.Pair)[row];
            const changeId = `pair player ${playerHand} vs. dealer ${dealerCard} to ${move || "x"}`;
            jobs.push({
              changeId: changeId,
              strategy: editableBase.withSet(row, col, HandType.Pair, move).toComplete(),
            });
          }
        }
      }
    }
  }

  if (shuffle) {
    basicShuffle(jobs);
  }

  return jobs;
}

function runSimulation(
  rules: Rules,
  strategy: CompleteStrategy,
  minGameCount: number,
  onFinish: (stats: Stats) => void,
): () => void {
  const stats = Stats.empty();
  const workers: BlackjackWorker[] = [];

  for (let i = 0; i < rules.threadCount; i += 1) {
    const worker: BlackjackWorker = new Worker(new URL("../engine/worker", import.meta.url), {
      type: "module",
    });

    worker.onmessage = (ev) => {
      stats.add(Stats.fromObject(ev.data.stats));
      if (stats.gameCount() >= minGameCount) {
        onFinish(stats);
      }
    };

    worker.postMessage({
      rules: rules.toObject(),
      strategy: strategy.toObject(),
    });

    workers.push(worker);
  }

  return () => {
    for (const worker of workers) {
      worker.terminate();
    }
  };
}

export function Optimizer(props: { rules: Rules; base: EditableStrategy }) {
  const [minBaseGameCount, setMinBaseGameCount] = useState(100_000_000);
  const [minTestGameCount, setMinTestGameCount] = useState(50_000_000);
  const [includeHard, setIncludeHard] = useState(true);
  const [includeSoft, setIncludeSoft] = useState(true);
  const [includePair, setIncludePair] = useState(true);

  const [running, setRunning] = useState(false);

  const [jobIndex, setJobIndex] = useState(0);
  const [jobs, setJobs] = useState<Job[] | null>(null);
  const [results, setResults] = useState<Record<number, string> | null>(null);
  const [baseHouseEdge, setBaseHouseEdge] = useState<number | null>(null);

  /** Queue new jobs when running state changes to true, remove the jobs if changed to false. */
  useEffect(() => {
    if (running) {
      let completeBase: CompleteStrategy;
      try {
        completeBase = props.base.toComplete();
      } catch (e) {
        console.error(e);
        toast.error("Base strategy is not valid");
        setRunning(false);
        return;
      }

      const jobs = accumulateJobs(completeBase, includeHard, includeSoft, includePair, true);
      if (jobs.length === 0) {
        toast.error("No possible optimizations with current settings");
        setRunning(false);
        return;
      }

      setJobIndex(0);
      setJobs(jobs);
      setResults({});
    } else {
      setJobs(null);
      setBaseHouseEdge(null);
    }
  }, [running, props.base, includeHard, includeSoft, includePair]);

  /** Handle jobs until they are all finished. */
  useEffect(() => {
    if (jobs === null) {
      return;
    }

    if (jobIndex === jobs.length) {
      setRunning(false);
      return;
    }

    let completeBase: CompleteStrategy;
    try {
      completeBase = props.base.toComplete();
    } catch (e) {
      console.error(e);
      toast.error("Base strategy is not valid");
      setRunning(false);
      return;
    }

    if (baseHouseEdge === null) {
      return runSimulation(props.rules, completeBase, minBaseGameCount, (stats) => {
        const houseEdge = stats.houseEdge(props.rules.blackjackPayout);
        setBaseHouseEdge(houseEdge);
      });
    }

    const job = jobs[jobIndex];
    return runSimulation(props.rules, job.strategy, minTestGameCount, (stats) => {
      /** Jump to the next job. */
      setJobIndex(jobIndex + 1);

      /** If there is an improvement, register it. */
      const houseEdge = stats.houseEdge(props.rules.blackjackPayout);
      const improvement = baseHouseEdge - houseEdge;
      if (improvement > 0) {
        const result = `Changing ${job.changeId} gives ${improvement.toLocaleString()}% house edge improvement`;
        toast.success(`Optimization found: ${result}`);
        setResults((prev) => {
          if (prev === null) {
            return { [jobIndex]: result };
          } else if (jobIndex in prev) {
            return prev;
          } else {
            return { ...prev, [jobIndex]: result };
          }
        });
      }
    });
  }, [jobIndex, jobs, baseHouseEdge, minBaseGameCount, minTestGameCount, props.base, props.rules]);

  return (
    <>
      <h2>Optimizer</h2>

      <p className="my-2">
        This section allows you to automatically optimize your strategy given your house rules. This
        is done by tweaking each and every cell in your strategy one by one (randomly but
        exhaustively), and running a test simulation to see if the change improves the house edge.
        The test simulation will run for the given number of games, so make sure to set it high
        enough to get a reliable result. Higher values do of course take significantly more time
        though. Changes that improve the house edge will be displayed below. If no changes showed
        up, that means you likely already have the optimal strategy for your house. Do not forget to
        test and verify the new changes above.
      </p>

      <div className="flex flex-wrap gap-2">
        <BorderedBox>
          <h3>Settings</h3>
          <table className="my-2 w-full border-separate border-spacing-1">
            <tbody>
              <tr>
                <td>1. Minimum game count for the base simulation</td>
                <td>
                  <input
                    type="number"
                    min={10_000_000}
                    step={10_000_000}
                    value={minBaseGameCount}
                    className="w-32"
                    onChange={(e) => {
                      setMinBaseGameCount(parseInt(e.target.value));
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>2. Minimum game count per test simulation</td>
                <td>
                  <input
                    type="number"
                    min={10_000_000}
                    step={10_000_000}
                    value={minTestGameCount}
                    className="w-32"
                    onChange={(e) => {
                      setMinTestGameCount(parseInt(e.target.value));
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>3. Optimize hard strategy</td>
                <td>
                  <input
                    type="checkbox"
                    checked={includeHard}
                    onChange={(e) => {
                      setIncludeHard(e.target.checked);
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>4. Optimize soft strategy</td>
                <td>
                  <input
                    type="checkbox"
                    checked={includeSoft}
                    onChange={(e) => {
                      setIncludeSoft(e.target.checked);
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>5. Optimize pair strategy</td>
                <td>
                  <input
                    type="checkbox"
                    checked={includePair}
                    onChange={(e) => {
                      setIncludePair(e.target.checked);
                    }}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <Button
            onClick={() => {
              setRunning((prev) => !prev);
            }}
            fullWidth={true}
          >
            {jobs === null
              ? results !== null
                ? "Restart"
                : "Start"
              : baseHouseEdge === null
                ? "Stop (calculating base house edge...)"
                : `Stop (${(jobs.length - jobIndex).toString()} changes remaining...)`}
          </Button>
        </BorderedBox>
        <BorderedBox>
          <h3>Results</h3>
          {results === null
            ? "-"
            : Object.values(results).length === 0
              ? "..."
              : Object.values(results).map((result, i) => <p key={i}>{result}</p>)}
        </BorderedBox>
      </div>
    </>
  );
}
