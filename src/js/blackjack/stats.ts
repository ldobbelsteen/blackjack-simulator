export class Stats {
  games: number;
  wins: number;
  pushes: number;
  losses: number;
  blackjacks: number;
  winsAfterDoubling: number;
  pushesAfterDoubling: number;
  lossesAfterDoubling: number;
  surrenders: number;
  splits: number;

  constructor(
    games: number,
    wins: number,
    pushes: number,
    losses: number,
    blackjacks: number,
    winsAfterDoubling: number,
    pushesAfterDoubling: number,
    lossesAfterDoubling: number,
    surrenders: number,
    splits: number,
  ) {
    this.games = games;
    this.wins = wins;
    this.pushes = pushes;
    this.losses = losses;
    this.blackjacks = blackjacks;
    this.winsAfterDoubling = winsAfterDoubling;
    this.pushesAfterDoubling = pushesAfterDoubling;
    this.lossesAfterDoubling = lossesAfterDoubling;
    this.surrenders = surrenders;
    this.splits = splits;
  }

  static empty(): Stats {
    return new Stats(0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }

  add(other: Stats) {
    this.games += other.games;
    this.wins += other.wins;
    this.pushes += other.pushes;
    this.losses += other.losses;
    this.blackjacks += other.blackjacks;
    this.winsAfterDoubling += other.winsAfterDoubling;
    this.pushesAfterDoubling += other.pushesAfterDoubling;
    this.lossesAfterDoubling += other.lossesAfterDoubling;
    this.surrenders += other.surrenders;
    this.splits += other.splits;
  }

  balance(blackjackPayout: number): number {
    return (
      this.wins -
      this.losses +
      this.blackjacks * blackjackPayout +
      2 * this.winsAfterDoubling -
      2 * this.lossesAfterDoubling -
      0.5 * this.surrenders
    );
  }

  toObject() {
    return {
      games: this.games,
      wins: this.wins,
      pushes: this.pushes,
      losses: this.losses,
      blackjacks: this.blackjacks,
      winsAfterDoubling: this.winsAfterDoubling,
      pushesAfterDoubling: this.pushesAfterDoubling,
      lossesAfterDoubling: this.lossesAfterDoubling,
      surrenders: this.surrenders,
      splits: this.splits,
    };
  }

  static fromObject(obj: ReturnType<Stats["toObject"]>): Stats {
    return new Stats(
      obj.games,
      obj.wins,
      obj.pushes,
      obj.losses,
      obj.blackjacks,
      obj.winsAfterDoubling,
      obj.pushesAfterDoubling,
      obj.lossesAfterDoubling,
      obj.surrenders,
      obj.splits,
    );
  }

  copy(): Stats {
    return Stats.fromObject(this.toObject());
  }
}
