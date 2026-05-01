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

export type LexedToken = {
  text: string;
  kind: TokenKind;
  trailingSpace: boolean;
};
