import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, User } from 'lucide-react';
import { useTicketStore } from '../store/useTicketStore';
import { StatusBadge } from '../components/StatusBadge';
import { FAULT_TYPES, STATUS_LABELS, PRIORITY_LABELS, type TicketStatus, type TicketPriority } from '../../shared/types';

const MAINTENANCE_STAFF = ['李师傅', '王电工', '刘师傅', '陈工', '赵师傅'];

export default function EditTicket() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentTicket, loading, fetchTicketById, updateTicket, clearCurrent } = useTicketStore();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    contact: '',
    phone: '',
    faultType: '',
    status: '' as TicketStatus | '',
    priority: '' as TicketPriority | '',
    assignee: '' as string | null,
    operator: '',
    remark: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (id) {
      fetchTicketById(parseInt(id));
    }
    return () => clearCurrent();
  }, [id, fetchTicketById, clearCurrent]);

  useEffect(() => {
    if (currentTicket) {
      setFormData({
        title: currentTicket.title,
        description: currentTicket.description,
        location: currentTicket.location,
        contact: currentTicket.contact,
        phone: currentTicket.phone,
        faultType: currentTicket.faultType,
        status: currentTicket.status,
        priority: currentTicket.priority,
        assignee: currentTicket.assignee,
        operator: '',
        remark: ''
      });
    }
  }, [currentTicket]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = '请输入故障标题';
    if (!formData.description.trim()) newErrors.description = '请输入故障描述';
    if (!formData.location.trim()) newErrors.location = '请输入故障位置';
    if (!formData.contact.trim()) newErrors.contact = '请输入联系人';
    if (!formData.phone.trim()) newErrors.phone = '请输入联系电话';
    else if (!/^1[3-9]\d{9}$/.test(formData.phone.trim())) newErrors.phone = '请输入正确的手机号';
    if (!formData.faultType) newErrors.faultType = '请选择故障类型';
    if (!formData.status) newErrors.status = '请选择状态';
    if (!formData.priority) newErrors.priority = '请选择优先级';
    if (formData.status !== currentTicket?.status && !formData.operator.trim()) {
      newErrors.operator = '状态变更时请填写操作人';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !id) return;

    try {
      await updateTicket(parseInt(id), {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        contact: formData.contact,
        phone: formData.phone,
        faultType: formData.faultType,
        status: formData.status as TicketStatus,
        priority: formData.priority as TicketPriority,
        assignee: formData.assignee,
        operator: formData.operator || undefined,
        remark: formData.remark || undefined
      });
      navigate(`/tickets/${id}`);
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value === '' ? null : value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link to={`/tickets/${id}`} className="flex items-center gap-1 text-slate-600 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>返回详情</span>
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-slate-900">编辑工单</h1>
            <StatusBadge status={currentTicket.status} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                故障标题 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm transition-colors ${
                  errors.title ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-blue-500'
                } focus:outline-none focus:ring-2 focus:border-transparent`}
              />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                故障描述 <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm transition-colors resize-none ${
                  errors.description ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-blue-500'
                } focus:outline-none focus:ring-2 focus:border-transparent`}
              />
              {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  故障位置 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm transition-colors ${
                    errors.location ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-blue-500'
                  } focus:outline-none focus:ring-2 focus:border-transparent`}
                />
                {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  故障类型 <span className="text-red-500">*</span>
                </label>
                <select
                  name="faultType"
                  value={formData.faultType}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm transition-colors cursor-pointer ${
                    errors.faultType ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-blue-500'
                  } focus:outline-none focus:ring-2 focus:border-transparent`}
                >
                  <option value="">请选择类型</option>
                  {FAULT_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.faultType && <p className="mt-1 text-sm text-red-500">{errors.faultType}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  联系人 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm transition-colors ${
                    errors.contact ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-blue-500'
                  } focus:outline-none focus:ring-2 focus:border-transparent`}
                />
                {errors.contact && <p className="mt-1 text-sm text-red-500">{errors.contact}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  联系电话 <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm transition-colors ${
                    errors.phone ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-blue-500'
                  } focus:outline-none focus:ring-2 focus:border-transparent`}
                />
                {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">管理员操作</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    状态 <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-lg text-sm transition-colors cursor-pointer ${
                      errors.status ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-blue-500'
                    } focus:outline-none focus:ring-2 focus:border-transparent`}
                  >
                    {(['pending', 'processing', 'completed', 'cancelled'] as TicketStatus[]).map(status => (
                      <option key={status} value={status}>{STATUS_LABELS[status]}</option>
                    ))}
                  </select>
                  {errors.status && <p className="mt-1 text-sm text-red-500">{errors.status}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    优先级 <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-lg text-sm transition-colors cursor-pointer ${
                      errors.priority ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-blue-500'
                    } focus:outline-none focus:ring-2 focus:border-transparent`}
                  >
                    {(['low', 'medium', 'high', 'urgent'] as TicketPriority[]).map(priority => (
                      <option key={priority} value={priority}>{PRIORITY_LABELS[priority]}</option>
                    ))}
                  </select>
                  {errors.priority && <p className="mt-1 text-sm text-red-500">{errors.priority}</p>}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  <User className="w-4 h-4 inline mr-1" />
                  分配维修人员
                </label>
                <select
                  name="assignee"
                  value={formData.assignee || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">未分配</option>
                  {MAINTENANCE_STAFF.map(staff => (
                    <option key={staff} value={staff}>{staff}</option>
                  ))}
                </select>
              </div>

              {formData.status !== currentTicket.status && (
                <div className="bg-blue-50 rounded-lg p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      操作人 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="operator"
                      value={formData.operator}
                      onChange={handleChange}
                      placeholder="您的姓名"
                      className={`w-full px-4 py-2.5 border rounded-lg text-sm transition-colors ${
                        errors.operator ? 'border-red-300 focus:ring-red-500' : 'border-blue-200 focus:ring-blue-500'
                      } focus:outline-none focus:ring-2 focus:border-transparent`}
                    />
                    {errors.operator && <p className="mt-1 text-sm text-red-500">{errors.operator}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      状态变更备注
                    </label>
                    <textarea
                      name="remark"
                      value={formData.remark}
                      onChange={handleChange}
                      rows={2}
                      placeholder="说明状态变更原因..."
                      className="w-full px-4 py-2.5 border border-blue-200 rounded-lg text-sm transition-colors resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <Link
                to={`/tickets/${id}`}
                className="px-5 py-2.5 text-slate-600 hover:text-slate-900 font-medium transition-colors"
              >
                取消
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                保存更改
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
