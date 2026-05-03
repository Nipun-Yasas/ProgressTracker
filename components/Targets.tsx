"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Plus, Edit2, Trash2 } from "lucide-react";
import DeleteConfirmationDialog from "@/components/Model";
import EditActivityDialog from "@/components/EditActivityDialog";

interface ITarget {
  _id: string;
  description: string;
}

export default function Targets() {
  const [targets, setTargets] = useState<ITarget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newDescription, setNewDescription] = useState("");
  const [targetToDelete, setTargetToDelete] = useState<ITarget | null>(null);
  const [targetToEdit, setTargetToEdit] = useState<ITarget | null>(null);

  useEffect(() => {
    fetchTargets();
  }, []);

  const fetchTargets = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/targets");
      if (res.ok) {
        setTargets(await res.json());
      } else {
        toast.error("Failed to load targets");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error loading targets");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTarget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDescription.trim()) return;

    try {
      const res = await fetch("/api/targets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: newDescription.trim() }),
      });

      if (res.ok) {
        const newTarget = await res.json();
        setTargets((prev) => [...prev, newTarget]);
        setNewDescription("");
        toast.success("Target added");
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to add target");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error adding target");
    }
  };

  const handleDeleteTarget = async (id: string) => {
    try {
      const res = await fetch(`/api/targets/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setTargets((prev) => prev.filter((t) => t._id !== id));
        toast.success("Target deleted");
      } else {
        toast.error("Failed to delete target");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error deleting target");
    }
  };

  const handleRequestDelete = (target: ITarget) => {
    setTargetToDelete(target);
  };

  const handleCancelDelete = () => {
    setTargetToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!targetToDelete) return;

    const targetId = targetToDelete._id;
    setTargetToDelete(null);
    await handleDeleteTarget(targetId);
  };

  const handleRequestEdit = (target: ITarget) => {
    setTargetToEdit(target);
  };

  const handleCancelEdit = () => {
    setTargetToEdit(null);
  };

  const handleConfirmEdit = async (newDescription: string) => {
    if (!targetToEdit) return;

    const id = targetToEdit._id;
    try {
      const res = await fetch(`/api/targets/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: newDescription }),
      });

      if (res.ok) {
        const updatedTarget = await res.json();
        setTargets((prev) =>
          prev.map((t) => (t._id === id ? updatedTarget : t)),
        );
        setTargetToEdit(null);
        toast.success("Target updated");
      } else {
        toast.error("Failed to update target");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating target");
    }
  };

  if (isLoading) {
    return (
      <div className="bg-backgroundSecondary/50 p-6 rounded-2xl border border-borderPrimary space-y-4 animate-pulse">
        <div className="h-6 w-32 bg-hoverPrimary rounded"></div>
        <div className="space-y-3">
          <div className="h-10 w-full bg-hoverPrimary rounded"></div>
          <div className="h-10 w-full bg-hoverPrimary rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-backgroundSecondary/60 p-6 rounded-2xl border border-borderPrimary space-y-6">
      <h2 className="text-xl font-bold tracking-tight">Main Targets</h2>

      <div className="space-y-4">
        {targets.length > 0 ? (
          <ul className="space-y-3">
            {targets.map((target) => (
              <li
                key={target._id}
                className="flex items-center justify-between bg-backgroundSecondary hover:bg-hoverPrimary p-3 rounded-xl border border-borderPrimary group"
              >
                <span className="text-textPrimary text-sm flex-1">
                  {target.description}
                </span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleRequestEdit(target)}
                    className="p-1.5 text-textSecondary hover:text-secondary hover:bg-secondary/10 rounded-md transition-colors"
                    title="Edit target"
                    aria-label="Edit target"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleRequestDelete(target)}
                    className="p-1.5 text-textSecondary hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
                    title="Delete target"
                    aria-label="Delete target"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-textSecondary text-sm italic">
            No targets defined yet.
          </p>
        )}

        <form onSubmit={handleAddTarget} className="flex items-center gap-2">
          <input
            type="text"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Add a new target..."
            className="flex-1 bg-backgroundSecondary border border-borderPrimary rounded-xl px-4 py-2.5 text-sm text-textPrimary focus:outline-none focus:ring-2 focus:ring-secondary/50 placeholder:text-textSecondary transition-all"
          />
          <button
            type="submit"
            disabled={!newDescription.trim()}
            className="flex items-center gap-2 px-4 py-2.5 bg-backgroundSecondary hover:bg-hoverPrimary disabled:bg-hoverPrimary disabled:text-textSecondary border border-borderPrimary font-medium rounded-xl text-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Target</span>
          </button>
        </form>
      </div>

      <DeleteConfirmationDialog
        open={targetToDelete !== null}
        itemName={targetToDelete?.description ?? "this target"}
        itemLabel="target"
        title="Delete target"
        confirmLabel="Delete target"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      <EditActivityDialog
        open={targetToEdit !== null}
        activityName={targetToEdit?.description ?? ""}
        title="Edit target"
        description="Update the description of your target."
        inputPlaceholder="Target description"
        confirmLabel="Save changes"
        onConfirm={handleConfirmEdit}
        onCancel={handleCancelEdit}
      />
    </div>
  );
}
