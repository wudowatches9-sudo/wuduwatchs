export function AdminTableSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {/* Table Header */}
      <div className="grid grid-cols-5 gap-4 rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-5 rounded bg-gray-200 dark:bg-gray-700" />
        ))}
      </div>

      {/* Table Rows */}
      {Array.from({ length: 7 }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid grid-cols-5 gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700"
        >
          {Array.from({ length: 5 }).map((_, colIndex) => (
            <div
              key={colIndex}
              className="h-4 rounded bg-gray-200 dark:bg-gray-800"
            />
          ))}
        </div>
      ))}
    </div>
  );
}
