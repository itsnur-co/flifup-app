# WeekCalendar Component

A pixel-perfect, reusable week calendar selector component with modern design.

## Features

- ✅ Week view with day selection
- ✅ Month/Year display with dropdown indicator
- ✅ "Today" quick navigation button
- ✅ Fully customizable and reusable
- ✅ TypeScript support
- ✅ Smooth animations and interactions
- ✅ Dark theme optimized
- ✅ Horizontal scrolling for week days

## Preview

The component displays:
- Month and year header with dropdown
- "Today" button for quick navigation
- 7 days of the week (S, M, T, W, T, F, S)
- Date numbers below each day
- Active selection with purple highlight
- Dark theme with subtle borders

## Installation

The component is already installed in your project at:
```
/components/calendar/WeekCalendar.tsx
```

## Basic Usage

```tsx
import { WeekCalendar } from '@/components/calendar';

function MyScreen() {
  return (
    <WeekCalendar
      onDateSelect={(date) => console.log('Selected:', date)}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `selectedDate` | `Date` | `new Date()` | Initially selected date |
| `onDateSelect` | `(date: Date) => void` | `undefined` | Callback when a date is selected |
| `monthYearText` | `string` | Auto-generated | Custom month/year text (e.g., "Jun 2025") |
| `showMonthDropdown` | `boolean` | `true` | Show/hide the dropdown chevron |
| `onMonthPress` | `() => void` | `undefined` | Callback when month button is pressed |
| `onTodayPress` | `() => void` | `undefined` | Callback when "Today" button is pressed |

## Advanced Usage Examples

### 1. Basic Calendar with Date Selection

```tsx
import React, { useState } from 'react';
import { WeekCalendar } from '@/components/calendar';

function TaskScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <WeekCalendar
      selectedDate={selectedDate}
      onDateSelect={(date) => {
        setSelectedDate(date);
        console.log('Selected date:', date);
      }}
    />
  );
}
```

### 2. With Month Picker Modal

```tsx
import React, { useState } from 'react';
import { WeekCalendar } from '@/components/calendar';

function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  return (
    <>
      <WeekCalendar
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        onMonthPress={() => setShowMonthPicker(true)}
        onTodayPress={() => {
          setSelectedDate(new Date());
          console.log('Jumped to today');
        }}
      />

      {/* Your month picker modal here */}
      {showMonthPicker && (
        <MonthPickerModal
          onClose={() => setShowMonthPicker(false)}
          onSelect={(date) => {
            setSelectedDate(date);
            setShowMonthPicker(false);
          }}
        />
      )}
    </>
  );
}
```

### 3. Without Dropdown (Static Month Display)

```tsx
<WeekCalendar
  showMonthDropdown={false}
  onDateSelect={(date) => console.log(date)}
/>
```

### 4. Custom Month Text

```tsx
<WeekCalendar
  monthYearText="জুন ২০২৫" // Bengali text
  onDateSelect={(date) => console.log(date)}
/>
```

### 5. In a Task Management Screen

```tsx
import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { WeekCalendar } from '@/components/calendar';
import { TaskList } from '@/components/tasks';

function TaskManagementScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <ScrollView>
      <WeekCalendar
        selectedDate={selectedDate}
        onDateSelect={(date) => {
          setSelectedDate(date);
          // Fetch tasks for this date
          fetchTasksForDate(date);
        }}
      />

      <TaskList date={selectedDate} />
    </ScrollView>
  );
}
```

### 6. With Custom Styling

```tsx
<View style={{ backgroundColor: '#000' }}>
  <WeekCalendar
    onDateSelect={(date) => console.log(date)}
  />
</View>
```

## Customization

### Modifying Colors

Edit the `styles` in `WeekCalendar.tsx`:

```typescript
const styles = StyleSheet.create({
  // Change selected day color
  dayItemSelected: {
    backgroundColor: '#8B5CF6', // Change this to your brand color
    borderColor: '#8B5CF6',
  },

  // Change background color
  container: {
    backgroundColor: '#1A1A1A', // Change this
  },

  // Change day item background
  dayItem: {
    backgroundColor: '#2A2A2A', // Change this
    borderColor: '#3A3A3A',
  },
});
```

### Changing Size

```typescript
dayItem: {
  width: 56,  // Change width
  height: 72, // Change height
  borderRadius: 20, // Change roundness
},
```

## Integration Points

This component works well with:
- Task management screens
- Event calendars
- Booking systems
- Habit trackers
- Schedule planners
- Meeting schedulers

## Performance

- Optimized rendering with proper key management
- Minimal re-renders
- Smooth horizontal scrolling
- Efficient date calculations

## Accessibility

- TouchableOpacity for proper touch feedback
- Clear visual states (selected/unselected)
- Readable text sizes
- High contrast colors

## Best Practices

1. **Always handle `onDateSelect`**: This callback is crucial for managing state
2. **Use controlled component pattern**: Pass `selectedDate` prop for controlled behavior
3. **Provide month picker**: If using `onMonthPress`, implement a month picker modal
4. **Test on both platforms**: Ensure the component looks good on iOS and Android

## Future Enhancements

Potential improvements you can add:
- Multi-date selection
- Date range selection
- Disabled dates
- Custom markers/badges for dates with events
- Swipe gestures to change weeks
- Haptic feedback on selection
- Animation transitions

## Support

For issues or questions, refer to the main project documentation.
