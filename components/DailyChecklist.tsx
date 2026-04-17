"use client";

import { useMemo, useEffect, useRef } from "react";
import { getDaysInMonth, parseISO, format } from "date-fns";
import { Check } from "lucide-react";
import { IActivity } from "@/lib/models/Activity";
import { IDailyLog } from "@/lib/models/DailyLog";

interface DailyChecklistProps {
  activities: IActivity[];
  logs: IDailyLog[];
  currentMonth: string; // "YYYY-MM"
  onToggleTick: (
    activityId: string,
    date: string,
    done: boolean,
  ) => Promise<void>;
  isLoading?: boolean;
}

export default function DailyChecklist({
  activities,
  logs,
  currentMonth,
  onToggleTick,
  isLoading = false,
}: DailyChecklistProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const todayRef = useRef<HTMLTableCellElement>(null);

  // Generate array of days for the current month
  const daysInMonth = useMemo(() => {
    try {
      const date = parseISO(`${currentMonth}-01`);
      return getDaysInMonth(date);
    } catch {
      return 31; // fallback
    }
  }, [currentMonth]);

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Auto-scroll to today's column if we are looking at the current month
  useEffect(() => {
    if (
      activities.length > 0 &&
      todayRef.current &&
      scrollContainerRef.current
    ) {
      const isCurrentMonth = currentMonth === format(new Date(), "yyyy-MM");
      if (isCurrentMonth) {
        const container = scrollContainerRef.current;
        const element = todayRef.current;
        const frozenColumnWidth = 200; // rough width of the sticky "Activity" column
        container.scrollTo({
          left: Math.max(0, element.offsetLeft - frozenColumnWidth - 20),
          behavior: "smooth",
        });
      }
    }
  }, [activities.length, currentMonth]);

  // Helper to efficiently check if a log exists and is done
  const isLogDone = (activityId: string, day: number) => {
    const dayStr = day.toString().padStart(2, "0");
    const dateStr = `${currentMonth}-${dayStr}`;
    const log = logs.find(
      (l) => l.activityId.toString() === activityId && l.date === dateStr,
    );
    return log?.done || false;
  };

  const handleToggle = (
    activityId: string,
    day: number,
    currentDone: boolean,
  ) => {
    if (isLoading) return;
    const dayStr = day.toString().padStart(2, "0");
    const dateStr = `${currentMonth}-${dayStr}`;
    onToggleTick(activityId, dateStr, !currentDone);
  };

  if (activities.length === 0) {
    return (
      <div className="bg-backgroundSecondary/60 border border-borderPrimary p-6 rounded-xl flex items-center justify-center min-h-[300px]">
        <p className="text-textSecondary">Add some activities to start tracking.</p>
      </div>
    );
  }

  return (
    <div className="bg-backgroundSecondary/60 border border-borderPrimary rounded-xl overflow-hidden flex flex-col h-full">
      <div
        className="overflow-x-auto flex-1 relative"
        ref={scrollContainerRef}
      >
        <table className="w-full text-sm text-left border-collapse">
          <thead className="text-xs uppercase text-textSecondary sticky top-0 z-10 bg-backgroundSecondary/80 backdrop-blur-md">
            <tr>
              <th
                scope="col"
                className="px-6 py-4 font-semibold w-48 sticky left-0 z-20 bg-backgroundSecondary border-r border-borderPrimary backdrop-blur-md"
              >
                Activity
              </th>
              {daysArray.map((day) => {
                const isToday =
                  currentMonth === format(new Date(), "yyyy-MM") &&
                  day === parseInt(format(new Date(), "d"));
                return (
                  <th
                    key={day}
                    ref={isToday ? todayRef : null}
                    scope="col"
                    className={`px-2 py-4 text-center min-w-[40px] font-medium border-l border-borderPrimary ${isToday ? "text-textPrimary bg-backgroundSecondary" : ""}`}
                  >
                    {day}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {activities.map((activity) => (
              <tr
                key={activity._id as unknown as string}
                className="hover:bg-hoverPrimary transition-colors"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-textPrimary whitespace-nowrap sticky left-0 z-10 bg-backgroundSecondary border-r border-borderPrimary backdrop-blur-md truncate max-w-[200px]"
                  title={activity.name}
                >
                  {activity.name}
                </th>
                {daysArray.map((day) => {
                  const done = isLogDone(
                    activity._id as unknown as string,
                    day,
                  );
                  return (
                    <td
                      key={day}
                      className="px-2 py-3 text-center border-l border-borderPrimary"
                    >
                      <button
                        onClick={() =>
                          handleToggle(
                            activity._id as unknown as string,
                            day,
                            done,
                          )
                        }
                        disabled={isLoading}
                        className={`w-7 h-7 mx-auto rounded flex items-center justify-center transition-all ${
                          done
                            ? "bg-primary/20 text-primary border border-primary/30"
                            : "bg-background border border-borderPrimary hover:border-borderPrimary text-transparent hover:bg-hoverPrimary"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                        aria-label={`Mark ${activity.name} on day ${day} as ${done ? "undone" : "done"}`}
                      >
                        <Check
                          className={`w-4 h-4 ${done ? "opacity-100" : "opacity-0"} transition-opacity`}
                        />
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
