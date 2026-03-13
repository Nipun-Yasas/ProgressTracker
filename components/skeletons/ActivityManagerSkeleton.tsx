export default function ActivityManagerSkeleton() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg p-6 flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-5 h-5 bg-zinc-800 rounded-full animate-pulse" />
        <div className="w-24 h-6 bg-zinc-800 rounded-md animate-pulse" />
      </div>
      <div className="flex gap-2 mb-6">
        <div className="flex-1 h-10 bg-zinc-800 rounded-lg animate-pulse" />
        <div className="w-10 h-10 bg-zinc-800 rounded-lg animate-pulse" />
      </div>
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-12 bg-zinc-800/50 rounded-lg animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
