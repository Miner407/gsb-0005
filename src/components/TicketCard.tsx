import { MapPin, User, Clock, Wrench } from 'lucide-react';
import type { Ticket } from '../../shared/types';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { timeAgo } from '../utils/format';
import { Link } from 'react-router-dom';

interface TicketCardProps {
  ticket: Ticket;
}

export function TicketCard({ ticket }: TicketCardProps) {
  return (
    <Link
      to={`/tickets/${ticket.id}`}
      className="block bg-white rounded-lg border border-slate-200 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 hover:border-blue-300 group"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-base font-semibold text-slate-800 group-hover:text-blue-800 transition-colors flex-1 pr-3 line-clamp-1">
          {ticket.title}
        </h3>
        <StatusBadge status={ticket.status} />
      </div>

      <p className="text-sm text-slate-600 mb-4 line-clamp-2" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' as const }}>
        {ticket.description}
      </p>

      <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
        <div className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" />
          <span className="truncate max-w-[120px]">{ticket.location}</span>
        </div>
        <div className="flex items-center gap-1">
          <Wrench className="w-3.5 h-3.5" />
          <span>{ticket.faultType}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <PriorityBadge priority={ticket.priority} />
          {ticket.assignee && (
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <User className="w-3 h-3" />
              <span>{ticket.assignee}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <Clock className="w-3 h-3" />
          <span>{timeAgo(ticket.createdAt)}</span>
        </div>
      </div>
    </Link>
  );
}
