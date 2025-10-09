import { describe, expect, it } from "vitest";
import { Action, Move } from "./move";
import { AllowDouble, AllowSurrender, Rules } from "./rules";
import { Simulation } from "./simulation";
import { CompleteStrategy } from "./strategy";

const SIMULATION_SIZE = 10_000;

describe("simulation", () => {
  it("gameCount", () => {
    const simulation = new Simulation(
      Rules.default(),
      CompleteStrategy.default(),
      "deterministic",
    );
    const stats = simulation.run(SIMULATION_SIZE);
    expect(stats.gameCount()).toBe(SIMULATION_SIZE);
  });

  it("noSurrenders", () => {
    const rules = Rules.default();
    rules.allowSurrender = AllowSurrender.Never;
    const simulation = new Simulation(
      rules,
      CompleteStrategy.default(),
      "deterministic",
    );
    const stats = simulation.run(SIMULATION_SIZE);
    expect(stats.surrenders).toBe(0);
  });

  it("noDoubleDowns", () => {
    const rules = Rules.default();
    rules.allowDouble = AllowDouble.Never;
    const simulation = new Simulation(
      rules,
      CompleteStrategy.default(),
      "deterministic",
    );
    const stats = simulation.run(SIMULATION_SIZE);
    expect(
      stats.winsAfterDoubling +
        stats.pushesAfterDoubling +
        stats.lossesAfterDoubling,
    ).toBe(0);
  });

  it("restrictedDoubleDowns", () => {
    const rules = Rules.default();
    rules.allowDouble = AllowDouble.NineTenOrEleven;
    const simulation = new Simulation(
      rules,
      CompleteStrategy.default(),
      "deterministic",
    );
    const stats = simulation.run(SIMULATION_SIZE);
    expect(
      stats.winsAfterDoubling +
        stats.pushesAfterDoubling +
        stats.lossesAfterDoubling,
    ).toBeGreaterThan(0);
  });

  it("noDoubleDownAfterSplit", () => {
    const rules = Rules.default();
    rules.allowDoubleAfterSplit = false;
    const simulation = new Simulation(
      rules,
      CompleteStrategy.default(),
      "deterministic",
    );
    const stats = simulation.run(SIMULATION_SIZE);
    expect(
      stats.winsAfterDoubling +
        stats.pushesAfterDoubling +
        stats.lossesAfterDoubling,
    ).toBeGreaterThan(0);
  });

  it("noSplits", () => {
    const rules = Rules.default();
    rules.maxSplits = 0;
    const simulation = new Simulation(
      rules,
      CompleteStrategy.default(),
      "deterministic",
    );
    const stats = simulation.run(SIMULATION_SIZE);
    expect(stats.splits).toBe(0);
  });

  it("invalidStrategyHard", () => {
    const strategy = CompleteStrategy.default();
    strategy.hard[3][5] = new Move(null, null);
    const simulation = new Simulation(
      Rules.default(),
      strategy,
      "deterministic",
    );
    expect(() => simulation.run(SIMULATION_SIZE)).toThrow();
  });

  it("invalidStrategySoft", () => {
    const strategy = CompleteStrategy.default();
    strategy.soft[3][4] = new Move(null, null);
    const simulation = new Simulation(
      Rules.default(),
      strategy,
      "deterministic",
    );
    expect(() => simulation.run(SIMULATION_SIZE)).toThrow();
  });

  it("lossAfterDoubling", () => {
    const strategy = CompleteStrategy.default();
    strategy.hard[5][5] = new Move(Action.Double, Action.Hit);
    const simulation = new Simulation(
      Rules.default(),
      strategy,
      "deterministic",
    );
    const stats = simulation.run(SIMULATION_SIZE);
    expect(stats.lossesAfterDoubling).toBeGreaterThan(0);
  });
});
