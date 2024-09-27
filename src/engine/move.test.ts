import { describe, expect, it } from "vitest";
import { HandType } from "./hand";
import { Action, Move } from "./move";

describe("move", () => {
  it("bijectiveParsingHard", () => {
    for (const move of Move.hardValidStr) {
      expect(Move.fromString(move, HandType.Hard).toString()).toBe(move);
    }
  });

  it("bijectiveParsingSoft", () => {
    for (const move of Move.softValidStr) {
      expect(Move.fromString(move, HandType.Soft).toString()).toBe(move);
    }
  });

  it("bijectiveParsingPair", () => {
    for (const move of Move.pairValidStr) {
      expect(Move.fromString(move, HandType.Pair).toString()).toBe(move);
    }
  });

  it("invalidCharacters", () => {
    expect(() => Move.fromString("X", HandType.Hard)).toThrow();
    expect(() => Move.fromString("X", HandType.Soft)).toThrow();
    expect(() => Move.fromString("X", HandType.Pair)).toThrow();

    expect(() => Move.fromString("XX", HandType.Hard)).toThrow();
    expect(() => Move.fromString("XX", HandType.Soft)).toThrow();
    expect(() => Move.fromString("XX", HandType.Pair)).toThrow();

    expect(() => Move.fromString("XXX", HandType.Hard)).toThrow();
    expect(() => Move.fromString("XXX", HandType.Soft)).toThrow();
    expect(() => Move.fromString("XXX", HandType.Pair)).toThrow();
  });

  it("invalidMoves", () => {
    expect(() => Move.fromString("DP", HandType.Hard)).toThrow();
    expect(() => Move.fromString("RP", HandType.Soft)).toThrow();
    expect(() => Move.fromString("RH", HandType.Pair)).toThrow();
  });

  it("onlyPrimary", () => {
    expect(new Move(Action.Hit, null).color()).toBe("#43b68d");
  });
});
