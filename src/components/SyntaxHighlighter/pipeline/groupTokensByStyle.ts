import { SpecialValueConfig, LexedToken, TokenGroup, TokenKind } from "./types";
import { tokenKindToClass } from "../SyntaxHighlighter.styles";
import { GroupingState, HandlerResult, buildGroup } from "./grouping";
import { handleRegularValue, detectSpecialTrigger, handleSpecialValue } from "./grouping";

const initializeGroupingState = (): GroupingState => ({
  currentStyle: "",
  tokens: [],
  activeSpecial: null,
});

/**
 * Checks whether the current token should activate special-value mode.
 * Returns a HandlerResult that flushes the open group and emits the triggering colon,
 * or null if no transition applies. A null return means the caller should dispatch
 * through the normal per-token handlers instead.
 */
const tryModeTransition = (
  state: GroupingState,
  text: string,
  displayText: string,
  kind: TokenKind,
  prevToken: string | null,
  prevKind: TokenKind | null,
  specialValues: SpecialValueConfig[]
): HandlerResult | null => {
  if (state.activeSpecial) return null;
  const config = detectSpecialTrigger(prevToken, prevKind, text, specialValues);
  if (!config) return null;
  return {
    state: {
      currentStyle: config.valueColor,
      tokens: [],
      activeSpecial: config,
    },
    emitted: [
      ...buildGroup(state.tokens, state.currentStyle),
      { text: displayText, className: tokenKindToClass[kind] },
    ],
  };
};

/**
 * Reduces a flat token array into display groups by running a three-mode state machine:
 *
 *  - **Regular mode** (`handleRegularValue`): merges consecutive same-style tokens.
 *  - **Colon isolation**: always emits `:` as its own group; also promotes the colon
 *    to `functionKey` style when the preceding token was a function key.
 *  - **Special-value mode** (`handleSpecialValue`): accumulates tokens after a trigger
 *    key's colon into a single colored group until the configured terminator is reached.
 *
 * `text` (raw, no trailing space) is used for comparisons — trigger-key matching and
 * colon detection. `displayText` (with trailing space when `trailingSpace` is set) is
 * used for emission. `prevToken` tracks raw text for the same reason: trigger-key
 * comparison must be against the clean identifier, not the spaced display form.
 */
export const groupTokensByStyle = (
  tokensWithStyles: LexedToken[],
  specialValues: SpecialValueConfig[]
): TokenGroup[] => {
  const groups: TokenGroup[] = [];
  let state: GroupingState = initializeGroupingState();
  let prevToken: string | null = null;
  let prevKind: TokenKind | null = null;

  for (let i = 0; i < tokensWithStyles.length; i++) {
    const { text, kind, trailingSpace } = tokensWithStyles[i];
    const displayText = trailingSpace ? `${text} ` : text;
    const isLastToken = i === tokensWithStyles.length - 1;

    const transition = tryModeTransition(
      state,
      text,
      displayText,
      kind,
      prevToken,
      prevKind,
      specialValues
    );
    if (transition) {
      groups.push(...transition.emitted);
      state = transition.state;
      prevToken = text;
      prevKind = kind;
      continue;
    }

    let result: HandlerResult;
    if (state.activeSpecial) {
      result = handleSpecialValue(state, text, displayText, kind, isLastToken);
    } else if (text === ":") {
      const colonStyle =
        prevKind === "functionKey" ? tokenKindToClass.functionKey : tokenKindToClass[kind];
      result = {
        state: { ...state, currentStyle: "", tokens: [] },
        emitted: [
          ...buildGroup(state.tokens, state.currentStyle),
          { text: displayText, className: colonStyle },
        ],
      };
    } else {
      result = handleRegularValue(state, displayText, tokenKindToClass[kind]);
    }

    groups.push(...result.emitted);
    state = result.state;
    prevToken = text;
    prevKind = kind;
  }

  groups.push(...buildGroup(state.tokens, state.currentStyle));

  return groups;
};
