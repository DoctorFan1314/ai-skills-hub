export default function ChannelsLoading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-40 bg-muted animate-pulse rounded" />
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2].map(i => (
          <div key={i} className="h-48 bg-muted animate-pulse rounded-xl" />
        ))}
      </div>
    </div>
  );
}
