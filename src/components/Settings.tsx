import { useState } from "react";
import toast from "react-hot-toast";
import { AllowDouble, AllowSurrender, Rules } from "../engine/rules";
import { BorderedBox } from "./BorderedBox";
import { Button } from "./Button";
import { RadioRow } from "./RadioRow";

export function Settings(props: {
  rules: Rules;
  setRules: (rules: Rules) => void;
}) {
  const [infoOpened, setInfoOpened] = useState(false);

  return (
    <BorderedBox>
      <div className="flex items-center gap-2">
        <h4>Settings</h4>
        <Button
          fullWidth={false}
          onClick={() => {
            props.setRules(Rules.default());
            toast.success("Settings reset");
          }}
        >
          Reset
        </Button>
      </div>

      <table className="my-2 w-full border-separate border-spacing-1">
        <tbody>
          <RadioRow
            title="1. Allow surrender"
            selected={AllowSurrender[props.rules.allowSurrender]}
            setSelected={(v) => {
              for (const [key, value] of Object.entries(AllowSurrender)) {
                if (v === key && typeof value !== "string") {
                  const copy = props.rules.copy();
                  copy.allowSurrender = value;
                  props.setRules(copy);
                  break;
                }
              }
            }}
            options={Object.keys(AllowSurrender).filter((v) =>
              Number.isNaN(parseInt(v, 10)),
            )}
          />
          <RadioRow
            title="2. Allow double-down"
            selected={AllowDouble[props.rules.allowDouble]}
            setSelected={(v) => {
              for (const [key, value] of Object.entries(AllowDouble)) {
                if (v === key && typeof value !== "string") {
                  const copy = props.rules.copy();
                  copy.allowDouble = value;
                  props.setRules(copy);
                  break;
                }
              }
            }}
            options={Object.keys(AllowDouble).filter((v) =>
              Number.isNaN(parseInt(v, 10)),
            )}
          />
          <tr>
            <td>3. Max splits</td>
            <td colSpan={3}>
              <input
                className="w-12"
                type="number"
                min={0}
                max={7}
                value={props.rules.maxSplits}
                onChange={(e) => {
                  const copy = props.rules.copy();
                  copy.maxSplits = parseInt(e.target.value, 10);
                  props.setRules(copy);
                }}
              />
              &nbsp;max
            </td>
          </tr>
          <RadioRow
            title="4. Allow hitting of split aces"
            selected={props.rules.allowHittingSplitAces ? "Yes" : "No"}
            setSelected={(v) => {
              const copy = props.rules.copy();
              copy.allowHittingSplitAces = v === "Yes";
              props.setRules(copy);
            }}
            options={["Yes", "No"]}
          />
          <RadioRow
            title="5. Allow resplitting of aces"
            selected={props.rules.allowResplittingAces ? "Yes" : "No"}
            setSelected={(v) => {
              const copy = props.rules.copy();
              copy.allowResplittingAces = v === "Yes";
              props.setRules(copy);
            }}
            options={["Yes", "No"]}
          />
          <RadioRow
            title="6. Allow double-down after splitting"
            selected={props.rules.allowDoubleAfterSplit ? "Yes" : "No"}
            setSelected={(v) => {
              const copy = props.rules.copy();
              copy.allowDoubleAfterSplit = v === "Yes";
              props.setRules(copy);
            }}
            options={["Yes", "No"]}
          />
          <RadioRow
            title="7. Dealer hits soft 17"
            selected={props.rules.dealerHitsSoft17 ? "Yes" : "No"}
            setSelected={(v) => {
              const copy = props.rules.copy();
              copy.dealerHitsSoft17 = v === "Yes";
              props.setRules(copy);
            }}
            options={["Yes", "No"]}
          />
          <RadioRow
            title="8. Blackjack payout"
            selected={props.rules.blackjackPayout === 1.5 ? "3 to 2" : "6 to 5"}
            setSelected={(v) => {
              const copy = props.rules.copy();
              copy.blackjackPayout = v === "3 to 2" ? 1.5 : 1.2;
              props.setRules(copy);
            }}
            options={["3 to 2", "6 to 5"]}
          />
          <tr>
            <td>9. Max deck penetration</td>
            <td colSpan={3}>
              <input
                className="w-12"
                type="number"
                min={5}
                max={90}
                value={props.rules.maxDeckPenetration}
                onChange={(e) => {
                  const copy = props.rules.copy();
                  copy.maxDeckPenetration = parseInt(e.target.value, 10);
                  props.setRules(copy);
                }}
              />
              &nbsp;%
            </td>
          </tr>
          <tr>
            <td>10. Deck count</td>
            <td colSpan={3}>
              <input
                className="w-12"
                type="number"
                min={2}
                max={8}
                value={props.rules.deckCount}
                onChange={(e) => {
                  const copy = props.rules.copy();
                  copy.deckCount = parseInt(e.target.value, 10);
                  props.setRules(copy);
                }}
              />
              &nbsp;decks
            </td>
          </tr>
          <tr>
            <td>11. Thread count</td>
            <td colSpan={3}>
              <input
                className="w-12"
                type="number"
                min={1}
                value={props.rules.threadCount}
                onChange={(e) => {
                  const copy = props.rules.copy();
                  copy.threadCount = parseInt(e.target.value, 10);
                  props.setRules(copy);
                }}
              />
              &nbsp;threads
            </td>
          </tr>
        </tbody>
      </table>

      <Button
        onClick={() => {
          setInfoOpened(!infoOpened);
        }}
        fullWidth={true}
      >
        {infoOpened ? "Less information" : "More information"}
      </Button>
      {infoOpened && (
        <div className="mt-2 bg-darkgray p-4 [&_p]:my-2">
          <p>
            1. Surrendering is a starting move in which the player gives up
            their hand and loses half of their bet. It can only be done on the
            initial hand and therefore not after splitting. With late surrender,
            the player gets to keep half of their bet only if the dealer does
            not have a blackjack, else they lose their entire bet. With early
            surrender the player always gets to keep half of their bet
            regardless of the dealer&apos;s cards.
          </p>
          <p>
            2. Double-down is a move where the player doubles their initial bet
            and receives just one more card. It is only available on the initial
            hand or directly after splitting. After this move, the hand is
            completely frozen. This option is offered at most casinos, but some
            only allow to double-down on a hand with a value of 9, 10 or 11.
          </p>
          <p>
            3. Splitting is a move where the player creates two new hands out of
            one hand consisting of two cards with the same value. The player has
            to put down another bet equal to the initial bet at the newly
            created hand. The first of two hands receives a new card and the
            player can play this hand just like normal. Once this side is done,
            the second hand gets a card and the same thing happens. If the new
            hand is a pair again, the player can decide to split again. Most
            casinos restrict the number of splits to a number normally between 1
            and 3. Some casinos allow unlimited splits.
          </p>
          <p>
            4. This setting influences whether or not the player is allowed to
            hit or double-down after having split a pair of aces. Most casinos
            do not allow this.
          </p>
          <p>
            5. This settings influences whether or not the player is allowed to
            split once more after having split aces and receiving another ace.
            Most casinos do not allow this.
          </p>
          <p>
            6. This settings influences whether the player is allowed to
            double-down on a hand after having split. Some casinos do not allow
            this.
          </p>
          <p>
            7. The move of the dealer when they get a soft 17 hand. This differs
            wildly accross regions; for example in Las Vegas they almost
            universally hit and in Europe they almost always stand.
          </p>
          <p>
            8. The payout the player gets when they have a blackjack. The
            traditional payout is 3 to 2, meaning the player wins 1.5x their bet
            (on top of getting back their initial bet). Some casinos offer a 6
            to 5 payout, meaning the player wins just 1.2x their bet.
          </p>
          <p>
            9. The minimum percentage of the cards that have already been played
            for the dealer to decide to reshuffle the deck. This is basically at
            which percentage the cut card is put.
          </p>
          <p>
            10. The number of decks to play the game with. Most common are 4, 6
            and 8 decks.
          </p>
          <p>
            11. The number of web worker threads the simulator spawns. In
            general, more threads results in faster simulations. However, do
            keep in mind that more threads will slow down your device more, and
            that more threads than physical CPU cores will generally not result
            in faster calculations.
          </p>
        </div>
      )}
    </BorderedBox>
  );
}
