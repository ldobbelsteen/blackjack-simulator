export interface Stats {
  wins: number;
  pushes: number;
  losses: number;
  blackjacks: number;
  winsAfterDoubling: number;
  pushesAfterDoubling: number;
  lossesAfterDoubling: number;
  surrenders: number;
  splits: number;
}

export const emptyStats = (): Stats => ({
  wins: 0,
  pushes: 0,
  losses: 0,
  blackjacks: 0,
  winsAfterDoubling: 0,
  pushesAfterDoubling: 0,
  lossesAfterDoubling: 0,
  surrenders: 0,
  splits: 0,
});

export const addStats = (stats: Stats, addition: Stats): Stats => {
  stats.wins += addition.wins;
  stats.pushes += addition.pushes;
  stats.losses += addition.losses;
  stats.blackjacks += addition.blackjacks;
  stats.winsAfterDoubling += addition.winsAfterDoubling;
  stats.pushesAfterDoubling += addition.pushesAfterDoubling;
  stats.lossesAfterDoubling += addition.lossesAfterDoubling;
  stats.surrenders += addition.surrenders;
  stats.splits += addition.splits;
  return stats;
};

export const extractGameCount = (stats: Stats) =>
  stats.wins +
  stats.pushes +
  stats.losses +
  stats.blackjacks +
  stats.winsAfterDoubling +
  stats.lossesAfterDoubling +
  stats.pushesAfterDoubling +
  stats.surrenders +
  stats.splits;

export const extractBalance = (stats: Stats, blackjackPayout: number) =>
  stats.wins -
  stats.losses +
  stats.blackjacks * blackjackPayout +
  2 * stats.winsAfterDoubling -
  2 * stats.lossesAfterDoubling -
  0.5 * stats.surrenders;
