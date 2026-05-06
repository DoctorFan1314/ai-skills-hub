export default function CategoryDetailLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="h-4 w-28 bg-secondary rounded animate-pulse mb-6" />
      <div className="flex items-center gap-3 mb-10">
        <div className="h-12 w-12 bg-secondary rounded animate-pulse" />
        <div>
          <div className="h-8 w-40 bg-secondary rounded animate-pulse mb-2" />
          <div className="h-4 w-64 bg-secondary rounded animate-pulse" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-48 bg-secondary rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}
