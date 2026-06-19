import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '..', '..', 'data', 'tickets.db');

export async function initDatabase() {
  const db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      location TEXT NOT NULL,
      contact TEXT NOT NULL,
      phone TEXT NOT NULL,
      fault_type TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      priority TEXT NOT NULL DEFAULT 'medium',
      assignee TEXT,
      submitter TEXT NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      started_at DATETIME,
      completed_at DATETIME
    );

    CREATE TABLE IF NOT EXISTS ticket_notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticket_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      author TEXT NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS status_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticket_id INTEGER NOT NULL,
      from_status TEXT,
      to_status TEXT NOT NULL,
      remark TEXT,
      operator TEXT NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
    CREATE INDEX IF NOT EXISTS idx_tickets_priority ON tickets(priority);
    CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at);
    CREATE INDEX IF NOT EXISTS idx_notes_ticket_id ON ticket_notes(ticket_id);
    CREATE INDEX IF NOT EXISTS idx_logs_ticket_id ON status_logs(ticket_id);
  `);

  const count = await db.get('SELECT COUNT(*) as count FROM tickets');
  if (count.count === 0) {
    await insertSeedData(db);
  }

  return db;
}

async function insertSeedData(db: Awaited<ReturnType<typeof open>>) {
  const now = new Date();
  const daysAgo = (days: number, hours = 0, minutes = 0) => {
    const d = new Date(now);
    d.setDate(d.getDate() - days);
    d.setHours(d.getHours() + hours);
    d.setMinutes(d.getMinutes() + minutes);
    return d.toISOString();
  };

  await db.run(`
    INSERT INTO tickets (title, description, location, contact, phone, fault_type, status, priority, assignee, submitter, created_at, started_at, completed_at) VALUES
    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    '空调不制冷', '办公室302室主空调无法制冷，天气炎热影响办公', '3楼302室', '张三', '13800138001', '空调', 'completed', 'high', '李师傅', '张三', daysAgo(5), daysAgo(4, 8), daysAgo(4, 14),
    '灯管闪烁', '会议室A灯管频繁闪烁，影响会议', '2楼会议室A', '李四', '13800138002', '电气', 'processing', 'medium', '王电工', '李四', daysAgo(2), daysAgo(1, 9), null,
    '水龙头漏水', '男卫生间洗手池水龙头漏水', '1楼男卫生间', '王五', '13800138003', '水电', 'pending', 'low', null, '王五', daysAgo(1), null, null,
    '门禁故障', '大门门禁刷卡无反应，需手动开门', '1楼大门', '赵六', '13800138004', '安防', 'pending', 'urgent', null, '赵六', daysAgo(0, -2), null, null,
    '打印机卡纸', '打印机频繁卡纸，无法正常打印', '4楼打印室', '孙七', '13800138005', '办公设备', 'completed', 'medium', '刘师傅', '孙七', daysAgo(7), daysAgo(6, 10), daysAgo(6, 11)
  ]);

  await db.run(`
    INSERT INTO ticket_notes (ticket_id, content, author, created_at) VALUES
    (?, ?, ?, ?),
    (?, ?, ?, ?),
    (?, ?, ?, ?),
    (?, ?, ?, ?)
  `, [
    1, '已联系维修人员，预计明天上午上门', '管理员', daysAgo(4, 2),
    1, '更换了压缩机，测试制冷正常', '李师傅', daysAgo(4, 14),
    2, '已采购配件，预计明天到货后更换', '管理员', daysAgo(1, 3),
    5, '清理了进纸通道，更换了搓纸轮', '刘师傅', daysAgo(6, 11)
  ]);

  await db.run(`
    INSERT INTO status_logs (ticket_id, from_status, to_status, remark, operator, created_at) VALUES
    (?, ?, ?, ?, ?, ?),
    (?, ?, ?, ?, ?, ?),
    (?, ?, ?, ?, ?, ?),
    (?, ?, ?, ?, ?, ?),
    (?, ?, ?, ?, ?, ?)
  `, [
    1, 'pending', 'processing', '分配给李师傅处理', '管理员', daysAgo(4, 8),
    1, 'processing', 'completed', '维修完成，制冷恢复正常', '管理员', daysAgo(4, 14),
    2, 'pending', 'processing', '分配给王电工处理', '管理员', daysAgo(1, 9),
    5, 'pending', 'processing', '分配给刘师傅处理', '管理员', daysAgo(6, 10),
    5, 'processing', 'completed', '打印机恢复正常', '管理员', daysAgo(6, 11)
  ]);
}

export type Database = Awaited<ReturnType<typeof initDatabase>>;
