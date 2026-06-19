import axios from 'axios';
import type {
  Ticket,
  TicketNote,
  StatusLog,
  Statistics,
  CreateTicketRequest,
  UpdateTicketRequest,
  CreateNoteRequest,
  TicketStatus
} from '../../shared/types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export async function getTickets(filters?: { status?: TicketStatus; priority?: string }): Promise<Ticket[]> {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.priority) params.append('priority', filters.priority);
  const url = params.toString() ? `/tickets?${params.toString()}` : '/tickets';
  const res = await api.get(url);
  return res.data;
}

export async function getTicketById(id: number): Promise<Ticket> {
  const res = await api.get(`/tickets/${id}`);
  return res.data;
}

export async function createTicket(data: CreateTicketRequest): Promise<Ticket> {
  const res = await api.post('/tickets', data);
  return res.data;
}

export async function updateTicket(id: number, data: UpdateTicketRequest): Promise<Ticket> {
  const res = await api.put(`/tickets/${id}`, data);
  return res.data;
}

export async function deleteTicket(id: number): Promise<void> {
  await api.delete(`/tickets/${id}`);
}

export async function getTicketNotes(ticketId: number): Promise<TicketNote[]> {
  const res = await api.get(`/tickets/${ticketId}/notes`);
  return res.data;
}

export async function addTicketNote(ticketId: number, data: CreateNoteRequest): Promise<TicketNote> {
  const res = await api.post(`/tickets/${ticketId}/notes`, data);
  return res.data;
}

export async function getStatusLogs(ticketId: number): Promise<StatusLog[]> {
  const res = await api.get(`/tickets/${ticketId}/status-logs`);
  return res.data;
}

export async function getStatistics(): Promise<Statistics> {
  const res = await api.get('/statistics');
  return res.data;
}
