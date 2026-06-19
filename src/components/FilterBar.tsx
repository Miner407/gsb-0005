import { clsx } from 'clsx';
import type { TicketStatus } from '../../shared/types';
import { STATUS_LABELS, PRIORITY_LABELS } from '../../shared/types';

interface FilterBarProps {
  statusFilter?: TicketStatus;
  priorityFilter?: string;
  onStatusChange: (status: TicketStatus | undefined) => void;
  onPriorityChange: (priority: string | undefined) => void;
}

const statusOptions: { value: TicketStatus | 'all'; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'pending', label: STATUS_LABELS.pending },
  { value: 'processing', label: STATUS_LABELS.processing },
  { value: 'completed', label: STATUS_LABELS.completed }
];

const priorityOptions: { value: string; label: string }[] = [
  { value: 'all', label: '全部优先级' },
  { value: 'low', label: PRIORITY_LABELS.low },
  { value: 'medium', label: PRIORITY_LABELS.medium },
  { value: 'high', label: PRIORITY_LABELS.high },
  { value: 'urgent', label: PRIORITY_LABELS.urgent }
];

export function FilterBar({ statusFilter, priorityFilter, onStatusChange, onPriorityChange }: FilterBarProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onStatusChange(option.value === 'all' ? undefined : option.value as TicketStatus)}
              className={clsx(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                statusFilter === option.value || (!statusFilter && option.value === 'all')
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="md:ml-auto">
          <select
            value={priorityFilter || 'all'}
            onChange={(e) => onPriorityChange(e.target.value === 'all' ? undefined : e.target.value)}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 border-0 focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {priorityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
