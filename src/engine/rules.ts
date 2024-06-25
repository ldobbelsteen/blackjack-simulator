export enum AllowSurrender {
  Late,
  Early,
  Never,
}

export enum AllowDouble {
  Always,
  NineTenOrEleven,
  Never,
}

export class Rules {
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

  constructor(
    allowSurrender: AllowSurrender,
    allowDouble: AllowDouble,
    maxSplits: number,
    allowHittingSplitAces: boolean,
    allowResplittingAces: boolean,
    allowDoubleAfterSplit: boolean,
    dealerHitsSoft17: boolean,
    blackjackPayout: number,
    maxDeckPenetration: number,
    deckCount: number,
    threadCount: number,
  ) {
    this.allowSurrender = allowSurrender;
    this.allowDouble = allowDouble;
    this.maxSplits = maxSplits;
    this.allowHittingSplitAces = allowHittingSplitAces;
    this.allowResplittingAces = allowResplittingAces;
    this.allowDoubleAfterSplit = allowDoubleAfterSplit;
    this.dealerHitsSoft17 = dealerHitsSoft17;
    this.blackjackPayout = blackjackPayout;
    this.maxDeckPenetration = maxDeckPenetration;
    this.deckCount = deckCount;
    this.threadCount = threadCount;
  }

  static default(): Rules {
    return new Rules(
      AllowSurrender.Late,
      AllowDouble.Always,
      3,
      false,
      false,
      true,
      true,
      1.5,
      75,
      8,
      Math.ceil(window.navigator.hardwareConcurrency / 2),
    );
  }

  toObject() {
    return {
      allowSurrender: this.allowSurrender,
      allowDouble: this.allowDouble,
      maxSplits: this.maxSplits,
      allowHittingSplitAces: this.allowHittingSplitAces,
      allowResplittingAces: this.allowResplittingAces,
      allowDoubleAfterSplit: this.allowDoubleAfterSplit,
      dealerHitsSoft17: this.dealerHitsSoft17,
      blackjackPayout: this.blackjackPayout,
      maxDeckPenetration: this.maxDeckPenetration,
      deckCount: this.deckCount,
      threadCount: this.threadCount,
    };
  }

  static fromObject(obj: ReturnType<Rules["toObject"]>): Rules {
    return new Rules(
      obj.allowSurrender,
      obj.allowDouble,
      obj.maxSplits,
      obj.allowHittingSplitAces,
      obj.allowResplittingAces,
      obj.allowDoubleAfterSplit,
      obj.dealerHitsSoft17,
      obj.blackjackPayout,
      obj.maxDeckPenetration,
      obj.deckCount,
      obj.threadCount,
    );
  }

  copy(): Rules {
    return Rules.fromObject(this.toObject());
  }
}
