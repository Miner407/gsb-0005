import { Router } from 'express';
import type { Database } from '../db/init';
import { createTicketController } from '../controllers/ticketController';

export function createTicketRouter(db: Database) {
  const router = Router();
  const controller = createTicketController(db);

  router.get('/', controller.getTickets.bind(controller));
  router.get('/statistics', controller.getStatistics.bind(controller));
  router.get('/:id', controller.getTicketById.bind(controller));
  router.post('/', controller.createTicket.bind(controller));
  router.put('/:id', controller.updateTicket.bind(controller));
  router.delete('/:id', controller.deleteTicket.bind(controller));
  router.get('/:id/notes', controller.getTicketNotes.bind(controller));
  router.post('/:id/notes', controller.addTicketNote.bind(controller));
  router.get('/:id/status-logs', controller.getStatusLogs.bind(controller));

  return router;
}
