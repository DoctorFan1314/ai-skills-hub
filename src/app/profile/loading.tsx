export default function ProfileLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 lg:px-8">
      <div className="glass-card p-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 bg-secondary rounded-full animate-pulse" />
          <div>
            <div className="h-6 w-32 bg-secondary rounded animate-pulse mb-2" />
            <div className="h-4 w-48 bg-secondary rounded animate-pulse" />
          </div>
        </div>
      </div>
      <div className="flex gap-2 mb-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 w-24 bg-secondary rounded-lg animate-pulse" />
        ))}
      </div>
      <div className="h-64 bg-secondary rounded-xl animate-pulse" />
    </div>
  );
}
