# Task API Documentation

## Overview

The Task API provides comprehensive task management with collaborators, categories, goals, reminders, focus mode, time tracking, and productivity reports.

---

## Authentication

All endpoints require JWT authentication:

```
Authorization: Bearer <your_jwt_token>
```

---

## Task CRUD

### Create Task

**POST** `/tasks`

**Request Body:**

```json
{
  "title": "Complete project report",
  "description": "Write the Q4 project summary report",
  "project": "Work",
  "priority": "HIGH",
  "dueDate": "2025-01-15",
  "dueTime": "14:30",
  "repeat": "NONE",
  "status": "TODO",
  "categoryId": "category-uuid",
  "goalId": "goal-uuid",
  "estimatedTime": 120,
  "subtasks": [
    { "title": "Research topics" },
    { "title": "Write introduction", "order": 1 },
    { "title": "Add charts and graphs", "order": 2 }
  ],
  "collaborators": [
    { "email": "henry.chambers@example.com" },
    { "email": "shane.nguyen@example.com" }
  ]
}
```

| Field         | Type   | Required | Description                        |
| ------------- | ------ | -------- | ---------------------------------- |
| title         | string | **Yes**  | Task title (max 255 chars)         |
| description   | string | No       | Task description (max 2000 chars)  |
| project       | string | No       | Project name (max 100 chars)       |
| priority      | enum   | No       | LOW, MEDIUM, HIGH (default: LOW)   |
| dueDate       | date   | No       | Due date (default: tomorrow)       |
| dueTime       | string | No       | HH:mm format (e.g., "14:30")       |
| repeat        | enum   | No       | NONE, DAILY, WEEKLY, MONTHLY       |
| reminderAt    | date   | No       | Reminder datetime (ISO 8601)       |
| status        | enum   | No       | TODO, IN_PROGRESS, COMPLETED       |
| categoryId    | string | No       | Category UUID                      |
| goalId        | string | No       | Goal UUID to link                  |
| estimatedTime | number | No       | Estimated time in minutes (1-1440) |
| subtasks      | array  | No       | Array of subtasks to create        |
| collaborators | array  | No       | Array of collaborators to add      |

> **Note:** Only `title` is required. All other fields are optional - you can create a task with just a title.

**Subtask Object:**

| Field       | Type    | Required | Description                           |
| ----------- | ------- | -------- | ------------------------------------- |
| title       | string  | Yes      | Subtask title (max 255 chars)         |
| order       | number  | No       | Order position (default: array index) |
| isCompleted | boolean | No       | Completion status (default: false)    |

**Collaborator Object:**

| Field | Type   | Required | Description                                 |
| ----- | ------ | -------- | ------------------------------------------- |
| email | string | Yes      | Email of Flifup user to add as collaborator |

**Note:** Collaborators must be registered Flifup users. Invalid emails or your own email will be silently ignored. Duplicate emails are automatically filtered.

**Minimal Request (only title required):**

```json
{
  "title": "Buy groceries"
}
```

**With optional fields:**

```json
{
  "title": "Team meeting",
  "dueDate": "2026-01-15",
  "dueTime": "14:30",
  "reminderAt": "2026-01-15T14:00:00.000Z",
  "categoryId": "category-uuid",
  "estimatedTime": 60,
  "priority": "HIGH"
}
```

**Response:** `201 Created`

The response includes the created task with all subtasks and collaborators.

---

### Get All Tasks

**GET** `/tasks`

Returns tasks where user is owner OR collaborator.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| status | enum | - | Filter by status |
| priority | enum | - | Filter by priority |
| project | string | - | Filter by project |
| search | string | - | Search in title/description/project |
| dueDateFrom | date | - | Filter from date |
| dueDateTo | date | - | Filter to date |
| sortBy | string | dueDate | Sort field |
| sortOrder | string | asc | asc or desc |
| page | number | 1 | Page number |
| limit | number | 20 | Items per page |

**Response:**

```json
{
  "data": [
    {
      "id": "task-uuid",
      "title": "Complete project report",
      "status": "TODO",
      "isOwner": true,
      "isCollaborator": false,
      "category": { "id": "...", "name": "Work", "icon": "💼", "color": "#6366F1" },
      "goal": { "id": "...", "title": "Q4 Goals" },
      "collaborators": [
        {
          "user": { "id": "...", "fullName": "John Doe", "email": "john@example.com", "profileImage": "..." }
        }
      ],
      "reminders": [...],
      "_count": { "subtasks": 3 }
    }
  ],
  "meta": { "total": 50, "page": 1, "limit": 20, "totalPages": 3 }
}
```

---

### Get Today's Tasks

**GET** `/tasks/today`

---

### Get Upcoming Tasks

**GET** `/tasks/upcoming`

---

### Get Overdue Tasks

**GET** `/tasks/overdue`

---

### Get Task by ID

**GET** `/tasks/:id`

---

### Get Enhanced Task Detail

**GET** `/tasks/detail/:id`

Returns detailed task with subtask counts and grouped subtasks.

**Response:**

```json
{
  "id": "task-uuid",
  "title": "Complete project report",
  "subtaskCounts": {
    "total": 6,
    "completed": 3,
    "incomplete": 3
  },
  "subtasksGrouped": {
    "incomplete": [...],
    "completed": [...]
  },
  "reminders": [
    { "id": "...", "value": 30, "unit": "MINUTES", "label": "30 minutes before" }
  ]
}
```

---

### Update Task

**PATCH** `/tasks/:id`

---

### Update Task Status

**PATCH** `/tasks/:id/status`

```json
{
  "status": "COMPLETED"
}
```

---

### Delete Task

**DELETE** `/tasks/:id`

---

### Delete All Tasks by Date

**DELETE** `/tasks/date/:date`

Deletes all tasks for the authenticated user on the specified date.

**URL Parameters:**

- `date`: Date in `YYYY-MM-DD` format (e.g., `2026-01-15`)

**Response:**

```json
{
  "message": "5 task(s) deleted successfully",
  "count": 5
}
```

**Error Responses:**

- `400 Bad Request`: Invalid date format
- `401 Unauthorized`: Not authenticated

---

## Categories

### Get Categories

**GET** `/tasks/categories/list`

Creates default categories if none exist.

---

### Create Category

**POST** `/tasks/categories`

```json
{
  "name": "Custom Category",
  "icon": "⭐",
  "color": "#FF5733"
}
```

---

### Update Category

**PATCH** `/tasks/categories/:categoryId`

---

### Delete Category

**DELETE** `/tasks/categories/:categoryId`

---

## Collaborators

When a task has collaborators, it appears in both the owner's and collaborators' task lists.

### Adding Collaborators (Primary Method - Inline)

The primary way to add collaborators is **when creating a task**. Include the `collaborators` array in your create task request:

```json
POST /tasks
{
  "title": "Team Project",
  "collaborators": [
    { "email": "henry.chambers@example.com" },
    { "email": "shane.nguyen@example.com" }
  ]
}
```

**Frontend Flow for "Add People" Sheet:**

1. Open sheet → Call `GET /tasks/users/contacts` to show previously added contacts
2. User types in search → Call `GET /tasks/users/search?q=<query>` to find users
3. User selects collaborators → Store in local state
4. User clicks "Create" → Task is created with collaborators in one request

### Search Users

**GET** `/tasks/users/search?q=john@example.com`

Search Flifup users by email or name to add as collaborators.

**Query Parameters:**

| Parameter | Type   | Required | Description                               |
| --------- | ------ | -------- | ----------------------------------------- |
| q         | string | Yes      | Search query (email or name), min 2 chars |
| limit     | number | No       | Max results to return (default: 10)       |

**Response:**

```json
[
  {
    "id": "user-uuid",
    "fullName": "John Doe",
    "email": "john@example.com"
  }
]
```

---

### Get Contacts

**GET** `/tasks/users/contacts`

Get frequently added collaborators (sorted by most added).

**Response:**

```json
[
  {
    "id": "user-uuid",
    "fullName": "Henry Arthur",
    "email": "henry.chambers@example.com"
  },
  {
    "id": "user-uuid-2",
    "fullName": "Shane Nguyen",
    "email": "shane.nguyen@example.com"
  }
]
```

---

### Managing Collaborators on Existing Tasks

Use these endpoints to manage collaborators on tasks that already exist.

#### Add Collaborator to Existing Task

**POST** `/tasks/:taskId/collaborators`

```json
{
  "email": "collaborator@example.com"
}
```

**Note:** The collaborator must be a registered Flifup user. Once added, the task will appear in both users' task lists.

---

#### Get Task Collaborators

**GET** `/tasks/:taskId/collaborators`

Returns list of collaborators for a specific task.

---

#### Remove Collaborator

**DELETE** `/tasks/:taskId/collaborators/:userId`

Removes a collaborator from the task.

---

## Goals

Goals can be created separately and linked to tasks.

### Create Goal

**POST** `/tasks/goals`

```json
{
  "title": "Run a Half Marathon",
  "description": "Complete a 21km run",
  "icon": "🏃",
  "color": "#10B981",
  "targetValue": 21,
  "unit": "km",
  "deadline": "2025-06-01"
}
```

---

### Get Goals

**GET** `/tasks/goals/list`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| isCompleted | boolean | Filter by completion status |
| search | string | Search in title/description |

---

### Get Goal with Tasks

**GET** `/tasks/goals/:goalId`

Returns goal with all linked tasks.

---

### Update Goal

**PATCH** `/tasks/goals/:goalId`

---

### Delete Goal

**DELETE** `/tasks/goals/:goalId`

---

## Reminders

### Reminder Presets

**GET** `/tasks/helpers/reminder-presets`

Returns all available preset options:

```json
{
  "minutes": [
    { "value": 1, "label": "1 minute before", "isPreset": true },
    { "value": 5, "label": "5 minutes before", "isPreset": true },
    { "value": 10, "label": "10 minutes before", "isPreset": true },
    { "value": 15, "label": "15 minutes before", "isPreset": true },
    { "value": 20, "label": "20 minutes before", "isPreset": true },
    { "value": 25, "label": "25 minutes before", "isPreset": true },
    { "value": 30, "label": "30 minutes before", "isPreset": true }
  ],
  "hours": [
    { "value": 1, "label": "1 hour before", "isPreset": true },
    { "value": 2, "label": "2 hours before", "isPreset": true },
    { "value": 4, "label": "4 hours before", "isPreset": true },
    { "value": 8, "label": "8 hours before", "isPreset": true },
    { "value": 16, "label": "16 hours before", "isPreset": true }
  ],
  "days": [
    { "value": 1, "label": "1 day before", "isPreset": true },
    { "value": 2, "label": "2 days before", "isPreset": true },
    { "value": 3, "label": "3 days before", "isPreset": true },
    { "value": 5, "label": "5 days before", "isPreset": true },
    { "value": 7, "label": "7 days before", "isPreset": true }
  ]
}
```

---

### Add Reminder

**POST** `/tasks/:taskId/reminders`

```json
{
  "value": 30,
  "unit": "MINUTES",
  "isCustom": false
}
```

| Unit    | Description         |
| ------- | ------------------- |
| MINUTES | Value is in minutes |
| HOURS   | Value is in hours   |
| DAYS    | Value is in days    |

---

### Get Reminders

**GET** `/tasks/:taskId/reminders`

---

### Delete Reminder

**DELETE** `/tasks/:taskId/reminders/:reminderId`

---

## Date Shortcuts

**GET** `/tasks/helpers/date-shortcuts`

Returns dynamic date shortcuts for quick task scheduling:

```json
[
  { "key": "today", "label": "Today", "date": "2025-12-31", "dayName": "Tue" },
  {
    "key": "tomorrow",
    "label": "Tomorrow",
    "date": "2026-01-01",
    "dayName": "Wed"
  },
  {
    "key": "later_this_week",
    "label": "Later this week",
    "date": "2026-01-03",
    "dayName": "Fri"
  },
  {
    "key": "this_weekend",
    "label": "This weekend",
    "date": "2026-01-04",
    "dayName": "Sat"
  },
  {
    "key": "next_week",
    "label": "Next week",
    "date": "2026-01-06",
    "dayName": "Mon"
  },
  { "key": "no_date", "label": "No date", "date": null, "dayName": null }
]
```

---

## Focus Mode

Pomodoro-style focus timer for tasks.

### Start Focus Session

**POST** `/tasks/focus/start`

```json
{
  "taskId": "task-uuid",
  "duration": 600
}
```

| Field    | Type   | Description                   |
| -------- | ------ | ----------------------------- |
| taskId   | string | Task to focus on              |
| duration | number | Duration in seconds (60-7200) |

**Response:**

```json
{
  "id": "session-uuid",
  "taskId": "task-uuid",
  "status": "RUNNING",
  "initialDuration": 600,
  "totalDuration": 600,
  "remainingTime": 600,
  "finishesAt": "2025-12-31T14:22:00.000Z",
  "formattedDuration": "10:00",
  "task": { "id": "...", "title": "Complete project report" }
}
```

---

### Get Active Session

**GET** `/tasks/focus/active`

Returns current running/paused session or null.

```json
{
  "id": "session-uuid",
  "status": "RUNNING",
  "currentRemainingTime": 542,
  "finishesAt": "2025-12-31T14:22:00.000Z",
  "formattedRemaining": "09:02",
  "formattedTotal": "10:00",
  "progress": 10
}
```

---

### Pause Session

**POST** `/tasks/focus/:sessionId/pause`

---

### Resume Session

**POST** `/tasks/focus/:sessionId/resume`

---

### Add Time

**POST** `/tasks/focus/:sessionId/add-time`

```json
{
  "additionalTime": 300
}
```

Adds 5 minutes (300 seconds) to the session.

---

### Complete Session

**POST** `/tasks/focus/:sessionId/complete`

Marks session as completed and updates task's actual time.

---

### Quit Session

**POST** `/tasks/focus/:sessionId/quit`

Quits the session early. Time is still tracked if > 1 minute.

---

### Get Focus History

**GET** `/tasks/focus/history`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| taskId | string | Filter by task |

---

## Time Entries

Manual time tracking for tasks.

### Add Time Entry

**POST** `/tasks/:taskId/time-entries`

```json
{
  "startTime": "2025-12-31T09:00:00.000Z",
  "endTime": "2025-12-31T11:00:00.000Z",
  "note": "Worked on introduction section"
}
```

---

### Get Time Entries

**GET** `/tasks/:taskId/time-entries`

---

### Update Time Entry

**PATCH** `/tasks/:taskId/time-entries/:entryId`

---

### Delete Time Entry

**DELETE** `/tasks/:taskId/time-entries/:entryId`

---

## Statistics & Reports

### Overview Stats

**GET** `/tasks/stats/overview`

Basic task statistics.

---

### Weekly Stats

**GET** `/tasks/stats/weekly`

Weekly task breakdown.

---

### Monthly Stats

**GET** `/tasks/stats/monthly?year=2025&month=12`

Monthly calendar view with task counts.

---

### Comprehensive Reports

**GET** `/tasks/reports/overview`

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| days | number | 30 | Number of days to analyze |
| startDate | string | - | Start date |
| endDate | string | - | End date |

**Response:**

```json
{
  "period": { "startDate": "...", "endDate": "...", "days": 30 },
  "overview": {
    "totalTasks": 50,
    "completedTasks": 35,
    "inProgressTasks": 10,
    "todoTasks": 5,
    "completionRate": 70
  },
  "focus": {
    "totalSessions": 25,
    "totalFocusTime": 45000,
    "totalFocusTimeFormatted": "12:30:00",
    "avgFocusPerSession": 1800,
    "avgFocusPerSessionFormatted": "30:00"
  },
  "byCategory": [{ "categoryId": "...", "count": 15 }],
  "byPriority": [{ "priority": "HIGH", "count": 10 }],
  "dailyStats": [
    {
      "date": "2025-12-31",
      "dayName": "Tue",
      "tasksCompleted": 3,
      "focusSessions": 2,
      "focusTime": 3600,
      "focusTimeFormatted": "01:00:00"
    }
  ]
}
```

---

### Productivity Score

**GET** `/tasks/reports/productivity`

Weekly productivity score (0-100) with insights.

**Response:**

```json
{
  "score": 75,
  "breakdown": {
    "tasksCompleted": 7,
    "completionScore": 28,
    "focusSessions": 15,
    "totalFocusTime": 27000,
    "totalFocusTimeFormatted": "07:30:00",
    "avgDailyFocusMinutes": 64,
    "focusScore": 32,
    "overdueTasks": 2,
    "overdueScore": 12
  },
  "insights": [
    "🎯 Great job! You completed at least one task per day this week.",
    "⏱️ Good focus time! Try to increase to 2 hours daily for better productivity.",
    "✅ No overdue tasks! Keep up the great organization."
  ]
}
```

---

## Subtasks

### Create Subtask

**POST** `/tasks/:taskId/subtasks`

```json
{
  "title": "Research topics"
}
```

---

### Get Subtasks

**GET** `/tasks/:taskId/subtasks`

---

### Update Subtask

**PATCH** `/tasks/:taskId/subtasks/:id`

---

### Toggle Subtask

**PATCH** `/tasks/:taskId/subtasks/:id/toggle`

Toggles completion status.

---

### Reorder Subtasks

**PATCH** `/tasks/:taskId/subtasks/reorder`

```json
{
  "subtaskIds": ["id1", "id2", "id3"]
}
```

---

### Delete Subtask

**DELETE** `/tasks/:taskId/subtasks/:id`

---

## Error Responses

### 400 Bad Request

```json
{
  "message": ["title must be a string"],
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
  "message": "Task not found",
  "error": "Not Found",
  "statusCode": 404
}
```

---

## Usage Examples

### Create Task with Subtasks

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project proposal",
    "description": "Write and submit the Q1 proposal",
    "priority": "HIGH",
    "dueDate": "2026-01-15",
    "subtasks": [
      { "title": "Research competitors" },
      { "title": "Write executive summary" },
      { "title": "Create budget breakdown" },
      { "title": "Review with team" }
    ]
  }'
```

### Create Task with Collaborators (Inline)

```bash
# Create a task with collaborators in one request
curl -X POST http://localhost:3000/tasks \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Team Project",
    "dueDate": "2026-01-15",
    "goalId": "goal-uuid",
    "collaborators": [
      { "email": "henry.chambers@example.com" },
      { "email": "shane.nguyen@example.com" }
    ]
  }'
```

### Create Task with Subtasks and Collaborators

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Q1 Marketing Campaign",
    "description": "Plan and execute Q1 marketing initiatives",
    "priority": "HIGH",
    "dueDate": "2026-02-01",
    "subtasks": [
      { "title": "Define target audience" },
      { "title": "Create content calendar" },
      { "title": "Design creatives" },
      { "title": "Launch campaign" }
    ],
    "collaborators": [
      { "email": "marketing@example.com" },
      { "email": "design@example.com" }
    ]
  }'
```

### Add Collaborator to Existing Task

```bash
# Add collaborator after task creation (they must be a Flifup user)
curl -X POST http://localhost:3000/tasks/<taskId>/collaborators \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{ "email": "teammate@example.com" }'
```

### Start a 10-minute Focus Session

```bash
# Start session
curl -X POST http://localhost:3000/tasks/focus/start \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{ "taskId": "<taskId>", "duration": 600 }'

# Check progress
curl http://localhost:3000/tasks/focus/active \
  -H "Authorization: Bearer <token>"

# Add 5 more minutes
curl -X POST http://localhost:3000/tasks/focus/<sessionId>/add-time \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{ "additionalTime": 300 }'

# Complete when timer ends
curl -X POST http://localhost:3000/tasks/focus/<sessionId>/complete \
  -H "Authorization: Bearer <token>"
```

### Get Weekly Productivity Report

```bash
curl http://localhost:3000/tasks/reports/productivity \
  -H "Authorization: Bearer <token>"
```

---

## Changelog

- **v1.0.0** - Initial release with Task CRUD
- **v1.1.0** - Added categories, collaborators, reminders, time entries
- **v1.2.0** - Added goals, date shortcuts, enhanced task detail
- **v1.3.0** - Added focus mode, productivity reports, task reports
- **v1.4.0** - Added inline subtask creation when creating tasks
- **v1.5.0** - Added inline collaborator assignment when creating tasks
