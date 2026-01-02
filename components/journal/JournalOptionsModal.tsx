/**
 * Journal Options Modal Component
 * Shows edit and delete options for a journal entry
 * Uses shared OptionsModal for reusability
 */

import React, { useMemo } from "react";
import { EditIcon, TrashIcon, PlusIcon } from "@/components/icons/TaskIcons";
import { InsightIcon } from "@/components/icons/JournalIcons";
import { ModalOption, OptionsModal } from "@/components/shared";

interface JournalOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const JournalOptionsModal: React.FC<JournalOptionsModalProps> = ({
  visible,
  onClose,
  onEdit,
  onDelete,
}) => {
  const options: ModalOption[] = useMemo(() => {
    const opts: ModalOption[] = [];

    // Edit Option
    if (onEdit) {
      opts.push({
        id: "edit",
        label: "Edit Journal",
        icon: <EditIcon size={22} color="#FFFFFF" />,
        onPress: onEdit,
      });
    }

    // Delete Option
    if (onDelete) {
      opts.push({
        id: "delete",
        label: "Delete Journal",
        icon: <TrashIcon size={22} color="#FFFFFF" />,
        onPress: onDelete,
        isDanger: true,
      });
    }

    return opts;
  }, [onEdit, onDelete]);

  return <OptionsModal visible={visible} onClose={onClose} options={options} />;
};

interface HeaderOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  onAddNew?: () => void;
  onInsights?: () => void;
}

export const JournalHeaderOptionsModal: React.FC<HeaderOptionsModalProps> = ({
  visible,
  onClose,
  onAddNew,
  onInsights,
}) => {
  const options: ModalOption[] = useMemo(() => {
    const opts: ModalOption[] = [];

    // Add New Option
    if (onAddNew) {
      opts.push({
        id: "addNew",
        label: "Add New Journal",
        icon: <PlusIcon size={22} color="#FFFFFF" />,
        onPress: onAddNew,
      });
    }

    // Insights Option
    if (onInsights) {
      opts.push({
        id: "insights",
        label: "Insights",
        icon: <InsightIcon size={22} color="#FFFFFF" />,
        onPress: onInsights,
      });
    }

    return opts;
  }, [onAddNew, onInsights]);

  return <OptionsModal visible={visible} onClose={onClose} options={options} />;
};

export default JournalOptionsModal;
