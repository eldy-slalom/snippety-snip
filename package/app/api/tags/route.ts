/**
 * GET /api/tags
 * Tag autocomplete endpoint
 * Returns tags matching the query prefix
 */

import { NextResponse } from 'next/server';
import { TagService } from '@/lib/db/tags';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    // Validate query parameter
    if (query === null) {
      return NextResponse.json(
        {
          error: 'Invalid query parameter',
          message: 'Query parameter \'q\' is required',
        },
        { status: 400 }
      );
    }

    if (typeof query !== 'string') {
      return NextResponse.json(
        {
          error: 'Invalid query parameter',
          message: 'Query parameter \'q\' must be a string',
        },
        { status: 400 }
      );
    }

    // Get matching tags (max 8)
    const tags = TagService.getTagsByPrefix(query, 8);

    return NextResponse.json(tags, { status: 200 });
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Failed to fetch tags',
      },
      { status: 500 }
    );
  }
}
