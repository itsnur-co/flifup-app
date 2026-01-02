/**
 * Task Header Options Modal Component
 * Options modal for task list header (3-dot menu)
 * Shows Reports, Focus History, and Delete All Tasks options
 * Uses reusable OptionsModal component
 */

import {
  ChartIcon,
  DeleteBinIcon,
  FocusLineIcon,
} from "@/components/icons/TaskIcons";
import { ModalOption, OptionsModal } from "@/components/shared";
import { Colors } from "@/constants/colors";
import React, { useMemo } from "react";

interface TaskHeaderOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  onViewReports: () => void;
  onViewFocusHistory?: () => void;
  onDeleteAll: () => void;
}

export const TaskHeaderOptionsModal: React.FC<TaskHeaderOptionsModalProps> = ({
  visible,
  onClose,
  onViewReports,
  onViewFocusHistory,
  onDeleteAll,
}) => {
  const options: ModalOption[] = useMemo(() => {
    const opts: ModalOption[] = [
      {
        id: "reports",
        label: "Task Progress",
        icon: <ChartIcon size={22} color={Colors.primary} />,
        onPress: onViewReports,
      },
    ];

    // Add Focus History if provided
    if (onViewFocusHistory) {
      opts.push({
        id: "focusHistory",
        label: "Focus History",
        icon: <FocusLineIcon size={22} color="#3B82F6" />,
        onPress: onViewFocusHistory,
      });
    }

    // Add Delete All option
    opts.push({
      id: "deleteAll",
      label: "Delete All Tasks",
      icon: <DeleteBinIcon size={22} color="#EF4444" />,
      onPress: onDeleteAll,
      isDanger: true,
    });

    return opts;
  }, [onViewReports, onViewFocusHistory, onDeleteAll]);

  return <OptionsModal visible={visible} onClose={onClose} options={options} />;
};

export default TaskHeaderOptionsModal;
