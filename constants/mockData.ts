/**
 * Mock data for task feature development
 * Replace with API calls in production
 */

import { Category, Person, Task, DateOptionItem } from '@/types/task';

export const MOCK_CATEGORIES: Category[] = [
  { id: '1', name: 'Work', color: '#9039FF', icon: 'briefcase' },
  { id: '2', name: 'Personal', color: '#3B82F6', icon: 'user' },
  { id: '3', name: 'Health', color: '#10B981', icon: 'heart' },
  { id: '4', name: 'Shopping', color: '#F59E0B', icon: 'shopping-cart' },
  { id: '5', name: 'Education', color: '#EC4899', icon: 'book' },
];

export const MOCK_PEOPLE: Person[] = [
  {
    id: '1',
    name: 'Miles, Esther',
    email: 'curtis.weaver@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
  },
  {
    id: '2',
    name: 'Flores, Juanita',
    email: 'jessica.hanson@example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces',
  },
  {
    id: '3',
    name: 'Cooper, Kristin',
    email: 'deanna.curtis@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
  },
  {
    id: '4',
    name: 'Henry, Arthur',
    email: 'dolores.chambers@example.com',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop&crop=faces',
  },
  {
    id: '5',
    name: 'Nguyen, Shane',
    email: 'felicia.reid@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces',
  },
];

export const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: 'Running',
    description: 'Morning run in the park',
    dueDate: new Date(),
    dueTime: '11 AM',
    category: MOCK_CATEGORIES[2],
    assignedPeople: [MOCK_PEOPLE[0], MOCK_PEOPLE[1], MOCK_PEOPLE[2]],
    reminder: new Date(),
    subTasks: [],
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Running',
    description: 'Evening jog',
    dueDate: new Date(),
    dueTime: '11 AM',
    category: MOCK_CATEGORIES[2],
    assignedPeople: [MOCK_PEOPLE[0], MOCK_PEOPLE[1], MOCK_PEOPLE[2]],
    reminder: new Date(),
    subTasks: [],
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    title: 'Running',
    description: 'Weekend marathon practice',
    dueDate: new Date(),
    dueTime: '11 AM',
    category: MOCK_CATEGORIES[2],
    assignedPeople: [MOCK_PEOPLE[0], MOCK_PEOPLE[1], MOCK_PEOPLE[2]],
    reminder: new Date(),
    subTasks: [],
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    title: 'Running',
    description: 'Completed morning run',
    dueDate: new Date(),
    dueTime: '11 AM',
    category: MOCK_CATEGORIES[2],
    assignedPeople: [MOCK_PEOPLE[0], MOCK_PEOPLE[1], MOCK_PEOPLE[2]],
    reminder: new Date(),
    subTasks: [],
    completed: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    title: 'Running',
    description: 'Completed evening run',
    dueDate: new Date(),
    dueTime: '11 AM',
    category: MOCK_CATEGORIES[2],
    assignedPeople: [MOCK_PEOPLE[0], MOCK_PEOPLE[1], MOCK_PEOPLE[2]],
    reminder: new Date(),
    subTasks: [],
    completed: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '6',
    title: 'Running',
    description: 'Completed weekend run',
    dueDate: new Date(),
    dueTime: '11 AM',
    category: MOCK_CATEGORIES[2],
    assignedPeople: [MOCK_PEOPLE[0], MOCK_PEOPLE[1], MOCK_PEOPLE[2]],
    reminder: new Date(),
    subTasks: [],
    completed: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Date options for the Select Date bottom sheet
export const getDateOptions = (): DateOptionItem[] => {
  const today = new Date();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getTomorrow = () => {
    const date = new Date(today);
    date.setDate(date.getDate() + 1);
    return date;
  };

  const getLaterThisWeek = () => {
    const date = new Date(today);
    // Get Friday of current week
    const daysUntilFriday = (5 - today.getDay() + 7) % 7;
    date.setDate(date.getDate() + (daysUntilFriday || 2));
    return date;
  };

  const getThisWeekend = () => {
    const date = new Date(today);
    // Get Saturday
    const daysUntilSaturday = (6 - today.getDay() + 7) % 7;
    date.setDate(date.getDate() + (daysUntilSaturday || 7));
    return date;
  };

  const getNextWeek = () => {
    const date = new Date(today);
    // Get Monday of next week
    const daysUntilNextMonday = ((8 - today.getDay()) % 7) || 7;
    date.setDate(date.getDate() + daysUntilNextMonday);
    return date;
  };

  return [
    {
      id: 'today',
      label: 'Today',
      icon: 'calendar',
      dayLabel: dayNames[today.getDay()],
      getDate: () => today,
    },
    {
      id: 'tomorrow',
      label: 'Tomorrow',
      icon: 'sun',
      dayLabel: dayNames[getTomorrow().getDay()],
      getDate: getTomorrow,
    },
    {
      id: 'later-this-week',
      label: 'Later this week',
      icon: 'square',
      dayLabel: dayNames[getLaterThisWeek().getDay()],
      getDate: getLaterThisWeek,
    },
    {
      id: 'this-weekend',
      label: 'This weekend',
      icon: 'couch',
      dayLabel: dayNames[getThisWeekend().getDay()],
      getDate: getThisWeekend,
    },
    {
      id: 'next-week',
      label: 'Next week',
      icon: 'arrow-right',
      dayLabel: dayNames[getNextWeek().getDay()],
      getDate: getNextWeek,
    },
    {
      id: 'no-date',
      label: 'No date',
      icon: 'minus-circle',
      getDate: () => null,
    },
    {
      id: 'custom',
      label: 'Custom',
      icon: 'calendar-plus',
      getDate: () => null,
    },
  ];
};

// Get upcoming tasks for the next 3 days
export const getUpcomingTasks = (): Task[] => {
  const upcoming: Task[] = [];
  const today = new Date();
  
  for (let i = 1; i <= 3; i++) {
    const futureDate = new Date(today);
    futureDate.setDate(futureDate.getDate() + i);
    
    upcoming.push({
      id: `upcoming-${i}`,
      title: 'Running',
      description: `Upcoming task for day ${i}`,
      dueDate: futureDate,
      dueTime: '11 AM',
      category: MOCK_CATEGORIES[2],
      assignedPeople: [MOCK_PEOPLE[0], MOCK_PEOPLE[1], MOCK_PEOPLE[2]],
      reminder: futureDate,
      subTasks: [],
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  
  return upcoming;
};
