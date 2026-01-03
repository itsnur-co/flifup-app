# Goals Feature Documentation (Frontend)

## Overview

The Goals feature allows users to create, manage, and track long-term goals with milestones (levels). Goals can have tasks linked to them, providing a hierarchical organization of work.

---

## Screens

### 1. Goal List Screen (`/goals`)

Main screen displaying all goals in two sections:

- **Ongoing Goals**: Goals not yet completed
- **Completed Goals**: Goals marked as done

**Features:**

- Pull-to-refresh
- FAB button for creating new goals
- Search functionality
- Goal cards with progress indicators

### 2. Goal Details Screen (`/goal-details?goalId=xxx`)

Detailed view of a single goal showing:

- Goal information (title, description, progress)
- Tasks/levels grouped by completion status
- Create Level button (FAB)
- Edit and Delete actions

---

## Components

### GoalListScreen

```tsx
<GoalListScreen
  goals={goals}
  ongoingGoals={ongoingGoals}
  completedGoals={completedGoals}
  isLoading={isLoading}
  onRefresh={refresh}
  onSearch={searchGoals}
  onGoalPress={handleGoalPress}
  onGoalMore={handleGoalMore}
  onCreatePress={handleCreatePress}
  onBack={() => router.back()}
/>
```

### GoalDetailsScreen

```tsx
<GoalDetailsScreen
  goal={selectedGoal}
  isLoading={isFetchingDetail}
  onBack={() => router.back()}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onCreateLevel={handleCreateLevel}
  onToggleTask={handleToggleTask}
  onTaskPress={handleTaskPress}
  onTaskMore={handleTaskMore}
/>
```

### GoalCard

Individual goal card component showing:

- Title
- Progress bar with percentage
- Task count (completed/total)
- Category badge
- Level badges
- Deadline (if set)

```tsx
<GoalCard
  goal={goal}
  onPress={() => handleGoalPress(goal.id)}
  onMorePress={() => handleGoalMore(goal)}
/>
```

### CreateGoalSheet

Bottom sheet for creating/editing goals.

```tsx
<CreateGoalSheet
  visible={showCreateSheet}
  onClose={handleClose}
  onSubmit={handleSubmit}
  goal={selectedGoal} // null for create, Goal object for edit
  categories={categories}
  onOpenDateSheet={() => setShowDateSheet(true)}
  onOpenCategorySheet={() => setShowCategorySheet(true)}
  onOpenLevelSheet={() => setShowLevelSheet(true)}
  selectedDate={selectedDate}
  selectedCategory={selectedCategory}
  selectedLevels={selectedLevels}
  isLoading={isCreating}
/>
```

### AddLevelSheet

Multi-select sheet for choosing level types.

```tsx
<AddLevelSheet
  visible={showLevelSheet}
  onClose={() => setShowLevelSheet(false)}
  onSelectLevels={handleSelectLevels}
  selectedLevels={selectedLevels}
/>
```

### GoalOptionsModal

Action modal using the reusable OptionsModal component.

```tsx
<GoalOptionsModal
  visible={showOptionsModal}
  goal={selectedGoal}
  onClose={() => setShowOptionsModal(false)}
  onEdit={handleEdit}
  onDuplicate={handleDuplicate}
  onFocus={handleFocus}
  onDelete={handleDelete}
/>
```

---

## Hooks

### useGoals

Main hook for goal management with API integration.

```typescript
import { useGoals } from "@/hooks";

const {
  // Data
  goals, // All goals
  ongoingGoals, // Filtered: !isCompleted
  completedGoals, // Filtered: isCompleted
  selectedGoal, // Current goal detail

  // Loading states
  isLoading,
  isCreating,
  isUpdating,
  isDeleting,
  isFetchingDetail,

  // Error
  error,

  // Actions
  fetchGoals,
  fetchGoal,
  createGoal,
  updateGoal,
  deleteGoal,
  duplicateGoal,
  toggleCompletion,
  setSelectedGoal,

  // Utility
  clearError,
  refresh,
  searchGoals,
} = useGoals({ autoFetch: true });
```

**Options:**

```typescript
interface UseGoalsOptions {
  autoFetch?: boolean; // Auto-fetch on mount (default: true)
  initialFilters?: QueryGoalsRequest;
}
```

---

## Types

### Goal

```typescript
interface Goal {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  color?: string;
  targetValue?: number;
  currentValue: number;
  unit?: string;
  deadline?: string;
  levels?: string[];
  categoryId?: string;
  category?: TaskCategory;
  isCompleted: boolean;
  completedAt?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  _count?: { tasks: number };
  progress?: number;
  taskCounts?: {
    total: number;
    completed: number;
    incomplete: number;
  };
}
```

### GoalDetail

```typescript
interface GoalDetail extends Goal {
  tasks: Task[];
  tasksGrouped?: {
    incomplete: Task[];
    completed: Task[];
  };
}
```

### GoalFormState

```typescript
interface GoalFormState {
  title: string;
  description: string;
  deadline: Date | null;
  levels: string[];
  category: TaskCategory | null;
  icon?: string;
  color?: string;
  targetValue?: number;
  unit?: string;
}
```

### Level Options

```typescript
const LEVEL_OPTIONS: LevelOption[] = [
  { id: "level1", name: "Level 1", label: "Level 1" },
  { id: "level2", name: "Level 2", label: "Level 2" },
  { id: "level3", name: "Level 3", label: "Level 3" },
  { id: "level4", name: "Level 4", label: "Level 4" },
];
```

---

## API Service

### goalService

```typescript
import { goalService } from "@/services/api/goal.service";

// Create
const response = await goalService.createGoal({
  title: "My Goal",
  description: "Description",
  deadline: "2026-03-01T00:00:00.000Z",
  levels: ["Level 1", "Level 2"],
  categoryId: "category123",
});

// List all goals
const goals = await goalService.getGoals();

// List with filters
const ongoingGoals = await goalService.getGoals({ isCompleted: false });
const searchResults = await goalService.getGoals({ search: "website" });

// Get single goal with tasks
const goalDetail = await goalService.getGoal("goalId123");

// Update
const updated = await goalService.updateGoal("goalId123", {
  title: "Updated Title",
  isCompleted: true,
});

// Delete
await goalService.deleteGoal("goalId123");

// Duplicate
const copy = await goalService.duplicateGoal("goalId123");

// Helper methods
await goalService.getOngoingGoals();
await goalService.getCompletedGoals();
await goalService.searchGoals("search text");
```

---

## Navigation Flow

```
Home Screen (tabs/index.tsx)
    │
    └── "🎯 Goals" Button
            │
            └── /goals (GoalListScreen)
                    │
                    ├── Create Goal
                    │   └── CreateGoalSheet
                    │       ├── SelectDateSheet (shared)
                    │       ├── AddCategorySheet (shared)
                    │       └── AddLevelSheet
                    │
                    ├── Goal Card Tap
                    │   └── /goal-details?goalId=xxx (GoalDetailsScreen)
                    │       ├── Create Level → /tasks?goalId=xxx&mode=create
                    │       ├── Edit → CreateGoalSheet
                    │       └── Delete → Confirmation Alert
                    │
                    └── Goal Card More (...)
                        └── GoalOptionsModal
                            ├── Edit Goal
                            ├── Duplicate Goal
                            ├── Focus
                            └── Delete Goal
```

---

## Reusable Components Used

| Component        | From                    | Usage                    |
| ---------------- | ----------------------- | ------------------------ |
| SelectDateSheet  | @/components/shared     | Date picker for deadline |
| AddCategorySheet | @/components/shared     | Category selection       |
| OptionsModal     | @/components/shared     | GoalOptionsModal base    |
| CreateButton     | @/components/buttons    | FAB buttons              |
| ScreenHeader     | @/components/navigation | Screen headers           |
| TaskCard         | @/components/task       | Task display in details  |
| BottomSheet      | @/components/ui         | Sheet wrapper            |

---

## File Structure

```
components/goal/
├── index.ts              # Barrel exports
├── GoalCard.tsx          # Individual goal card
├── GoalListScreen.tsx    # Main list screen
├── GoalDetailsScreen.tsx # Detail screen
├── CreateGoalSheet.tsx   # Create/edit sheet
├── AddLevelSheet.tsx     # Level selection
└── GoalOptionsModal.tsx  # Actions modal

hooks/
└── useGoals.ts           # Goal management hook

services/api/
└── goal.service.ts       # API client

types/
└── goal.ts               # Type definitions

app/
├── goals.tsx             # Goals list route
└── goal-details.tsx      # Goal details route
```

---

## Best Practices

1. **Always use useGoals hook** for state management instead of direct API calls.

2. **Refresh after mutations** to keep UI in sync:

   ```typescript
   const result = await createGoal(data);
   if (result) {
     await refresh();
   }
   ```

3. **Handle loading states** for better UX:

   ```tsx
   <CreateGoalSheet
     isLoading={isCreating || isUpdating}
     ...
   />
   ```

4. **Use shared components** for consistency:

   - SelectDateSheet for all date picking
   - AddCategorySheet for category selection
   - OptionsModal for action sheets

5. **Progress calculation** is done on frontend:
   ```typescript
   const progress =
     totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
   ```
