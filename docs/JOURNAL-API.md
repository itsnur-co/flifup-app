# Journal API Documentation

## Overview

The Journal API provides endpoints for managing gratitude journal entries with mood tracking, categories, and insights. Users can create journal entries with moods/feelings, organize them by categories, and get insights about their mood patterns over time.

---

## Authentication

All endpoints require JWT authentication. Include the Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## Mood Values

| Emoji | Value        | Description      |
| ----- | ------------ | ---------------- |
| 😁    | `VERY_HAPPY` | Feeling amazing  |
| 🙂    | `HAPPY`      | Feeling good     |
| 😐    | `NEUTRAL`    | Feeling okay     |
| 😟    | `SAD`        | Feeling down     |
| 😭    | `VERY_SAD`   | Feeling terrible |

---

## Visibility Options

| Value     | Description               |
| --------- | ------------------------- |
| `ONLY_ME` | Private journal (default) |
| `SHARED`  | Visible to others         |

---

## Default Categories

When a user first accesses categories, the following defaults are created:

| Name       | Icon | Color   |
| ---------- | ---- | ------- |
| Exercise   | 🏃   | #10B981 |
| Prayer     | 🙏   | #8B5CF6 |
| Diet       | 🥗   | #F59E0B |
| Meditation | 🧘   | #6366F1 |
| Sleep      | 😴   | #3B82F6 |
| Hydration  | 💧   | #06B6D4 |

---

## Journal Endpoints

### Create Journal

Create a new journal entry.

**POST** `/journals`

**Request Body:**

```json
{
  "title": "Morning Gratitude",
  "description": "Grateful for a good night's sleep and a fresh start",
  "categoryId": "category-uuid",
  "mood": "HAPPY",
  "visibility": "ONLY_ME"
}
```

| Field       | Type   | Required | Description                               |
| ----------- | ------ | -------- | ----------------------------------------- |
| title       | string | Yes      | Journal title (1-200 chars)               |
| description | string | No       | Journal content                           |
| categoryId  | string | No       | Category UUID                             |
| mood        | enum   | No       | VERY_HAPPY, HAPPY, NEUTRAL, SAD, VERY_SAD |
| visibility  | enum   | No       | ONLY_ME (default) or SHARED               |

**Response:** `201 Created`

```json
{
  "id": "journal-uuid",
  "title": "Morning Gratitude",
  "description": "Grateful for a good night's sleep and a fresh start",
  "categoryId": "category-uuid",
  "mood": "HAPPY",
  "visibility": "ONLY_ME",
  "userId": "user-uuid",
  "createdAt": "2024-01-15T08:30:00.000Z",
  "updatedAt": "2024-01-15T08:30:00.000Z",
  "category": {
    "id": "category-uuid",
    "name": "Sleep",
    "icon": "😴",
    "color": "#3B82F6",
    "isDefault": true
  }
}
```

---

### Get All Journals

Retrieve all journal entries with filtering and pagination.

**GET** `/journals`

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| categoryId | string | - | Filter by category UUID |
| mood | enum | - | Filter by mood |
| search | string | - | Search in title and description |
| sortBy | string | createdAt | Sort field (createdAt, updatedAt, title) |
| sortOrder | string | desc | Sort order (asc, desc) |
| page | number | 1 | Page number |
| limit | number | 20 | Items per page (1-100) |

**Response:** `200 OK`

```json
{
  "data": [
    {
      "id": "journal-uuid",
      "title": "Morning Gratitude",
      "description": "...",
      "categoryId": "category-uuid",
      "mood": "HAPPY",
      "visibility": "ONLY_ME",
      "createdAt": "2024-01-15T08:30:00.000Z",
      "updatedAt": "2024-01-15T08:30:00.000Z",
      "category": {
        "id": "category-uuid",
        "name": "Sleep",
        "icon": "😴",
        "color": "#3B82F6",
        "isDefault": true
      }
    }
  ],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}
```

---

### Get Single Journal

Retrieve a specific journal entry.

**GET** `/journals/:id`

**Response:** `200 OK`

```json
{
  "id": "journal-uuid",
  "title": "Morning Gratitude",
  "description": "Grateful for a good night's sleep and a fresh start",
  "categoryId": "category-uuid",
  "mood": "HAPPY",
  "visibility": "ONLY_ME",
  "userId": "user-uuid",
  "createdAt": "2024-01-15T08:30:00.000Z",
  "updatedAt": "2024-01-15T08:30:00.000Z",
  "category": {
    "id": "category-uuid",
    "name": "Sleep",
    "icon": "😴",
    "color": "#3B82F6",
    "isDefault": true
  }
}
```

---

### Update Journal

Update an existing journal entry.

**PATCH** `/journals/:id`

**Request Body:**

```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "categoryId": "new-category-uuid",
  "mood": "VERY_HAPPY",
  "visibility": "SHARED"
}
```

All fields are optional.

**Response:** `200 OK` - Returns updated journal object

---

### Delete Journal

Delete a journal entry.

**DELETE** `/journals/:id`

**Response:** `200 OK`

```json
{
  "message": "Journal deleted successfully"
}
```

---

## Category Endpoints

### Get Categories

Get all journal categories for the current user. Creates default categories if none exist.

**GET** `/journals/categories/list`

**Response:** `200 OK`

```json
[
  {
    "id": "category-uuid",
    "name": "Exercise",
    "icon": "🏃",
    "color": "#10B981",
    "isDefault": true,
    "userId": "user-uuid",
    "_count": {
      "journals": 5
    }
  },
  {
    "id": "category-uuid-2",
    "name": "My Custom Category",
    "icon": "⭐",
    "color": "#FF5733",
    "isDefault": false,
    "userId": "user-uuid",
    "_count": {
      "journals": 2
    }
  }
]
```

---

### Create Category

Create a new custom category.

**POST** `/journals/categories`

**Request Body:**

```json
{
  "name": "My Custom Category",
  "icon": "⭐",
  "color": "#FF5733"
}
```

| Field | Type   | Required | Description                |
| ----- | ------ | -------- | -------------------------- |
| name  | string | Yes      | Category name (1-50 chars) |
| icon  | string | No       | Emoji or icon              |
| color | string | No       | Hex color code             |

**Response:** `201 Created`

```json
{
  "id": "category-uuid",
  "name": "My Custom Category",
  "icon": "⭐",
  "color": "#FF5733",
  "isDefault": false,
  "userId": "user-uuid",
  "_count": {
    "journals": 0
  }
}
```

---

### Update Category

Update an existing category.

**PATCH** `/journals/categories/:id`

**Request Body:**

```json
{
  "name": "Updated Name",
  "icon": "🌟",
  "color": "#00FF00"
}
```

All fields are optional.

**Response:** `200 OK` - Returns updated category object

---

### Delete Category

Delete a custom category. Default categories cannot be deleted.

**DELETE** `/journals/categories/:id`

**Response:** `200 OK`

```json
{
  "message": "Category deleted successfully"
}
```

**Error:** `400 Bad Request`

```json
{
  "message": "Cannot delete default category"
}
```

---

## Insights Endpoints

### Get Mood Insights

Get mood data over time for the mood graph visualization.

**GET** `/journals/insights/mood`

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| days | number | 7 | Number of days to analyze |
| startDate | string | - | ISO date string for start |
| endDate | string | - | ISO date string for end (defaults to now) |

**Response:** `200 OK`

```json
{
  "period": {
    "startDate": "2024-01-08T00:00:00.000Z",
    "endDate": "2024-01-14T23:59:59.999Z",
    "totalDays": 7
  },
  "overall": {
    "totalJournals": 15,
    "journalsWithMood": 12,
    "avgMoodValue": 3.75
  },
  "moodDistribution": {
    "VERY_HAPPY": 3,
    "HAPPY": 5,
    "NEUTRAL": 2,
    "SAD": 2,
    "VERY_SAD": 0
  },
  "dailyMoods": [
    {
      "date": "2024-01-08",
      "dayName": "Mon",
      "mood": "HAPPY",
      "moodValue": 4,
      "journalCount": 2
    },
    {
      "date": "2024-01-09",
      "dayName": "Tue",
      "mood": "NEUTRAL",
      "moodValue": 3,
      "journalCount": 1
    },
    {
      "date": "2024-01-10",
      "dayName": "Wed",
      "mood": null,
      "moodValue": null,
      "journalCount": 0
    }
  ]
}
```

**Notes:**

- `moodValue` is a numeric representation (1-5 scale, higher = happier)
- Days without journals have `mood: null` and `moodValue: null`
- If multiple journals exist on one day, the average mood is calculated

---

### Get Statistics

Get overall journal statistics.

**GET** `/journals/statistics`

**Response:** `200 OK`

```json
{
  "total": 50,
  "thisWeek": 7,
  "thisMonth": 20,
  "byMood": [
    { "mood": "VERY_HAPPY", "count": 10 },
    { "mood": "HAPPY", "count": 20 },
    { "mood": "NEUTRAL", "count": 12 },
    { "mood": "SAD", "count": 6 },
    { "mood": "VERY_SAD", "count": 2 }
  ],
  "byCategory": [
    { "categoryId": "category-uuid-1", "count": 15 },
    { "categoryId": "category-uuid-2", "count": 10 },
    { "categoryId": null, "count": 25 }
  ]
}
```

---

## Error Responses

### 400 Bad Request

```json
{
  "message": ["title must be between 1 and 200 characters"],
  "error": "Bad Request",
  "statusCode": 400
}
```

### 401 Unauthorized

```json
{
  "message": "Unauthorized",
  "statusCode": 401
}
```

### 403 Forbidden

```json
{
  "message": "Access denied",
  "error": "Forbidden",
  "statusCode": 403
}
```

### 404 Not Found

```json
{
  "message": "Journal not found",
  "error": "Not Found",
  "statusCode": 404
}
```

### 409 Conflict

```json
{
  "message": "Category with this name already exists",
  "error": "Conflict",
  "statusCode": 409
}
```

---

## Usage Examples

### Create a Gratitude Journal Entry

```bash
curl -X POST http://localhost:3000/journals \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Today I am grateful for...",
    "description": "My family, my health, and the beautiful weather today",
    "mood": "VERY_HAPPY",
    "visibility": "ONLY_ME"
  }'
```

### Get Last 7 Days Mood Graph Data

```bash
curl -X GET "http://localhost:3000/journals/insights/mood?days=7" \
  -H "Authorization: Bearer <token>"
```

### Search Journals by Keyword

```bash
curl -X GET "http://localhost:3000/journals?search=gratitude&mood=HAPPY" \
  -H "Authorization: Bearer <token>"
```

---

## Changelog

- **v1.0.0** - Initial release with Journal CRUD, Categories, and Mood Insights
