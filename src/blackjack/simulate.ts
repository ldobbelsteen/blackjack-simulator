import { Deck } from "./deck";
import { Hand } from "./hand";
import { Action } from "./move";
import { Rules, AllowDouble, AllowSurrender } from "./rules";
import { emptyStats, Stats } from "./stats";
import {
  CompleteStrategy,
  getHardMove,
  getPairMove,
  getSoftMove,
} from "./strategy";

export const simulate = (
  rules: Rules,
  strategy: CompleteStrategy,
  output: (stats: Stats) => void
) => {
  const deck = new Deck(rules.deckCount, rules.maxDeckPenetration);

  for (;;) {
    const stats = emptyStats();

    for (let i = 0; i < 50000; i++) {
      if (deck.beyondThreshold()) {
        deck.shuffle();
      }

      /** Create hands for the player and the dealer */
      const playerHand = new Hand(deck.takeCard(), deck.takeCard());
      const dealerHand = new Hand(deck.takeCard(), deck.takeCard());

      /** Check for blackjacks */
      const dealerBlackjack = dealerHand.value === 21;
      const playerBlackjack = playerHand.value === 21;
      if (playerBlackjack) {
        if (dealerBlackjack) {
          stats.pushes++;
        } else {
          stats.blackjacks++;
        }
        continue;
      }

      /** Function for the player's turn that recurses when splitting */
      let splitCount = 0;
      const playerFinalHands: Hand[] = [];
      const playerTurn = (hand: Hand) => {
        /** Loop until the player is satisfied, has busted, or returns otherwise */
        while (hand.value < 21) {
          /** Determine move from strategy */
          const move =
            hand.isPair() && splitCount < rules.maxSplits
              ? getPairMove(strategy.pair, hand.value, dealerHand.firstCard)
              : hand.isSoft()
              ? getSoftMove(strategy.soft, hand.value, dealerHand.firstCard)
              : getHardMove(strategy.hard, hand.value, dealerHand.firstCard);

          /** Determine the act to execute based on availability of acts */
          let act: Action;
          switch (move[0]) {
            case Action.Double: {
              const doubleAvailable =
                hand.isUntouched &&
                (rules.allowDoubleAfterSplit || splitCount === 0) &&
                (rules.allowDouble === AllowDouble.Always ||
                  (rules.allowDouble === AllowDouble.Restricted &&
                    (hand.value === 9 ||
                      hand.value === 10 ||
                      hand.value === 11)));
              if (doubleAvailable) {
                act = move[0];
              } else {
                act = move[1];
              }
              break;
            }
            case Action.Surrender: {
              const surrenderAvailable =
                (rules.allowSurrender === AllowSurrender.Early ||
                  rules.allowSurrender === AllowSurrender.Late) &&
                hand.isUntouched &&
                splitCount === 0;
              if (surrenderAvailable) {
                act = move[0];
              } else {
                act = move[1];
              }
              break;
            }
            case Action.Split:
              if (rules.allowDoubleAfterSplit) {
                act = move[0];
              } else {
                act = move[1];
              }
              break;
            case Action.None:
              act = move[1];
          }

          /** Execute the selected act */
          switch (act) {
            case Action.Hit:
              hand.addCard(deck.takeCard());
              break;
            case Action.Stand:
              playerFinalHands.push(hand);
              return;
            case Action.Split: {
              stats.splits++;
              splitCount++;
              const splitCard = hand.firstCard;
              const hand1 = new Hand(splitCard, deck.takeCard());
              playerTurn(hand1);
              const hand2 = new Hand(splitCard, deck.takeCard());
              playerTurn(hand2);
              return;
            }
            case Action.Double:
              hand.addCard(deck.takeCard());
              hand.isDoubled = true;
              playerFinalHands.push(hand);
              return;
            case Action.Surrender:
              if (
                rules.allowSurrender === AllowSurrender.Early ||
                !dealerBlackjack
              ) {
                stats.surrenders++;
              } else {
                stats.losses++;
              }
              return;
            default:
              throw "Invalid act!";
          }
        }

        /** Add the hand to the final hands */
        playerFinalHands.push(hand);
      };

      /** Let the player play their turn */
      playerTurn(playerHand);

      /** Let the dealer play their turn */
      for (;;) {
        if (dealerHand.value < 17) {
          dealerHand.addCard(deck.takeCard());
          continue;
        }
        if (
          rules.dealerHitsSoft17 &&
          dealerHand.isSoft() &&
          dealerHand.value === 17
        ) {
          dealerHand.addCard(deck.takeCard());
          continue;
        }
        break;
      }

      /** Determine winner for each of the player's hands against the dealer's hand */
      playerFinalHands.forEach((playerHand) => {
        const playerHandValue = playerHand.value;
        const dealerHandValue = dealerHand.value;
        const playerHandDoubled = playerHand.isDoubled;
        if (playerHandValue > 21) {
          if (playerHandDoubled) {
            stats.lossesAfterDoubling++;
          } else {
            stats.losses++;
          }
        } else if (dealerHandValue > 21) {
          if (playerHandDoubled) {
            stats.winsAfterDoubling++;
          } else {
            stats.wins++;
          }
        } else if (dealerHandValue === playerHandValue) {
          if (playerHandDoubled) {
            stats.pushesAfterDoubling++;
          } else {
            stats.pushes++;
          }
        } else if (dealerHandValue > playerHandValue) {
          if (playerHandDoubled) {
            stats.lossesAfterDoubling++;
          } else {
            stats.losses++;
          }
        } else if (dealerHandValue < playerHandValue) {
          if (playerHandDoubled) {
            stats.winsAfterDoubling++;
          } else {
            stats.wins++;
          }
        }
      });
    }

    output(stats);
  }
};
