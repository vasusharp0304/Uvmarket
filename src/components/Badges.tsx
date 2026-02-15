export function StatusBadge({ status }: { status: string }) {
    const config: Record<string, { label: string; className: string }> = {
        PENDING: { label: 'Pending', className: 'badge badge-amber' },
        ACTIVE: { label: 'Active', className: 'badge badge-blue' },
        TARGET_HIT: { label: 'Target Hit', className: 'badge badge-green' },
        STOP_LOSS: { label: 'Stop Loss', className: 'badge badge-red' },
        CLOSED_MANUAL: { label: 'Closed', className: 'badge badge-gray' },
    };

    const { label, className } = config[status] || { label: status, className: 'badge badge-gray' };

    return <span className={className}>{label}</span>;
}

export function DirectionBadge({ direction }: { direction: string }) {
    return (
        <span className={`badge ${direction === 'BUY' ? 'badge-green' : 'badge-red'}`}>
            {direction}
        </span>
    );
}

export function SubscriptionBadge({ status }: { status: string }) {
    const config: Record<string, { label: string; className: string }> = {
        active: { label: 'Active', className: 'badge badge-green' },
        inactive: { label: 'Inactive', className: 'badge badge-gray' },
        expired: { label: 'Expired', className: 'badge badge-red' },
    };

    const { label, className } = config[status] || { label: status, className: 'badge badge-gray' };

    return <span className={className}>{label}</span>;
}
