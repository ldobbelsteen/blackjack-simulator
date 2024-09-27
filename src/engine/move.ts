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

  /** All valid move string representations per hand type. */
  static hardValidStr = ["RH", "RS", "DH", "DS", "H", "S"];
  static softValidStr = ["RH", "RS", "DH", "DS", "H", "S"];
  static pairValidStr = ["RP", "P", ""];

  constructor(primary: Action | null, secondary: Action | null) {
    this.primary = primary;
    this.secondary = secondary;
  }

  isValid(type: HandType): boolean {
    switch (type) {
      case HandType.Hard:
        return Move.hardValidStr.includes(this.toString());
      case HandType.Soft:
        return Move.softValidStr.includes(this.toString());
      case HandType.Pair:
        return Move.pairValidStr.includes(this.toString());
    }
  }

  static fromString(s: string, type: HandType): Move {
    let result: Move;
    switch (s.length) {
      case 0:
        result = new Move(null, null);
        break;
      case 1:
        result = new Move(null, charToAction(s[0]));
        break;
      case 2:
        result = new Move(charToAction(s[0]), charToAction(s[1]));
        break;
      default:
        throw new Error(`move has invalid number of characters: ${s}`);
    }

    if (!result.isValid(type)) {
      throw new Error(`move is invalid: ${s}`);
    }

    return result;
  }

  toString(): string {
    const primary = this.primary !== null ? actionToChar(this.primary) : "";
    const secondary = this.secondary !== null ? actionToChar(this.secondary) : "";
    return primary + secondary;
  }

  color(): string {
    if (this.primary === null) {
      if (this.secondary === null) {
        return "#f7a1a1";
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
