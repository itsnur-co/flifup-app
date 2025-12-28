# Habits API Documentation

## Base URL

```
http://localhost:3000/api/v1/habits
```

## Authentication

All habits endpoints require Bearer token in Authorization header:

```
Authorization: Bearer <access_token>
```

---

## Enums

### RepeatType

```typescript
enum RepeatType {
  DAILY    // Repeat on specific days of the week
  MONTHLY  // Repeat on specific dates of the month
  INTERVAL // Repeat every N days
}
```

### GoalUnit

```typescript
enum GoalUnit {
  KM
  METERS
  MINUTES
  HOURS
  COUNT
  LITERS
  GLASSES
}
```

### GoalFrequency

```typescript
enum GoalFrequency {
  PER_DAY
  PER_WEEK
  PER_MONTH
}
```

### HabitStatus

```typescript
enum HabitStatus {
  ACTIVE    // Habit is currently active
  PAUSED    // Habit is temporarily paused
  ARCHIVED  // Habit is archived
}
```

---

## Endpoints

### 1. Create Habit

**POST** `/habits`

Creates a new habit with repeat configuration, goals, and reminders.

**Request Body:**

```json
{
  "name": "Morning Run",
  "description": "Run 5km every morning",
  "repeatType": "DAILY",
  "repeatDays": [1, 2, 3, 4, 5],
  "startDate": "2025-01-01T00:00:00.000Z",
  "goalValue": 5,
  "goalUnit": "KM",
  "goalFrequency": "PER_DAY",
  "categoryId": "clxxx...",
  "reminderTime": "06:00",
  "comment": "Start slowly and build up",
  "status": "ACTIVE"
}
```

**Field Descriptions:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Habit name (max 255 chars) |
| description | string | No | Habit description (max 2000 chars) |
| repeatType | RepeatType | Yes | Type of repetition |
| repeatDays | number[] | Conditional | Required for DAILY (0-6) and MONTHLY (1-31) |
| categoryId | string | No | Category ID (CUID) |
| repeatInterval | number | Conditional | Required for INTERVAL (1-365 days) |
| startDate | ISO 8601 | Yes | When the habit starts |
| goalValue | number | No | Goal value (e.g., 5 for "5 km") |
| goalUnit | GoalUnit | No | Unit of measurement |
| goalFrequency | GoalFrequency | No | How often the goal applies |
| category | string | Yes | Category name (max 100 chars) |
| reminderTime | string | No | Time in HH:mm format (e.g., "09:00") |
| comment | string | No | Additional notes (max 1000 chars) |
| status | HabitStatus | No | Default: ACTIVE |

**Repeat Configuration Examples:**

_Daily (specific days):_

```json
{
  "repeatType": "DAILY",
  "repeatDays": [1, 2, 3, 4, 5] // Monday-Friday (0=Sunday, 6=Saturday)
}
```

_Monthly (specific dates):_

```json
{
  "repeatType": "MONTHLY",
  "repeatDays": [1, 15, 25] // 1st, 15th, and 25th of each month
}
```

_Interval (every N days):_

```json
{
  "repeatType": "INTERVAL",
  "repeatInterval": 3 // Every 3 days
}
```

**Response (201 Created):**

```json
{
  "id": "clxxx...",
  "name": "Morning Run",
  "description": "Run 5km every morning",
  "repeatType": "DAILY",
  "repeatDays": [1, 2, 3, 4, 5],
  "repeatInterval": null,
  "startDate": "2025-01-01T00:00:00.000Z",
  "goalValue": 5,
  "goalUnit": "KM",
  "goalFrequency": "PER_DAY",
  "category": "Exercise",
  "reminderTime": "06:00",
  "comment": "Start slowly and build up",
  "status": "ACTIVE",
  "userId": "clxxx...",
  "createdAt": "2025-12-21T10:00:00.000Z",
  "updatedAt": "2025-12-21T10:00:00.000Z",
  "completions": [],
  "_count": {
    "completions": 0
  }
}
```

**Errors:**
| Status | Description |
|--------|-------------|
| 400 | Validation error / Invalid repeat configuration |
| 401 | Unauthorized (invalid or missing token) |
| 429 | Rate limit exceeded |

---

### 2. Get All Habits

**GET** `/habits`

Retrieves all habits with pagination, filtering, and search.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| status | HabitStatus | - | Filter by status |
| repeatType | RepeatType | - | Filter by repeat type |
| category | string | - | Filter by category |
| search | string | - | Search in name, description, category, comment |
| startDateFrom | ISO 8601 | - | Filter habits starting from this date |
| startDateTo | ISO 8601 | - | Filter habits starting until this date |
| sortBy | string | createdAt | Sort by: name, startDate, createdAt, category |
| sortOrder | string | desc | Sort order: asc or desc |
| page | number | 1 | Page number (min: 1) |
| limit | number | 20 | Items per page (min: 1, max: 100) |

**Example Request:**

```
GET /habits?status=ACTIVE&category=Exercise&page=1&limit=10
```

**Response (200 OK):**

```json
{
  "data": [
    {
      "id": "clxxx...",
      "name": "Morning Run",
      "description": "Run 5km every morning",
      "repeatType": "DAILY",
      "repeatDays": [1, 2, 3, 4, 5],
      "repeatInterval": null,
      "startDate": "2025-01-01T00:00:00.000Z",
      "goalValue": 5,
      "goalUnit": "KM",
      "goalFrequency": "PER_DAY",
      "category": "Exercise",
      "reminderTime": "06:00",
      "comment": "Start slowly and build up",
      "status": "ACTIVE",
      "userId": "clxxx...",
      "createdAt": "2025-12-21T10:00:00.000Z",
      "updatedAt": "2025-12-21T10:00:00.000Z",
      "completions": [
        {
          "id": "clxxx...",
          "habitId": "clxxx...",
          "date": "2025-12-21T00:00:00.000Z",
          "value": 5,
          "note": "Felt great!",
          "createdAt": "2025-12-21T07:00:00.000Z",
          "updatedAt": "2025-12-21T07:00:00.000Z"
        }
      ],
      "_count": {
        "completions": 15
      }
    }
  ],
  "meta": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```

---

### 3. Get Habit by ID

**GET** `/habits/:id`

Retrieves a specific habit with its completion history.

**Response (200 OK):**

```json
{
  "id": "clxxx...",
  "name": "Morning Run",
  "description": "Run 5km every morning",
  "repeatType": "DAILY",
  "repeatDays": [1, 2, 3, 4, 5],
  "repeatInterval": null,
  "startDate": "2025-01-01T00:00:00.000Z",
  "goalValue": 5,
  "goalUnit": "KM",
  "goalFrequency": "PER_DAY",
  "category": "Exercise",
  "reminderTime": "06:00",
  "comment": "Start slowly and build up",
  "status": "ACTIVE",
  "userId": "clxxx...",
  "createdAt": "2025-12-21T10:00:00.000Z",
  "updatedAt": "2025-12-21T10:00:00.000Z",
  "completions": [
    // Last 30 completions
  ],
  "_count": {
    "completions": 45
  }
}
```

**Errors:**
| Status | Description |
|--------|-------------|
| 401 | Unauthorized |
| 403 | Access denied (not your habit) |
| 404 | Habit not found |

---

### 4. Update Habit

**PATCH** `/habits/:id`

Updates habit details. All fields are optional.

**Request Body:**

```json
{
  "name": "Evening Run",
  "status": "PAUSED",
  "reminderTime": "18:00"
}
```

**Response (200 OK):**
Returns the updated habit object (same structure as Get Habit).

**Errors:**
| Status | Description |
|--------|-------------|
| 400 | Validation error |
| 401 | Unauthorized |
| 403 | Access denied |
| 404 | Habit not found |

---

### 5. Delete Habit

**DELETE** `/habits/:id`

Permanently deletes a habit and all its completions.

**Response (200 OK):**

```json
{
  "message": "Habit deleted successfully"
}
```

**Errors:**
| Status | Description |
|--------|-------------|
| 401 | Unauthorized |
| 403 | Access denied |
| 404 | Habit not found |

---

### 6. Get Today's Habits

**GET** `/habits/today`

Retrieves all active habits scheduled for today with completion status.

**Response (200 OK):**

```json
[
  {
    "id": "clxxx...",
    "name": "Morning Run",
    "category": "Exercise",
    "goalValue": 5,
    "goalUnit": "KM",
    "goalFrequency": "PER_DAY",
    "completions": [
      {
        "id": "clxxx...",
        "date": "2025-12-21T00:00:00.000Z",
        "value": 5,
        "note": "Completed!"
      }
    ],
    "isCompletedToday": true
    // ... other habit fields
  }
]
```

---

### 7. Get Habits by Date

**GET** `/habits/date/:date`

Retrieves habits scheduled for a specific date.

**Parameters:**

- `date`: ISO 8601 date string (e.g., "2025-12-21")

**Example:**

```
GET /habits/date/2025-12-25T00:00:00.000Z
```

**Response (200 OK):**

```json
[
  {
    "id": "clxxx...",
    "name": "Morning Run",
    "completions": [],
    "isCompleted": false
    // ... other habit fields
  }
]
```

---

### 8. Complete Habit

**POST** `/habits/:id/complete`

Marks a habit as completed for a specific date.

**Request Body:**

```json
{
  "date": "2025-12-21T00:00:00.000Z",
  "value": 5.2,
  "note": "Ran 5.2km in 30 minutes. Felt great!"
}
```

**Field Descriptions:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| date | ISO 8601 | Yes | Date of completion (normalized to UTC midnight) |
| value | number | No | Progress value for goal tracking |
| note | string | No | Optional note about the completion (max 500 chars) |

**Response (200 OK):**

```json
{
  "id": "clxxx...",
  "habitId": "clxxx...",
  "date": "2025-12-21T00:00:00.000Z",
  "value": 5.2,
  "note": "Ran 5.2km in 30 minutes. Felt great!",
  "createdAt": "2025-12-21T08:00:00.000Z",
  "updatedAt": "2025-12-21T08:00:00.000Z"
}
```

**Note:** If a completion already exists for the date, it will be updated (upsert behavior).

**Errors:**
| Status | Description |
|--------|-------------|
| 400 | Validation error |
| 401 | Unauthorized |
| 403 | Access denied |
| 404 | Habit not found |

---

### 9. Uncomplete Habit

**DELETE** `/habits/:id/complete/:date`

Removes a completion for a specific date.

**Parameters:**

- `id`: Habit ID
- `date`: ISO 8601 date string

**Example:**

```
DELETE /habits/clxxx.../complete/2025-12-21T00:00:00.000Z
```

**Response (200 OK):**

```json
{
  "message": "Habit marked as incomplete"
}
```

**Errors:**
| Status | Description |
|--------|-------------|
| 401 | Unauthorized |
| 403 | Access denied |
| 404 | Habit or completion not found |

---

### 10. Get Categories

**GET** `/habits/categories`

Retrieves all unique habit categories for the user.

**Response (200 OK):**

```json
[
  "Exercise",
  "Prayer",
  "Diet",
  "Meditation",
  "Sleep",
  "Hydration",
  "Custom Category"
]
```

---

### 11. Get Habit Statistics

**GET** `/habits/:id/stats`

Retrieves detailed statistics for a specific habit over a date range.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| days | number | 7 | Number of days to analyze (1-365) |
| startDate | ISO 8601 | - | Custom start date (overrides days) |
| endDate | ISO 8601 | now | Custom end date |

**Example:**

```
GET /habits/clxxx.../stats?days=30
```

**Response (200 OK):**

```json
{
  "habitId": "clxxx...",
  "period": {
    "startDate": "2025-11-21T00:00:00.000Z",
    "endDate": "2025-12-21T23:59:59.999Z",
    "totalDays": 31
  },
  "completedDays": 23,
  "completionRate": 74.19,
  "currentStreak": 7,
  "longestStreak": 12,
  "completions": [
    {
      "id": "clxxx...",
      "habitId": "clxxx...",
      "date": "2025-12-21T00:00:00.000Z",
      "value": 5,
      "note": "Great run!",
      "createdAt": "2025-12-21T07:00:00.000Z",
      "updatedAt": "2025-12-21T07:00:00.000Z"
    }
  ]
}
```

---

### 12. Get Overall Progress

**GET** `/habits/progress/overall`

Retrieves overall progress across all active habits.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| days | number | 7 | Number of days to analyze (1-365) |
| startDate | ISO 8601 | - | Custom start date (overrides days) |
| endDate | ISO 8601 | now | Custom end date |

**Example:**

```
GET /habits/progress/overall?days=7
```

**Response (200 OK):**

```json
{
  "period": {
    "startDate": "2025-12-15T00:00:00.000Z",
    "endDate": "2025-12-21T23:59:59.999Z",
    "totalDays": 7
  },
  "overall": {
    "totalScheduled": 35,
    "totalCompleted": 28,
    "avgCompletionRate": 80.0
  },
  "dailyStats": [
    {
      "date": "2025-12-15T00:00:00.000Z",
      "scheduled": 5,
      "completed": 4,
      "completionRate": 80.0
    },
    {
      "date": "2025-12-16T00:00:00.000Z",
      "scheduled": 5,
      "completed": 5,
      "completionRate": 100.0
    }
  ]
}
```

**Field Descriptions:**

- `totalScheduled`: Total number of habits that were scheduled across all days
- `totalCompleted`: Total number of habits that were completed
- `avgCompletionRate`: Overall completion percentage
- `dailyStats`: Day-by-day breakdown showing scheduled vs completed habits

---

## Predefined Categories

The UI provides these predefined categories, but users can also create custom ones:

- Exercise
- Prayer
- Diet
- Meditation
- Sleep
- Hydration

---

## Date Handling

- All dates are normalized to UTC midnight (00:00:00.000Z)
- A habit can only be completed once per day
- Completions are uniquely identified by `habitId` + `date`
- When checking if a habit is scheduled for a day, the system uses:
  - `dayOfWeek` (0-6, Sunday-Saturday) for DAILY habits
  - `dayOfMonth` (1-31) for MONTHLY habits
  - Days since `startDate` modulo `repeatInterval` for INTERVAL habits

---

## Rate Limits

All habit endpoints follow the global rate limit:

- **Global:** 100 requests per minute

---

## Business Logic

### Streak Calculation

**Current Streak:**

- Counts consecutive days of completion
- Resets if no completion for today or yesterday
- Maximum lookback: 100 most recent completions

**Longest Streak:**

- Tracks the longest consecutive completion streak ever achieved
- Calculated from all historical completions

### Repeat Type Logic

**DAILY:**

- `repeatDays` contains day numbers (0=Sunday, 6=Saturday)
- Example: `[1,2,3,4,5]` = Monday through Friday

**MONTHLY:**

- `repeatDays` contains dates (1-31)
- Example: `[1,15]` = 1st and 15th of each month
- Note: If a month doesn't have the date (e.g., Feb 31), it's skipped

**INTERVAL:**

- `repeatInterval` specifies every N days
- Example: `repeatInterval: 3` = every 3 days from `startDate`
- Calculation: `daysSinceStart % repeatInterval === 0`

---

## Frontend Integration Examples

### Creating a Habit

```javascript
// Daily habit - every weekday
const dailyHabit = {
  name: 'Morning Exercise',
  repeatType: 'DAILY',
  repeatDays: [1, 2, 3, 4, 5], // Mon-Fri
  startDate: '2025-01-01T00:00:00.000Z',
  category: 'Exercise',
  goalValue: 30,
  goalUnit: 'MINUTES',
  goalFrequency: 'PER_DAY',
};

// Monthly habit - specific dates
const monthlyHabit = {
  name: 'Monthly Review',
  repeatType: 'MONTHLY',
  repeatDays: [25], // 25th of each month
  startDate: '2025-01-01T00:00:00.000Z',
  category: 'Personal Development',
};

// Interval habit - every 2 days
const intervalHabit = {
  name: 'Workout',
  repeatType: 'INTERVAL',
  repeatInterval: 2,
  startDate: '2025-01-01T00:00:00.000Z',
  category: 'Exercise',
};
```

### Tracking Today's Habits

```javascript
// Get today's habits
const response = await fetch('/api/v1/habits/today', {
  headers: { Authorization: `Bearer ${accessToken}` },
});
const todayHabits = await response.json();

// Display with completion status
todayHabits.forEach((habit) => {
  console.log(`${habit.name}: ${habit.isCompletedToday ? '✓' : '○'}`);
});
```

### Completing a Habit

```javascript
// Mark habit as complete for today
await fetch(`/api/v1/habits/${habitId}/complete`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    date: new Date().toISOString(),
    value: 5.2, // Optional: track progress
    note: 'Felt great!', // Optional: add note
  }),
});
```

### Viewing Progress

```javascript
// Get last 7 days statistics
const stats = await fetch(`/api/v1/habits/${habitId}/stats?days=7`, {
  headers: { Authorization: `Bearer ${accessToken}` },
}).then((r) => r.json());

console.log(`Completion Rate: ${stats.completionRate}%`);
console.log(`Current Streak: ${stats.currentStreak} days`);
console.log(`Longest Streak: ${stats.longestStreak} days`);

// Get overall progress
const overall = await fetch('/api/v1/habits/progress/overall?days=7', {
  headers: { Authorization: `Bearer ${accessToken}` },
}).then((r) => r.json());

console.log(`Overall completion: ${overall.overall.avgCompletionRate}%`);
```

---

## Error Handling

All endpoints follow consistent error response format:

```json
{
  "message": ["Error message 1", "Error message 2"],
  "error": "Bad Request",
  "statusCode": 400
}
```

Common HTTP status codes:

- `200` OK - Successful GET, PATCH, DELETE operations
- `201` Created - Successful POST operations
- `400` Bad Request - Validation errors, invalid data
- `401` Unauthorized - Missing or invalid authentication token
- `403` Forbidden - Access denied (not your resource)
- `404` Not Found - Resource doesn't exist
- `429` Too Many Requests - Rate limit exceeded

---

## Database Schema

### Habit Model

```prisma
model Habit {
  id             String       @id @default(cuid())
  name           String
  description    String?
  repeatType     RepeatType
  repeatDays     Int[]
  repeatInterval Int?
  startDate      DateTime
  goalValue      Float?
  goalUnit       GoalUnit?
  goalFrequency  GoalFrequency?
  category       String
  reminderTime   String?
  comment        String?
  status         HabitStatus  @default(ACTIVE)
  userId         String
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt

  user           User         @relation(...)
  completions    HabitCompletion[]
}
```

### HabitCompletion Model

```prisma
model HabitCompletion {
  id        String   @id @default(cuid())
  habitId   String
  date      DateTime
  value     Float?
  note      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  habit     Habit    @relation(...)

  @@unique([habitId, date])
}
```

---

## Best Practices

1. **Date Consistency:** Always send dates in ISO 8601 format and let the backend normalize them
2. **Completion Tracking:** Use the `complete` endpoint with upsert behavior to avoid duplicates
3. **Progress Monitoring:** Combine individual habit stats with overall progress for comprehensive insights
4. **Category Management:** Fetch categories dynamically to show users their existing categories
5. **Streak Motivation:** Display current and longest streaks to encourage consistency
6. **Error Handling:** Always handle 403 errors gracefully (habit might have been deleted)
7. **Pagination:** Use appropriate page sizes for habit lists (default: 20, max: 100)
8. **Search:** Combine filters and search for powerful habit discovery

---

# Habit Categories API

Categories allow users to organize their habits. Default categories are created automatically on first access.

## Data Models

### HabitCategory Object

```json
{
  "id": "clxxx...",
  "name": "Exercise",
  "icon": "🏃",
  "color": "#10B981",
  "isDefault": true,
  "userId": "clxxx...",
  "createdAt": "2025-11-30T12:00:00.000Z",
  "updatedAt": "2025-11-30T12:00:00.000Z",
  "_count": {
    "habits": 5
  }
}
```

## Default Categories

The following categories are created automatically for new users:

| Name | Icon | Color |
|------|------|-------|
| Exercise | 🏃 | #10B981 |
| Prayer | 🙏 | #8B5CF6 |
| Diet | 🥗 | #F59E0B |
| Meditation | 🧘 | #6366F1 |
| Sleep | 😴 | #3B82F6 |
| Hydration | 💧 | #06B6D4 |

---

## Endpoints

### 1. Get All Categories

**GET** `/habits/categories`

Retrieves all categories for the authenticated user. Default categories are auto-created on first access.

**Response (200 OK):**

```json
[
  {
    "id": "clxxx...",
    "name": "Exercise",
    "icon": "🏃",
    "color": "#10B981",
    "isDefault": true,
    "userId": "clxxx...",
    "createdAt": "2025-11-30T12:00:00.000Z",
    "updatedAt": "2025-11-30T12:00:00.000Z",
    "_count": {
      "habits": 5
    }
  }
]
```

---

### 2. Create Category

**POST** `/habits/categories`

Creates a new custom category.

**Request Body:**

```json
{
  "name": "Reading",
  "icon": "📚",
  "color": "#EF4444"
}
```

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| name | string | Yes | Max 50 characters, unique per user |
| icon | string | No | Max 50 characters (emoji) |
| color | string | No | Hex color format (e.g., `#6366F1`) |

**Response (201 Created):**

```json
{
  "id": "clxxx...",
  "name": "Reading",
  "icon": "📚",
  "color": "#EF4444",
  "isDefault": false,
  "userId": "clxxx...",
  "createdAt": "2025-11-30T12:00:00.000Z",
  "updatedAt": "2025-11-30T12:00:00.000Z",
  "_count": {
    "habits": 0
  }
}
```

**Errors:**

| Status | Description |
|--------|-------------|
| 400 | Invalid color format |
| 401 | Unauthorized |
| 409 | Category with this name already exists |

---

### 3. Update Category

**PATCH** `/habits/categories/:categoryId`

Updates an existing category.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| categoryId | string | Category ID (CUID) |

**Request Body:**

```json
{
  "name": "Books",
  "icon": "📖",
  "color": "#F59E0B"
}
```

**Response (200 OK):**

```json
{
  "id": "clxxx...",
  "name": "Books",
  "icon": "📖",
  "color": "#F59E0B",
  "isDefault": false,
  "userId": "clxxx...",
  "createdAt": "2025-11-30T12:00:00.000Z",
  "updatedAt": "2025-11-30T13:00:00.000Z",
  "_count": {
    "habits": 2
  }
}
```

**Errors:**

| Status | Description |
|--------|-------------|
| 400 | Invalid color format |
| 401 | Unauthorized |
| 403 | Category does not belong to user |
| 404 | Category not found |
| 409 | Category with this name already exists |

---

### 4. Delete Category

**DELETE** `/habits/categories/:categoryId`

Deletes a custom category. Default categories cannot be deleted.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| categoryId | string | Category ID (CUID) |

**Response (200 OK):**

```json
{
  "message": "Category deleted successfully"
}
```

**Errors:**

| Status | Description |
|--------|-------------|
| 400 | Cannot delete default category |
| 401 | Unauthorized |
| 403 | Category does not belong to user |
| 404 | Category not found |

---

# Updated Habit Object

Habits now include the linked category:

```json
{
  "id": "clxxx...",
  "name": "Morning Run",
  "description": "Run 5km every morning",
  "repeatType": "DAILY",
  "repeatDays": [1, 2, 3, 4, 5],
  "repeatInterval": null,
  "startDate": "2025-01-01T00:00:00.000Z",
  "goalValue": 5,
  "goalUnit": "KM",
  "goalFrequency": "PER_DAY",
  "categoryId": "clcat...",
  "category": {
    "id": "clcat...",
    "name": "Exercise",
    "icon": "🏃",
    "color": "#10B981",
    "isDefault": true
  },
  "reminderTime": "06:00",
  "comment": "Start slowly and build up",
  "status": "ACTIVE",
  "userId": "clxxx...",
  "createdAt": "2025-12-21T10:00:00.000Z",
  "updatedAt": "2025-12-21T10:00:00.000Z"
}
```

---

# Updated Overall Progress API

The overall progress endpoint now supports filtering by category.

**GET** `/habits/progress/overall`

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| days | number | 7 | Number of days to calculate stats for (1-365) |
| startDate | ISO 8601 | - | Custom start date |
| endDate | ISO 8601 | - | Custom end date |
| categoryId | string | - | Filter by category ID |

**Example Request:**

```
GET /habits/progress/overall?days=7&categoryId=clxxx...
```

---

# Updated Query Habits API

The habits list now supports filtering by category ID.

**GET** `/habits`

**Updated Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| categoryId | string | - | Filter by category ID |

**Example Request:**

```
GET /habits?categoryId=clxxx...&status=ACTIVE
```

---

# Database Schema Updates

### HabitCategory Model

```prisma
model HabitCategory {
  id        String   @id @default(cuid())
  name      String
  icon      String?
  color     String?
  isDefault Boolean  @default(false)
  userId    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user   User    @relation(...)
  habits Habit[]

  @@unique([userId, name])
}
```

### Updated Habit Model

```prisma
model Habit {
  id             String   @id @default(cuid())
  name           String
  description    String?
  repeatType     RepeatType
  repeatDays     Int[]
  repeatInterval Int?
  startDate      DateTime
  goalValue      Float?
  goalUnit       GoalUnit?
  goalFrequency  GoalFrequency?
  categoryId     String?
  reminderTime   String?
  comment        String?
  status         HabitStatus  @default(ACTIVE)
  userId         String
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt

  user        User              @relation(...)
  category    HabitCategory?    @relation(...)
  completions HabitCompletion[]
}
```
