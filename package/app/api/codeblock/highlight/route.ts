import { NextRequest, NextResponse } from "next/server";
import { getHighlighter } from "shiki";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, language, theme } = body;

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Invalid input: content is required and must be a string" },
        { status: 400 }
      );
    }

    if (!language || typeof language !== "string") {
      return NextResponse.json(
        { error: "Invalid input: language is required and must be a string" },
        { status: 400 }
      );
    }

    if (!theme || !["dark", "light"].includes(theme)) {
      return NextResponse.json(
        { error: 'Invalid input: theme must be "dark" or "light"' },
        { status: 400 }
      );
    }

    // Initialize Shiki highlighter
    const highlighter = await getHighlighter({
      themes: ["github-dark", "github-light"],
      langs: [
        "javascript",
        "typescript",
        "python",
        "java",
        "cpp",
        "csharp",
        "go",
        "rust",
        "ruby",
        "php",
        "swift",
        "kotlin",
        "html",
        "css",
        "sql",
        "json",
        "yaml",
        "markdown",
        "bash",
        "powershell",
      ],
    });

    // Determine the Shiki theme
    const shikiTheme = theme === "dark" ? "github-dark" : "github-light";

    // Check if language is supported
    const supportedLangs = highlighter.getLoadedLanguages();
    const normalizedLang = language.toLowerCase();

    let html: string;
    if (supportedLangs.includes(normalizedLang)) {
      // Highlight the code
      html = highlighter.codeToHtml(content, {
        lang: normalizedLang,
        theme: shikiTheme,
      });
    } else {
      // Fallback to plain text
      html = `<pre><code>${escapeHtml(content)}</code></pre>`;
    }

    return NextResponse.json({ html }, { status: 200 });
  } catch (error) {
    console.error("Highlighting error:", error);
    return NextResponse.json(
      { error: "Failed to highlight code" },
      { status: 500 }
    );
  }
}

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
