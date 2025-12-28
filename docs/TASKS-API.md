# Flifup Tasks API Documentation

## Base URL

```
http://localhost:3000/api/v1
```

## Authentication

All Tasks endpoints require Bearer token authentication:

```
Authorization: Bearer <access_token>
```

---

# Tasks

## Data Models

### Task Object

```json
{
  "id": "clxxx...",
  "title": "Complete project proposal",
  "description": "Write and submit the Q1 project proposal",
  "status": "TODO",
  "priority": "HIGH",
  "dueDate": "2025-12-15T10:00:00.000Z",
  "repeat": "NONE",
  "project": "Work",
  "reminderAt": "2025-12-14T09:00:00.000Z",
  "completedAt": null,
  "userId": "clxxx...",
  "createdAt": "2025-11-30T12:00:00.000Z",
  "updatedAt": "2025-11-30T12:00:00.000Z",
  "subtasks": []
}
```

### Enums

| Field      | Values                               |
| ---------- | ------------------------------------ |
| `status`   | `TODO`, `IN_PROGRESS`, `COMPLETED`   |
| `priority` | `LOW`, `MEDIUM`, `HIGH`              |
| `repeat`   | `NONE`, `DAILY`, `WEEKLY`, `MONTHLY` |

---

## Endpoints

### 1. Create Task

**POST** `/tasks`

Creates a new task for the authenticated user.

**Request Body:**

```json
{
  "title": "Complete project proposal",
  "description": "Write and submit the Q1 project proposal",
  "project": "Work",
  "priority": "HIGH",
  "dueDate": "2025-12-15T10:00:00.000Z",
  "repeat": "NONE",
  "reminderAt": "2025-12-14T09:00:00.000Z",
  "status": "TODO"
}
```

| Field         | Type     | Required | Constraints                                            |
| ------------- | -------- | -------- | ------------------------------------------------------ |
| `title`       | string   | ✅ Yes   | Max 255 characters                                     |
| `description` | string   | No       | Max 2000 characters                                    |
| `project`     | string   | No       | Max 100 characters                                     |
| `priority`    | enum     | No       | `LOW`, `MEDIUM`, `HIGH` (default: `LOW`)               |
| `dueDate`     | ISO 8601 | No       | Valid date string                                      |
| `repeat`      | enum     | No       | `NONE`, `DAILY`, `WEEKLY`, `MONTHLY` (default: `NONE`) |
| `reminderAt`  | ISO 8601 | No       | Valid date string                                      |
| `status`      | enum     | No       | `TODO`, `IN_PROGRESS`, `COMPLETED` (default: `TODO`)   |

**Response (201 Created):**

```json
{
  "id": "clxxx...",
  "title": "Complete project proposal",
  "description": "Write and submit the Q1 project proposal",
  "status": "TODO",
  "priority": "HIGH",
  "dueDate": "2025-12-15T10:00:00.000Z",
  "repeat": "NONE",
  "project": "Work",
  "reminderAt": "2025-12-14T09:00:00.000Z",
  "completedAt": null,
  "userId": "clxxx...",
  "createdAt": "2025-11-30T12:00:00.000Z",
  "updatedAt": "2025-11-30T12:00:00.000Z"
}
```

**Errors:**
| Status | Description |
|--------|-------------|
| 400 | Validation error |
| 401 | Unauthorized - Invalid or missing token |

---

### 2. Get All Tasks

**GET** `/tasks`

Retrieves all tasks for the authenticated user with optional filtering, sorting, and pagination.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `status` | enum | - | Filter by status: `TODO`, `IN_PROGRESS`, `COMPLETED` |
| `priority` | enum | - | Filter by priority: `LOW`, `MEDIUM`, `HIGH` |
| `project` | string | - | Filter by project name (exact match) |
| `search` | string | - | Search in title and description |
| `dueDateFrom` | ISO 8601 | - | Filter tasks with due date >= value |
| `dueDateTo` | ISO 8601 | - | Filter tasks with due date <= value |
| `sortBy` | string | `createdAt` | Sort field: `dueDate`, `priority`, `createdAt`, `project` |
| `sortOrder` | string | `desc` | Sort order: `asc`, `desc` |
| `page` | integer | 1 | Page number (min: 1) |
| `limit` | integer | 20 | Items per page (min: 1, max: 100) |

**Example Request:**

```
GET /tasks?status=TODO&priority=HIGH&project=Work&sortBy=dueDate&sortOrder=asc&page=1&limit=10
```

**Response (200 OK):**

```json
{
  "data": [
    {
      "id": "clxxx...",
      "title": "Complete project proposal",
      "description": "Write and submit the Q1 project proposal",
      "status": "TODO",
      "priority": "HIGH",
      "dueDate": "2025-12-15T10:00:00.000Z",
      "repeat": "NONE",
      "project": "Work",
      "reminderAt": "2025-12-14T09:00:00.000Z",
      "completedAt": null,
      "userId": "clxxx...",
      "createdAt": "2025-11-30T12:00:00.000Z",
      "updatedAt": "2025-11-30T12:00:00.000Z",
      "subtasks": [
        {
          "id": "clyyy...",
          "title": "Research competitors",
          "isCompleted": true,
          "order": 0
        }
      ]
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

**Errors:**
| Status | Description |
|--------|-------------|
| 400 | Invalid query parameters |
| 401 | Unauthorized |

---

### 3. Get Today's Tasks

**GET** `/tasks/today`

Retrieves all tasks due today for the authenticated user.

**Response (200 OK):**

```json
[
  {
    "id": "clxxx...",
    "title": "Morning standup",
    "description": null,
    "status": "TODO",
    "priority": "MEDIUM",
    "dueDate": "2025-11-30T09:00:00.000Z",
    "repeat": "DAILY",
    "project": "Work",
    "reminderAt": null,
    "completedAt": null,
    "userId": "clxxx...",
    "createdAt": "2025-11-30T08:00:00.000Z",
    "updatedAt": "2025-11-30T08:00:00.000Z",
    "subtasks": []
  }
]
```

---

### 4. Get Upcoming Tasks

**GET** `/tasks/upcoming`

Retrieves tasks due in the next 7 days (excluding today and overdue).

**Response (200 OK):**

```json
[
  {
    "id": "clxxx...",
    "title": "Weekly report",
    "description": "Submit weekly progress report",
    "status": "TODO",
    "priority": "HIGH",
    "dueDate": "2025-12-05T17:00:00.000Z",
    "repeat": "WEEKLY",
    "project": "Work",
    "reminderAt": "2025-12-05T15:00:00.000Z",
    "completedAt": null,
    "userId": "clxxx...",
    "createdAt": "2025-11-28T10:00:00.000Z",
    "updatedAt": "2025-11-28T10:00:00.000Z",
    "subtasks": []
  }
]
```

---

### 5. Get Overdue Tasks

**GET** `/tasks/overdue`

Retrieves all tasks that are past their due date and not completed.

**Response (200 OK):**

```json
[
  {
    "id": "clxxx...",
    "title": "Pay electricity bill",
    "description": null,
    "status": "TODO",
    "priority": "HIGH",
    "dueDate": "2025-11-25T23:59:59.000Z",
    "repeat": "MONTHLY",
    "project": "Personal",
    "reminderAt": null,
    "completedAt": null,
    "userId": "clxxx...",
    "createdAt": "2025-11-20T10:00:00.000Z",
    "updatedAt": "2025-11-20T10:00:00.000Z",
    "subtasks": []
  }
]
```

---

### 6. Get Projects

**GET** `/tasks/projects`

Retrieves a list of unique project names used by the authenticated user.

**Response (200 OK):**

```json
["Work", "Personal", "Health", "Shopping"]
```

---

### 7. Get Single Task

**GET** `/tasks/:id`

Retrieves a specific task by ID.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Task ID (CUID) |

**Response (200 OK):**

```json
{
  "id": "clxxx...",
  "title": "Complete project proposal",
  "description": "Write and submit the Q1 project proposal",
  "status": "TODO",
  "priority": "HIGH",
  "dueDate": "2025-12-15T10:00:00.000Z",
  "repeat": "NONE",
  "project": "Work",
  "reminderAt": "2025-12-14T09:00:00.000Z",
  "completedAt": null,
  "userId": "clxxx...",
  "createdAt": "2025-11-30T12:00:00.000Z",
  "updatedAt": "2025-11-30T12:00:00.000Z",
  "subtasks": [
    {
      "id": "clyyy...",
      "title": "Research competitors",
      "isCompleted": true,
      "order": 0,
      "completedAt": "2025-11-30T14:00:00.000Z",
      "taskId": "clxxx...",
      "createdAt": "2025-11-30T12:30:00.000Z",
      "updatedAt": "2025-11-30T14:00:00.000Z"
    }
  ]
}
```

**Errors:**
| Status | Description |
|--------|-------------|
| 401 | Unauthorized |
| 403 | Task does not belong to user |
| 404 | Task not found |

---

### 8. Update Task

**PATCH** `/tasks/:id`

Updates a task's fields. Only provided fields will be updated.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Task ID (CUID) |

**Request Body:**

```json
{
  "title": "Updated task title",
  "priority": "MEDIUM",
  "status": "IN_PROGRESS"
}
```

| Field         | Type     | Required | Constraints                          |
| ------------- | -------- | -------- | ------------------------------------ |
| `title`       | string   | No       | Max 255 characters                   |
| `description` | string   | No       | Max 2000 characters                  |
| `project`     | string   | No       | Max 100 characters                   |
| `priority`    | enum     | No       | `LOW`, `MEDIUM`, `HIGH`              |
| `dueDate`     | ISO 8601 | No       | Valid date string                    |
| `repeat`      | enum     | No       | `NONE`, `DAILY`, `WEEKLY`, `MONTHLY` |
| `reminderAt`  | ISO 8601 | No       | Valid date string                    |
| `status`      | enum     | No       | `TODO`, `IN_PROGRESS`, `COMPLETED`   |

**Response (200 OK):**

```json
{
  "id": "clxxx...",
  "title": "Updated task title",
  "description": "Write and submit the Q1 project proposal",
  "status": "IN_PROGRESS",
  "priority": "MEDIUM",
  "dueDate": "2025-12-15T10:00:00.000Z",
  "repeat": "NONE",
  "project": "Work",
  "reminderAt": "2025-12-14T09:00:00.000Z",
  "completedAt": null,
  "userId": "clxxx...",
  "createdAt": "2025-11-30T12:00:00.000Z",
  "updatedAt": "2025-11-30T15:00:00.000Z"
}
```

**Errors:**
| Status | Description |
|--------|-------------|
| 400 | Validation error |
| 401 | Unauthorized |
| 403 | Task does not belong to user |
| 404 | Task not found |

---

### 9. Update Task Status

**PATCH** `/tasks/:id/status`

Quick endpoint to update only the task status.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Task ID (CUID) |

**Request Body:**

```json
{
  "status": "COMPLETED"
}
```

| Field    | Type | Required | Values                             |
| -------- | ---- | -------- | ---------------------------------- |
| `status` | enum | ✅ Yes   | `TODO`, `IN_PROGRESS`, `COMPLETED` |

**Response (200 OK):**

```json
{
  "id": "clxxx...",
  "title": "Complete project proposal",
  "description": "Write and submit the Q1 project proposal",
  "status": "COMPLETED",
  "priority": "HIGH",
  "dueDate": "2025-12-15T10:00:00.000Z",
  "repeat": "NONE",
  "project": "Work",
  "reminderAt": "2025-12-14T09:00:00.000Z",
  "completedAt": "2025-11-30T16:00:00.000Z",
  "userId": "clxxx...",
  "createdAt": "2025-11-30T12:00:00.000Z",
  "updatedAt": "2025-11-30T16:00:00.000Z"
}
```

> **Note:** When status is set to `COMPLETED`, `completedAt` is automatically set. When status changes from `COMPLETED` to another status, `completedAt` is cleared.

**Errors:**
| Status | Description |
|--------|-------------|
| 400 | Validation error |
| 401 | Unauthorized |
| 403 | Task does not belong to user |
| 404 | Task not found |

---

### 10. Delete Task

**DELETE** `/tasks/:id`

Permanently deletes a task and all its subtasks.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Task ID (CUID) |

**Response (200 OK):**

```json
{
  "message": "Task deleted successfully"
}
```

**Errors:**
| Status | Description |
|--------|-------------|
| 401 | Unauthorized |
| 403 | Task does not belong to user |
| 404 | Task not found |

---

# Subtasks

Subtasks are nested under tasks and provide granular task breakdown.

## Data Model

### Subtask Object

```json
{
  "id": "clyyy...",
  "title": "Research competitors",
  "isCompleted": false,
  "order": 0,
  "completedAt": null,
  "taskId": "clxxx...",
  "createdAt": "2025-11-30T12:30:00.000Z",
  "updatedAt": "2025-11-30T12:30:00.000Z"
}
```

---

## Endpoints

### 1. Create Subtask

**POST** `/tasks/:taskId/subtasks`

Creates a new subtask for a task.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `taskId` | string | Parent task ID (CUID) |

**Request Body:**

```json
{
  "title": "Research competitors",
  "order": 0
}
```

| Field   | Type    | Required | Constraints        |
| ------- | ------- | -------- | ------------------ |
| `title` | string  | ✅ Yes   | Max 255 characters |
| `order` | integer | No       | Min 0 (default: 0) |

**Response (201 Created):**

```json
{
  "id": "clyyy...",
  "title": "Research competitors",
  "isCompleted": false,
  "order": 0,
  "completedAt": null,
  "taskId": "clxxx...",
  "createdAt": "2025-11-30T12:30:00.000Z",
  "updatedAt": "2025-11-30T12:30:00.000Z"
}
```

**Errors:**
| Status | Description |
|--------|-------------|
| 400 | Validation error |
| 401 | Unauthorized |
| 403 | Task does not belong to user |
| 404 | Task not found |

---

### 2. Get All Subtasks

**GET** `/tasks/:taskId/subtasks`

Retrieves all subtasks for a task, ordered by `order` field.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `taskId` | string | Parent task ID (CUID) |

**Response (200 OK):**

```json
[
  {
    "id": "clyyy1...",
    "title": "Research competitors",
    "isCompleted": true,
    "order": 0,
    "completedAt": "2025-11-30T14:00:00.000Z",
    "taskId": "clxxx...",
    "createdAt": "2025-11-30T12:30:00.000Z",
    "updatedAt": "2025-11-30T14:00:00.000Z"
  },
  {
    "id": "clyyy2...",
    "title": "Write executive summary",
    "isCompleted": false,
    "order": 1,
    "completedAt": null,
    "taskId": "clxxx...",
    "createdAt": "2025-11-30T12:35:00.000Z",
    "updatedAt": "2025-11-30T12:35:00.000Z"
  }
]
```

**Errors:**
| Status | Description |
|--------|-------------|
| 401 | Unauthorized |
| 403 | Task does not belong to user |
| 404 | Task not found |

---

### 3. Update Subtask

**PATCH** `/tasks/:taskId/subtasks/:id`

Updates a subtask's fields.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `taskId` | string | Parent task ID (CUID) |
| `id` | string | Subtask ID (CUID) |

**Request Body:**

```json
{
  "title": "Updated subtask title",
  "isCompleted": true
}
```

| Field         | Type    | Required | Constraints        |
| ------------- | ------- | -------- | ------------------ |
| `title`       | string  | No       | Max 255 characters |
| `isCompleted` | boolean | No       | `true` or `false`  |

**Response (200 OK):**

```json
{
  "id": "clyyy...",
  "title": "Updated subtask title",
  "isCompleted": true,
  "order": 0,
  "completedAt": "2025-11-30T15:00:00.000Z",
  "taskId": "clxxx...",
  "createdAt": "2025-11-30T12:30:00.000Z",
  "updatedAt": "2025-11-30T15:00:00.000Z"
}
```

**Errors:**
| Status | Description |
|--------|-------------|
| 400 | Validation error |
| 401 | Unauthorized |
| 403 | Task/Subtask does not belong to user |
| 404 | Task or Subtask not found |

---

### 4. Toggle Subtask Completion

**PATCH** `/tasks/:taskId/subtasks/:id/toggle`

Toggles the completion status of a subtask.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `taskId` | string | Parent task ID (CUID) |
| `id` | string | Subtask ID (CUID) |

**Response (200 OK):**

```json
{
  "id": "clyyy...",
  "title": "Research competitors",
  "isCompleted": true,
  "order": 0,
  "completedAt": "2025-11-30T15:30:00.000Z",
  "taskId": "clxxx...",
  "createdAt": "2025-11-30T12:30:00.000Z",
  "updatedAt": "2025-11-30T15:30:00.000Z"
}
```

> **Note:** When toggled to completed, `completedAt` is set to current time. When toggled to incomplete, `completedAt` is cleared.

**Errors:**
| Status | Description |
|--------|-------------|
| 401 | Unauthorized |
| 403 | Task/Subtask does not belong to user |
| 404 | Task or Subtask not found |

---

### 5. Reorder Subtasks

**PATCH** `/tasks/:taskId/subtasks/reorder`

Reorders subtasks by providing an array of subtask IDs in the desired order.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `taskId` | string | Parent task ID (CUID) |

**Request Body:**

```json
{
  "orderedIds": ["clyyy2...", "clyyy1...", "clyyy3..."]
}
```

| Field        | Type     | Required | Constraints                    |
| ------------ | -------- | -------- | ------------------------------ |
| `orderedIds` | string[] | ✅ Yes   | Non-empty array of subtask IDs |

**Response (200 OK):**

```json
[
  {
    "id": "clyyy2...",
    "title": "Write executive summary",
    "isCompleted": false,
    "order": 0,
    "completedAt": null,
    "taskId": "clxxx...",
    "createdAt": "2025-11-30T12:35:00.000Z",
    "updatedAt": "2025-11-30T16:00:00.000Z"
  },
  {
    "id": "clyyy1...",
    "title": "Research competitors",
    "isCompleted": true,
    "order": 1,
    "completedAt": "2025-11-30T14:00:00.000Z",
    "taskId": "clxxx...",
    "createdAt": "2025-11-30T12:30:00.000Z",
    "updatedAt": "2025-11-30T16:00:00.000Z"
  },
  {
    "id": "clyyy3...",
    "title": "Review with team",
    "isCompleted": false,
    "order": 2,
    "completedAt": null,
    "taskId": "clxxx...",
    "createdAt": "2025-11-30T12:40:00.000Z",
    "updatedAt": "2025-11-30T16:00:00.000Z"
  }
]
```

**Errors:**
| Status | Description |
|--------|-------------|
| 400 | Invalid or empty orderedIds array |
| 401 | Unauthorized |
| 403 | Task does not belong to user |
| 404 | Task not found |

---

### 6. Delete Subtask

**DELETE** `/tasks/:taskId/subtasks/:id`

Permanently deletes a subtask.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `taskId` | string | Parent task ID (CUID) |
| `id` | string | Subtask ID (CUID) |

**Response (200 OK):**

```json
{
  "message": "Subtask deleted successfully"
}
```

**Errors:**
| Status | Description |
|--------|-------------|
| 401 | Unauthorized |
| 403 | Task/Subtask does not belong to user |
| 404 | Task or Subtask not found |

---

# Error Response Format

All error responses follow this format:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

Or for validation errors with details:

```json
{
  "statusCode": 400,
  "message": [
    "title must be shorter than or equal to 255 characters",
    "priority must be one of the following values: LOW, MEDIUM, HIGH"
  ],
  "error": "Bad Request"
}
```

---

# Database Indexes

For optimal performance, the following indexes are configured:

| Table   | Indexed Fields     | Purpose                   |
| ------- | ------------------ | ------------------------- |
| Task    | `userId`           | Filter user's tasks       |
| Task    | `project`          | Filter by project         |
| Task    | `status`           | Filter by status          |
| Task    | `dueDate`          | Date range queries        |
| Task    | `userId + project` | Composite filter          |
| Task    | `userId + status`  | Composite filter          |
| Task    | `userId + dueDate` | Composite filter          |
| Subtask | `taskId`           | Get task's subtasks       |
| Subtask | `taskId + order`   | Ordered subtask retrieval |

---

# Best Practices

1. **Pagination**: Always use pagination for `/tasks` endpoint with large datasets
2. **Filtering**: Use filters to reduce response size and improve performance
3. **Status Updates**: Use `/tasks/:id/status` for quick status changes
4. **Subtask Order**: Use `reorder` endpoint for drag-and-drop reordering
5. **Token Refresh**: Refresh access token before it expires (15 min lifetime)

---

# Task Categories

## Data Models

### Category Object

```json
{
  "id": "clxxx...",
  "name": "Exercise",
  "icon": "🏃",
  "color": "#10B981",
  "isDefault": true,
  "userId": "clxxx...",
  "createdAt": "2025-11-30T12:00:00.000Z",
  "updatedAt": "2025-11-30T12:00:00.000Z"
}
```

---

## Endpoints

### 1. Get All Categories

**GET** `/tasks/categories`

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
    "updatedAt": "2025-11-30T12:00:00.000Z"
  }
]
```

---

### 2. Create Category

**POST** `/tasks/categories`

Creates a new custom category.

**Request Body:**

```json
{
  "name": "Reading",
  "icon": "📚",
  "color": "#EF4444"
}
```

| Field   | Type   | Required | Constraints                        |
| ------- | ------ | -------- | ---------------------------------- |
| `name`  | string | ✅ Yes   | Max 50 characters, unique per user |
| `icon`  | string | No       | Max 50 characters (emoji)          |
| `color` | string | No       | Hex color format (e.g., `#6366F1`) |

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
  "updatedAt": "2025-11-30T12:00:00.000Z"
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

**PATCH** `/tasks/categories/:id`

Updates an existing category.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Category ID (CUID) |

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
  "updatedAt": "2025-11-30T13:00:00.000Z"
}
```

**Errors:**
| Status | Description |
|--------|-------------|
| 400 | Cannot modify default category |
| 401 | Unauthorized |
| 403 | Category does not belong to user |
| 404 | Category not found |
| 409 | Category with this name already exists |

---

### 4. Delete Category

**DELETE** `/tasks/categories/:id`

Deletes a custom category.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Category ID (CUID) |

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

# Task Collaborators

## Data Models

### Collaborator Object

```json
{
  "id": "clxxx...",
  "taskId": "clyyy...",
  "userId": "clzzz...",
  "role": "VIEWER",
  "addedAt": "2025-11-30T12:00:00.000Z",
  "user": {
    "id": "clzzz...",
    "fullName": "John Doe",
    "email": "john@example.com"
  }
}
```

### Enums

| Field  | Values             |
| ------ | ------------------ |
| `role` | `VIEWER`, `EDITOR` |

---

## Endpoints

### 1. Search Users

**GET** `/tasks/users/search`

Search for users to add as collaborators.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | string | ✅ Yes | Email to search for (min 3 characters) |

**Response (200 OK):**

```json
[
  {
    "id": "clxxx...",
    "fullName": "John Doe",
    "email": "john@example.com"
  }
]
```

---

### 2. Get Contacts

**GET** `/tasks/users/contacts`

Get frequently added collaborators (contacts).

**Response (200 OK):**

```json
[
  {
    "email": "john@example.com",
    "fullName": "John Doe",
    "userId": "clxxx...",
    "addCount": 5
  }
]
```

---

### 3. Get Task Collaborators

**GET** `/tasks/:taskId/collaborators`

Get all collaborators for a task.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `taskId` | string | Task ID (CUID) |

**Response (200 OK):**

```json
[
  {
    "id": "clxxx...",
    "taskId": "clyyy...",
    "userId": "clzzz...",
    "role": "EDITOR",
    "addedAt": "2025-11-30T12:00:00.000Z",
    "user": {
      "id": "clzzz...",
      "fullName": "John Doe",
      "email": "john@example.com"
    }
  }
]
```

---

### 4. Add Collaborator

**POST** `/tasks/:taskId/collaborators`

Add a collaborator to a task.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `taskId` | string | Task ID (CUID) |

**Request Body:**

```json
{
  "email": "john@example.com",
  "role": "EDITOR"
}
```

| Field   | Type   | Required | Constraints                            |
| ------- | ------ | -------- | -------------------------------------- |
| `email` | string | ✅ Yes   | Valid email format                     |
| `role`  | enum   | No       | `VIEWER`, `EDITOR` (default: `VIEWER`) |

**Response (201 Created):**

```json
{
  "id": "clxxx...",
  "taskId": "clyyy...",
  "userId": "clzzz...",
  "role": "EDITOR",
  "addedAt": "2025-11-30T12:00:00.000Z",
  "user": {
    "id": "clzzz...",
    "fullName": "John Doe",
    "email": "john@example.com"
  }
}
```

**Errors:**
| Status | Description |
|--------|-------------|
| 400 | Cannot add yourself as collaborator |
| 401 | Unauthorized |
| 403 | Task does not belong to user |
| 404 | Task or user not found |
| 409 | User is already a collaborator |

---

### 5. Remove Collaborator

**DELETE** `/tasks/:taskId/collaborators/:collaboratorId`

Remove a collaborator from a task.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `taskId` | string | Task ID (CUID) |
| `collaboratorId` | string | Collaborator ID (CUID) |

**Response (200 OK):**

```json
{
  "message": "Collaborator removed successfully"
}
```

---

# Task Reminders

## Data Models

### Reminder Object

```json
{
  "id": "clxxx...",
  "taskId": "clyyy...",
  "value": 30,
  "unit": "MINUTES",
  "isCustom": false,
  "scheduledAt": "2025-12-15T09:30:00.000Z",
  "sentAt": null,
  "createdAt": "2025-11-30T12:00:00.000Z"
}
```

### Enums

| Field  | Values                     |
| ------ | -------------------------- |
| `unit` | `MINUTES`, `HOURS`, `DAYS` |

---

## Endpoints

### 1. Get Task Reminders

**GET** `/tasks/:taskId/reminders`

Get all reminders for a task.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `taskId` | string | Task ID (CUID) |

**Response (200 OK):**

```json
[
  {
    "id": "clxxx...",
    "taskId": "clyyy...",
    "value": 30,
    "unit": "MINUTES",
    "isCustom": false,
    "scheduledAt": "2025-12-15T09:30:00.000Z",
    "sentAt": null,
    "createdAt": "2025-11-30T12:00:00.000Z"
  }
]
```

---

### 2. Add Reminder

**POST** `/tasks/:taskId/reminders`

Add a reminder to a task.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `taskId` | string | Task ID (CUID) |

**Request Body:**

```json
{
  "value": 1,
  "unit": "HOURS",
  "isCustom": false
}
```

| Field      | Type    | Required | Constraints                                                 |
| ---------- | ------- | -------- | ----------------------------------------------------------- |
| `value`    | number  | ✅ Yes   | Min 1, Max 365 (for days), Max 24 (hours), Max 60 (minutes) |
| `unit`     | enum    | ✅ Yes   | `MINUTES`, `HOURS`, `DAYS`                                  |
| `isCustom` | boolean | No       | Default: `false`                                            |

**Response (201 Created):**

```json
{
  "id": "clxxx...",
  "taskId": "clyyy...",
  "value": 1,
  "unit": "HOURS",
  "isCustom": false,
  "scheduledAt": "2025-12-15T09:00:00.000Z",
  "sentAt": null,
  "createdAt": "2025-11-30T12:00:00.000Z"
}
```

**Errors:**
| Status | Description |
|--------|-------------|
| 400 | Task has no due date |
| 401 | Unauthorized |
| 403 | Task does not belong to user |
| 404 | Task not found |
| 409 | Reminder with same timing already exists |

---

### 3. Delete Reminder

**DELETE** `/tasks/:taskId/reminders/:reminderId`

Remove a reminder from a task.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `taskId` | string | Task ID (CUID) |
| `reminderId` | string | Reminder ID (CUID) |

**Response (200 OK):**

```json
{
  "message": "Reminder removed successfully"
}
```

---

# Task Time Entries

## Data Models

### Time Entry Object

```json
{
  "id": "clxxx...",
  "taskId": "clyyy...",
  "startTime": "2025-11-30T10:00:00.000Z",
  "endTime": "2025-11-30T11:30:00.000Z",
  "duration": 90,
  "note": "Worked on the introduction section",
  "createdAt": "2025-11-30T11:30:00.000Z",
  "updatedAt": "2025-11-30T11:30:00.000Z"
}
```

---

## Endpoints

### 1. Get Task Time Entries

**GET** `/tasks/:taskId/time-entries`

Get all time entries for a task.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `taskId` | string | Task ID (CUID) |

**Response (200 OK):**

```json
{
  "entries": [
    {
      "id": "clxxx...",
      "taskId": "clyyy...",
      "startTime": "2025-11-30T10:00:00.000Z",
      "endTime": "2025-11-30T11:30:00.000Z",
      "duration": 90,
      "note": "First session",
      "createdAt": "2025-11-30T11:30:00.000Z",
      "updatedAt": "2025-11-30T11:30:00.000Z"
    }
  ],
  "totalMinutes": 90,
  "estimatedMinutes": 120
}
```

---

### 2. Add Time Entry

**POST** `/tasks/:taskId/time-entries`

Add a time entry to a task.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `taskId` | string | Task ID (CUID) |

**Request Body:**

```json
{
  "startTime": "2025-11-30T10:00:00.000Z",
  "endTime": "2025-11-30T11:30:00.000Z",
  "note": "Worked on introduction"
}
```

| Field       | Type     | Required | Constraints             |
| ----------- | -------- | -------- | ----------------------- |
| `startTime` | ISO 8601 | ✅ Yes   | Valid date string       |
| `endTime`   | ISO 8601 | ✅ Yes   | Must be after startTime |
| `note`      | string   | No       | Max 500 characters      |

**Response (201 Created):**

```json
{
  "id": "clxxx...",
  "taskId": "clyyy...",
  "startTime": "2025-11-30T10:00:00.000Z",
  "endTime": "2025-11-30T11:30:00.000Z",
  "duration": 90,
  "note": "Worked on introduction",
  "createdAt": "2025-11-30T11:30:00.000Z",
  "updatedAt": "2025-11-30T11:30:00.000Z"
}
```

**Errors:**
| Status | Description |
|--------|-------------|
| 400 | End time must be after start time |
| 401 | Unauthorized |
| 403 | Task does not belong to user |
| 404 | Task not found |

---

### 3. Update Time Entry

**PATCH** `/tasks/:taskId/time-entries/:entryId`

Update a time entry.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `taskId` | string | Task ID (CUID) |
| `entryId` | string | Time Entry ID (CUID) |

**Request Body:**

```json
{
  "startTime": "2025-11-30T09:30:00.000Z",
  "endTime": "2025-11-30T11:00:00.000Z",
  "note": "Updated note"
}
```

**Response (200 OK):**

```json
{
  "id": "clxxx...",
  "taskId": "clyyy...",
  "startTime": "2025-11-30T09:30:00.000Z",
  "endTime": "2025-11-30T11:00:00.000Z",
  "duration": 90,
  "note": "Updated note",
  "createdAt": "2025-11-30T11:30:00.000Z",
  "updatedAt": "2025-11-30T12:00:00.000Z"
}
```

---

### 4. Delete Time Entry

**DELETE** `/tasks/:taskId/time-entries/:entryId`

Delete a time entry.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `taskId` | string | Task ID (CUID) |
| `entryId` | string | Time Entry ID (CUID) |

**Response (200 OK):**

```json
{
  "message": "Time entry deleted successfully"
}
```

---

# Task Statistics

## Endpoints

### 1. Get Overview Stats

**GET** `/tasks/stats/overview`

Get overall task statistics for the authenticated user.

**Response (200 OK):**

```json
{
  "total": 50,
  "completed": 35,
  "pending": 15,
  "completionRate": 70.0,
  "overdue": 3,
  "dueToday": 5,
  "avgCompletionTime": 48.5,
  "thisWeek": {
    "total": 12,
    "completed": 8
  },
  "thisMonth": {
    "completed": 25
  }
}
```

| Field                 | Description                              |
| --------------------- | ---------------------------------------- |
| `total`               | Total number of tasks                    |
| `completed`           | Tasks with status COMPLETED              |
| `pending`             | Tasks not completed (TODO + IN_PROGRESS) |
| `completionRate`      | Percentage of completed tasks            |
| `overdue`             | Tasks past due date and not completed    |
| `dueToday`            | Tasks due today                          |
| `avgCompletionTime`   | Average hours to complete tasks          |
| `thisWeek.total`      | Tasks due this week                      |
| `thisWeek.completed`  | Tasks completed this week                |
| `thisMonth.completed` | Tasks completed this month               |

---

### 2. Get Weekly Stats

**GET** `/tasks/stats/weekly`

Get daily breakdown for the current week.

**Response (200 OK):**

```json
{
  "week": [
    {
      "date": "2025-11-24",
      "dayName": "Sun",
      "total": 3,
      "completed": 2
    },
    {
      "date": "2025-11-25",
      "dayName": "Mon",
      "total": 5,
      "completed": 4
    }
  ]
}
```

---

### 3. Get Monthly Stats

**GET** `/tasks/stats/monthly`

Get daily breakdown for a specific month.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `year` | number | No | Year (default: current year) |
| `month` | number | No | Month 0-11 (default: current month) |

**Response (200 OK):**

```json
{
  "year": 2025,
  "month": 10,
  "daysInMonth": 30,
  "days": [
    {
      "day": 1,
      "date": "2025-11-01",
      "total": 2,
      "completed": 1
    }
  ],
  "summary": {
    "totalTasks": 45,
    "completedTasks": 30,
    "completionRate": 66.67
  }
}
```

---

# Updated Create Task

The create task endpoint now supports additional fields:

**POST** `/tasks`

**Additional Request Body Fields:**

```json
{
  "title": "Complete project proposal",
  "dueTime": "14:30",
  "categoryId": "clxxx...",
  "estimatedTime": 120
}
```

| Field           | Type   | Required | Constraints                   |
| --------------- | ------ | -------- | ----------------------------- |
| `dueTime`       | string | No       | Format: HH:mm (24-hour)       |
| `categoryId`    | string | No       | Valid category ID             |
| `estimatedTime` | number | No       | Estimated minutes to complete |

---

# Updated Task Object

Tasks now include additional fields and relations:

```json
{
  "id": "clxxx...",
  "title": "Complete project proposal",
  "description": "Write and submit the Q1 project proposal",
  "status": "TODO",
  "priority": "HIGH",
  "dueDate": "2025-12-15T10:00:00.000Z",
  "dueTime": "14:30",
  "repeat": "NONE",
  "project": "Work",
  "reminderAt": null,
  "completedAt": null,
  "categoryId": "clcat...",
  "estimatedTime": 120,
  "actualTime": 90,
  "userId": "clxxx...",
  "createdAt": "2025-11-30T12:00:00.000Z",
  "updatedAt": "2025-11-30T12:00:00.000Z",
  "subtasks": [],
  "category": {
    "id": "clcat...",
    "name": "Work",
    "icon": "💼",
    "color": "#6366F1"
  },
  "collaborators": [
    {
      "id": "clcol...",
      "role": "EDITOR",
      "user": {
        "id": "cluser...",
        "fullName": "John Doe",
        "email": "john@example.com"
      }
    }
  ],
  "reminders": [
    {
      "id": "clrem...",
      "value": 30,
      "unit": "MINUTES",
      "scheduledAt": "2025-12-15T14:00:00.000Z"
    }
  ]
}
```

---

# Additional Database Indexes

| Table            | Indexed Fields                   | Purpose                         |
| ---------------- | -------------------------------- | ------------------------------- |
| TaskCategory     | `userId`                         | Filter user's categories        |
| TaskCategory     | `userId + name` (unique)         | Unique category names per user  |
| TaskCollaborator | `taskId`                         | Get task's collaborators        |
| TaskCollaborator | `taskId + userId` (unique)       | Prevent duplicate collaborators |
| TaskReminder     | `taskId`                         | Get task's reminders            |
| TaskReminder     | `taskId + value + unit` (unique) | Prevent duplicate reminders     |
| TaskTimeEntry    | `taskId`                         | Get task's time entries         |
| UserContact      | `userId`                         | Get user's contacts             |
| UserContact      | `userId + contactEmail` (unique) | Unique contacts per user        |
