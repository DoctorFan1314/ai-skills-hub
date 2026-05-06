export default function TrendingLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
      <div className="h-8 w-32 bg-secondary rounded animate-pulse mb-2" />
      <div className="h-4 w-64 bg-secondary rounded animate-pulse mb-10" />
      <div className="flex gap-2 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-10 w-24 bg-secondary rounded-lg animate-pulse" />
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-20 bg-secondary rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}
