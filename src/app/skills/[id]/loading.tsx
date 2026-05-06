export default function SkillDetailLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
      <div className="h-4 w-24 bg-secondary rounded animate-pulse mb-6" />
      <div className="h-8 w-64 bg-secondary rounded animate-pulse mb-3" />
      <div className="flex gap-6 mb-4">
        <div className="h-4 w-20 bg-secondary rounded animate-pulse" />
        <div className="h-4 w-16 bg-secondary rounded animate-pulse" />
        <div className="h-4 w-24 bg-secondary rounded animate-pulse" />
      </div>
      <div className="h-4 w-full bg-secondary rounded animate-pulse mb-4" />
      <div className="flex gap-4 mb-6">
        <div className="h-6 w-20 bg-secondary rounded animate-pulse" />
      </div>
      <div className="grid lg:grid-cols-[1fr_280px] gap-6">
        <div className="h-96 bg-secondary rounded-xl animate-pulse" />
        <div className="h-64 bg-secondary rounded-xl animate-pulse" />
      </div>
    </div>
  );
}
