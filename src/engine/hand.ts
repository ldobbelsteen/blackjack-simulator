import { type Card } from "./deck";

/** All types of hands. */
export enum HandType {
  Hard,
  Soft,
  Pair,
}

/**
 * Optimized representation of a player's or dealer's hand of cards. Keeps the
 * public variables fresh for external use. The hand's value is automatically
 * 'compressed' when it is soft and exceeds a value of 21.
 */
export class Hand {
  value: number;
  private aceCount: number;
  isUntouched: boolean;
  private startedAsPair: boolean;
  firstCard: Card;
  isDoubled: boolean;

  constructor(card1: Card, card2: Card) {
    this.value = 0;
    this.aceCount = 0;
    this.add(card1);
    this.add(card2);
    this.isUntouched = true;
    this.startedAsPair = card1 === card2;
    this.firstCard = card1;
    this.isDoubled = false;
  }

  add(card: Card): void {
    this.value += card;
    this.isUntouched = false;
    if (card === 11) this.aceCount += 1;
    if (this.value > 21 && this.isSoft()) {
      this.aceCount--;
      this.value -= 10;
    }
  }

  type(): HandType {
    if (this.isPair()) return HandType.Pair;
    if (this.isSoft()) return HandType.Soft;
    return HandType.Hard;
  }

  private isSoft(): boolean {
    return this.aceCount > 0;
  }

  private isPair(): boolean {
    return this.startedAsPair && this.isUntouched;
  }

  toString(): string {
    return `${this.value}, type: ${this.type()}, doubled: ${this.isDoubled}, first card: ${this.firstCard}`;
  }
}
