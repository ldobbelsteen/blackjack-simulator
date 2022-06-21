import { colord, extend } from "colord";
import mixPlugin from "colord/plugins/mix";
extend([mixPlugin]);

/** All of the possible actions ('moves') in blackjack */
export enum Action {
  Hit,
  None,
  Stand,
  Split,
  Double,
  Surrender,
}

/**
 * Move consisting of preferred action and secondary action. Having none as a
 * primary action means the secondary should always be executed. Having split as
 * a primary move means the secondary move should only be executed when the
 * player is not allowed to double down after splitting.
 */
export type Move = [
  Action.None | Action.Double | Action.Surrender | Action.Split,
  Action.None | Action.Hit | Action.Stand | Action.Split
];

/** Convert an action to a human-readable representation in the form of a character */
function actionToChar(action: Action): string {
  switch (action) {
    case Action.Hit:
      return "h";
    case Action.None:
      return "";
    case Action.Stand:
      return "s";
    case Action.Split:
      return "p";
    case Action.Double:
      return "d";
    case Action.Surrender:
      return "r";
  }
}

/** Parse an action from its human-readable representation */
function charToAction(string: string): Action {
  switch (string) {
    case "h":
      return Action.Hit;
    case "s":
      return Action.Stand;
    case "p":
      return Action.Split;
    case "d":
      return Action.Double;
    case "r":
      return Action.Surrender;
    default:
      return Action.None;
  }
}

/** Convert a move to a human-readable string */
export function moveToString(move: Move): string {
  const human = move.map(actionToChar).join("");
  const capitalzed = human.charAt(0).toUpperCase() + human.slice(1);
  return capitalzed;
}

/** Convert a move to its corresponding color in HEX */
export function moveToColor(move: Move): string {
  let color = colord("#ff0000");

  /** First take the color of the secondary action */
  switch (move[1]) {
    case Action.Hit:
      color = colord("#43b68d");
      break;
    case Action.Stand:
      color = colord("#ff7d63");
      break;
    case Action.Split:
      color = colord("#00b3ff");
      break;
  }

  /** Mix in the color of the primary actions */
  switch (move[0]) {
    case Action.Double:
      color = color.mix("#ffef00", 0.7);
      break;
    case Action.Surrender:
      color = color.mix("#ff00fb", 0.7);
      break;
    case Action.Split:
      color = color.mix("#00b3ff", 0.5);
      break;
  }

  return color.toHex();
}

/** Convert the human-readable representation of a move to a move if it is valid */
export function stringToMove(str: string): Move | undefined {
  str = str.toLowerCase();
  if (str.length === 1) {
    const action = charToAction(str);
    if (
      action === Action.Hit ||
      action === Action.Stand ||
      action === Action.Split
    ) {
      return [Action.None, action];
    }
  } else if (str.length === 2) {
    const primaryAction = charToAction(str.charAt(0));
    if (
      primaryAction === Action.None ||
      primaryAction === Action.Double ||
      primaryAction === Action.Surrender ||
      primaryAction === Action.Split
    ) {
      const secondaryAction = charToAction(str.charAt(1));
      if (
        secondaryAction === Action.Hit ||
        secondaryAction === Action.Stand ||
        secondaryAction === Action.Split
      ) {
        if (
          !(primaryAction === Action.Split && secondaryAction === Action.Split)
        ) {
          return [primaryAction, secondaryAction];
        }
      }
    }
  }
}
