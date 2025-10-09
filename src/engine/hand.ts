import type { Card } from "./deck";

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
  private value_: number;
  private aceCount_: number;
  private isUntouched_: boolean;
  private startedAsPair_: boolean;
  private firstCard_: Card;
  private isDoubledDown_: boolean;

  constructor(card1: Card, card2: Card) {
    this.value_ = 0;
    this.aceCount_ = 0;
    this.isUntouched_ = true;
    this.startedAsPair_ = card1 === card2;
    this.firstCard_ = card1;
    this.isDoubledDown_ = false;

    this.add(card1);
    this.add(card2);
    this.isUntouched_ = true;
  }

  add(card: Card): void {
    this.value_ += card;
    this.isUntouched_ = false;
    if (card === 11) {
      this.aceCount_ += 1;
    }
    if (this.value_ > 21 && this.isSoft()) {
      this.aceCount_ -= 1;
      this.value_ -= 10;
    }
  }

  doubleDown(card: Card): void {
    this.add(card);
    this.isDoubledDown_ = true;
  }

  type(): HandType {
    if (this.isPair()) return HandType.Pair;
    if (this.isSoft()) return HandType.Soft;
    return HandType.Hard;
  }

  isBlackjack(): boolean {
    return this.value_ === 21 && this.isUntouched_;
  }

  private isSoft(): boolean {
    return this.aceCount_ > 0;
  }

  private isPair(): boolean {
    return this.startedAsPair_ && this.isUntouched_;
  }

  downgradePair() {
    this.startedAsPair_ = false;
  }

  toString(): string {
    return `${this.value_.toString()}, type: ${HandType[this.type()]}, doubled: ${this.isDoubledDown_ ? "true" : "false"}, first card: ${this.firstCard_.toString()}`;
  }

  get value(): number {
    return this.value_;
  }

  get isUntouched(): boolean {
    return this.isUntouched_;
  }

  get firstCard(): Card {
    return this.firstCard_;
  }

  get isDoubledDown(): boolean {
    return this.isDoubledDown_;
  }
}
