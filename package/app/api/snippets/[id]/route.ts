/**
 * Snippet Detail API Route
 * Handles operations on individual snippets
 */

import { NextRequest, NextResponse } from 'next/server';
import { SnippetService } from '@/lib/db/snippets';

/**
 * GET /api/snippets/[id]
 * Get a specific snippet by ID with tags
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid snippet ID' },
        { status: 400 }
      );
    }

    const snippet = SnippetService.getSnippetById(id);

    if (!snippet) {
      return NextResponse.json(
        { error: 'Snippet not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(snippet);
  } catch (error) {
    console.error('Error fetching snippet:', error);
    return NextResponse.json(
      { error: 'Failed to fetch snippet' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/snippets/[id]
 * Update a snippet with tags
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid snippet ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, content, language, tags } = body;

    // Validate tags if provided
    if (tags !== undefined) {
      if (!Array.isArray(tags)) {
        return NextResponse.json(
          { error: 'Tags must be an array' },
          { status: 400 }
        );
      }

      if (tags.length === 0) {
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
    }

    const snippet = SnippetService.updateSnippet(id, {
      title,
      content,
      language,
      tags,
    });

    if (!snippet) {
      return NextResponse.json(
        { error: 'Snippet not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(snippet);
  } catch (error) {
    console.error('Error updating snippet:', error);
    return NextResponse.json(
      { error: 'Failed to update snippet' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/snippets/[id]
 * Delete a snippet
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid snippet ID' },
        { status: 400 }
      );
    }

    const success = SnippetService.deleteSnippet(id);

    if (!success) {
      return NextResponse.json(
        { error: 'Snippet not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting snippet:', error);
    return NextResponse.json(
      { error: 'Failed to delete snippet' },
      { status: 500 }
    );
  }
}
