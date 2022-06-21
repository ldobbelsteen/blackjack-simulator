import { describe, expect, it } from "vitest";
import { Hand } from "./hand";

describe("hand", () => {
  it("hard", () => {
    const hand = new Hand(10, 4);
    expect(hand.value).toBe(14);
    expect(hand.isUntouched).toBe(true);
    expect(hand.firstCard).toBe(10);
    expect(hand.isDoubled).toBe(false);
    expect(hand.isSoft()).toBe(false);
    expect(hand.isPair()).toBe(false);

    hand.addCard(3);
    hand.addCard(8);
    expect(hand.value).toBe(25);
    expect(hand.isUntouched).toBe(false);
    expect(hand.firstCard).toBe(10);
    expect(hand.isDoubled).toBe(false);
    expect(hand.isSoft()).toBe(false);
    expect(hand.isPair()).toBe(false);
  });

  it("soft", () => {
    const hand = new Hand(6, 11);
    expect(hand.value).toBe(17);
    expect(hand.isUntouched).toBe(true);
    expect(hand.firstCard).toBe(6);
    expect(hand.isDoubled).toBe(false);
    expect(hand.isSoft()).toBe(true);
    expect(hand.isPair()).toBe(false);

    hand.addCard(9);
    expect(hand.value).toBe(16);
    expect(hand.isUntouched).toBe(false);
    expect(hand.firstCard).toBe(6);
    expect(hand.isDoubled).toBe(false);
    expect(hand.isSoft()).toBe(false);
    expect(hand.isPair()).toBe(false);
  });

  it("pair", () => {
    const hand = new Hand(3, 3);
    expect(hand.value).toBe(6);
    expect(hand.isUntouched).toBe(true);
    expect(hand.firstCard).toBe(3);
    expect(hand.isDoubled).toBe(false);
    expect(hand.isSoft()).toBe(false);
    expect(hand.isPair()).toBe(true);

    hand.addCard(11);
    expect(hand.value).toBe(17);
    expect(hand.isUntouched).toBe(false);
    expect(hand.firstCard).toBe(3);
    expect(hand.isDoubled).toBe(false);
    expect(hand.isSoft()).toBe(true);
    expect(hand.isPair()).toBe(false);
  });
});
