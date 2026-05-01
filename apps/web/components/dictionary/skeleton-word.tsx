export function SkeletonWord() {
  return (
    <div className="animate-pulse space-y-8 p-6">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-6 w-16 bg-muted rounded-full" />
          <div className="h-6 w-12 bg-muted rounded-full" />
        </div>
        <div className="h-12 w-64 bg-muted rounded-xl" />
        <div className="h-8 w-48 bg-muted rounded-xl" />
        <div className="flex items-center gap-2">
          <div className="h-5 w-32 bg-muted rounded-lg" />
          <div className="h-8 w-8 bg-muted rounded-full" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[80, 60, 56].map((w) => (
          <div key={w} className="h-9 bg-muted rounded-xl" style={{ width: w }} />
        ))}
      </div>

      {/* Meanings */}
      <div className="space-y-6">
        {[0, 1].map((i) => (
          <div key={i} className="space-y-3">
            <div className="h-4 w-24 bg-muted rounded-lg" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-muted rounded-lg" />
              <div className="h-4 w-5/6 bg-muted rounded-lg" />
            </div>
            <div className="h-16 bg-muted rounded-2xl" />
          </div>
        ))}
      </div>

      {/* Synonyms */}
      <div className="space-y-3">
        <div className="h-4 w-24 bg-muted rounded-lg" />
        <div className="flex gap-2 flex-wrap">
          {[64, 80, 56, 72, 60].map((w) => (
            <div key={w} className="h-8 bg-muted rounded-full" style={{ width: w }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="animate-pulse flex items-center gap-4 p-4 bg-card border border-border rounded-2xl">
      <div className="w-6 h-6 bg-muted rounded-lg shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-32 bg-muted rounded-lg" />
        <div className="h-3 w-24 bg-muted rounded-lg" />
      </div>
      <div className="w-8 h-8 bg-muted rounded-lg shrink-0" />
    </div>
  );
}
