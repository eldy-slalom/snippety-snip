/**
 * Shared language options used across UI, validation, and persistence layers.
 * Options are sorted alphabetically by their display label to match UX expectations.
 */

export const LANGUAGE_OPTIONS = [
  { id: "c-sharp", label: "C#" },
  { id: "c-plus-plus", label: "C++" },
  { id: "css", label: "CSS" },
  { id: "go", label: "Go" },
  { id: "html", label: "HTML" },
  { id: "java", label: "Java" },
  { id: "javascript", label: "JavaScript" },
  { id: "json", label: "JSON" },
  { id: "kotlin", label: "Kotlin" },
  { id: "markdown", label: "Markdown" },
  { id: "other", label: "Other" },
  { id: "php", label: "PHP" },
  { id: "powershell", label: "PowerShell" },
  { id: "python", label: "Python" },
  { id: "ruby", label: "Ruby" },
  { id: "rust", label: "Rust" },
  { id: "shell-bash", label: "Shell/Bash" },
  { id: "sql", label: "SQL" },
  { id: "swift", label: "Swift" },
  { id: "typescript", label: "TypeScript" },
  { id: "yaml", label: "YAML" },
] as const;

export type LanguageOption = (typeof LANGUAGE_OPTIONS)[number];
export type LanguageId = LanguageOption["id"];

export const LANGUAGE_IDS: LanguageId[] = LANGUAGE_OPTIONS.map(
  (option) => option.id
);

export const LANGUAGE_LABEL_BY_ID: Record<LanguageId, string> =
  LANGUAGE_OPTIONS.reduce<Record<LanguageId, string>>((acc, option) => {
    acc[option.id] = option.label;
    return acc;
  }, {} as Record<LanguageId, string>);
