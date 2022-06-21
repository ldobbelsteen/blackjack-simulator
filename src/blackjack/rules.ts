export enum AllowSurrender {
  Never,
  Early,
  Late,
}

export enum AllowDouble {
  Never,
  Restricted,
  Always,
}

export interface Rules {
  allowSurrender: AllowSurrender;
  allowDouble: AllowDouble;
  maxSplits: number;
  allowHittingSplitAces: boolean;
  allowResplittingAces: boolean;
  allowDoubleAfterSplit: boolean;
  dealerHitsSoft17: boolean;
  blackjackPayout: number;
  maxDeckPenetration: number;
  deckCount: number;
  threadCount: number;
}

export const defaultRules = (): Rules => ({
  allowSurrender: AllowSurrender.Never,
  allowDouble: AllowDouble.Always,
  maxSplits: 3,
  allowHittingSplitAces: false,
  allowResplittingAces: false,
  allowDoubleAfterSplit: true,
  dealerHitsSoft17: true,
  blackjackPayout: 1.5,
  maxDeckPenetration: 0.75,
  deckCount: 6,
  threadCount: window.navigator.hardwareConcurrency,
});
