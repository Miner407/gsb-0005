import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, MapPin, User, Phone, Clock, Wrench, MessageSquare, Send } from 'lucide-react';
import { useTicketStore } from '../store/useTicketStore';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { formatDate, getProcessingDuration } from '../utils/format';
import { STATUS_LABELS } from '../../shared/types';

export default function TicketDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    currentTicket,
    ticketNotes,
    statusLogs,
    loading,
    fetchTicketById,
    fetchTicketNotes,
    fetchStatusLogs,
    deleteTicket,
    addNote,
    clearCurrent
  } = useTicketStore();

  const [noteContent, setNoteContent] = useState('');
  const [noteAuthor, setNoteAuthor] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (id) {
      const ticketId = parseInt(id);
      fetchTicketById(ticketId);
      fetchTicketNotes(ticketId);
      fetchStatusLogs(ticketId);
    }
    return () => clearCurrent();
  }, [id, fetchTicketById, fetchTicketNotes, fetchStatusLogs, clearCurrent]);

  const handleDelete = async () => {
    if (id) {
      try {
        await deleteTicket(parseInt(id));
        navigate('/');
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (id && noteContent.trim() && noteAuthor.trim()) {
      try {
        await addNote(parseInt(id), noteContent.trim(), noteAuthor.trim());
        setNoteContent('');
      } catch (error) {
        console.error('Add note failed:', error);
      }
    }
  };

  if (loading && !currentTicket) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">加载中...</div>
      </div>
    );
  }

  if (!currentTicket) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">工单不存在</p>
          <Link to="/" className="text-blue-600 hover:underline">返回列表</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/" className="flex items-center gap-1 text-slate-600 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>返回列表</span>
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-slate-900">{currentTicket.title}</h1>
                <StatusBadge status={currentTicket.status} />
                <PriorityBadge priority={currentTicket.priority} />
              </div>
              <p className="text-slate-500 text-sm">工单编号：#{currentTicket.id} · 提交于 {formatDate(currentTicket.createdAt)}</p>
            </div>
            <div className="flex gap-2 mt-4 sm:mt-0">
              <Link
                to={`/tickets/${currentTicket.id}/edit`}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                编辑
              </Link>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                删除
              </button>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-slate-700 mb-2">问题描述</h3>
            <p className="text-slate-600 whitespace-pre-wrap">{currentTicket.description}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">位置</p>
                <p className="text-sm font-medium text-slate-700">{currentTicket.location}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <Wrench className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">故障类型</p>
                <p className="text-sm font-medium text-slate-700">{currentTicket.faultType}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <User className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">联系人</p>
                <p className="text-sm font-medium text-slate-700">{currentTicket.contact}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Phone className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">联系电话</p>
                <p className="text-sm font-medium text-slate-700">{currentTicket.phone}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
            <div>
              <p className="text-xs text-slate-500 mb-1">提交人</p>
              <p className="text-sm font-medium text-slate-700">{currentTicket.submitter}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">处理人员</p>
              <p className="text-sm font-medium text-slate-700">{currentTicket.assignee || '未分配'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">处理时长</p>
              <p className="text-sm font-medium text-slate-700">{getProcessingDuration(currentTicket.startedAt, currentTicket.completedAt)}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              状态流转记录
            </h2>
            <div className="space-y-4">
              {statusLogs.map((log, index) => (
                <div key={log.id} className="flex gap-4">
                  <div className="relative">
                    <div className="w-3 h-3 rounded-full bg-blue-600 mt-1.5"></div>
                    {index < statusLogs.length - 1 && (
                      <div className="absolute top-4 left-1.5 w-0.5 h-full bg-slate-200 -ml-px"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-slate-900">
                        {STATUS_LABELS[log.toStatus]}
                      </span>
                      {log.fromStatus && (
                        <span className="text-xs text-slate-400">
                          ← {STATUS_LABELS[log.fromStatus]}
                        </span>
                      )}
                    </div>
                    {log.remark && (
                      <p className="text-sm text-slate-600 mb-1">{log.remark}</p>
                    )}
                    <p className="text-xs text-slate-400">
                      {log.operator} · {formatDate(log.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-green-600" />
              处理备注
            </h2>

            <form onSubmit={handleAddNote} className="mb-6">
              <div className="mb-3">
                <input
                  type="text"
                  value={noteAuthor}
                  onChange={(e) => setNoteAuthor(e.target.value)}
                  placeholder="您的姓名"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="输入备注内容..."
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={!noteContent.trim() || !noteAuthor.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {ticketNotes.length > 0 ? (
                ticketNotes.map((note) => (
                  <div key={note.id} className="bg-slate-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-700">{note.author}</span>
                      <span className="text-xs text-slate-400">{formatDate(note.createdAt)}</span>
                    </div>
                    <p className="text-sm text-slate-600">{note.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-400 text-center py-4">暂无备注</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">确认删除</h3>
            <p className="text-slate-600 mb-6">确定要删除这个工单吗？此操作无法撤销。</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium"
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
