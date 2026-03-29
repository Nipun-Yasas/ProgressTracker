"use client";

import { useState } from "react";
import { Plus, Trash2, Activity as ActivityIcon } from "lucide-react";
import { IActivity } from "@/lib/models/Activity";

interface ActivityManagerProps {
  activities: IActivity[];
  onAddActivity: (name: string) => Promise<void>;
  onDeleteActivity: (id: string) => Promise<void>;
  isLoading?: boolean;
}

export default function ActivityManager({
  activities,
  onAddActivity,
  onDeleteActivity,
  isLoading = false,
}: ActivityManagerProps) {
  const [newActivityName, setNewActivityName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivityName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onAddActivity(newActivityName.trim());
      setNewActivityName("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-backgroundSecondary/60 border border-borderPrimary p-6 rounded-xl flex flex-col h-full">
      <div className="flex items-center gap-2 mb-6">
        <ActivityIcon className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-medium text-textPrimary">Activities</h3>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newActivityName}
          onChange={(e) => setNewActivityName(e.target.value)}
          placeholder="e.g. Read 10 pages..."
          className="flex-1 bg-backgroundSecondary border border-borderPrimary rounded-lg px-4 py-2 text-sm text-textPrimary placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          disabled={isLoading || isSubmitting}
        />
        <button
          type="submit"
          disabled={!newActivityName.trim() || isLoading || isSubmitting}
          className="bg-backgroundSecondary hover:bg-hoverPrimary disabled:bg-hoverPrimary disabled:text-textSecondary border border-borderPrimary p-2 rounded-lg disabled:cursor-not-allowed flex items-center justify-center min-w-[40px]"
          aria-label="Add activity"
        >
          <Plus className="w-5 h-5" />
        </button>
      </form>

      <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
        {activities.length === 0 ? (
          <div className="text-center py-8 text-textSecondary text-sm">
            No activities set for this month yet.
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity._id as unknown as string}
              className="flex items-center justify-between p-3 rounded-lg bg-backgroundSecondary hover:bg-hoverPrimary border border-borderPrimary hover:border-borderPrimary transition-colors group"
            >
              <span className="text-sm font-medium text-textPrimary truncate pr-4">
                {activity.name}
              </span>
              <button
                onClick={() =>
                  onDeleteActivity(activity._id as unknown as string)
                }
                disabled={isLoading}
                className="text-textSecondary hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all focus:opacity-100 p-1 rounded hover:bg-hoverPrimary disabled:opacity-50"
                aria-label="Delete activity"
                title="Delete activity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
