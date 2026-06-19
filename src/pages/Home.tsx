import { useEffect, useState } from 'react';
import { Clock, Wrench, CheckCircle2, AlertCircle, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTicketStore } from '../store/useTicketStore';
import { StatsCard } from '../components/StatsCard';
import { FilterBar } from '../components/FilterBar';
import { TicketCard } from '../components/TicketCard';
import { formatDuration } from '../utils/format';
import type { TicketStatus } from '../../shared/types';

export default function Home() {
  const {
    tickets,
    statistics,
    filters,
    loading,
    fetchTickets,
    fetchStatistics,
    setFilters
  } = useTicketStore();

  const [statusFilter, setStatusFilter] = useState<TicketStatus | undefined>(filters.status);
  const [priorityFilter, setPriorityFilter] = useState<string | undefined>(filters.priority);

  useEffect(() => {
    fetchTickets();
    fetchStatistics();
  }, [fetchTickets, fetchStatistics]);

  const handleStatusChange = (status: TicketStatus | undefined) => {
    setStatusFilter(status);
    setFilters({ status, priority: priorityFilter });
  };

  const handlePriorityChange = (priority: string | undefined) => {
    setPriorityFilter(priority);
    setFilters({ status: statusFilter, priority });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">维修工单管理</h1>
            <p className="text-slate-600">管理和跟踪所有维修维护请求</p>
          </div>
          <Link
            to="/tickets/new"
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            新建工单
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="待处理"
            value={statistics?.pending || 0}
            icon={AlertCircle}
            color="orange"
          />
          <StatsCard
            title="处理中"
            value={statistics?.processing || 0}
            icon={Wrench}
            color="blue"
          />
          <StatsCard
            title="已完成"
            value={statistics?.completed || 0}
            icon={CheckCircle2}
            color="green"
          />
          <StatsCard
            title="平均处理时长"
            value={statistics ? formatDuration(statistics.avgProcessingTime) : '-'}
            icon={Clock}
            color="slate"
          />
        </div>

        <FilterBar
          statusFilter={statusFilter}
          priorityFilter={priorityFilter}
          onStatusChange={handleStatusChange}
          onPriorityChange={handlePriorityChange}
        />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg border border-slate-200 p-5 animate-pulse">
                <div className="flex items-start justify-between mb-3">
                  <div className="h-5 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-6 bg-slate-200 rounded-full w-16"></div>
                </div>
                <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-5/6 mb-4"></div>
                <div className="flex gap-4 mb-3">
                  <div className="h-3 bg-slate-200 rounded w-20"></div>
                  <div className="h-3 bg-slate-200 rounded w-16"></div>
                </div>
                <div className="h-10 bg-slate-100 rounded"></div>
              </div>
            ))}
          </div>
        ) : tickets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wrench className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-700 mb-2">暂无工单</h3>
            <p className="text-slate-500 mb-6">当前筛选条件下没有找到工单</p>
            <Link
              to="/tickets/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              创建第一个工单
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
