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

  toEditable() {
    return new EditableStrategy(
      this.hard.map((row) => row.map((move) => move.toString())),
      this.soft.map((row) => row.map((move) => move.toString())),
      this.pair.map((row) => row.map((move) => move.toString())),
    );
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
        return [9, 8, 7, 6, 5, 4, 3, 2, 1].map((v) => `A+${v.toString()}`);
      case HandType.Pair:
        return ["AA", "TT", "99", "88", "77", "66", "55", "44", "33", "22"];
    }
  }

  columnHeaders(): string[] {
    return ["2", "3", "4", "5", "6", "7", "8", "9", "10", "A"];
  }

  color(row: number, col: number, type: HandType): string {
    try {
      switch (type) {
        case HandType.Hard:
          return Move.fromString(this.hard[row][col], type).color();
        case HandType.Soft:
          return Move.fromString(this.soft[row][col], type).color();
        case HandType.Pair:
          return Move.fromString(this.pair[row][col], type).color();
      }
    } catch {
      return "red";
    }
  }

  input(row: number, col: number, type: HandType): string {
    switch (type) {
      case HandType.Hard:
        return this.hard[row][col];
      case HandType.Soft:
        return this.soft[row][col];
      case HandType.Pair:
        return this.pair[row][col];
    }
  }

  withSet(row: number, col: number, type: HandType, value: string): EditableStrategy {
    let hard = this.hard;
    let soft = this.soft;
    let pair = this.pair;

    switch (type) {
      case HandType.Hard:
        hard = [...this.hard];
        hard[row] = [...this.hard[row]];
        hard[row][col] = value;
        break;
      case HandType.Soft:
        soft = [...this.soft];
        soft[row] = [...this.soft[row]];
        soft[row][col] = value;
        break;
      case HandType.Pair:
        pair = [...this.pair];
        pair[row] = [...this.pair[row]];
        pair[row][col] = value;
        break;
    }

    return new EditableStrategy(hard, soft, pair);
  }

  toComplete(): CompleteStrategy {
    return new CompleteStrategy(
      this.hard.map((row) => row.map((cell) => Move.fromString(cell, HandType.Hard))),
      this.soft.map((row) => row.map((cell) => Move.fromString(cell, HandType.Soft))),
      this.pair.map((row) => row.map((cell) => Move.fromString(cell, HandType.Pair))),
    );
  }

  toObject() {
    return {
      hard: this.hard,
      soft: this.soft,
      pair: this.pair,
    };
  }

  static fromObject(obj: ReturnType<EditableStrategy["toObject"]>): EditableStrategy {
    return new EditableStrategy(obj.hard, obj.soft, obj.pair);
  }
}
