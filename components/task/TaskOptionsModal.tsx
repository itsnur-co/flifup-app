/**
 * Task Options Modal Component
 * Action sheet for task operations (Edit, Duplicate, Delete)
 */

import DuplicateSVG from "@/assets/svg/duplicate-white.svg";
import {
  DeleteBinIcon,
  EditLineIcon,
  FocusLineIcon,
} from "@/components/icons/TaskIcons";
import { ModalOption, OptionsModal } from "@/components/shared/OptionsModal";
import { Task } from "@/types/task";
import React from "react";

interface TaskOptionsModalProps {
  visible: boolean;
  task: Task | null;
  onClose: () => void;
  onEdit?: (task: Task) => void;
  onDuplicate?: (task: Task) => void;
  onFocus?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

export const TaskOptionsModal: React.FC<TaskOptionsModalProps> = ({
  visible,
  task,
  onClose,
  onEdit,
  onDuplicate,
  onFocus,
  onDelete,
}) => {
  if (!task) return null;

  // Check if user is owner (can delete) - default to true for backwards compatibility
  const canDelete = task.isOwner !== false;

  const options: ModalOption[] = [
    {
      id: "edit",
      label: "Edit Task",
      icon: <EditLineIcon size={20} color="#FFFFFF" />,
      onPress: () => onEdit?.(task),
    },
    {
      id: "duplicate",
      label: "Duplicate Task",
      icon: <DuplicateSVG width={20} height={20} />,
      onPress: () => onDuplicate?.(task),
    },
    {
      id: "focus",
      label: "Focus",
      icon: <FocusLineIcon size={20} color="#FFFFFF" />,
      onPress: () => onFocus?.(task),
    },
    // Only show delete option if user is owner
    ...(canDelete
      ? [
          {
            id: "delete",
            label: "Delete Task",
            icon: <DeleteBinIcon size={20} color="#EF4444" />,
            onPress: () => onDelete?.(task),
            isDanger: true,
          },
        ]
      : []),
  ];

  return (
    <OptionsModal
      visible={visible}
      onClose={onClose}
      options={options}
      cancelLabel="Cancel"
    />
  );
};
