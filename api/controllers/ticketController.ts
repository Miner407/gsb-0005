import type { Request, Response } from 'express';
import type { Database } from '../db/init';
import * as ticketService from '../services/ticketService';
import type { CreateTicketRequest, UpdateTicketRequest, CreateNoteRequest } from '../../shared/types';

export function createTicketController(db: Database) {
  return {
    async getTickets(req: Request, res: Response) {
      try {
        const { status, priority } = req.query;
        const filters: any = {};
        if (status) filters.status = status;
        if (priority) filters.priority = priority;

        const tickets = await ticketService.getTickets(db, filters);
        res.json(tickets);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tickets' });
      }
    },

    async getTicketById(req: Request, res: Response) {
      try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
          return res.status(400).json({ error: 'Invalid ticket ID' });
        }

        const ticket = await ticketService.getTicketById(db, id);
        if (!ticket) {
          return res.status(404).json({ error: 'Ticket not found' });
        }
        res.json(ticket);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch ticket' });
      }
    },

    async createTicket(req: Request, res: Response) {
      try {
        const data = req.body as CreateTicketRequest;

        if (!data.title || !data.description || !data.location || !data.contact || !data.phone || !data.faultType || !data.submitter) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        const ticket = await ticketService.createTicket(db, data);
        res.status(201).json(ticket);
      } catch (error) {
        res.status(500).json({ error: 'Failed to create ticket' });
      }
    },

    async updateTicket(req: Request, res: Response) {
      try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
          return res.status(400).json({ error: 'Invalid ticket ID' });
        }

        const data = req.body as UpdateTicketRequest;
        const ticket = await ticketService.updateTicket(db, id, data);

        if (!ticket) {
          return res.status(404).json({ error: 'Ticket not found' });
        }
        res.json(ticket);
      } catch (error) {
        res.status(500).json({ error: 'Failed to update ticket' });
      }
    },

    async deleteTicket(req: Request, res: Response) {
      try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
          return res.status(400).json({ error: 'Invalid ticket ID' });
        }

        const success = await ticketService.deleteTicket(db, id);
        if (!success) {
          return res.status(404).json({ error: 'Ticket not found' });
        }
        res.status(204).send();
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete ticket' });
      }
    },

    async getTicketNotes(req: Request, res: Response) {
      try {
        const ticketId = parseInt(req.params.id);
        if (isNaN(ticketId)) {
          return res.status(400).json({ error: 'Invalid ticket ID' });
        }

        const notes = await ticketService.getTicketNotes(db, ticketId);
        res.json(notes);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch notes' });
      }
    },

    async addTicketNote(req: Request, res: Response) {
      try {
        const ticketId = parseInt(req.params.id);
        if (isNaN(ticketId)) {
          return res.status(400).json({ error: 'Invalid ticket ID' });
        }

        const data = req.body as CreateNoteRequest;
        if (!data.content || !data.author) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        const note = await ticketService.addTicketNote(db, ticketId, data);
        res.status(201).json(note);
      } catch (error) {
        res.status(500).json({ error: 'Failed to add note' });
      }
    },

    async getStatusLogs(req: Request, res: Response) {
      try {
        const ticketId = parseInt(req.params.id);
        if (isNaN(ticketId)) {
          return res.status(400).json({ error: 'Invalid ticket ID' });
        }

        const logs = await ticketService.getStatusLogs(db, ticketId);
        res.json(logs);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch status logs' });
      }
    },

    async getStatistics(req: Request, res: Response) {
      try {
        const stats = await ticketService.getStatistics(db);
        res.json(stats);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch statistics' });
      }
    }
  };
}
