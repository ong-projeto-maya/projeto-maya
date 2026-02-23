export default function SkeletonCard() {
  return (
    <div className="card animate-pulse">
      {/* Image Skeleton */}
      <div className="h-64 bg-gray-200 rounded-xl mb-4" />

      {/* Title Skeleton */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
        <div className="w-6 h-6 bg-gray-200 rounded-full" />
      </div>

      {/* Tags Skeleton */}
      <div className="flex gap-2 mb-4">
        <div className="h-6 bg-gray-200 rounded-full w-20" />
        <div className="h-6 bg-gray-200 rounded-full w-24" />
        <div className="h-6 bg-gray-200 rounded-full w-16" />
      </div>

      {/* Text Skeleton */}
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-4/6" />
      </div>

      {/* Button Skeleton */}
      <div className="h-12 bg-gray-200 rounded-2xl" />
    </div>
  )
}
