/**
 * Select Date Bottom Sheet Component
 * Date selection with quick options and custom calendar
 * Matches Figma design exactly
 */

import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomSheet } from '@/components/ui/BottomSheet';
import {
  CalendarIcon,
  SunIcon,
  SquareIcon,
  CouchIcon,
  ArrowRightIcon,
  MinusCircleIcon,
  CalendarPlusIcon,
  ChevronDownIcon,
} from '@/components/icons/TaskIcons';
import { Colors } from '@/constants/colors';
import { DateOption, DateOptionItem } from '@/types/task';

interface SelectDateSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelectDate: (date: Date | null, option: DateOption) => void;
  selectedDate?: Date | null;
}

const getIconForOption = (id: DateOption, color: string) => {
  const iconProps = { size: 22, color };
  
  switch (id) {
    case 'today':
      return <CalendarIcon {...iconProps} />;
    case 'tomorrow':
      return <SunIcon {...iconProps} color="#F59E0B" />;
    case 'later-this-week':
      return <SquareIcon {...iconProps} />;
    case 'this-weekend':
      return <CouchIcon {...iconProps} color="#3B82F6" />;
    case 'next-week':
      return <ArrowRightIcon {...iconProps} />;
    case 'no-date':
      return <MinusCircleIcon {...iconProps} color="#6B7280" />;
    case 'custom':
      return <CalendarPlusIcon {...iconProps} color="#F97316" />;
    default:
      return <CalendarIcon {...iconProps} />;
  }
};

export const SelectDateSheet: React.FC<SelectDateSheetProps> = ({
  visible,
  onClose,
  onSelectDate,
  selectedDate,
}) => {
  const insets = useSafeAreaInsets();
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(selectedDate ?? null);

  // Generate date options
  const dateOptions = useMemo((): DateOptionItem[] => {
    const today = new Date();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const getTomorrow = () => {
      const date = new Date(today);
      date.setDate(date.getDate() + 1);
      return date;
    };

    const getLaterThisWeek = () => {
      const date = new Date(today);
      const daysUntilFriday = (5 - today.getDay() + 7) % 7;
      date.setDate(date.getDate() + (daysUntilFriday || 2));
      return date;
    };

    const getThisWeekend = () => {
      const date = new Date(today);
      const daysUntilSaturday = (6 - today.getDay() + 7) % 7;
      date.setDate(date.getDate() + (daysUntilSaturday || 7));
      return date;
    };

    const getNextWeek = () => {
      const date = new Date(today);
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
  }, []);

  const handleOptionPress = (option: DateOptionItem) => {
    if (option.id === 'custom') {
      setShowCalendar(!showCalendar);
      return;
    }

    const date = option.getDate();
    onSelectDate(date, option.id);
    onClose();
  };

  const handleAddDate = () => {
    if (selectedDay) {
      onSelectDate(selectedDay, 'custom');
    }
    onClose();
  };

  // Calendar helpers
  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const generateCalendarDays = (): (number | null)[] => {
    const days: (number | null)[] = [];
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const isSelectedDay = (day: number): boolean => {
    if (!selectedDay) return false;
    return (
      day === selectedDay.getDate() &&
      currentMonth.getMonth() === selectedDay.getMonth() &&
      currentMonth.getFullYear() === selectedDay.getFullYear()
    );
  };

  const isToday = (day: number): boolean => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  const handleDayPress = (day: number) => {
    const newDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    setSelectedDay(newDate);
  };

  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long' });
  const year = currentMonth.getFullYear();

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      snapPoints={showCalendar ? [0.85] : [0.6]}
      initialSnapIndex={0}
      backgroundColor="#1C1C1E"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Select Date</Text>
          <TouchableOpacity onPress={handleAddDate} activeOpacity={0.7}>
            <Text style={styles.addButton}>Add</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <View style={styles.optionsList}>
          {dateOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.optionItem}
              onPress={() => handleOptionPress(option)}
              activeOpacity={0.7}
            >
              <View style={styles.optionIcon}>
                {getIconForOption(option.id, Colors.primary)}
              </View>
              <Text style={styles.optionLabel}>{option.label}</Text>
              {option.dayLabel && (
                <Text style={styles.optionDay}>{option.dayLabel}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {showCalendar && (
          <View style={[styles.calendarContainer, { paddingBottom: insets.bottom + 16 }]}>
            <View style={styles.monthSelector}>
              <TouchableOpacity style={styles.yearSelector} activeOpacity={0.7}>
                <Text style={styles.yearText}>{year}</Text>
                <ChevronDownIcon size={16} color="#FFFFFF" />
              </TouchableOpacity>

              <View style={styles.monthDivider} />

              <TouchableOpacity style={styles.monthDropdown} activeOpacity={0.7}>
                <Text style={styles.monthText}>{monthName}</Text>
                <ChevronDownIcon size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.weekDaysRow}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <Text key={day} style={styles.weekDayText}>{day}</Text>
              ))}
            </View>

            <View style={styles.calendarGrid}>
              {generateCalendarDays().map((day, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayCell,
                    day && isSelectedDay(day) && styles.dayCellSelected,
                  ]}
                  onPress={() => day && handleDayPress(day)}
                  disabled={!day}
                  activeOpacity={0.7}
                >
                  {day && (
                    <Text
                      style={[
                        styles.dayText,
                        isToday(day) && styles.dayTextToday,
                        isSelectedDay(day) && styles.dayTextSelected,
                      ]}
                    >
                      {day}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  addButton: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: '#2C2C2E',
  },
  optionsList: {
    paddingTop: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  optionIcon: {
    width: 32,
    alignItems: 'center',
  },
  optionLabel: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 12,
  },
  optionDay: {
    fontSize: 15,
    color: '#6B7280',
  },
  calendarContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#2C2C2E',
    marginTop: 8,
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  yearSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  yearText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  monthDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#3A3A3C',
    marginHorizontal: 16,
  },
  monthDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  monthText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  weekDayText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
    width: 40,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  dayCellSelected: {
    backgroundColor: Colors.primary,
  },
  dayText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#FFFFFF',
  },
  dayTextToday: {
    color: Colors.primary,
    fontWeight: '600',
  },
  dayTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default SelectDateSheet;
