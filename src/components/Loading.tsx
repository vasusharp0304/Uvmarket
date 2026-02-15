export function LoadingSpinner() {
    return (
        <div className="loading-container">
            <div className="spinner"></div>
            <p className="loading-text">Loading...</p>
        </div>
    );
}

export function StatCardSkeleton() {
    return (
        <div className="stat-card skeleton">
            <div className="skeleton-line skeleton-sm"></div>
            <div className="skeleton-line skeleton-lg"></div>
        </div>
    );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="table-skeleton">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="skeleton-row">
                    <div className="skeleton-line skeleton-md"></div>
                </div>
            ))}
        </div>
    );
}
