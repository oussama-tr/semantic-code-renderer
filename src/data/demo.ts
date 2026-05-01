export const demoTokens = `const sample = {
  active: true,
  count: 42,
  label: "demo",
  ratio: 3.14,
};`;

export const demoOperators = `const result = a >= b && c <= d || e === f;`;

export const demoNesting = `const list = {
  items: [
    { key: "a", value: 1 },
    { key: "b", value: 2 },
  ],
};`;

export const demoFunctionKeys = `const widget = {
  handler: function() {
    return this.util();
  },
  util: function() {
    return null;
  },
};`;

export const demoSpecialValues = `const record = {
  name: "entry",
  type: Primary,
  info: A concise summary of the entry,
};`;

export const demoIndent = `function outer() {
  if (true) {
    return "nested";
  }
}`;
