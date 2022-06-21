import { Action, Move, moveToString } from "./move";

interface Strategy<T> {
  hard: HardTable<T>;
  soft: SoftTable<T>;
  pair: PairTable<T>;
}

export type CompleteStrategy = Strategy<Move>;

export const defaultCompleteStrategy = (): CompleteStrategy => ({
  hard: defaultHardTable,
  soft: defaultSoftTable,
  pair: defaultPairTable,
});

export type MoveWithInput = {
  move: Move | undefined;
  input: string;
};

export type EditableStrategy = Strategy<MoveWithInput>;

export const defaultEditableStrategy = (): EditableStrategy => ({
  hard: defaultHardTable.map((row) =>
    row.map((move) => ({
      move: move,
      input: moveToString(move),
    }))
  ) as HardTable<MoveWithInput>,
  soft: defaultSoftTable.map((row) =>
    row.map((move) => ({
      move: move,
      input: moveToString(move),
    }))
  ) as SoftTable<MoveWithInput>,
  pair: defaultPairTable.map((row) =>
    row.map((move) => ({
      move: move,
      input: moveToString(move),
    }))
  ) as PairTable<MoveWithInput>,
});

export const validateStrategy = (
  strategy: EditableStrategy
): CompleteStrategy | undefined => {
  let isValid = true;
  const complete: CompleteStrategy = {
    hard: strategy.hard.map((row) =>
      row.map((cell) => {
        if (!cell.move) isValid = false;
        return cell.move;
      })
    ) as HardTable<Move>,
    soft: strategy.soft.map((row) =>
      row.map((cell) => {
        if (!cell.move) isValid = false;
        return cell.move;
      })
    ) as SoftTable<Move>,
    pair: strategy.pair.map((row) =>
      row.map((cell) => {
        if (!cell.move) isValid = false;
        return cell.move;
      })
    ) as PairTable<Move>,
  };

  if (isValid) {
    return complete;
  } else {
    return undefined;
  }
};

type HardTable<T> = [
  [T, T, T, T, T, T, T, T, T, T],
  [T, T, T, T, T, T, T, T, T, T],
  [T, T, T, T, T, T, T, T, T, T],
  [T, T, T, T, T, T, T, T, T, T],
  [T, T, T, T, T, T, T, T, T, T],
  [T, T, T, T, T, T, T, T, T, T],
  [T, T, T, T, T, T, T, T, T, T],
  [T, T, T, T, T, T, T, T, T, T],
  [T, T, T, T, T, T, T, T, T, T],
  [T, T, T, T, T, T, T, T, T, T],
  [T, T, T, T, T, T, T, T, T, T],
  [T, T, T, T, T, T, T, T, T, T],
  [T, T, T, T, T, T, T, T, T, T],
  [T, T, T, T, T, T, T, T, T, T],
  [T, T, T, T, T, T, T, T, T, T],
  [T, T, T, T, T, T, T, T, T, T],
  [T, T, T, T, T, T, T, T, T, T]
];

export const getHardMove = (
  table: HardTable<Move>,
  playerValue: number,
  dealerUpcard: number
): Move => table[20 - playerValue][dealerUpcard - 2];

type SoftTable<T> = [
  [T, T, T, T, T, T, T, T, T, T],
  [T, T, T, T, T, T, T, T, T, T],
  [T, T, T, T, T, T, T, T, T, T],
  [T, T, T, T, T, T, T, T, T, T],
  [T, T, T, T, T, T, T, T, T, T],
  [T, T, T, T, T, T, T, T, T, T],
  [T, T, T, T, T, T, T, T, T, T],
  [T, T, T, T, T, T, T, T, T, T],
  [T, T, T, T, T, T, T, T, T, T]
];

export const getSoftMove = (
  table: SoftTable<Move>,
  playerValue: number,
  dealerUpcard: number
): Move => table[20 - playerValue][dealerUpcard - 2];

type PairTable<T> = [
  [T, T, T, T, T, T, T, T, T, T],
  [T, T, T, T, T, T, T, T, T, T],
  [T, T, T, T, T, T, T, T, T, T],
  [T, T, T, T, T, T, T, T, T, T],
  [T, T, T, T, T, T, T, T, T, T],
  [T, T, T, T, T, T, T, T, T, T],
  [T, T, T, T, T, T, T, T, T, T],
  [T, T, T, T, T, T, T, T, T, T],
  [T, T, T, T, T, T, T, T, T, T],
  [T, T, T, T, T, T, T, T, T, T]
];

export const getPairMove = (
  table: PairTable<Move>,
  playerValue: number,
  dealerUpcard: number
): Move => table[(22 - playerValue) / 2][dealerUpcard - 2];

const defaultHardTable: HardTable<Move> = [
  [
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
  ],
  [
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
  ],
  [
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
  ],
  [
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.Surrender, Action.Stand],
  ],
  [
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.Surrender, Action.Hit],
    [Action.Surrender, Action.Hit],
    [Action.Surrender, Action.Hit],
  ],
  [
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.Surrender, Action.Hit],
    [Action.Surrender, Action.Hit],
  ],
  [
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
  ],
  [
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
  ],
  [
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
  ],
  [
    [Action.Double, Action.Hit],
    [Action.Double, Action.Hit],
    [Action.Double, Action.Hit],
    [Action.Double, Action.Hit],
    [Action.Double, Action.Hit],
    [Action.Double, Action.Hit],
    [Action.Double, Action.Hit],
    [Action.Double, Action.Hit],
    [Action.Double, Action.Hit],
    [Action.None, Action.Hit],
  ],
  [
    [Action.Double, Action.Hit],
    [Action.Double, Action.Hit],
    [Action.Double, Action.Hit],
    [Action.Double, Action.Hit],
    [Action.Double, Action.Hit],
    [Action.Double, Action.Hit],
    [Action.Double, Action.Hit],
    [Action.Double, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
  ],
  [
    [Action.None, Action.Hit],
    [Action.Double, Action.Hit],
    [Action.Double, Action.Hit],
    [Action.Double, Action.Hit],
    [Action.Double, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
  ],
  [
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
  ],
  [
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
  ],
  [
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
  ],
  [
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
  ],
  [
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
  ],
];

const defaultSoftTable: SoftTable<Move> = [
  [
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
  ],
  [
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.Double, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
  ],
  [
    [Action.Double, Action.Stand],
    [Action.Double, Action.Stand],
    [Action.Double, Action.Stand],
    [Action.Double, Action.Stand],
    [Action.Double, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
  ],
  [
    [Action.None, Action.Hit],
    [Action.Double, Action.Hit],
    [Action.Double, Action.Hit],
    [Action.Double, Action.Hit],
    [Action.Double, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
  ],
  [
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.Double, Action.Hit],
    [Action.Double, Action.Hit],
    [Action.Double, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
  ],
  [
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.Double, Action.Hit],
    [Action.Double, Action.Hit],
    [Action.Double, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
  ],
  [
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.Double, Action.Hit],
    [Action.Double, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
  ],
  [
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.Double, Action.Hit],
    [Action.Double, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
  ],
  [
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
  ],
];

const defaultPairTable: PairTable<Move> = [
  [
    [Action.None, Action.Split],
    [Action.None, Action.Split],
    [Action.None, Action.Split],
    [Action.None, Action.Split],
    [Action.None, Action.Split],
    [Action.None, Action.Split],
    [Action.None, Action.Split],
    [Action.None, Action.Split],
    [Action.None, Action.Split],
    [Action.None, Action.Split],
  ],
  [
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
  ],
  [
    [Action.None, Action.Split],
    [Action.None, Action.Split],
    [Action.None, Action.Split],
    [Action.None, Action.Split],
    [Action.None, Action.Split],
    [Action.None, Action.Stand],
    [Action.None, Action.Split],
    [Action.None, Action.Split],
    [Action.None, Action.Stand],
    [Action.None, Action.Stand],
  ],
  [
    [Action.None, Action.Split],
    [Action.None, Action.Split],
    [Action.None, Action.Split],
    [Action.None, Action.Split],
    [Action.None, Action.Split],
    [Action.None, Action.Split],
    [Action.None, Action.Split],
    [Action.None, Action.Split],
    [Action.None, Action.Split],
    [Action.Surrender, Action.Split],
  ],
  [
    [Action.None, Action.Split],
    [Action.None, Action.Split],
    [Action.None, Action.Split],
    [Action.None, Action.Split],
    [Action.None, Action.Split],
    [Action.None, Action.Split],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
  ],
  [
    [Action.Split, Action.Hit],
    [Action.None, Action.Split],
    [Action.None, Action.Split],
    [Action.None, Action.Split],
    [Action.None, Action.Split],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
  ],
  [
    [Action.Double, Action.Hit],
    [Action.Double, Action.Hit],
    [Action.Double, Action.Hit],
    [Action.Double, Action.Hit],
    [Action.Double, Action.Hit],
    [Action.Double, Action.Hit],
    [Action.Double, Action.Hit],
    [Action.Double, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
  ],
  [
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.Split, Action.Hit],
    [Action.Split, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
  ],
  [
    [Action.Split, Action.Hit],
    [Action.Split, Action.Hit],
    [Action.None, Action.Split],
    [Action.None, Action.Split],
    [Action.None, Action.Split],
    [Action.None, Action.Split],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
  ],
  [
    [Action.Split, Action.Hit],
    [Action.Split, Action.Hit],
    [Action.None, Action.Split],
    [Action.None, Action.Split],
    [Action.None, Action.Split],
    [Action.None, Action.Split],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
    [Action.None, Action.Hit],
  ],
];
