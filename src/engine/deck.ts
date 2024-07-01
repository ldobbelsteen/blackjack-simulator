import { EntropySource, Shuffler } from "./shuffler";

/** A regular playing card. Jacks, queens and kings are represented by 10 */
export type Card = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

/**
 * Representation of a playing deck. Creates a deck out of a specified number of
 * single decks.
 */
export class Deck {
  private index: number;
  private cards: Card[];
  private threshold: number;
  private shuffler: Shuffler;

  constructor(deckCount: number, shuffleThreshold: number, entropySource?: EntropySource) {
    const suit: Card[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11];

    this.index = 0;
    this.cards = new Array<Card[]>(deckCount * 4).fill(suit).flat();
    this.threshold = Math.ceil((shuffleThreshold / 100) * this.cards.length); // TODO: investigate floor/ceil
    this.shuffler = new Shuffler(entropySource);
    this.shuffle();
  }

  takeCard(): Card {
    const result = this.cards[this.index];
    this.index += 1;
    return result;
  }

  beyondThreshold(): boolean {
    return this.index >= this.threshold;
  }

  shuffle(): void {
    this.shuffler.shuffle(this.cards);
    this.index = 0;
  }
}
