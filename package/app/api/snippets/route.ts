/**
 * API route handler for /api/snippets
 * Handles POST requests to create new snippets
 */

import { NextRequest, NextResponse } from "next/server";
import { SnippetService } from "../../../lib/db/snippets";
import { validateSnippetData } from "../../../utils/snippet-validators";
import type {
  CreateSnippetData,
  CreateSnippetResponse,
  ApiErrorResponse,
} from "../../../types/snippet";

/**
 * POST /api/snippets - Create a new snippet
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<CreateSnippetResponse | ApiErrorResponse>> {
  try {
    // Parse request body
    const body = (await request.json()) as CreateSnippetData;

    // Validate input data
    const validationErrors = validateSnippetData({
      title: body.title,
      content: body.content,
      language: body.language,
      tags: body.tags,
    });

    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationErrors,
        } as ApiErrorResponse,
        { status: 400 }
      );
    }

    // Create snippet using service layer
    const snippet = SnippetService.createBasicSnippet(body);

    // Return created snippet
    return NextResponse.json({ snippet } as CreateSnippetResponse, {
      status: 201,
    });
  } catch (error) {
    console.error("Error creating snippet:", error);

    // Return generic error message to client
    return NextResponse.json(
      {
        error: "Failed to create snippet. Please try again.",
      } as ApiErrorResponse,
      { status: 500 }
    );
  }
}

/**
 * GET /api/snippets - Get all snippets (for future use)
 */
export async function GET(): Promise<NextResponse> {
  try {
    const snippets = SnippetService.getAllBasicSnippets();
    return NextResponse.json({ snippets }, { status: 200 });
  } catch (error) {
    console.error("Error fetching snippets:", error);
    return NextResponse.json(
      { error: "Failed to fetch snippets" } as ApiErrorResponse,
      { status: 500 }
    );
  }
}
