"use client";

import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { Target } from "lucide-react";
import mongoose from "mongoose";

import MonthSelector from "@/components/MonthSelector";
import ActivityManager from "@/components/ActivityManager";
import ActivityManagerSkeleton from "@/components/skeletons/ActivityManagerSkeleton";
import DailyChecklist from "@/components/DailyChecklist";
import DailyChecklistSkeleton from "@/components/skeletons/DailyChecklistSkeleton";
import ProgressCharts from "@/components/ProgressCharts";
import ProgressChartsSkeleton from "@/components/skeletons/ProgressChartsSkeleton";
import Targets from "@/components/Targets";

import { IActivity } from "@/lib/models/Activity";
import { IDailyLog } from "@/lib/models/DailyLog";
import { UserButton, Show } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  const [currentMonth, setCurrentMonth] = useState(() =>
    format(new Date(), "yyyy-MM"),
  );
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [logs, setLogs] = useState<IDailyLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMonthData = useCallback(async (month: string) => {
    setIsLoading(true);
    try {
      const [activitiesRes, logsRes] = await Promise.all([
        fetch(`/api/activities?month=${month}`),
        fetch(`/api/logs?month=${month}`),
      ]);

      if (activitiesRes.ok && logsRes.ok) {
        setActivities(await activitiesRes.json());
        setLogs(await logsRes.json());
      } else {
        toast.error("Failed to load data");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while fetching data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMonthData(currentMonth);
  }, [currentMonth, fetchMonthData]);

  const handleAddActivity = async (name: string) => {
    try {
      const res = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, month: currentMonth }),
      });

      if (res.ok) {
        const newActivity = await res.json();
        setActivities((prev) => [...prev, newActivity]);
        toast.success("Activity added");
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to add activity");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error adding activity");
    }
  };

  const handleDeleteActivity = async (id: string) => {
    if (
      !confirm(
        "Are you sure? This will delete the activity and all its history.",
      )
    )
      return;

    try {
      const res = await fetch(`/api/activities/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setActivities((prev) =>
          prev.filter((a) => (a._id as unknown as string) !== id),
        );
        setLogs((prev) => prev.filter((l) => l.activityId.toString() !== id));
        toast.success("Activity deleted");
      } else {
        toast.error("Failed to delete activity");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error deleting activity");
    }
  };

  const handleToggleTick = async (
    activityId: string,
    date: string,
    done: boolean,
  ) => {
    // Optimistic UI update
    setLogs((prev) => {
      const existing = prev.find(
        (l) => l.activityId.toString() === activityId && l.date === date,
      );
      if (existing) {
        return prev.map((l) =>
          l.activityId.toString() === activityId && l.date === date
            ? ({ ...l, done } as IDailyLog)
            : l,
        );
      } else {
        return [
          ...prev,
          {
            activityId: activityId as unknown as mongoose.Types.ObjectId,
            date,
            done,
          } as unknown as IDailyLog,
        ];
      }
    });

    try {
      const res = await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activityId, date, done }),
      });

      if (!res.ok) {
        throw new Error("Failed to update log");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save progress");
      // Revert on error
      fetchMonthData(currentMonth);
    }
  };

  const handleCopyPrevious = async () => {
    try {
      const prevDate = new Date(`${currentMonth}-01`);
      prevDate.setMonth(prevDate.getMonth() - 1);
      const prevMonth = format(prevDate, "yyyy-MM");

      const res = await fetch("/api/logs/copy-month", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromMonth: prevMonth, toMonth: currentMonth }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.copiedCount > 0) {
          toast.success(data.message);
          fetchMonthData(currentMonth);
        } else {
          toast.success(data.message);
        }
      } else {
        toast.error("Failed to copy activities");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error copying activities");
    }
  };

  return (
    <main className="min-h-screen p-4">

      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex bg-backgroundSecondary/60 p-3 sm:p-4 rounded-xl items-center justify-between gap-3 border-b border-borderPrimary">
          <div className="flex items-center gap-3 p-1">
            <div className="bg-secondary/10 p-1.5 sm:p-2 rounded-xl">
              <Target className="w-5 h-5 sm:w-8 sm:h-8 text-secondary" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl sm:text-3xl font-bold tracking-tight">Progress Flow</h1>
              <p className="text-textSecondary text-[10px] sm:text-sm leading-tight">
                Stay consistent, track your daily habits.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Show when="signed-in">
              <UserButton />
            </Show>
            <ThemeToggle />
          </div>
        </header>

        <Targets />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <MonthSelector
              currentMonth={currentMonth}
              onMonthChange={setCurrentMonth}
              onCopyPrevious={handleCopyPrevious}
              showCopyButton={activities.length === 0 && !isLoading}
            />

            {isLoading ? (
              <ActivityManagerSkeleton />
            ) : (
              <div className="">
                <ActivityManager
                  activities={activities}
                  onAddActivity={handleAddActivity}
                  onDeleteActivity={handleDeleteActivity}
                  isLoading={isLoading}
                />
              </div>
            )}
          </div>

          <div className="lg:col-span-3 space-y-6 flex flex-col h-full">
            {isLoading ? (
              <DailyChecklistSkeleton />
            ) : (
              <div className="">
                <DailyChecklist
                  activities={activities}
                  logs={logs}
                  currentMonth={currentMonth}
                  onToggleTick={handleToggleTick}
                  isLoading={isLoading}
                />
              </div>
            )}

            {isLoading ? (
              <ProgressChartsSkeleton />
            ) : (
              <ProgressCharts
                activities={activities}
                logs={logs}
                currentMonth={currentMonth}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
