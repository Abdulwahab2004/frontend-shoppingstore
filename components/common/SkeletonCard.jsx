export default function SkeletonCard() {
  return (
    <div className="bg-white border border-sage rounded-lg overflow-hidden animate-pulse">
      <div className="w-full h-40 bg-sage/30" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-sage/30 rounded w-3/4" />
        <div className="h-4 bg-sage/30 rounded w-1/3" />
      </div>
    </div>
  );
}