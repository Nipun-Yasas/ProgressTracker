"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  format,
  getDaysInMonth,
  parseISO,
  getWeekOfMonth,
  endOfMonth,
} from "date-fns";
import { IActivity } from "@/lib/models/Activity";
import { IDailyLog } from "@/lib/models/DailyLog";
import { Activity, BarChart3 } from "lucide-react";

interface ProgressChartsProps {
  activities: IActivity[];
  logs: IDailyLog[];
  currentMonth: string; // "YYYY-MM"
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: {
    value: number;
    payload: { fullDate?: string; fullSubject?: string; completed?: number };
  }[];
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-lg shadow-xl outline-none">
        <p className="text-zinc-300 font-medium mb-1">
          {payload[0].payload.fullDate ||
            payload[0].payload.fullSubject ||
            label}
        </p>
        <p className="text-emerald-400 font-semibold text-lg">
          {payload[0].value}%{" "}
          <span className="text-xs text-zinc-500 font-normal">completed</span>
        </p>
        {payload[0].payload.completed !== undefined && (
          <p className="text-zinc-500 text-xs mt-1">
            {payload[0].payload.completed} instance(s)
          </p>
        )}
      </div>
    );
  }
  return null;
};

export default function ProgressCharts({
  activities,
  logs,
  currentMonth,
}: ProgressChartsProps) {
  const [activeTab, setActiveTab] = useState<"daily" | "weekly" | "monthly">(
    "daily",
  );

  const totalActivities = activities.length;

  const { dailyData, weeklyData, monthlyData } = useMemo(() => {
    if (!totalActivities) {
      return { dailyData: [], weeklyData: [], monthlyData: [] };
    }

    try {
      const date = parseISO(`${currentMonth}-01`);
      const daysInMonth = getDaysInMonth(date);

      // --- 1. Daily Data ---
      // X: Day 1, 2... Y: % done
      const dData = Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const dayStr = day.toString().padStart(2, "0");
        const dateStr = `${currentMonth}-${dayStr}`;

        const logsForDay = logs.filter(
          (l: IDailyLog) => l.date === dateStr && l.done,
        );
        const percentDone = (logsForDay.length / totalActivities) * 100;

        return {
          day: day.toString(),
          fullDate: format(parseISO(dateStr), "MMM do"),
          percent: Math.round(percentDone),
          completed: logsForDay.length,
        };
      });

      // --- 2. Weekly Data ---
      // X: Week 1, 2... Y: % done
      const numWeeks = getWeekOfMonth(endOfMonth(date));
      const wData = Array.from({ length: numWeeks }, (_, i) => {
        const weekNum = i + 1;
        return {
          week: `Week ${weekNum}`,
          totalPossible: 0,
          completed: 0,
          percent: 0,
        };
      });

      // Group daily logs by week
      Array.from({ length: daysInMonth }).forEach((_, i) => {
        const day = i + 1;
        const dayStr = day.toString().padStart(2, "0");
        const dateStr = `${currentMonth}-${dayStr}`;

        // Note: Simplistic week calculation based on day modulo. date-fns getWeekOfMonth can be more complex depending on locale.
        // For a simple view, we'll just divide days by 7
        const weekIndex = Math.floor(i / 7);

        if (weekIndex < wData.length) {
          wData[weekIndex].totalPossible += totalActivities;
          const logsForDay = logs.filter(
            (l: IDailyLog) => l.date === dateStr && l.done,
          ).length;
          wData[weekIndex].completed += logsForDay;
        }
      });

      wData.forEach((w) => {
        if (w.totalPossible > 0) {
          w.percent = Math.round((w.completed / w.totalPossible) * 100);
        }
      });

      // --- 3. Monthly Data (By Activity) ---
      // X: Activity Name, Y: % of days done in month
      const mData = activities.map((act) => {
        const actId = act._id.toString();
        const completedDays = logs.filter(
          (l: IDailyLog) => l.activityId.toString() === actId && l.done,
        ).length;
        const percent = Math.round((completedDays / daysInMonth) * 100);

        return {
          subject:
            act.name.length > 15 ? act.name.substring(0, 15) + "..." : act.name,
          fullSubject: act.name,
          percent,
          completed: completedDays,
        };
      });

      return { dailyData: dData, weeklyData: wData, monthlyData: mData };
    } catch {
      return { dailyData: [], weeklyData: [], monthlyData: [] };
    }
  }, [activities, logs, currentMonth, totalActivities]);

  if (activities.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl shadow-lg flex flex-col items-center justify-center h-[400px] text-zinc-500">
        <BarChart3 className="w-12 h-12 mb-4 opacity-20" />
        <p>No data to visualize yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg p-6">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <h3 className="text-lg font-medium text-zinc-100 flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-500" />
          Progress Overview
        </h3>

        <div className="flex bg-zinc-950/50 p-1 rounded-lg border border-zinc-800/50">
          <button
            onClick={() => setActiveTab("daily")}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeTab === "daily"
                ? "bg-zinc-800 text-zinc-100 shadow-sm"
                : "text-zinc-400 hover:text-zinc-300"
            }`}
          >
            Daily Flow
          </button>
          <button
            onClick={() => setActiveTab("weekly")}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeTab === "weekly"
                ? "bg-zinc-800 text-zinc-100 shadow-sm"
                : "text-zinc-400 hover:text-zinc-300"
            }`}
          >
            Weekly Trend
          </button>
          <button
            onClick={() => setActiveTab("monthly")}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeTab === "monthly"
                ? "bg-zinc-800 text-zinc-100 shadow-sm"
                : "text-zinc-400 hover:text-zinc-300"
            }`}
          >
            By Activity
          </button>
        </div>
      </div>

      <div className="h-[300px] w-full">
        {activeTab === "daily" && (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={dailyData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#27272a"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                stroke="#71717a"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                stroke="#71717a"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                tickFormatter={(val) => `${val}%`}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "#27272a", opacity: 0.4 }}
              />
              <Bar
                dataKey="percent"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        )}

        {activeTab === "weekly" && (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={weeklyData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#27272a"
                vertical={false}
              />
              <XAxis
                dataKey="week"
                stroke="#71717a"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                stroke="#71717a"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                tickFormatter={(val) => `${val}%`}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "#27272a", opacity: 0.4 }}
              />
              <Bar
                dataKey="percent"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                maxBarSize={60}
              />
            </BarChart>
          </ResponsiveContainer>
        )}

        {activeTab === "monthly" && (
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={monthlyData}>
              <PolarGrid stroke="#3f3f46" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: "#a1a1aa", fontSize: 11 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={{ fill: "#71717a", fontSize: 10 }}
              />
              <Radar
                name="Completion Rate"
                dataKey="percent"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.3}
              />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
