export interface CodeBlockDisplaySettings {
  showLineNumbers: boolean;
  theme: "dark" | "light";
}

export const defaultCodeBlockSettings: CodeBlockDisplaySettings = {
  showLineNumbers: true,
  theme: "dark",
};
