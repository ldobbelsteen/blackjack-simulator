import { mixColors } from "../misc";
import { HandType } from "./hand";

/** All of the possible actions ('moves') in blackjack. */
export enum Action {
  Hit,
  Stand,
  Split,
  Double,
  Surrender,
}

/** Convert an action to a human-readable representation in the form of a character. */
function actionToChar(a: Action): string {
  switch (a) {
    case Action.Hit:
      return "H";
    case Action.Stand:
      return "S";
    case Action.Split:
      return "P";
    case Action.Double:
      return "D";
    case Action.Surrender:
      return "R";
  }
}

/** Parse an action from its human-readable representation. */
function charToAction(s: string): Action {
  switch (s) {
    case "H":
      return Action.Hit;
    case "S":
      return Action.Stand;
    case "P":
      return Action.Split;
    case "D":
      return Action.Double;
    case "R":
      return Action.Surrender;
  }
  throw new Error(`invalid action char: ${s}`);
}

/** Convert an action to its corresponding color in HEX. */
function actionToColor(a: Action): string {
  switch (a) {
    case Action.Hit:
      return "#43b68d";
    case Action.Stand:
      return "#ff7d63";
    case Action.Split:
      return "#00b3ff";
    case Action.Double:
      return "#ffef00";
    case Action.Surrender:
      return "#ff00fb";
  }
}

export class Move {
  primary: Action | null;
  secondary: Action | null;

  constructor(primary: Action | null, secondary: Action | null, type: HandType) {
    this.primary = primary;
    this.secondary = secondary;

    if (!this.isValid(type)) {
      throw new Error(`move is invalid: ${this.toString()}`);
    }
  }

  isValid(type: HandType): boolean {
    switch (type) {
      case HandType.Hard:
        return ["RH", "RS", "DH", "DS", "H", "S"].includes(this.toString());
      case HandType.Soft:
        return ["RH", "RS", "DH", "DS", "H", "S"].includes(this.toString());
      case HandType.Pair:
        return ["RP", "P", ""].includes(this.toString());
    }
  }

  static fromString(s: string, type: HandType): Move {
    switch (s.length) {
      case 0:
        return new Move(null, null, type);
      case 1:
        return new Move(null, charToAction(s[0]), type);
      case 2:
        return new Move(charToAction(s[0]), charToAction(s[1]), type);
      default:
        throw new Error(`move is invalid: ${s}`);
    }
  }

  toString(): string {
    const primary = this.primary !== null ? actionToChar(this.primary) : "";
    const secondary = this.secondary !== null ? actionToChar(this.secondary) : "";
    return primary + secondary;
  }

  color(): string {
    if (this.primary === null) {
      if (this.secondary === null) {
        return "#4a4a4a";
      } else {
        return actionToColor(this.secondary);
      }
    } else {
      if (this.secondary === null) {
        return actionToColor(this.primary);
      } else {
        return mixColors(actionToColor(this.primary), actionToColor(this.secondary), 0.3);
      }
    }
  }
}
