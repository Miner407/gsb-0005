import type { Database } from '../db/init';
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

function rowToTicket(row: any): Ticket {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    location: row.location,
    contact: row.contact,
    phone: row.phone,
    faultType: row.fault_type,
    status: row.status,
    priority: row.priority,
    assignee: row.assignee,
    submitter: row.submitter,
    createdAt: row.created_at,
    startedAt: row.started_at,
    completedAt: row.completed_at
  };
}

function rowToNote(row: any): TicketNote {
  return {
    id: row.id,
    ticketId: row.ticket_id,
    content: row.content,
    author: row.author,
    createdAt: row.created_at
  };
}

function rowToStatusLog(row: any): StatusLog {
  return {
    id: row.id,
    ticketId: row.ticket_id,
    fromStatus: row.from_status,
    toStatus: row.to_status,
    remark: row.remark,
    operator: row.operator,
    createdAt: row.created_at
  };
}

export async function getTickets(
  db: Database,
  filters?: { status?: TicketStatus; priority?: string }
): Promise<Ticket[]> {
  let sql = 'SELECT * FROM tickets WHERE 1=1';
  const params: any[] = [];

  if (filters?.status) {
    sql += ' AND status = ?';
    params.push(filters.status);
  }
  if (filters?.priority) {
    sql += ' AND priority = ?';
    params.push(filters.priority);
  }
  sql += ' ORDER BY created_at DESC';

  const rows = await db.all(sql, params);
  return rows.map(rowToTicket);
}

export async function getTicketById(db: Database, id: number): Promise<Ticket | null> {
  const row = await db.get('SELECT * FROM tickets WHERE id = ?', id);
  return row ? rowToTicket(row) : null;
}

export async function createTicket(db: Database, data: CreateTicketRequest): Promise<Ticket> {
  const result = await db.run(
    `INSERT INTO tickets (title, description, location, contact, phone, fault_type, submitter)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [data.title, data.description, data.location, data.contact, data.phone, data.faultType, data.submitter]
  );

  const ticket = await getTicketById(db, result.lastID as number);
  if (!ticket) throw new Error('Failed to create ticket');

  await db.run(
    `INSERT INTO status_logs (ticket_id, from_status, to_status, remark, operator)
     VALUES (?, ?, ?, ?, ?)`,
    [ticket.id, null, 'pending', '工单已创建', data.submitter]
  );

  return ticket;
}

export async function updateTicket(
  db: Database,
  id: number,
  data: UpdateTicketRequest
): Promise<Ticket | null> {
  const existing = await getTicketById(db, id);
  if (!existing) return null;

  const updates: string[] = [];
  const params: any[] = [];

  if (data.title !== undefined) {
    updates.push('title = ?');
    params.push(data.title);
  }
  if (data.description !== undefined) {
    updates.push('description = ?');
    params.push(data.description);
  }
  if (data.location !== undefined) {
    updates.push('location = ?');
    params.push(data.location);
  }
  if (data.contact !== undefined) {
    updates.push('contact = ?');
    params.push(data.contact);
  }
  if (data.phone !== undefined) {
    updates.push('phone = ?');
    params.push(data.phone);
  }
  if (data.faultType !== undefined) {
    updates.push('fault_type = ?');
    params.push(data.faultType);
  }
  if (data.priority !== undefined) {
    updates.push('priority = ?');
    params.push(data.priority);
  }
  if (data.assignee !== undefined) {
    updates.push('assignee = ?');
    params.push(data.assignee);
  }

  if (data.status !== undefined && data.status !== existing.status) {
    updates.push('status = ?');
    params.push(data.status);

    if (data.status === 'processing' && !existing.startedAt) {
      updates.push('started_at = ?');
      params.push(new Date().toISOString());
    }
    if (data.status === 'completed' && !existing.completedAt) {
      updates.push('completed_at = ?');
      params.push(new Date().toISOString());
    }

    await db.run(
      `INSERT INTO status_logs (ticket_id, from_status, to_status, remark, operator)
       VALUES (?, ?, ?, ?, ?)`,
      [id, existing.status, data.status, data.remark || '', data.operator || '管理员']
    );
  }

  if (updates.length > 0) {
    params.push(id);
    await db.run(`UPDATE tickets SET ${updates.join(', ')} WHERE id = ?`, params);
  }

  return getTicketById(db, id);
}

export async function deleteTicket(db: Database, id: number): Promise<boolean> {
  const existing = await getTicketById(db, id);
  if (!existing) return false;

  await db.run('DELETE FROM tickets WHERE id = ?', id);
  return true;
}

export async function getTicketNotes(db: Database, ticketId: number): Promise<TicketNote[]> {
  const rows = await db.all(
    'SELECT * FROM ticket_notes WHERE ticket_id = ? ORDER BY created_at DESC',
    ticketId
  );
  return rows.map(rowToNote);
}

export async function addTicketNote(
  db: Database,
  ticketId: number,
  data: CreateNoteRequest
): Promise<TicketNote> {
  const result = await db.run(
    'INSERT INTO ticket_notes (ticket_id, content, author) VALUES (?, ?, ?)',
    [ticketId, data.content, data.author]
  );

  const note = await db.get('SELECT * FROM ticket_notes WHERE id = ?', result.lastID);
  return rowToNote(note);
}

export async function getStatusLogs(db: Database, ticketId: number): Promise<StatusLog[]> {
  const rows = await db.all(
    'SELECT * FROM status_logs WHERE ticket_id = ? ORDER BY created_at ASC',
    ticketId
  );
  return rows.map(rowToStatusLog);
}

export async function getStatistics(db: Database): Promise<Statistics> {
  const statusCounts = await db.all(
    "SELECT status, COUNT(*) as count FROM tickets WHERE status IN ('pending', 'processing', 'completed') GROUP BY status"
  );

  const avgResult = await db.get(
    `SELECT AVG(julianday(completed_at) - julianday(started_at)) * 24 as avg_hours
     FROM tickets WHERE status = 'completed' AND started_at IS NOT NULL AND completed_at IS NOT NULL`
  );

  const stats: Statistics = {
    pending: 0,
    processing: 0,
    completed: 0,
    avgProcessingTime: avgResult?.avg_hours || 0
  };

  for (const row of statusCounts) {
    if (row.status === 'pending') stats.pending = row.count;
    else if (row.status === 'processing') stats.processing = row.count;
    else if (row.status === 'completed') stats.completed = row.count;
  }

  return stats;
}
