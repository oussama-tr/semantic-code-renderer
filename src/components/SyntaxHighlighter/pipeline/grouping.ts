import { SpecialValueConfig, TokenGroup, TokenKind } from "./types";
import { tokenKindToClass } from "../SyntaxHighlighter.styles";

/** Mutable accumulator threaded through each token in the grouper loop. */
export type GroupingState = {
  /** Tailwind class of the group currently being accumulated; empty when no group is open. */
  currentStyle: string;
  /** Raw display-text fragments collected for the open group. */
  tokens: string[];
  /** Non-null while inside a special-value span (between a trigger key's colon and its terminator). */
  activeSpecial: SpecialValueConfig | null;
};

export type HandlerResult = {
  state: GroupingState;
  emitted: TokenGroup[];
};

export const buildGroup = (tokens: string[], className: string): TokenGroup[] => {
  if (tokens.length < 1) return [];
  return [{ text: tokens.join(""), className }];
};

/**
 * Accumulates consecutive tokens that share a style into one open group.
 * When the incoming style differs from the current group's style, the open group
 * is flushed and a new one is started with the incoming token.
 *
 * Nothing is emitted mid-group — `emitted` is only non-empty on a style boundary,
 * so callers must flush any remaining open group after the final token.
 */
export const handleRegularValue = (
  state: GroupingState,
  token: string,
  style: string
): HandlerResult => {
  if (style === state.currentStyle) {
    return {
      state: { ...state, tokens: [...state.tokens, token] },
      emitted: [],
    };
  }

  return {
    state: {
      currentStyle: style,
      tokens: [token],
      activeSpecial: state.activeSpecial,
    },
    emitted: buildGroup(state.tokens, state.currentStyle),
  };
};

/**
 * Returns the matching SpecialValueConfig when the current token is a colon preceded
 * by a trigger key with default kind — the signal that a special-value span
 * should begin. Returns undefined otherwise.
 */
export const detectSpecialTrigger = (
  prevToken: string | null,
  prevKind: TokenKind | null,
  currentToken: string,
  specialValues: SpecialValueConfig[]
): SpecialValueConfig | undefined => {
  if (!prevToken || currentToken !== ":") return undefined;
  return specialValues.find((config) => config.triggerKey === prevToken && prevKind === "default");
};

/**
 * Accumulates tokens inside a special-value span. When the terminator is reached
 * as the last token on the line, the accumulated group is flushed and special-value
 * mode is deactivated.
 */
export const handleSpecialValue = (
  state: GroupingState,
  text: string,
  displayText: string,
  kind: TokenKind,
  isLastToken: boolean
): HandlerResult => {
  const terminator = state.activeSpecial?.terminator ?? ",";
  if (text === terminator && isLastToken) {
    return {
      state: { ...state, activeSpecial: null, currentStyle: "", tokens: [] },
      emitted: [
        ...buildGroup(state.tokens, state.currentStyle),
        { text: displayText, className: tokenKindToClass[kind] },
      ],
    };
  }
  return {
    state: { ...state, tokens: [...state.tokens, displayText] },
    emitted: [],
  };
};
