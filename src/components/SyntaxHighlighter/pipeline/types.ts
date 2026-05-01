/** Configures a special-value span: tokens between `triggerKey:` and `terminator`
 *  (default `","`) are rendered with `valueColor`. The trigger fires only when the
 *  trigger key carries default text color, distinguishing it from identically named
 *  tokens with non-default styling. */
export type SpecialValueConfig = {
  triggerKey: string;
  valueColor: string;
  terminator?: string;
};

export type TokenKind =
  | "keyword"
  | "operator"
  | "brace"
  | "punctuation"
  | "boolean"
  | "number"
  | "string"
  | "quote"
  | "functionKey"
  | "default";

export type TokenGroup = { text: string; className: string };

/** Output of the lexer — a raw token assigned a semantic kind.
 *  Callers derive the CSS class via `tokenKindToClass[kind]`. */
export type LexedToken = {
  text: string;
  kind: TokenKind;
  /** Whether whitespace immediately followed this token in the source. The grouper
   *  appends a space to the display text when building groups, keeping lexical
   *  token text clean while preserving rendered spacing. */
  trailingSpace: boolean;
};
