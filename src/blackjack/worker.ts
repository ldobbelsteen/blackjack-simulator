import { Rules } from "./rules";
import { simulate } from "./simulate";
import { Stats } from "./stats";
import { CompleteStrategy } from "./strategy";

/** The data type of messages this worker assumes to receive */
interface BlackjackWorkerRx {
  rules: Rules;
  strategy: CompleteStrategy;
}

/** The data type of messages this worker sends back */
interface BlackjackWorkerTx {
  stats: Stats;
}

/** Static typings for this worker for the main thread side */
export interface BlackjackWorker extends Worker {
  onmessage:
    | ((this: BlackjackWorker, ev: MessageEvent<BlackjackWorkerTx>) => void)
    | null;
  postMessage(config: BlackjackWorkerRx): void;
}

/** Static typings for this worker for within the worker */
interface BlackjackWorkerScope extends DedicatedWorkerGlobalScope {
  onmessage:
    | ((
        this: BlackjackWorkerScope,
        ev: MessageEvent<BlackjackWorkerRx>
      ) => void)
    | null;
  postMessage(message: BlackjackWorkerTx): void;
}

declare let self: BlackjackWorkerScope;
self.onmessage = (ev) => {
  simulate(ev.data.rules, ev.data.strategy, (stats) =>
    self.postMessage({ stats })
  );
};
