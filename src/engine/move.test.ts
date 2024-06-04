import { describe, expect, it } from "vitest";
import { HandType } from "./hand";
import { Move } from "./move";

describe("move", () => {
  it("parsingHard", () => {
    expect(() => Move.fromString("H", HandType.Hard)).not.toThrow();
    expect(() => Move.fromString("S", HandType.Hard)).not.toThrow();
    expect(() => Move.fromString("DH", HandType.Hard)).not.toThrow();
    expect(() => Move.fromString("DS", HandType.Hard)).not.toThrow();
    expect(() => Move.fromString("RH", HandType.Hard)).not.toThrow();
    expect(() => Move.fromString("RS", HandType.Hard)).not.toThrow();
    expect(() => Move.fromString("", HandType.Hard)).toThrow();
    expect(() => Move.fromString("P", HandType.Hard)).toThrow();
    expect(() => Move.fromString("RP", HandType.Hard)).toThrow();
  });

  it("parsingSoft", () => {
    expect(() => Move.fromString("H", HandType.Soft)).not.toThrow();
    expect(() => Move.fromString("S", HandType.Soft)).not.toThrow();
    expect(() => Move.fromString("DH", HandType.Soft)).not.toThrow();
    expect(() => Move.fromString("DS", HandType.Soft)).not.toThrow();
    expect(() => Move.fromString("RH", HandType.Soft)).not.toThrow();
    expect(() => Move.fromString("RS", HandType.Soft)).not.toThrow();
    expect(() => Move.fromString("", HandType.Soft)).toThrow();
    expect(() => Move.fromString("P", HandType.Soft)).toThrow();
    expect(() => Move.fromString("RP", HandType.Soft)).toThrow();
  });

  it("parsingPair", () => {
    expect(() => Move.fromString("H", HandType.Pair)).toThrow();
    expect(() => Move.fromString("S", HandType.Pair)).toThrow();
    expect(() => Move.fromString("DH", HandType.Pair)).toThrow();
    expect(() => Move.fromString("DS", HandType.Pair)).toThrow();
    expect(() => Move.fromString("RH", HandType.Pair)).toThrow();
    expect(() => Move.fromString("RS", HandType.Pair)).toThrow();
    expect(() => Move.fromString("", HandType.Pair)).not.toThrow();
    expect(() => Move.fromString("P", HandType.Pair)).not.toThrow();
    expect(() => Move.fromString("RP", HandType.Pair)).not.toThrow();
  });

  it("bijectiveParsingHard", () => {
    const moves = ["RH", "RS", "DH", "DS", "H", "S"];
    for (const move of moves) {
      expect(Move.fromString(move, HandType.Hard).toString()).toBe(move);
    }
  });

  it("bijectiveParsingSoft", () => {
    const moves = ["RH", "RS", "DH", "DS", "H", "S"];
    for (const move of moves) {
      expect(Move.fromString(move, HandType.Soft).toString()).toBe(move);
    }
  });

  it("bijectiveParsingPair", () => {
    const moves = ["RP", "P", ""];
    for (const move of moves) {
      expect(Move.fromString(move, HandType.Pair).toString()).toBe(move);
    }
  });

  it("invalidMoves", () => {
    expect(() => Move.fromString("X", HandType.Hard)).toThrow();
    expect(() => Move.fromString("X", HandType.Soft)).toThrow();
    expect(() => Move.fromString("X", HandType.Pair)).toThrow();

    expect(() => Move.fromString("XXX", HandType.Hard)).toThrow();
    expect(() => Move.fromString("XXX", HandType.Soft)).toThrow();
    expect(() => Move.fromString("XXX", HandType.Pair)).toThrow();
  });
});
