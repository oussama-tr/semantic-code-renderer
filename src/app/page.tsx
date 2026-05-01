import SyntaxHighlighter from "@/components/SyntaxHighlighter/SyntaxHighlighter";
import { tokenStyles } from "@/components/SyntaxHighlighter/SyntaxHighlighter.styles";
import {
  demoTokens,
  demoOperators,
  demoNesting,
  demoFunctionKeys,
  demoSpecialValues,
  demoIndent,
} from "@/data/demo";

const demoSpecialValueConfigs = [
  { triggerKey: "type", valueColor: tokenStyles.special },
  { triggerKey: "info", valueColor: tokenStyles.special },
];

const demoFunctionKeyList = ["handler", "util"];

const Section = ({ label }: { label: string }) => (
  <h3 className="p-4 text-white/50 font-mono text-xs uppercase tracking-widest">{label}</h3>
);

export default function Home() {
  return (
    <div>
      <main>
        <Section label="Basic Tokens" />
        <SyntaxHighlighter data={demoTokens} />

        <Section label="Compound Operators" />
        <SyntaxHighlighter data={demoOperators} />

        <Section label="Nested Structures" />
        <SyntaxHighlighter data={demoNesting} />

        <Section label="Function Keys" />
        <SyntaxHighlighter data={demoFunctionKeys} functionKeys={demoFunctionKeyList} />

        <Section label="Special Values" />
        <SyntaxHighlighter data={demoSpecialValues} specialValues={demoSpecialValueConfigs} />

        <Section label="Multi-level Indentation" />
        <SyntaxHighlighter data={demoIndent} />
      </main>
    </div>
  );
}
