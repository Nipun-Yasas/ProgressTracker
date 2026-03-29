"use client";

import { ChevronLeft, ChevronRight, Copy } from "lucide-react";
import { format, addMonths, subMonths, parseISO } from "date-fns";

interface MonthSelectorProps {
  currentMonth: string; // "YYYY-MM"
  onMonthChange: (newMonth: string) => void;
  onCopyPrevious?: () => void;
  showCopyButton?: boolean;
}

export default function MonthSelector({
  currentMonth,
  onMonthChange,
  onCopyPrevious,
  showCopyButton = false,
}: MonthSelectorProps) {
  // We parse the current month as "YYYY-MM-01" to get a valid Date object
  const currentDate = parseISO(`${currentMonth}-01`);

  const handlePrev = () => {
    const prevDate = subMonths(currentDate, 1);
    onMonthChange(format(prevDate, "yyyy-MM"));
  };

  const handleNext = () => {
    const nextDate = addMonths(currentDate, 1);
    onMonthChange(format(nextDate, "yyyy-MM"));
  };

  return (
    <div className="flex flex-col items-center gap-4 bg-backgroundSecondary/60 border border-borderPrimary p-3 rounded-xl">
      <div className="flex items-center justify-between w-full">
        <button
          onClick={handlePrev}
          className="p-2 rounded-full hover:bg-hoverPrimary transition-colors text-textSecondary hover:text-textPrimary"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold tracking-wide text-textPrimary">
          {format(currentDate, "MMMM yyyy")}
        </h2>

        <button
          onClick={handleNext}
          className="p-2 rounded-full hover:bg-hoverPrimary transition-colors text-textSecondary hover:text-textPrimary"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {showCopyButton && onCopyPrevious && (
        <button
          onClick={onCopyPrevious}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary bg-primary/10 border border-primary/20 rounded-lg hover:bg-hover/20 transition-colors w-full justify-center mt-2 group"
        >
          <Copy className="w-4 h-4 group-hover:scale-110 transition-transform" />
          Copy activities from {format(subMonths(currentDate, 1), "MMMM")}
        </button>
      )}
    </div>
  );
}
