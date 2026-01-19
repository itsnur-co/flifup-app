
import DuplicateSVG from "@/assets/svg/duplicate-white.svg";
import {
  DeleteBinIcon,
  EditLineIcon,
  FocusLineIcon,
} from "@/components/icons/TaskIcons";
import { ModalOption, OptionsModal } from "@/components/shared/OptionsModal";
import { Habit } from "@/types/habit";
import React from "react";

interface HabitOptionsModalProps {
  visible: boolean;
  habit: Habit | null;
  onClose: () => void;
  onEdit?: (habit: Habit) => void;
  onDuplicate?: (habit: Habit) => void;
  onFocus?: (habit: Habit) => void;
  onDelete?: (habit: Habit) => void;
}

export const HabitOptionsModal: React.FC<HabitOptionsModalProps> = ({
  visible,
  habit,
  onClose,
  onEdit,
  onDuplicate,
  onFocus,
  onDelete,
}) => {
  if (!habit) return null;

  const options: ModalOption[] = [
    {
      id: "edit",
      label: "Edit Habit",
      icon: <EditLineIcon size={20} color="#FFFFFF" />,
      onPress: () => onEdit?.(habit),
    },
    {
      id: "duplicate",
      label: "Duplicate Habit",
      icon: <DuplicateSVG width={20} height={20} />,
      onPress: () => onDuplicate?.(habit),
    },
    {
      id: "focus",
      label: "Focus",
      icon: <FocusLineIcon size={20} color="#FFFFFF" />,
      onPress: () => onFocus?.(habit),
    },
    {
      id: "delete",
      label: "Delete Habit",
      icon: <DeleteBinIcon size={20} color="#EF4444" />,
      onPress: () => onDelete?.(habit),
      isDanger: true,
    },
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
