# Tags API Contract

**Date**: 2025-01-27  
**Feature**: 001-snippet-tags

## Overview

RESTful API endpoint for tag autocomplete functionality. This endpoint provides tag suggestions as users type in the tag input field.

## Endpoint

### GET /api/tags

Get tag suggestions for autocomplete based on prefix matching.

**Path**: `/api/tags`  
**Method**: `GET`  
**Authentication**: None (local-first application)

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | string | Yes | Prefix to match against tag names (case-insensitive) |

#### Request Example

```http
GET /api/tags?q=java HTTP/1.1
Host: localhost:3000
```

#### Response

**Status Code**: `200 OK`

**Content-Type**: `application/json`

**Body**:

```json
[
  {
    "id": 1,
    "name": "javascript",
    "created_at": "2025-01-27T10:00:00Z"
  },
  {
    "id": 2,
    "name": "java",
    "created_at": "2025-01-27T09:30:00Z"
  }
]
```

#### Response Schema

```typescript
interface Tag {
  id: number;
  name: string;
  created_at: string; // ISO 8601 format
}

type TagsResponse = Tag[];
```

#### Behavior

- **Prefix Matching**: Returns tags where `name` starts with the query prefix (case-insensitive)
- **Limit**: Maximum 8 tags returned
- **Ordering**: Results ordered alphabetically by tag name
- **Empty Query**: If `q` is empty or missing, returns empty array `[]`
- **No Matches**: Returns empty array `[]` if no tags match

#### Error Responses

**400 Bad Request**: Invalid query parameter format

```json
{
  "error": "Invalid query parameter",
  "message": "Query parameter 'q' must be a string"
}
```

**500 Internal Server Error**: Database error

```json
{
  "error": "Internal server error",
  "message": "Failed to fetch tags"
}
```

## Implementation Notes

- Endpoint should be fast (<200ms for 90% of requests per SC-002)
- Use parameterized queries to prevent SQL injection
- Case-insensitive matching: convert query to lowercase before database query
- Database query uses indexed `name` column for efficient prefix matching
- Results limited to 8 tags for performance and UX

## Example Usage

### JavaScript/TypeScript

```typescript
async function getTagSuggestions(prefix: string): Promise<Tag[]> {
  const response = await fetch(`/api/tags?q=${encodeURIComponent(prefix)}`);
  if (!response.ok) {
    throw new Error('Failed to fetch tag suggestions');
  }
  return response.json();
}
```

### cURL

```bash
curl "http://localhost:3000/api/tags?q=java"
```

