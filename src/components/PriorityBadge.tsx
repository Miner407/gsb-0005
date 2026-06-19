import { clsx } from 'clsx';
import type { TicketPriority } from '../../shared/types';
import { PRIORITY_LABELS } from '../../shared/types';

interface PriorityBadgeProps {
  priority: TicketPriority;
  className?: string;
}

const priorityColors: Record<TicketPriority, string> = {
  low: 'bg-gray-100 text-gray-600 border-gray-200',
  medium: 'bg-sky-100 text-sky-700 border-sky-200',
  high: 'bg-orange-100 text-orange-700 border-orange-200',
  urgent: 'bg-red-100 text-red-700 border-red-200'
};

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border',
        priorityColors[priority],
        className
      )}
    >
      {PRIORITY_LABELS[priority]}
    </span>
  );
}
