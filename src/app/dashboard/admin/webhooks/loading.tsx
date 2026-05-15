export default function WebhooksLoading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-40 bg-muted animate-pulse rounded" />
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 w-full bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    </div>
  );
}
