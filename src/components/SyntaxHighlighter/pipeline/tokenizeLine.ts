import { TokenKind, LexedToken } from "./types";

const tok = (text: string, kind: TokenKind): LexedToken => ({ text, kind, trailingSpace: false });

/** Tokenizes a single source line into styled tokens using the provided regex.
 *  Build the regex with `buildSyntaxRegex` — group ordering in the pattern
 *  determines dispatch priority. */
export const tokenizeLine = (line: string, regex: RegExp): LexedToken[] => {
  const tokens: LexedToken[] = [];

  for (const match of line.matchAll(regex)) {
    const {
      whitespaceGroup,
      braceGroup,
      punctuationGroup,
      operatorGroup,
      stringGroup,
      booleanGroup,
      keywordGroup,
      numberGroup,
      functionKeyGroup,
      identifierGroup,
    } = match.groups!;

    if (numberGroup) {
      tokens.push(tok(numberGroup, "number"));
    } else if (stringGroup) {
      tokens.push(
        tok(stringGroup[0], "quote"),
        tok(stringGroup.slice(1, -1), "string"),
        tok(stringGroup[0], "quote")
      );
    } else if (whitespaceGroup) {
      const lastIndex = tokens.length - 1;
      if (lastIndex >= 0) tokens[lastIndex] = { ...tokens[lastIndex], trailingSpace: true };
    } else if (functionKeyGroup) {
      tokens.push(tok(functionKeyGroup, "functionKey"));
    } else if (braceGroup) {
      tokens.push(tok(braceGroup, "brace"));
    } else if (punctuationGroup) {
      tokens.push(tok(punctuationGroup, "punctuation"));
    } else if (operatorGroup) {
      tokens.push(tok(operatorGroup, "operator"));
    } else if (booleanGroup) {
      tokens.push(tok(booleanGroup, "boolean"));
    } else if (keywordGroup) {
      tokens.push(tok(keywordGroup, "keyword"));
    } else if (identifierGroup) {
      tokens.push(tok(identifierGroup, "default"));
    }
  }

  return tokens;
};
