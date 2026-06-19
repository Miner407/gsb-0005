import { clsx } from 'clsx';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color: 'orange' | 'blue' | 'green' | 'slate';
  subtitle?: string;
}

const colorClasses = {
  orange: 'bg-orange-50 text-orange-600 border-orange-100',
  blue: 'bg-blue-50 text-blue-600 border-blue-100',
  green: 'bg-green-50 text-green-600 border-green-100',
  slate: 'bg-slate-50 text-slate-600 border-slate-200'
};

const iconBgClasses = {
  orange: 'bg-orange-100 text-orange-600',
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  slate: 'bg-slate-100 text-slate-600'
};

export function StatsCard({ title, value, icon: Icon, color, subtitle }: StatsCardProps) {
  return (
    <div className={clsx(
      'bg-white rounded-xl border p-5 transition-all duration-300 hover:shadow-md',
      colorClasses[color]
    )}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium mb-1 opacity-80">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-xs opacity-60 mt-2">{subtitle}</p>
          )}
        </div>
        <div className={clsx(
          'p-3 rounded-lg',
          iconBgClasses[color]
        )}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
