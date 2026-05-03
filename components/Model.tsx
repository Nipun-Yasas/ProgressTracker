'use client';

interface DeleteConfirmationDialogProps {
  open: boolean;
  itemName: string;
  itemLabel?: string;
  title?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmationDialog({
  open,
  itemName,
  itemLabel = "activity",
  title = "Delete activity",
  confirmLabel = "Delete activity",
  onConfirm,
  onCancel,
}: DeleteConfirmationDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close delete confirmation"
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
        onClick={onCancel}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-activity-title"
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-borderPrimary bg-backgroundSecondary shadow-2xl shadow-black/40"
      >
        <div className="border-b border-borderPrimary/80 bg-backgroundSecondary px-6 py-5">
          <h3
            id="delete-activity-title"
            className="text-lg font-semibold text-textPrimary"
          >
            {title}
          </h3>
          <p className="mt-2 text-sm text-textSecondary">
            Are you sure you want to delete {itemName}? This will remove the {itemLabel} and all of its history.
          </p>
        </div>

        <div className="flex flex-col-reverse gap-3 bg-backgroundSecondary px-6 py-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex justify-center rounded-lg border border-borderPrimary bg-backgroundSecondary px-4 py-2 text-sm font-medium text-textPrimary transition-colors hover:bg-hoverPrimary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex justify-center rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-400"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
