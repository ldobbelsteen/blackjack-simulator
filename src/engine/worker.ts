import { Rules } from "./rules";
import { Simulation } from "./simulation";
import type { Stats } from "./stats";
import { CompleteStrategy } from "./strategy";

/** The data type of messages this worker assumes to receive. */
interface BlackjackWorkerRx {
  rules: ReturnType<Rules["toObject"]>;
  strategy: ReturnType<CompleteStrategy["toObject"]>;
}

/** The data type of messages this worker sends back. */
interface BlackjackWorkerTx {
  stats: ReturnType<Stats["toObject"]>;
}

/** Static typings for this worker for the main thread side. */
export interface BlackjackWorker extends Worker {
  onmessage:
    | ((this: BlackjackWorker, ev: MessageEvent<BlackjackWorkerTx>) => void)
    | null;
  postMessage(config: BlackjackWorkerRx): void;
}

/** Static typings for this worker for within the worker. */
interface BlackjackWorkerScope extends DedicatedWorkerGlobalScope {
  onmessage:
    | ((
        this: BlackjackWorkerScope,
        ev: MessageEvent<BlackjackWorkerRx>,
      ) => void)
    | null;
  postMessage(message: BlackjackWorkerTx): void;
}

declare let self: BlackjackWorkerScope;

self.onmessage = (ev) => {
  const rules = Rules.fromObject(ev.data.rules);
  const strategy = CompleteStrategy.fromObject(ev.data.strategy);
  const simulation = new Simulation(rules, strategy);

  for (;;) {
    const stats = simulation.run(100_000);
    const msg: BlackjackWorkerTx = { stats: stats.toObject() };
    self.postMessage(msg);
  }
};
