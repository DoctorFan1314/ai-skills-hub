export default function SkillsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="h-8 w-48 bg-secondary rounded animate-pulse mb-2" />
          <div className="h-4 w-64 bg-secondary rounded animate-pulse" />
        </div>
        <div className="h-10 w-32 bg-secondary rounded-lg animate-pulse" />
      </div>
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 max-w-md flex-1 bg-secondary rounded animate-pulse" />
        <div className="h-9 w-20 bg-secondary rounded animate-pulse" />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-48 bg-secondary rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}
