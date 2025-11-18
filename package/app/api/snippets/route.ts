/**
 * Snippets API Route
 * Handles snippet creation and listing operations
 */

import { NextRequest, NextResponse } from 'next/server';
import { SnippetService } from '@/lib/db/snippets';

/**
 * GET /api/snippets
 * Get all snippets with tags
 */
export async function GET() {
  try {
    const snippets = SnippetService.getAllSnippets();
    return NextResponse.json(snippets);
  } catch (error) {
    console.error('Error fetching snippets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch snippets' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/snippets
 * Create a new snippet with tags
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, language, tags } = body;

    // Validate required fields
    if (!title || !content || !language) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content, or language' },
        { status: 400 }
      );
    }

    // Validate tags
    if (!tags || !Array.isArray(tags) || tags.length === 0) {
      return NextResponse.json(
        { error: 'At least one tag is required' },
        { status: 400 }
      );
    }

    if (tags.length > 5) {
      return NextResponse.json(
        { error: 'Maximum of 5 tags allowed' },
        { status: 400 }
      );
    }

    // Create snippet with tags
    const snippet = SnippetService.createSnippet({
      title,
      content,
      language,
      tags,
    });

    return NextResponse.json(snippet, { status: 201 });
  } catch (error) {
    console.error('Error creating snippet:', error);
    return NextResponse.json(
      { error: 'Failed to create snippet' },
      { status: 500 }
    );
  }
}
