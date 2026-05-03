'use client';

import { useState, useEffect } from 'react';

interface EditActivityDialogProps {
  open: boolean;
  activityName: string;
  title?: string;
  description?: string;
  inputPlaceholder?: string;
  confirmLabel?: string;
  onConfirm: (newName: string) => void;
  onCancel: () => void;
}

export default function EditActivityDialog({
  open,
  activityName,
  title = 'Edit activity',
  description = 'Update the name of your activity.',
  inputPlaceholder = 'Activity name',
  confirmLabel = 'Save changes',
  onConfirm,
  onCancel,
}: EditActivityDialogProps) {
  const [editedName, setEditedName] = useState(activityName);

  useEffect(() => {
    if (open) {
      setEditedName(activityName);
    }
  }, [open, activityName]);

  const handleConfirm = () => {
    if (editedName.trim() && editedName.trim() !== activityName) {
      onConfirm(editedName.trim());
    } else {
      onCancel();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirm();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close edit dialog"
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
        onClick={onCancel}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-activity-title"
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-borderPrimary bg-backgroundSecondary shadow-2xl shadow-black/40"
      >
        <div className="border-b border-borderPrimary/80 bg-backgroundSecondary px-6 py-5">
          <h3
            id="edit-activity-title"
            className="text-lg font-semibold text-textPrimary"
          >
            {title}
          </h3>
          <p className="mt-2 text-sm text-textSecondary">
            {description}
          </p>
        </div>

        <div className="bg-backgroundSecondary px-6 py-5">
          <input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={inputPlaceholder}
            autoFocus
            className="w-full bg-backgroundSecondary border border-borderPrimary rounded-lg px-4 py-2 text-sm text-textPrimary placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>

        <div className="flex flex-col-reverse gap-3 bg-backgroundSecondary px-6 py-5 sm:flex-row sm:justify-end border-t border-borderPrimary/80">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex justify-center rounded-lg border border-borderPrimary bg-backgroundSecondary px-4 py-2 text-sm font-medium text-textPrimary transition-colors hover:bg-hoverPrimary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!editedName.trim() || editedName.trim() === activityName}
            className="inline-flex justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
