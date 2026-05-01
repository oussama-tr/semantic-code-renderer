import React, { useMemo } from "react";
import { margins } from "./SyntaxHighlighter.styles";
import { buildSyntaxRegex } from "./SyntaxHighlighter.regex";
import { SpecialValueConfig, TokenGroup } from "./pipeline/types";
import { groupTokensByStyle } from "./pipeline/groupTokensByStyle";
import { tokenizeLine } from "./pipeline/tokenizeLine";

type SyntaxHighlighterProps = {
  data: string;
  /** Identifier–color pairs that trigger special-value coloring. When a configured
   *  `triggerKey` precedes a colon with default styling, subsequent tokens are rendered
   *  with `valueColor` until the terminator (default `","`) is reached. */
  specialValues?: SpecialValueConfig[];
  /** Identifiers to style as function keys. The grouper also recolors the immediately
   *  following colon to match. Pass a stable reference to avoid rebuilding the regex. */
  functionKeys?: string[];
};

const renderGroups = (groups: TokenGroup[]) =>
  groups.map(({ text, className }, index) => (
    <span key={`${className}-${index}`} className={className}>
      {text}
    </span>
  ));

const SyntaxHighlighter: React.FC<SyntaxHighlighterProps> = ({
  data,
  specialValues = [],
  functionKeys = [],
}) => {
  const regex = useMemo(() => buildSyntaxRegex(functionKeys), [functionKeys]);

  const lines = useMemo(() => {
    return data.split("\n").map((line) => {
      const leadingSpaces = line.length - line.trimStart().length;
      const marginClass = margins[leadingSpaces as keyof typeof margins] ?? "";
      const groups = groupTokensByStyle(tokenizeLine(line, regex), specialValues);
      return { groups, marginClass };
    });
  }, [data, regex, specialValues]);

  return (
    <div className="p-4">
      <code
        aria-label="Code snippet"
        className="font-mono font-bold text-xs md:text-sm lg:text-base"
      >
        {lines.map(({ groups, marginClass }, index) => (
          <div key={index} className={marginClass}>
            {renderGroups(groups)}
          </div>
        ))}
      </code>
    </div>
  );
};

export default SyntaxHighlighter;
