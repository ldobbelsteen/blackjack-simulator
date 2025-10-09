import { describe, expect, it } from "vitest";
import { type Card, Deck } from "./deck";

describe("deck", () => {
  it("occurrences", () => {
    const deckCount = 4;
    const shuffleThreshold = 100;
    const deck = new Deck(deckCount, shuffleThreshold, "deterministic");
    for (let i = 0; i < 100; i += 1) {
      const occurrences = new Map<Card, number>();
      for (let j = 0; j < deckCount * 52; j += 1) {
        const card = deck.takeCard();
        occurrences.set(card, (occurrences.get(card) ?? 0) + 1);
      }
      for (const [card, count] of occurrences) {
        if (card === 10) {
          expect(count).toBe(deckCount * 16);
        } else {
          expect(count).toBe(deckCount * 4);
        }
      }
      expect(deck.beyondThreshold()).toBe(true);
      deck.shuffle();
    }
  });
});
