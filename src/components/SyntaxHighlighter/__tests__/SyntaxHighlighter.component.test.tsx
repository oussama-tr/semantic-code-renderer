import { render, screen } from "@testing-library/react";
import SyntaxHighlighter from "../SyntaxHighlighter";
import { tokenStyles } from "../SyntaxHighlighter.styles";

describe("SyntaxHighlighter component", () => {
  it("renders lines with indentation classes and special value spans", () => {
    const dsl = ["const data = {", "  name: 'alpha',", "  info: A sample value,", "}"].join("\n");

    render(
      <SyntaxHighlighter
        data={dsl}
        specialValues={[{ triggerKey: "info", valueColor: tokenStyles.special }]}
      />
    );

    const code = screen.getByLabelText("Code snippet");
    expect(code.children[1]).toHaveClass("ml-4");

    expect(screen.getByText(/A sample value/)).toHaveClass(tokenStyles.special);
  });

  it("recolors the colon after a function key", () => {
    render(<SyntaxHighlighter data="handler:" functionKeys={["handler"]} />);

    const code = screen.getByLabelText("Code snippet");
    expect(code.children[0]?.textContent).toContain("handler:");
    expect(screen.getByText(":")).toHaveClass(tokenStyles.functionKey);
  });
});
