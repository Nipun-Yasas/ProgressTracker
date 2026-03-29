export default function DailyChecklistSkeleton() {
  return (
    <div className="bg-backgroundSecondary border border-borderPrimary rounded-xl shadow-lg flex flex-col overflow-hidden">
      <div className="border-b border-borderPrimary bg-background/80 p-4 flex gap-4">
        <div className="w-48 h-6 bg-hoverPrimary rounded-md animate-pulse shrink-0" />
        <div className="flex-1 flex gap-2 overflow-hidden">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="w-10 h-6 bg-hoverPrimary rounded-md animate-pulse shrink-0"
            />
          ))}
        </div>
      </div>
      <div className="p-4 space-y-4">
        {[1, 2, 3, 4, 5].map((row) => (
          <div key={row} className="flex gap-4">
            <div className="w-48 h-6 bg-hoverPrimary rounded-md animate-pulse shrink-0" />
            <div className="flex-1 flex gap-2 overflow-hidden">
              {Array.from({ length: 15 }).map((_, i) => (
                <div
                  key={i}
                  className="w-7 h-7 bg-hoverPrimary rounded animate-pulse mx-auto shrink-0"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
