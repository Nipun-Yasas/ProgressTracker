export default function ProgressChartsSkeleton() {
  return (
    <div className="flex-1 bg-backgroundSecondary border border-borderPrimary rounded-xl shadow-lg p-6 min-h-[300px] flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-hoverPrimary rounded-full animate-pulse" />
        <div className="w-32 h-6 bg-hoverPrimary rounded-md animate-pulse" />
      </div>
      <div className="flex-1 flex items-end gap-4 overflow-hidden">
        {/* Using a fixed array of pseudo-random heights to prevent hydration mismatches */}
        {[
          35, 60, 20, 80, 45, 90, 25, 65, 55, 30, 75, 50, 85, 40, 95, 20, 70,
          100, 35, 60, 80, 45, 90, 25, 65, 55, 30, 75, 50, 85,
        ].map((height, i) => (
          <div
            key={i}
            className="flex-1 bg-hoverPrimary/50 rounded-t-sm animate-pulse min-w-[20px]"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </div>
  );
}
