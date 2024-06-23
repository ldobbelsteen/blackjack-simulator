import { describe, expect, it } from "vitest";
import { Hand, HandType } from "./hand";

describe("hand", () => {
  it("hard", () => {
    const hand = new Hand(10, 4);
    expect(hand.value).toBe(14);
    expect(hand.isUntouched).toBe(true);
    expect(hand.firstCard).toBe(10);
    expect(hand.isDoubledDown).toBe(false);
    expect(hand.type()).toBe(HandType.Hard);

    hand.add(3);
    hand.add(8);
    expect(hand.value).toBe(25);
    expect(hand.isUntouched).toBe(false);
    expect(hand.firstCard).toBe(10);
    expect(hand.isDoubledDown).toBe(false);
    expect(hand.type()).toBe(HandType.Hard);
  });

  it("soft", () => {
    const hand = new Hand(6, 11);
    expect(hand.value).toBe(17);
    expect(hand.isUntouched).toBe(true);
    expect(hand.firstCard).toBe(6);
    expect(hand.isDoubledDown).toBe(false);
    expect(hand.type()).toBe(HandType.Soft);

    hand.add(9);
    expect(hand.value).toBe(16);
    expect(hand.isUntouched).toBe(false);
    expect(hand.firstCard).toBe(6);
    expect(hand.isDoubledDown).toBe(false);
    expect(hand.type()).toBe(HandType.Hard);
  });

  it("pair", () => {
    const hand = new Hand(3, 3);
    expect(hand.value).toBe(6);
    expect(hand.isUntouched).toBe(true);
    expect(hand.firstCard).toBe(3);
    expect(hand.isDoubledDown).toBe(false);
    expect(hand.type()).toBe(HandType.Pair);

    hand.add(11);
    expect(hand.value).toBe(17);
    expect(hand.isUntouched).toBe(false);
    expect(hand.firstCard).toBe(3);
    expect(hand.isDoubledDown).toBe(false);
    expect(hand.type()).toBe(HandType.Soft);
  });

  it("toString", () => {
    const hand = new Hand(10, 4);
    expect(hand.toString()).toBe("14, type: Hard, doubled: false, first card: 10");

    hand.add(3);
    hand.add(8);
    expect(hand.toString()).toBe("25, type: Hard, doubled: false, first card: 10");
  });
});
