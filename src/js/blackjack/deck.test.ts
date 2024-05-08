import { describe, expect, it } from "vitest";
import { Card, Deck } from "./deck";

// @ts-expect-error vitest runs in node which doesn't have crypto by default
import crypto from "node:crypto";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
globalThis.crypto = crypto;

describe("deck", () => {
  it("occurrences", () => {
    const deckCount = 4;
    const deckPenetration = 1.0;
    const deck = new Deck(deckCount, deckPenetration);
    for (let i = 0; i < 100; i++) {
      const occurrences = new Map<Card, number>();
      for (let j = 0; j < deckCount * 52; j++) {
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
