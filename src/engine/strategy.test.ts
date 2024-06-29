import { describe, expect, it } from "vitest";
import { CompleteStrategy, EditableStrategy } from "./strategy";
import { HandType } from "./hand";

describe("completeStrategy", () => {
  it("toFromObject", () => {
    const strategy = CompleteStrategy.default();
    const converted = CompleteStrategy.fromObject(strategy.toObject());
    expect(JSON.stringify(strategy)).toBe(JSON.stringify(converted));
  });
});

describe("editableStrategy", () => {
  it("toComplete", () => {
    const strategy1 = EditableStrategy.default().toComplete();
    const strategy2 = CompleteStrategy.default();
    expect(JSON.stringify(strategy1)).toBe(JSON.stringify(strategy2));
  });

  it("toEditable", () => {
    const strategy1 = EditableStrategy.default();
    const strategy2 = strategy1.toComplete().toEditable();
    expect(JSON.stringify(strategy1)).toBe(JSON.stringify(strategy2));
  });

  it("rowHeaders", () => {
    const strategy = EditableStrategy.default();
    expect(strategy.rowHeaders(HandType.Hard).length).toBe(strategy.hard.length);
    expect(strategy.rowHeaders(HandType.Soft).length).toBe(strategy.soft.length);
    expect(strategy.rowHeaders(HandType.Pair).length).toBe(strategy.pair.length);
  });

  it("columnHeaders", () => {
    const strategy = EditableStrategy.default();
    expect(strategy.columnHeaders().length).toBe(strategy.hard[0].length);
    expect(strategy.columnHeaders().length).toBe(strategy.soft[0].length);
    expect(strategy.columnHeaders().length).toBe(strategy.pair[0].length);
  });

  it("color", () => {
    const strategy = CompleteStrategy.default();
    const editable = EditableStrategy.default();
    for (let i = 0; i < strategy.hard.length; i++) {
      for (let j = 0; j < strategy.hard[i].length; j++) {
        expect(editable.color(i, j, HandType.Hard)).toBe(strategy.hard[i][j].color());
      }
    }
    for (let i = 0; i < strategy.soft.length; i++) {
      for (let j = 0; j < strategy.soft[i].length; j++) {
        expect(editable.color(i, j, HandType.Soft)).toBe(strategy.soft[i][j].color());
      }
    }
    for (let i = 0; i < strategy.pair.length; i++) {
      for (let j = 0; j < strategy.pair[i].length; j++) {
        expect(editable.color(i, j, HandType.Pair)).toBe(strategy.pair[i][j].color());
      }
    }

    editable.hard[0][0] = "invalid";
    expect(editable.color(0, 0, HandType.Hard)).toBe("red");
  });

  it("input", () => {
    const strategy = CompleteStrategy.default();
    const editable = EditableStrategy.default();
    for (let i = 0; i < strategy.hard.length; i++) {
      for (let j = 0; j < strategy.hard[i].length; j++) {
        expect(editable.input(i, j, HandType.Hard)).toBe(strategy.hard[i][j].toString());
      }
    }
    for (let i = 0; i < strategy.soft.length; i++) {
      for (let j = 0; j < strategy.soft[i].length; j++) {
        expect(editable.input(i, j, HandType.Soft)).toBe(strategy.soft[i][j].toString());
      }
    }
    for (let i = 0; i < strategy.pair.length; i++) {
      for (let j = 0; j < strategy.pair[i].length; j++) {
        expect(editable.input(i, j, HandType.Pair)).toBe(strategy.pair[i][j].toString());
      }
    }
  });

  it("withSet", () => {
    const strategy1 = EditableStrategy.default();
    const strategy2 = strategy1.withSet(0, 0, HandType.Hard, "DH");
    expect(JSON.stringify(strategy1.hard)).not.toBe(JSON.stringify(strategy2.hard));
    expect(JSON.stringify(strategy1.soft)).toBe(JSON.stringify(strategy2.soft));
    expect(JSON.stringify(strategy1.pair)).toBe(JSON.stringify(strategy2.pair));

    const strategy3 = strategy2.withSet(0, 0, HandType.Soft, "DS");
    expect(JSON.stringify(strategy2.hard)).toBe(JSON.stringify(strategy3.hard));
    expect(JSON.stringify(strategy2.soft)).not.toBe(JSON.stringify(strategy3.soft));
    expect(JSON.stringify(strategy2.pair)).toBe(JSON.stringify(strategy3.pair));

    const strategy4 = strategy3.withSet(0, 0, HandType.Pair, "DP");
    expect(JSON.stringify(strategy3.hard)).toBe(JSON.stringify(strategy4.hard));
    expect(JSON.stringify(strategy3.soft)).toBe(JSON.stringify(strategy4.soft));
    expect(JSON.stringify(strategy3.pair)).not.toBe(JSON.stringify(strategy4.pair));
  });

  it("toFromObject", () => {
    const strategy = EditableStrategy.default();
    const converted = EditableStrategy.fromObject(strategy.toObject());
    expect(JSON.stringify(strategy)).toBe(JSON.stringify(converted));
  });
});
