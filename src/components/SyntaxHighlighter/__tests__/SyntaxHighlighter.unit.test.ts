import { buildSyntaxRegex } from "../SyntaxHighlighter.regex";
import { TokenKind, LexedToken } from "../pipeline/types";
import { tokenizeLine } from "../pipeline/tokenizeLine";

const tw = (text: string, kind: TokenKind, trailingSpace = false): LexedToken => ({
  text,
  kind,
  trailingSpace,
});

describe("tokenizeLine", () => {
  const baseRegex = buildSyntaxRegex([]);
  const handlerRegex = buildSyntaxRegex(["handler"]);

  describe("token classification", () => {
    it("should associate keyword tokens with the keyword kind", () => {
      const tokens = tokenizeLine("const function return this", baseRegex);

      expect(tokens).toEqual([
        tw("const", "keyword", true),
        tw("function", "keyword", true),
        tw("return", "keyword", true),
        tw("this", "keyword"),
      ]);
    });

    it("should associate operator tokens with the operator kind", () => {
      const tokens = tokenizeLine("= && >", baseRegex);

      expect(tokens).toEqual([
        tw("=", "operator", true),
        tw("&&", "operator", true),
        tw(">", "operator"),
      ]);
    });

    it("should associate brace tokens with the brace kind", () => {
      const tokens = tokenizeLine("{ } ( ) [ ]", baseRegex);

      expect(tokens).toEqual([
        tw("{", "brace", true),
        tw("}", "brace", true),
        tw("(", "brace", true),
        tw(")", "brace", true),
        tw("[", "brace", true),
        tw("]", "brace"),
      ]);
    });

    it("should associate punctuation tokens with the punctuation kind", () => {
      const tokens = tokenizeLine(", ;", baseRegex);

      expect(tokens).toEqual([tw(",", "punctuation", true), tw(";", "punctuation")]);
    });

    it("should associate boolean tokens with the boolean kind", () => {
      const tokens = tokenizeLine("true false", baseRegex);

      expect(tokens).toEqual([tw("true", "boolean", true), tw("false", "boolean")]);
    });

    it("should associate numeric tokens with the number kind", () => {
      expect(tokenizeLine("123", baseRegex)).toEqual([tw("123", "number")]);
    });

    it("should associate string tokens with quote and string kinds", () => {
      expect(tokenizeLine(`'hello'`, baseRegex)).toEqual([
        tw("'", "quote"),
        tw("hello", "string"),
        tw("'", "quote"),
      ]);
    });

    it("should associate unknown tokens with the default kind", () => {
      expect(tokenizeLine("unknownToken", baseRegex)).toEqual([tw("unknownToken", "default")]);
    });

    it("should style a function key token as functionKey; colon recoloring is the grouper's responsibility", () => {
      expect(tokenizeLine("handler:", handlerRegex)).toEqual([
        tw("handler", "functionKey"),
        tw(":", "punctuation"),
      ]);
    });

    it("should style a lone function key token as functionKey", () => {
      expect(tokenizeLine("handler", handlerRegex)).toEqual([tw("handler", "functionKey")]);
    });

    it("should emit tokens following a function key normally", () => {
      expect(tokenizeLine("handler.", handlerRegex)).toEqual([
        tw("handler", "functionKey"),
        tw(".", "punctuation"),
      ]);
    });

    it("should split operator tokens containing = and style each part as operator", () => {
      expect(tokenizeLine("x=123", baseRegex)).toEqual([
        tw("x", "default"),
        tw("=", "operator"),
        tw("123", "number"),
      ]);
    });

    it("should classify multi-char operators as a single operator token", () => {
      expect(tokenizeLine(">=", baseRegex)).toEqual([tw(">=", "operator")]);
    });

    it("should tokenize triple-equals as two operator tokens matching regex greediness", () => {
      expect(tokenizeLine("===", baseRegex)).toEqual([tw("==", "operator"), tw("=", "operator")]);
    });

    it("should escape regex special characters in function keys", () => {
      const regex = buildSyntaxRegex(["my+key"]);
      expect(tokenizeLine("my+key:", regex)).toEqual([
        tw("my+key", "functionKey"),
        tw(":", "punctuation"),
      ]);
    });
  });

  describe("whitespace handling", () => {
    it("should mark the token preceding whitespace with trailingSpace", () => {
      expect(tokenizeLine("const function", baseRegex)).toEqual([
        tw("const", "keyword", true),
        tw("function", "keyword"),
      ]);
    });

    it("should treat multiple consecutive whitespace characters as a single trailing space", () => {
      expect(tokenizeLine("const    function", baseRegex)).toEqual([
        tw("const", "keyword", true),
        tw("function", "keyword"),
      ]);
    });

    it("should drop leading whitespace with no effect on token text", () => {
      expect(tokenizeLine("  const", baseRegex)).toEqual([tw("const", "keyword")]);
    });

    it("should mark the last token with trailingSpace when the line ends with whitespace", () => {
      expect(tokenizeLine("const  ", baseRegex)).toEqual([tw("const", "keyword", true)]);
    });
  });

  describe("edge cases", () => {
    it("should return an empty array for an empty line", () => {
      expect(tokenizeLine("", baseRegex)).toEqual([]);
    });

    it("should return an empty array for a whitespace-only line", () => {
      expect(tokenizeLine("   ", baseRegex)).toEqual([]);
    });

    it("should handle a compound expression correctly", () => {
      const tokens = tokenizeLine(`const x = { key: 'value', num: 123 };`, baseRegex);

      expect(tokens).toEqual([
        tw("const", "keyword", true),
        tw("x", "default", true),
        tw("=", "operator", true),
        tw("{", "brace", true),
        tw("key", "default"),
        tw(":", "punctuation", true),
        tw("'", "quote"),
        tw("value", "string"),
        tw("'", "quote"),
        tw(",", "punctuation", true),
        tw("num", "default"),
        tw(":", "punctuation", true),
        tw("123", "number", true),
        tw("}", "brace"),
        tw(";", "punctuation"),
      ]);
    });
  });
});
