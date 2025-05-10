// Outside of ListingTeaser
const SkeletonCard: React.FC = () => (
  <div className="animate-pulse bg-card border border-gray-200 rounded-lg shadow-md">
    <div className="bg-gray-300 w-full aspect-[4/3] rounded-t-lg"></div>
    <div className="p-3 space-y-2">
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="h-3 bg-gray-300 rounded w-full"></div>
      <div className="h-3 bg-gray-300 rounded w-5/6"></div>
    </div>
  </div>
);

export default SkeletonCard;