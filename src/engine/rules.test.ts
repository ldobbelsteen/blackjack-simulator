import { describe, expect, it } from "vitest";
import { Rules } from "./rules";

describe("rules", () => {
  it("copy", () => {
    const rules = Rules.default();
    const copy = rules.copy();
    expect(JSON.stringify(copy)).toEqual(JSON.stringify(rules));
  });
});
