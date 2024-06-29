import { describe, expect, it } from "vitest";
import { Simulation } from "./simulate";
import { AllowDouble, AllowSurrender, Rules } from "./rules";
import { CompleteStrategy } from "./strategy";

const SIMULATION_SIZE = 1_000_000;

describe("simulate", () => {
  it("gameCount", () => {
    const simulation = new Simulation(Rules.default(), CompleteStrategy.default(), "deterministic");
    const stats = simulation.run(SIMULATION_SIZE);
    expect(stats.gameCount()).toBe(SIMULATION_SIZE);
  });

  it("noSurrenders", () => {
    const rules = Rules.default();
    rules.allowSurrender = AllowSurrender.Never;
    const simulation = new Simulation(rules, CompleteStrategy.default(), "deterministic");
    const stats = simulation.run(SIMULATION_SIZE);
    expect(stats.surrenders).toBe(0);
  });

  it("noDoubleDowns", () => {
    const rules = Rules.default();
    rules.allowDouble = AllowDouble.Never;
    const simulation = new Simulation(rules, CompleteStrategy.default(), "deterministic");
    const stats = simulation.run(SIMULATION_SIZE);
    expect(stats.winsAfterDoubling + stats.pushesAfterDoubling + stats.lossesAfterDoubling).toBe(0);
  });

  it("restrictedDoubleDowns", () => {
    const rules = Rules.default();
    rules.allowDouble = AllowDouble.NineTenOrEleven;
    const simulation = new Simulation(rules, CompleteStrategy.default(), "deterministic");
    const stats = simulation.run(SIMULATION_SIZE);
    expect(
      stats.winsAfterDoubling + stats.pushesAfterDoubling + stats.lossesAfterDoubling,
    ).toBeGreaterThan(0);
  });

  it("noDoubleDownAfterSplit", () => {
    const rules = Rules.default();
    rules.allowDoubleAfterSplit = false;
    const simulation = new Simulation(rules, CompleteStrategy.default(), "deterministic");
    const stats = simulation.run(SIMULATION_SIZE);
    expect(
      stats.winsAfterDoubling + stats.pushesAfterDoubling + stats.lossesAfterDoubling,
    ).toBeGreaterThan(0);
  });

  it("noSplits", () => {
    const rules = Rules.default();
    rules.maxSplits = 0;
    const simulation = new Simulation(rules, CompleteStrategy.default(), "deterministic");
    const stats = simulation.run(SIMULATION_SIZE);
    expect(stats.splits).toBe(0);
  });

  it("nonDeterministicSources", () => {
    expect(
      () => new Simulation(Rules.default(), CompleteStrategy.default(), "crypto"),
    ).not.toThrow();
    expect(() => new Simulation(Rules.default(), CompleteStrategy.default(), "math")).not.toThrow();
    expect(() => new Simulation(Rules.default(), CompleteStrategy.default())).not.toThrow();
  });
});
