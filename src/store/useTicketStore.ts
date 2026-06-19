import { create } from 'zustand';
import type { Ticket, TicketNote, StatusLog, Statistics, TicketStatus, CreateTicketRequest, UpdateTicketRequest } from '../../shared/types';
import * as api from '../lib/api';

interface TicketStore {
  tickets: Ticket[];
  currentTicket: Ticket | null;
  ticketNotes: TicketNote[];
  statusLogs: StatusLog[];
  statistics: Statistics | null;
  loading: boolean;
  error: string | null;
  filters: { status?: TicketStatus; priority?: string };
  setFilters: (filters: { status?: TicketStatus; priority?: string }) => void;
  fetchTickets: () => Promise<void>;
  fetchTicketById: (id: number) => Promise<void>;
  fetchTicketNotes: (ticketId: number) => Promise<void>;
  fetchStatusLogs: (ticketId: number) => Promise<void>;
  fetchStatistics: () => Promise<void>;
  createTicket: (data: CreateTicketRequest) => Promise<Ticket>;
  updateTicket: (id: number, data: UpdateTicketRequest) => Promise<void>;
  deleteTicket: (id: number) => Promise<void>;
  addNote: (ticketId: number, content: string, author: string) => Promise<void>;
  clearCurrent: () => void;
}

export const useTicketStore = create<TicketStore>((set, get) => ({
  tickets: [],
  currentTicket: null,
  ticketNotes: [],
  statusLogs: [],
  statistics: null,
  loading: false,
  error: null,
  filters: {},

  setFilters: (filters) => {
    set({ filters });
    get().fetchTickets();
  },

  fetchTickets: async () => {
    set({ loading: true, error: null });
    try {
      const { filters } = get();
      const tickets = await api.getTickets(filters);
      set({ tickets, loading: false });
    } catch (error) {
      set({ error: '加载工单列表失败', loading: false });
    }
  },

  fetchTicketById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const ticket = await api.getTicketById(id);
      set({ currentTicket: ticket, loading: false });
    } catch (error) {
      set({ error: '加载工单详情失败', loading: false });
    }
  },

  fetchTicketNotes: async (ticketId: number) => {
    try {
      const notes = await api.getTicketNotes(ticketId);
      set({ ticketNotes: notes });
    } catch (error) {
      set({ error: '加载备注失败' });
    }
  },

  fetchStatusLogs: async (ticketId: number) => {
    try {
      const logs = await api.getStatusLogs(ticketId);
      set({ statusLogs: logs });
    } catch (error) {
      set({ error: '加载状态记录失败' });
    }
  },

  fetchStatistics: async () => {
    try {
      const stats = await api.getStatistics();
      set({ statistics: stats });
    } catch (error) {
      set({ error: '加载统计数据失败' });
    }
  },

  createTicket: async (data: CreateTicketRequest) => {
    set({ loading: true, error: null });
    try {
      const ticket = await api.createTicket(data);
      set({ loading: false });
      return ticket;
    } catch (error) {
      set({ error: '创建工单失败', loading: false });
      throw error;
    }
  },

  updateTicket: async (id: number, data: UpdateTicketRequest) => {
    set({ loading: true, error: null });
    try {
      const updated = await api.updateTicket(id, data);
      set((state) => ({
        tickets: state.tickets.map(t => t.id === id ? updated : t),
        currentTicket: state.currentTicket?.id === id ? updated : state.currentTicket,
        loading: false
      }));
    } catch (error) {
      set({ error: '更新工单失败', loading: false });
      throw error;
    }
  },

  deleteTicket: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await api.deleteTicket(id);
      set((state) => ({
        tickets: state.tickets.filter(t => t.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ error: '删除工单失败', loading: false });
      throw error;
    }
  },

  addNote: async (ticketId: number, content: string, author: string) => {
    try {
      const note = await api.addTicketNote(ticketId, { content, author });
      set((state) => ({
        ticketNotes: [note, ...state.ticketNotes]
      }));
    } catch (error) {
      set({ error: '添加备注失败' });
      throw error;
    }
  },

  clearCurrent: () => {
    set({ currentTicket: null, ticketNotes: [], statusLogs: [] });
  }
}));
