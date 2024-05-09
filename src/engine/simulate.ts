import { Deck } from "./deck";
import { Hand, HandType } from "./hand";
import { Action } from "./move";
import { type Rules, AllowDouble, AllowSurrender } from "./rules";
import { Stats } from "./stats";
import { type CompleteStrategy } from "./strategy";

export class Simulation {
  private rules: Rules;
  private strategy: CompleteStrategy;
  private deck: Deck;

  constructor(rules: Rules, strategy: CompleteStrategy) {
    this.rules = rules;
    this.strategy = strategy;
    this.deck = new Deck(rules.deckCount, rules.maxDeckPenetration);
  }

  run(count: number): Stats {
    const stats = Stats.empty();

    for (let i = 0; i < count; i += 1) {
      if (this.deck.beyondThreshold()) {
        this.deck.shuffle();
      }

      /** Create hands for the player and the dealer. */
      const playerHand = new Hand(this.deck.takeCard(), this.deck.takeCard());
      const dealerHand = new Hand(this.deck.takeCard(), this.deck.takeCard());

      /** Check for blackjacks. */
      const dealerBlackjack = dealerHand.value === 21;
      const playerBlackjack = playerHand.value === 21;
      if (playerBlackjack) {
        if (dealerBlackjack) {
          stats.pushes += 1;
        } else {
          stats.blackjacks += 1;
        }
        continue;
      }

      let splitCount = 0;
      const playerFinalHands: Hand[] = [];

      /** Function for the player's turn that recurses when splitting. */
      const playerTurn = (h: Hand) => {
        /** Check whether an action is currently available given the circumstances. */
        const actionIsAvailable = (a: Action): boolean => {
          switch (a) {
            case Action.Hit:
              return true;
            case Action.Stand:
              return true;
            case Action.Split:
              return splitCount < this.rules.maxSplits;
            case Action.Double:
              return (
                h.isUntouched &&
                (this.rules.allowDoubleAfterSplit || splitCount === 0) &&
                (this.rules.allowDouble === AllowDouble.Always ||
                  (this.rules.allowDouble === AllowDouble.NineTenOrEleven &&
                    (h.value === 9 || h.value === 10 || h.value === 11)))
              );
            case Action.Surrender:
              return (
                this.rules.allowSurrender !== AllowSurrender.Never &&
                h.isUntouched &&
                splitCount === 0
              );
          }
        };

        /** Get the action a player takes based on the circumstances and its strategy. */
        const determineAction = (type: HandType): Action => {
          switch (type) {
            case HandType.Pair: {
              const pm = this.strategy.pairMove(h.value, dealerHand.firstCard);
              if (pm.primary !== null && actionIsAvailable(pm.primary)) {
                return pm.primary;
              } else if (pm.secondary !== null && actionIsAvailable(pm.secondary)) {
                return pm.secondary;
              } else {
                return determineAction(HandType.Hard);
              }
            }
            case HandType.Soft: {
              const sm = this.strategy.softMove(h.value, dealerHand.firstCard);
              if (sm.primary !== null && actionIsAvailable(sm.primary)) {
                return sm.primary;
              } else if (sm.secondary !== null && actionIsAvailable(sm.secondary)) {
                return sm.secondary;
              } else {
                throw new Error(`no valid move for hand: ${h.toString()}`);
              }
            }
            case HandType.Hard: {
              const hm = this.strategy.hardMove(h.value, dealerHand.firstCard);
              if (hm.primary !== null && actionIsAvailable(hm.primary)) {
                return hm.primary;
              } else if (hm.secondary !== null && actionIsAvailable(hm.secondary)) {
                return hm.secondary;
              } else {
                throw new Error(`no valid move for hand: ${h.toString()}`);
              }
            }
          }
        };

        /** Loop until the player busts (the while guard) or otherwise breaks the loop. */
        while (h.value < 21) {
          /** Determine the action to execute and execute it. */
          switch (determineAction(h.type())) {
            case Action.Hit:
              h.add(this.deck.takeCard());
              break;
            case Action.Stand:
              playerFinalHands.push(h);
              return;
            case Action.Split: {
              stats.splits += 1;
              splitCount += 1;
              const splitCard = h.firstCard;
              const hand1 = new Hand(splitCard, this.deck.takeCard());
              playerTurn(hand1);
              const hand2 = new Hand(splitCard, this.deck.takeCard());
              playerTurn(hand2);
              return;
            }
            case Action.Double:
              h.add(this.deck.takeCard());
              h.isDoubled = true;
              playerFinalHands.push(h);
              return;
            case Action.Surrender:
              if (this.rules.allowSurrender === AllowSurrender.Early || !dealerBlackjack) {
                stats.surrenders += 1;
              } else {
                stats.losses += 1;
              }
              return;
          }
        }

        /** Add the hand to the final hands */
        playerFinalHands.push(h);
      };

      /** Let the player play their turn. */
      playerTurn(playerHand);

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
}
