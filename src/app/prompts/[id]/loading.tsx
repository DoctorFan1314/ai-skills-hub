export default function PromptDetailLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8 animate-pulse">
      <div className="h-4 w-24 bg-white/5 rounded mb-6" />
      <div className="h-8 w-3/4 bg-white/5 rounded mb-3" />
      <div className="h-4 w-full bg-white/5 rounded mb-2" />
      <div className="h-4 w-2/3 bg-white/5 rounded mb-6" />
      <div className="flex gap-4 mb-8">
        <div className="h-5 w-20 bg-white/5 rounded" />
        <div className="h-5 w-20 bg-white/5 rounded" />
        <div className="h-5 w-20 bg-white/5 rounded" />
      </div>
      <div className="glass-card p-6 mb-8">
        <div className="h-6 w-40 bg-white/5 rounded mb-4" />
        <div className="h-40 bg-white/5 rounded mb-4" />
        <div className="h-10 w-36 bg-white/5 rounded" />
      </div>
      <div className="glass-card p-6 mb-8">
        <div className="h-6 w-32 bg-white/5 rounded mb-4" />
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="h-12 bg-white/5 rounded" />
          <div className="h-12 bg-white/5 rounded" />
        </div>
      </div>
    </div>
  );
}
