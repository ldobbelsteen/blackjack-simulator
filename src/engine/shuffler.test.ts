import { describe, expect, it } from "vitest";
import { Deck } from "./deck";
import { Shuffler } from "./shuffler";

describe("shuffler", () => {
  it("differentEntropySources", () => {
    expect(() => new Shuffler("crypto")).not.toThrow();
    expect(() => new Shuffler("math")).not.toThrow();
    expect(() => new Shuffler("deterministic")).not.toThrow();
    expect(() => new Shuffler()).not.toThrow();
  });

  it("fetchEntropyCycle", () => {
    const deck = new Deck(64, 0, "deterministic");
    for (let i = 0; i < 16; i += 1) {
      deck.shuffle();
    }
  });
});
