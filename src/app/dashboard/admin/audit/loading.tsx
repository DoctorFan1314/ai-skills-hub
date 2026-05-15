export default function AuditLoading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-32 bg-muted animate-pulse rounded" />
      <div className="flex gap-3">
        <div className="h-8 w-40 bg-muted animate-pulse rounded" />
        <div className="h-8 w-32 bg-muted animate-pulse rounded" />
        <div className="h-8 w-36 bg-muted animate-pulse rounded" />
        <div className="h-8 w-36 bg-muted animate-pulse rounded" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="h-12 w-full bg-muted animate-pulse rounded" />
        ))}
      </div>
    </div>
  );
}
