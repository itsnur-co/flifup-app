/**
 * Task Options Bottom Sheet Component
 * Edit and Delete task options modal
 * Matches Figma design exactly
 */

import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { EditIcon, TrashIcon } from '@/components/icons/TaskIcons';
import { Task } from '@/types/task';

interface TaskOptionsSheetProps {
  visible: boolean;
  onClose: () => void;
  task: Task | null;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export const TaskOptionsSheet: React.FC<TaskOptionsSheetProps> = ({
  visible,
  onClose,
  task,
  onEdit,
  onDelete,
}) => {
  const insets = useSafeAreaInsets();

  if (!task) return null;

  const handleEdit = () => {
    onEdit(task);
    onClose();
  };

  const handleDelete = () => {
    onDelete(task);
    onClose();
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      snapPoints={[0.35]}
      initialSnapIndex={0}
      backgroundColor="#1C1C1E"
    >
      <View style={[styles.container, { paddingBottom: insets.bottom + 16 }]}>
        {/* Options */}
        <View style={styles.optionsContainer}>
          {/* Edit Option */}
          <TouchableOpacity
            style={styles.optionItem}
            onPress={handleEdit}
            activeOpacity={0.7}
          >
            <EditIcon size={22} color="#FFFFFF" />
            <Text style={styles.optionText}>Edit Task</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Delete Option */}
          <TouchableOpacity
            style={styles.optionItem}
            onPress={handleDelete}
            activeOpacity={0.7}
          >
            <TrashIcon size={22} color="#FFFFFF" />
            <Text style={styles.optionText}>Delete Task</Text>
          </TouchableOpacity>
        </View>

        {/* Cancel Button */}
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onClose}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  optionsContainer: {
    backgroundColor: '#2C2C2E',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    gap: 14,
  },
  optionText: {
    fontSize: 17,
    fontWeight: '400',
    color: '#FFFFFF',
  },
  divider: {
    height: 1,
    backgroundColor: '#3A3A3C',
    marginHorizontal: 20,
  },
  cancelButton: {
    backgroundColor: '#2C2C2E',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 17,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});

export default TaskOptionsSheet;
