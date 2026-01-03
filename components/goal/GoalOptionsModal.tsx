/**
 * Goal Options Modal Component
 * Action sheet for goal operations (Edit, Duplicate, Focus, Delete)
 */

import DuplicateSVG from "@/assets/svg/duplicate-white.svg";
import {
  DeleteBinIcon,
  EditLineIcon,
  FocusLineIcon,
} from "@/components/icons/TaskIcons";
import { ModalOption, OptionsModal } from "@/components/shared/OptionsModal";
import { Goal } from "@/types/goal";
import React from "react";

interface GoalOptionsModalProps {
  visible: boolean;
  goal: Goal | null;
  onClose: () => void;
  onEdit: (goal: Goal) => void;
  onDuplicate: (goal: Goal) => void;
  onFocus: (goal: Goal) => void;
  onDelete: (goal: Goal) => void;
}

export const GoalOptionsModal: React.FC<GoalOptionsModalProps> = ({
  visible,
  goal,
  onClose,
  onEdit,
  onDuplicate,
  onFocus,
  onDelete,
}) => {
  if (!goal) return null;

  const options: ModalOption[] = [
    {
      id: "edit",
      label: "Edit Goal",
      icon: <EditLineIcon size={20} color="#FFFFFF" />,
      onPress: () => onEdit(goal),
    },
    {
      id: "duplicate",
      label: "Duplicate Goal",
      icon: <DuplicateSVG width={20} height={20} />,
      onPress: () => onDuplicate(goal),
    },
    {
      id: "focus",
      label: "Focus",
      icon: <FocusLineIcon size={20} color="#FFFFFF" />,
      onPress: () => onFocus(goal),
    },
    {
      id: "delete",
      label: "Delete Goal",
      icon: <DeleteBinIcon size={20} color="#EF4444" />,
      onPress: () => onDelete(goal),
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
