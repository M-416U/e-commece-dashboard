import React from "react";
import Dialog_model from "@/components/ui/dialog_model";
import { Button } from "@/components/ui/button";

type DeleteAlertType = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoad: boolean;
  title?: string;
};

const DeleteAlert = ({
  isOpen,
  onClose,
  onConfirm,
  isLoad,
  title,
}: DeleteAlertType) => {
  return (
    <Dialog_model
      IsOpen={isOpen}
      onClose={onClose}
      title={title || "Delete"}
      description="Are you sure you want to delete"
    >
      <div className="flex justify-between">
        <Button size="sm" onClick={onClose} disabled={isLoad}>
          Cancel
        </Button>
        <Button
          size="sm"
          variant="destructiveOutline"
          onClick={onConfirm}
          disabled={isLoad}
        >
          Delete
        </Button>
      </div>
    </Dialog_model>
  );
};

export default DeleteAlert;
