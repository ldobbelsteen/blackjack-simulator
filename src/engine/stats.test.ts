import { describe, expect, it } from "vitest";
import { Stats } from "./stats";

describe("stats", () => {
  it("add", () => {
    const stats = Stats.empty();
    stats.add(Stats.empty());
    expect(JSON.stringify(stats.toObject())).toEqual(
      JSON.stringify(Stats.empty().toObject()),
    );
  });

  it("derived", () => {
    expect(Stats.empty().balance(100)).toEqual(0);
    expect(Stats.empty().houseEdge(100)).toEqual(0);
    expect(Stats.empty().gamesPerSecond(100)).toEqual(0);
  });

  it("copy", () => {
    const stats = Stats.empty();
    const copy = stats.copy();
    expect(JSON.stringify(stats.toObject())).toEqual(
      JSON.stringify(copy.toObject()),
    );
  });
});
