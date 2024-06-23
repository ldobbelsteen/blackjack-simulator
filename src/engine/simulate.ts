import { Card, Deck } from "./deck";
import { Hand, HandType } from "./hand";
import { Action } from "./move";
import { type Rules, AllowDouble, AllowSurrender } from "./rules";
import { EntropySource } from "./shuffle";
import { Stats } from "./stats";
import { type CompleteStrategy } from "./strategy";

export class Simulation {
  private rules: Rules;
  private strategy: CompleteStrategy;
  private deck: Deck;

  constructor(rules: Rules, strategy: CompleteStrategy, entropySource: EntropySource = "crypto") {
    this.rules = rules;
    this.strategy = strategy;
    this.deck = new Deck(rules.deckCount, rules.maxDeckPenetration, entropySource);
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

      /** Let the dealer play their turn. */
      while (
        dealerHand.value < 17 ||
        (this.rules.dealerHitsSoft17 &&
          dealerHand.value === 17 &&
          dealerHand.type() == HandType.Soft)
      ) {
        dealerHand.add(this.deck.takeCard());
      }

      /** Determine winner for each of the player's hands against the dealer's hand. */
      playerFinalHands.forEach((playerHand) => {
        if (playerHand.value > 21) {
          if (playerHand.isDoubled) {
            stats.lossesAfterDoubling += 1;
          } else {
            stats.losses += 1;
          }
        } else if (dealerHand.value > 21) {
          if (playerHand.isDoubled) {
            stats.winsAfterDoubling += 1;
          } else {
            stats.wins += 1;
          }
        } else if (dealerHand.value === playerHand.value) {
          if (playerHand.isDoubled) {
            stats.pushesAfterDoubling += 1;
          } else {
            stats.pushes += 1;
          }
        } else if (dealerHand.value > playerHand.value) {
          if (playerHand.isDoubled) {
            stats.lossesAfterDoubling += 1;
          } else {
            stats.losses += 1;
          }
        } else if (dealerHand.value < playerHand.value) {
          if (playerHand.isDoubled) {
            stats.winsAfterDoubling += 1;
          } else {
            stats.wins += 1;
          }
        }
      });
    }

    return stats;
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
          this.rules.allowSurrender !== AllowSurrender.Never && handIsUntouched && splitCount === 0
        );
    }
  }

  /** Get the action a player takes based on the circumstances and its strategy. */
  private determineAction(
    handType: HandType,
    handValue: number,
    handIsUntouched: boolean,
    dealerUpcard: Card,
    splitCount: number,
  ): Action {
    switch (handType) {
      case HandType.Pair: {
        const pairMove = this.strategy.pairMove(handValue, dealerUpcard);
        if (
          pairMove.primary !== null &&
          this.actionIsAvailable(pairMove.primary, handValue, handIsUntouched, splitCount)
        ) {
          return pairMove.primary;
        } else if (
          pairMove.secondary !== null &&
          this.actionIsAvailable(pairMove.secondary, handValue, handIsUntouched, splitCount)
        ) {
          return pairMove.secondary;
        } else {
          return this.determineAction(
            HandType.Hard,
            handValue,
            handIsUntouched,
            dealerUpcard,
            splitCount,
          );
        }
      }
      case HandType.Soft: {
        const softMove = this.strategy.softMove(handValue, dealerUpcard);
        if (
          softMove.primary !== null &&
          this.actionIsAvailable(softMove.primary, handValue, handIsUntouched, splitCount)
        ) {
          return softMove.primary;
        } else if (
          softMove.secondary !== null &&
          this.actionIsAvailable(softMove.secondary, handValue, handIsUntouched, splitCount)
        ) {
          return softMove.secondary;
        } else {
          throw new Error(`invalid move: ${softMove.toString()}`);
        }
      }
      case HandType.Hard: {
        const hardMove = this.strategy.hardMove(handValue, dealerUpcard);
        if (
          hardMove.primary !== null &&
          this.actionIsAvailable(hardMove.primary, handValue, handIsUntouched, splitCount)
        ) {
          return hardMove.primary;
        } else if (
          hardMove.secondary !== null &&
          this.actionIsAvailable(hardMove.secondary, handValue, handIsUntouched, splitCount)
        ) {
          return hardMove.secondary;
        } else {
          throw new Error(`invalid move: ${hardMove.toString()}`);
        }
      }
    }
  }

  /**
   * Execute a player's turn on a hand given the dealer's hand. Returns the final
   * hand (or multiple in case of splits). The stats are kept up-to-date in case
   * of splits and surrenders.
   */
  private playerTurn(playerHand: Hand, dealerHand: Hand, stats: Stats): Hand[] {
    const finalHands: Hand[] = [];
    this.playerTurnRec(playerHand, dealerHand, stats, 0, finalHands);
    return finalHands;
  }

  /**
   * Recursive function to execute a player's turn on a hand (see main function).
   * Returns the number of (new) splits that occurred.
   */
  private playerTurnRec(
    playerHand: Hand,
    dealerHand: Hand,
    stats: Stats,
    prevSplitCount: number,
    finalHands: Hand[],
  ): number {
    /** Loop until the player busts (the while guard) or otherwise breaks the loop. */
    while (playerHand.value < 21) {
      /** Determine the action to execute and execute it. */
      switch (
        this.determineAction(
          playerHand.type(),
          playerHand.value,
          playerHand.isUntouched,
          dealerHand.firstCard,
          prevSplitCount,
        )
      ) {
        case Action.Hit:
          playerHand.add(this.deck.takeCard());
          break;
        case Action.Stand:
          finalHands.push(playerHand);
          return 0;
        case Action.Split: {
          stats.splits += 1;
          const splitCard = playerHand.firstCard;
          const hand1 = new Hand(splitCard, this.deck.takeCard());
          const splitCount1 = this.playerTurnRec(
            hand1,
            dealerHand,
            stats,
            prevSplitCount + 1,
            finalHands,
          );
          const hand2 = new Hand(splitCard, this.deck.takeCard());
          const splitCount2 = this.playerTurnRec(
            hand2,
            dealerHand,
            stats,
            prevSplitCount + 1 + splitCount1,
            finalHands,
          );
          return splitCount1 + splitCount2;
        }
        case Action.Double:
          playerHand.add(this.deck.takeCard());
          playerHand.isDoubled = true;
          finalHands.push(playerHand);
          return 0;
        case Action.Surrender:
          if (this.rules.allowSurrender === AllowSurrender.Early || !dealerHand.isBlackjack()) {
            stats.surrenders += 1;
          } else {
            stats.losses += 1;
          }
          return 0;
      }
    }

    /** Add the hand to the final hands */
    finalHands.push(playerHand);

    return 0;
  }
}
