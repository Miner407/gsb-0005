import { clsx } from 'clsx';
import type { TicketStatus } from '../../shared/types';
import { STATUS_LABELS } from '../../shared/types';

interface StatusBadgeProps {
  status: TicketStatus;
  className?: string;
}

const statusColors: Record<TicketStatus, string> = {
  pending: 'bg-orange-100 text-orange-800 border-orange-200',
  processing: 'bg-blue-100 text-blue-800 border-blue-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-gray-100 text-gray-600 border-gray-200'
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        statusColors[status],
        className
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
