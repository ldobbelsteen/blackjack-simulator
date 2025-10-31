import { Deck } from "./deck";
import { Hand, HandType } from "./hand";
import { Action } from "./move";
import { AllowDouble, AllowSurrender, type Rules } from "./rules";
import type { EntropySource } from "./shuffler";
import { Stats } from "./stats";
import type { CompleteStrategy } from "./strategy";

export class Simulation {
  private rules: Rules;
  private strategy: CompleteStrategy;
  private deck: Deck;

  constructor(
    rules: Rules,
    strategy: CompleteStrategy,
    entropySource?: EntropySource,
  ) {
    this.rules = rules;
    this.strategy = strategy;
    this.deck = new Deck(
      rules.deckCount,
      rules.maxDeckPenetration,
      entropySource,
    );
  }

  run(count: number): Stats {
    const stats = Stats.empty();

    for (let i = 0; i < count; i += 1) {
      if (this.deck.beyondThreshold()) {
        this.deck.shuffle();
      }

      /** Create hands for the player and the dealer and deal the cards. */
      const playerHand = new Hand(this.deck.takeCard(), this.deck.takeCard());
      const dealerHand = new Hand(this.deck.takeCard(), this.deck.takeCard());

      /** Check for a blackjack, in which case the game is always over. */
      if (playerHand.isBlackjack()) {
        if (dealerHand.isBlackjack()) {
          stats.pushes += 1;
        } else {
          stats.blackjacks += 1;
        }
        continue;
      }

      /** Let the player play their turn and collect their resulting hand(s). */
      const playerFinalHands = this.playerTurn(playerHand, dealerHand, stats);
      if (playerFinalHands === undefined) {
        continue;
      }

      /** Let the dealer play their turn. */
      while (
        dealerHand.value < 17 ||
        (this.rules.dealerHitsSoft17 &&
          dealerHand.value === 17 &&
          dealerHand.type() === HandType.Soft)
      ) {
        dealerHand.add(this.deck.takeCard());
      }

      /** Determine winner between player's hand(s) and the dealer's hand. */
      if (playerFinalHands instanceof Hand) {
        this.determineWinner(playerFinalHands, dealerHand, stats);
      } else {
        for (const playerFinalHand of playerFinalHands) {
          this.determineWinner(playerFinalHand, dealerHand, stats);
        }
      }
    }

    return stats;
  }

  /**
   * Execute a player's turn on a hand given the dealer's hand. Returns the final
   * hand (or multiple in case of splits).
   */
  private playerTurn(
    playerHand: Hand,
    dealerHand: Hand,
    stats: Stats,
  ): Hand[] | Hand | undefined {
    let result: Hand[] | Hand | undefined;
    this.playerTurnRec(playerHand, dealerHand, stats, 0, (finalHand: Hand) => {
      if (result === undefined) {
        result = finalHand;
      } else if (result instanceof Hand) {
        result = [result, finalHand];
      } else {
        result.push(finalHand);
      }
    });
    return result;
  }

  /**
   * Recursive function to execute a player's turn on a hand (see main function).
   * Returns the number of (new) splits that occurred and outputs final hands
   * to the output function.
   */
  private playerTurnRec(
    playerHand: Hand,
    dealerHand: Hand,
    stats: Stats,
    prevSplitCount: number,
    outputHand: (h: Hand) => void,
  ): number {
    /** Loop until the player busts. */
    while (playerHand.value < 21) {
      /** Determine the action to take and execute it. */
      switch (this.determineAction(playerHand, dealerHand, prevSplitCount)) {
        case Action.Hit:
          playerHand.add(this.deck.takeCard());
          break;
        case Action.Stand:
          outputHand(playerHand);
          return 0;
        case Action.Split: {
          stats.splits += 1;

          const leftHand = new Hand(playerHand.firstCard, this.deck.takeCard());
          const leftSplitCount = this.playerTurnRec(
            leftHand,
            dealerHand,
            stats,
            prevSplitCount + 1,
            outputHand,
          );

          const rightHand = new Hand(
            playerHand.firstCard,
            this.deck.takeCard(),
          );
          const rightSplitCount = this.playerTurnRec(
            rightHand,
            dealerHand,
            stats,
            prevSplitCount + 1 + leftSplitCount,
            outputHand,
          );

          return leftSplitCount + rightSplitCount + 1;
        }
        case Action.Double:
          playerHand.doubleDown(this.deck.takeCard());
          outputHand(playerHand);
          return 0;
        case Action.Surrender:
          if (
            this.rules.allowSurrender === AllowSurrender.Early ||
            !dealerHand.isBlackjack()
          ) {
            stats.surrenders += 1;
          } else {
            stats.losses += 1;
          }
          return 0;
      }
    }

    outputHand(playerHand);
    return 0;
  }

  /** Get the action a player takes based on the circumstances and its strategy. */
  private determineAction(
    playerHand: Hand,
    dealerHand: Hand,
    splitCount: number,
  ): Action {
    switch (playerHand.type()) {
      case HandType.Pair: {
        const pairMove = this.strategy.pairMove(
          playerHand.value,
          dealerHand.firstCard,
        );
        if (
          pairMove.primary !== null &&
          this.actionIsAvailable(
            pairMove.primary,
            playerHand.value,
            playerHand.isUntouched,
            splitCount,
          )
        ) {
          return pairMove.primary;
        } else if (
          pairMove.secondary !== null &&
          this.actionIsAvailable(
            pairMove.secondary,
            playerHand.value,
            playerHand.isUntouched,
            splitCount,
          )
        ) {
          return pairMove.secondary;
        } else {
          /** If neither is possible, fall back to other strategies. */
          playerHand.downgradePair();
          return this.determineAction(playerHand, dealerHand, splitCount);
        }
      }
      case HandType.Soft: {
        const softMove = this.strategy.softMove(
          playerHand.value,
          dealerHand.firstCard,
        );
        if (
          softMove.primary !== null &&
          this.actionIsAvailable(
            softMove.primary,
            playerHand.value,
            playerHand.isUntouched,
            splitCount,
          )
        ) {
          return softMove.primary;
        } else if (
          softMove.secondary !== null &&
          this.actionIsAvailable(
            softMove.secondary,
            playerHand.value,
            playerHand.isUntouched,
            splitCount,
          )
        ) {
          return softMove.secondary;
        } else {
          throw new Error(`invalid soft move: ${softMove.toString()}`);
        }
      }
      case HandType.Hard: {
        const hardMove = this.strategy.hardMove(
          playerHand.value,
          dealerHand.firstCard,
        );
        if (
          hardMove.primary !== null &&
          this.actionIsAvailable(
            hardMove.primary,
            playerHand.value,
            playerHand.isUntouched,
            splitCount,
          )
        ) {
          return hardMove.primary;
        } else if (
          hardMove.secondary !== null &&
          this.actionIsAvailable(
            hardMove.secondary,
            playerHand.value,
            playerHand.isUntouched,
            splitCount,
          )
        ) {
          return hardMove.secondary;
        } else {
          throw new Error(`invalid hard move: ${hardMove.toString()}`);
        }
      }
    }
  }

  /** Check whether an action is currently available given the circumstances. */
  private actionIsAvailable(
    action: Action,
    handValue: number,
    handIsUntouched: boolean,
    splitCount: number,
  ): boolean {
    switch (action) {
      case Action.Hit:
        return true;
      case Action.Stand:
        return true;
      case Action.Split:
        return splitCount < this.rules.maxSplits;
      case Action.Double:
        return (
          handIsUntouched &&
          (this.rules.allowDoubleAfterSplit || splitCount === 0) &&
          (this.rules.allowDouble === AllowDouble.Always ||
            (this.rules.allowDouble === AllowDouble.NineTenOrEleven &&
              (handValue === 9 || handValue === 10 || handValue === 11)))
        );
      case Action.Surrender:
        return (
          this.rules.allowSurrender !== AllowSurrender.Never &&
          handIsUntouched &&
          splitCount === 0
        );
    }
  }

  /**
   * Determine the winner of a game based on the player's hand and the dealer's hand.
   * Update the stats accordingly.
   */
  private determineWinner(playerHand: Hand, dealerHand: Hand, stats: Stats) {
    if (playerHand.value > 21) {
      if (playerHand.isDoubledDown) {
        stats.lossesAfterDoubling += 1;
      } else {
        stats.losses += 1;
      }
    } else if (dealerHand.value > 21) {
      if (playerHand.isDoubledDown) {
        stats.winsAfterDoubling += 1;
      } else {
        stats.wins += 1;
      }
    } else if (dealerHand.value === playerHand.value) {
      if (playerHand.isDoubledDown) {
        stats.pushesAfterDoubling += 1;
      } else {
        stats.pushes += 1;
      }
    } else if (dealerHand.value > playerHand.value) {
      if (playerHand.isDoubledDown) {
        stats.lossesAfterDoubling += 1;
      } else {
        stats.losses += 1;
      }
    } else {
      if (playerHand.isDoubledDown) {
        stats.winsAfterDoubling += 1;
      } else {
        stats.wins += 1;
      }
    }
  }
}
