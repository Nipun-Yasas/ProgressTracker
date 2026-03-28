"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Target, Plus, Edit2, Trash2, Check, X } from "lucide-react";

interface ITarget {
  _id: string;
  description: string;
}

export default function Targets() {
  const [targets, setTargets] = useState<ITarget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newDescription, setNewDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDescription, setEditDescription] = useState("");

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
    if (!confirm("Are you sure you want to delete this target?")) return;

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

  const handleEditTarget = (id: string, currentDesc: string) => {
    setEditingId(id);
    setEditDescription(currentDesc);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editDescription.trim()) return;
    try {
      const res = await fetch(`/api/targets/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: editDescription.trim() }),
      });

      if (res.ok) {
        const updatedTarget = await res.json();
        setTargets((prev) => prev.map((t) => (t._id === id ? updatedTarget : t)));
        setEditingId(null);
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
      <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 space-y-4 animate-pulse">
        <div className="h-6 w-32 bg-zinc-800 rounded"></div>
        <div className="space-y-3">
          <div className="h-10 w-full bg-zinc-800 rounded"></div>
          <div className="h-10 w-full bg-zinc-800 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 space-y-6">
      <div className="flex items-center gap-3">
        <div className="bg-amber-500/10 p-2 rounded-xl border border-amber-500/20">
          <Target className="w-5 h-5 text-amber-500" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Main Targets</h2>
      </div>

      <div className="space-y-4">
        {targets.length > 0 ? (
          <ul className="space-y-3">
            {targets.map((target) => (
              <li key={target._id} className="flex items-center justify-between bg-zinc-900 p-3 rounded-xl border border-zinc-800 group">
                {editingId === target._id ? (
                  <div className="flex items-center flex-1 gap-2">
                    <input
                      type="text"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="flex-1 bg-zinc-800/50 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveEdit(target._id);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                    />
                    <button onClick={() => handleSaveEdit(target._id)} className="p-1.5 text-emerald-500 hover:bg-emerald-500/10 rounded-md transition-colors">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={() => setEditingId(null)} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-md transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="text-zinc-200 text-sm flex-1">{target.description}</span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditTarget(target._id, target.description)}
                        className="p-1.5 text-zinc-400 hover:text-amber-500 hover:bg-amber-500/10 rounded-md transition-colors title='Edit Target'"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTarget(target._id)}
                        className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors title='Delete Target'"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-zinc-500 text-sm italic">No targets defined yet.</p>
        )}

        <form onSubmit={handleAddTarget} className="flex items-center gap-2">
          <input
            type="text"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Add a new target..."
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50 placeholder:text-zinc-600 transition-all"
          />
          <button
            type="submit"
            disabled={!newDescription.trim()}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-800 disabled:text-zinc-500 text-zinc-950 font-medium rounded-xl transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Target</span>
          </button>
        </form>
      </div>
    </div>
  );
}
