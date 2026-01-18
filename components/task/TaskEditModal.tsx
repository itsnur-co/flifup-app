/**
 * Task Edit Modal Component
 * Edit/Delete options modal for task 3-dot menu
 * Uses reusable OptionsModal component
 */

import {
  DeleteBinIcon,
  EditIcon,
  FocusLineIcon,
  FocusWhiteIcon,
} from "@/components/icons/TaskIcons";
import { ModalOption, OptionsModal } from "@/components/shared";
import { Colors } from "@/constants/colors";
import React, { useMemo } from "react";

interface TaskEditModalProps {
  visible: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onSetFocus?: () => void;
}

export const TaskEditModal: React.FC<TaskEditModalProps> = ({
  visible,
  onClose,
  onEdit,
  onDelete,
  onSetFocus,
}) => {
  const options: ModalOption[] = useMemo(() => {
    const opts: ModalOption[] = [];

    // Set Focus Option
    if (onSetFocus) {
      opts.push({
        id: "setFocus",
        label: "Set Focus",
        icon: <FocusWhiteIcon size={22} />,
        onPress: onSetFocus,
      });
    }

    // Edit Option
    opts.push({
      id: "edit",
      label: "Edit Task",
      icon: <EditIcon size={22}  />,
      onPress: onEdit,
    });

    // Delete Option
    opts.push({
      id: "delete",
      label: "Delete Task",
      icon: <DeleteBinIcon size={22} color="#EF4444" />,
      onPress: onDelete,
      isDanger: true,
    });

    return opts;
  }, [onEdit, onDelete, onSetFocus]);

  return <OptionsModal visible={visible} onClose={onClose} options={options} />;
};

export default TaskEditModal;
