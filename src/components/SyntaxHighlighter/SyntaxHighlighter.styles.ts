import { TokenKind } from "./pipeline/types";

/** Color registry — holds all named Tailwind classes used by the highlighter. */
const tokenStyles = {
  keyword: "text-pink-500",
  operator: "text-pink-500",
  brace: "text-gray-400",
  punctuation: "text-gray-400",
  boolean: "text-orange-500",
  number: "text-orange-500",
  string: "text-yellow-400",
  quote: "text-gray-400",
  functionKey: "text-green-400",
  special: "text-cyan-400",
  default: "text-white",
} as const;

/** Token kind → CSS class map used by the pipeline. */
export const tokenKindToClass: Record<TokenKind, string> = {
  keyword: tokenStyles.keyword,
  operator: tokenStyles.operator,
  brace: tokenStyles.brace,
  punctuation: tokenStyles.punctuation,
  boolean: tokenStyles.boolean,
  number: tokenStyles.number,
  string: tokenStyles.string,
  quote: tokenStyles.quote,
  functionKey: tokenStyles.functionKey,
  default: tokenStyles.default,
};

const margins = {
  2: "ml-4 lg:ml-8",
  4: "ml-8 lg:ml-16",
  6: "ml-12 lg:ml-24",
} as const;

export { tokenStyles, margins };
