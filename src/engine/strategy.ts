import { HandType } from "./hand";
import { Move } from "./move";

class Strategy<T> {
  hard: T[][];
  soft: T[][];
  pair: T[][];

  constructor(hard: T[][], soft: T[][], pair: T[][]) {
    this.hard = hard;
    this.soft = soft;
    this.pair = pair;
  }
}

export class CompleteStrategy extends Strategy<Move> {
  static default(): CompleteStrategy {
    return new CompleteStrategy(
      [
        ["S", "S", "S", "S", "S", "S", "S", "S", "S", "S"],
        ["S", "S", "S", "S", "S", "S", "S", "S", "S", "S"],
        ["S", "S", "S", "S", "S", "S", "S", "S", "S", "S"],
        ["S", "S", "S", "S", "S", "S", "S", "S", "S", "RS"],
        ["S", "S", "S", "S", "S", "H", "H", "RH", "RH", "RH"],
        ["S", "S", "S", "S", "S", "H", "H", "H", "RH", "RH"],
        ["S", "S", "S", "S", "S", "H", "H", "H", "H", "H"],
        ["S", "S", "S", "S", "S", "H", "H", "H", "H", "H"],
        ["H", "H", "S", "S", "S", "H", "H", "H", "H", "H"],
        ["DH", "DH", "DH", "DH", "DH", "DH", "DH", "DH", "DH", "DH"],
        ["DH", "DH", "DH", "DH", "DH", "DH", "DH", "DH", "H", "H"],
        ["H", "DH", "DH", "DH", "DH", "H", "H", "H", "H", "H"],
        ["H", "H", "H", "H", "H", "H", "H", "H", "H", "H"],
        ["H", "H", "H", "H", "H", "H", "H", "H", "H", "H"],
        ["H", "H", "H", "H", "H", "H", "H", "H", "H", "H"],
        ["H", "H", "H", "H", "H", "H", "H", "H", "H", "H"],
        ["H", "H", "H", "H", "H", "H", "H", "H", "H", "H"],
      ].map((row) => row.map((cell) => Move.fromString(cell, HandType.Hard))),
      [
        ["S", "S", "S", "S", "S", "S", "S", "S", "S", "S"],
        ["S", "S", "S", "S", "DS", "S", "S", "S", "S", "S"],
        ["DS", "DS", "DS", "DS", "DS", "S", "S", "H", "H", "H"],
        ["H", "DH", "DH", "DH", "DH", "H", "H", "H", "H", "H"],
        ["H", "H", "DH", "DH", "DH", "H", "H", "H", "H", "H"],
        ["H", "H", "DH", "DH", "DH", "H", "H", "H", "H", "H"],
        ["H", "H", "H", "DH", "DH", "H", "H", "H", "H", "H"],
        ["H", "H", "H", "DH", "DH", "H", "H", "H", "H", "H"],
        ["H", "H", "H", "H", "H", "H", "H", "H", "H", "H"],
      ].map((row) => row.map((cell) => Move.fromString(cell, HandType.Soft))),
      [
        ["P", "P", "P", "P", "P", "P", "P", "P", "P", "P"],
        ["", "", "", "", "", "", "", "", "", ""],
        ["P", "P", "P", "P", "P", "", "P", "P", "", ""],
        ["P", "P", "P", "P", "P", "P", "P", "P", "P", "RP"],
        ["P", "P", "P", "P", "P", "P", "", "", "", ""],
        ["P", "P", "P", "P", "P", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "P", "P", "", "", "", "", ""],
        ["P", "P", "P", "P", "P", "P", "", "", "", ""],
        ["P", "P", "P", "P", "P", "P", "", "", "", ""],
      ].map((row) => row.map((cell) => Move.fromString(cell, HandType.Pair))),
    );
  }

  hardMove(playerValue: number, dealerUpcard: number) {
    return this.hard[20 - playerValue][dealerUpcard - 2];
  }

  softMove(playerValue: number, dealerUpcard: number) {
    return this.soft[20 - playerValue][dealerUpcard - 2];
  }

  pairMove(playerValue: number, dealerUpcard: number) {
    return this.pair[(22 - playerValue) / 2][dealerUpcard - 2];
  }

  toObject() {
    return {
      hard: this.hard.map((row) => row.map((move) => move.toString())),
      soft: this.soft.map((row) => row.map((move) => move.toString())),
      pair: this.pair.map((row) => row.map((move) => move.toString())),
    };
  }

  static fromObject(obj: ReturnType<CompleteStrategy["toObject"]>): CompleteStrategy {
    return new CompleteStrategy(
      obj.hard.map((row) => row.map((cell) => Move.fromString(cell, HandType.Hard))),
      obj.soft.map((row) => row.map((cell) => Move.fromString(cell, HandType.Soft))),
      obj.pair.map((row) => row.map((cell) => Move.fromString(cell, HandType.Pair))),
    );
  }
}

export class EditableStrategy extends Strategy<string> {
  static default(): EditableStrategy {
    const complete = CompleteStrategy.default();
    return new EditableStrategy(
      complete.hard.map((row) => row.map((move) => move.toString())),
      complete.soft.map((row) => row.map((move) => move.toString())),
      complete.pair.map((row) => row.map((move) => move.toString())),
    );
  }

  rowHeaders(type: HandType): string[] {
    switch (type) {
      case HandType.Hard:
        return [20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4].map((v) =>
          v.toString(),
        );
      case HandType.Soft:
        return [9, 8, 7, 6, 5, 4, 3, 2, 1].map((v) => `A+${v}`);
      case HandType.Pair:
        return ["AA", "TT", "99", "88", "77", "66", "55", "44", "33", "22"];
    }
  }

  columnHeaders(): string[] {
    return ["2", "3", "4", "5", "6", "7", "8", "9", "10", "A"];
  }

  color(i: number, j: number, type: HandType): string {
    try {
      switch (type) {
        case HandType.Hard:
          return Move.fromString(this.hard[i][j], type).color();
        case HandType.Soft:
          return Move.fromString(this.soft[i][j], type).color();
        case HandType.Pair:
          return Move.fromString(this.pair[i][j], type).color();
      }
    } catch (e) {
      return "red";
    }
  }

  input(i: number, j: number, type: HandType): string {
    switch (type) {
      case HandType.Hard:
        return this.hard[i][j];
      case HandType.Soft:
        return this.soft[i][j];
      case HandType.Pair:
        return this.pair[i][j];
    }
  }

  withSet(i: number, j: number, type: HandType, value: string): EditableStrategy {
    const copy = this.copy();
    switch (type) {
      case HandType.Hard:
        copy.hard[i][j] = value;
        break;
      case HandType.Soft:
        copy.soft[i][j] = value;
        break;
      case HandType.Pair:
        copy.pair[i][j] = value;
        break;
    }
    return copy;
  }

  toComplete(): CompleteStrategy {
    return new CompleteStrategy(
      this.hard.map((row) => row.map((cell) => Move.fromString(cell, HandType.Hard))),
      this.soft.map((row) => row.map((cell) => Move.fromString(cell, HandType.Soft))),
      this.pair.map((row) => row.map((cell) => Move.fromString(cell, HandType.Pair))),
    );
  }

  private copy(): EditableStrategy {
    return new EditableStrategy(
      this.hard.map((row) => row.slice()),
      this.soft.map((row) => row.slice()),
      this.pair.map((row) => row.slice()),
    );
  }
}
