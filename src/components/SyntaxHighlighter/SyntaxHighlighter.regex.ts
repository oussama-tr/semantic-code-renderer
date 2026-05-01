const escapeRegex = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Builds the tokenizer regex for the given set of function-key identifiers.
 *
 * Group ordering is load-bearing: more-specific groups must come before broader ones.
 * `functionKeyGroup` is inserted directly before `identifierGroup` so configured
 * identifiers are captured with function-key priority rather than falling through
 * to plain identifier matching.
 */
export const buildSyntaxRegex = (functionKeys: string[]): RegExp => {
  const functionKeyPart =
    functionKeys.length > 0
      ? `(?<functionKeyGroup>\\b(?:${functionKeys.map(escapeRegex).join("|")})\\b)|`
      : "";
  return new RegExp(
    `(?<whitespaceGroup>\\s+)|` +
      `(?<braceGroup>[{}()\\[\\]])|` +
      `(?<punctuationGroup>[.,;:])|` +
      `(?<operatorGroup>[+\\-*/=<>]=?|&&|\\|\\|)|` +
      `(?<stringGroup>'[^']*'|".*?")|` +
      `(?<booleanGroup>\\b(?:true|false)\\b)|` +
      `(?<keywordGroup>\\b(?:const|function|return|this)\\b)|` +
      `(?<numberGroup>\\b\\d+(?:\\.\\d+)?\\b)|` +
      functionKeyPart +
      `(?<identifierGroup>\\b[a-zA-Z_][a-zA-Z0-9_]*\\b)`,
    "g"
  );
};
