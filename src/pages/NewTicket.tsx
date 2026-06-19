import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useTicketStore } from '../store/useTicketStore';
import { FAULT_TYPES } from '../../shared/types';

export default function NewTicket() {
  const navigate = useNavigate();
  const { createTicket, loading } = useTicketStore();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    contact: '',
    phone: '',
    faultType: '',
    submitter: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = '请输入故障标题';
    if (!formData.description.trim()) newErrors.description = '请输入故障描述';
    if (!formData.location.trim()) newErrors.location = '请输入故障位置';
    if (!formData.contact.trim()) newErrors.contact = '请输入联系人';
    if (!formData.phone.trim()) newErrors.phone = '请输入联系电话';
    else if (!/^1[3-9]\d{9}$/.test(formData.phone.trim())) newErrors.phone = '请输入正确的手机号';
    if (!formData.faultType) newErrors.faultType = '请选择故障类型';
    if (!formData.submitter.trim()) newErrors.submitter = '请输入提交人';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const ticket = await createTicket(formData);
      navigate(`/tickets/${ticket.id}`);
    } catch (error) {
      console.error('Create failed:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/" className="flex items-center gap-1 text-slate-600 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>返回列表</span>
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-6">提交维修工单</h1>

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
                placeholder="简要描述故障问题"
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
                placeholder="详细描述故障现象..."
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
                  placeholder="如：3楼302室"
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
                  placeholder="联系人姓名"
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
                  placeholder="手机号码"
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm transition-colors ${
                    errors.phone ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-blue-500'
                  } focus:outline-none focus:ring-2 focus:border-transparent`}
                />
                {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                提交人 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="submitter"
                value={formData.submitter}
                onChange={handleChange}
                placeholder="您的姓名"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm transition-colors ${
                  errors.submitter ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-blue-500'
                } focus:outline-none focus:ring-2 focus:border-transparent`}
              />
              {errors.submitter && <p className="mt-1 text-sm text-red-500">{errors.submitter}</p>}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <Link
                to="/"
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
                提交工单
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
