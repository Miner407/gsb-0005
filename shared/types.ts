export type TicketStatus = 'pending' | 'processing' | 'completed' | 'cancelled';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Ticket {
  id: number;
  title: string;
  description: string;
  location: string;
  contact: string;
  phone: string;
  faultType: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignee: string | null;
  submitter: string;
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
}

export interface TicketNote {
  id: number;
  ticketId: number;
  content: string;
  author: string;
  createdAt: string;
}

export interface StatusLog {
  id: number;
  ticketId: number;
  fromStatus: TicketStatus | null;
  toStatus: TicketStatus;
  remark: string;
  operator: string;
  createdAt: string;
}

export interface Statistics {
  pending: number;
  processing: number;
  completed: number;
  avgProcessingTime: number;
}

export interface CreateTicketRequest {
  title: string;
  description: string;
  location: string;
  contact: string;
  phone: string;
  faultType: string;
  submitter: string;
}

export interface UpdateTicketRequest {
  status?: TicketStatus;
  priority?: TicketPriority;
  assignee?: string | null;
  title?: string;
  description?: string;
  location?: string;
  contact?: string;
  phone?: string;
  faultType?: string;
  operator?: string;
  remark?: string;
}

export interface CreateNoteRequest {
  content: string;
  author: string;
}

export const STATUS_LABELS: Record<TicketStatus, string> = {
  pending: '待处理',
  processing: '处理中',
  completed: '已完成',
  cancelled: '已取消'
};

export const PRIORITY_LABELS: Record<TicketPriority, string> = {
  low: '低',
  medium: '中',
  high: '高',
  urgent: '紧急'
};

export const FAULT_TYPES = ['空调', '电气', '水电', '安防', '办公设备', '网络', '门窗', '其他'];
