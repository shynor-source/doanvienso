import React, { useState } from 'react';
import { Bell, X, CheckCheck, Calendar, Send, Clock, CheckCircle2, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function NotificationModal({ isOpen, onClose, currentRole }) {
  const {
    notifications,
    activeSession,
    volunteerActivities,
    markNotificationRead,
    markAllNotificationsRead,
    sendTargetedNotification,
    triggerGlobalToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState('inbox'); // 'inbox' | 'schedule' | 'compose'
  const [composeForm, setComposeForm] = useState({
    targetGroup: 'Nhóm công nhân làm xa KCN',
    targetRole: 'member',
    title: 'Thông báo điều chỉnh lịch sinh hoạt tháng 12',
    content: 'Kính đề nghị các đồng chí cập nhật lại thời gian họp lúc 20:00 tại Nhà văn hóa KP5 (hỗ trợ đăng ký ca bù nếu vướng tăng ca).',
  });

  if (!isOpen) return null;

  const roleNotifications = notifications[currentRole] || [];
  const unreadCount = roleNotifications.filter((n) => n.unread).length;
  const upcomingActivities = volunteerActivities.filter((a) => a.status === 'upcoming');
  const canCompose = currentRole === 'secretary' || currentRole === 'ward_officer';

  const handleSendNotice = (e) => {
    e.preventDefault();
    if (!composeForm.title.trim() || !composeForm.content.trim()) return;
    sendTargetedNotification(composeForm);
    triggerGlobalToast(`Đã gửi thông báo tới "${composeForm.targetGroup}"!`);
    setActiveTab('inbox');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-[2px] flex items-end justify-center animate-fade-in">
      <div className="bg-white rounded-t-[28px] p-5 pb-7 max-w-[390px] w-full shadow-2xl space-y-4 max-h-[86dvh] overflow-y-auto animate-sheet-up">
        <div className="w-10 h-1 rounded-full bg-slate-300 mx-auto" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#EEF0FB] text-[#161891] flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-slate-900">Lịch & Thông báo</h3>
              <p className="text-[12px] text-slate-500">
                {unreadCount > 0 ? `${unreadCount} chưa đọc` : 'Đã đọc tất cả'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 text-slate-500 rounded-full bg-slate-100 flex items-center justify-center"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className={`grid ${canCompose ? 'grid-cols-3' : 'grid-cols-2'} gap-1 bg-slate-100 p-1 rounded-xl`}>
          <button
            onClick={() => setActiveTab('inbox')}
            className={`h-9 px-2 rounded-lg text-[12px] font-bold transition ${
              activeTab === 'inbox' ? 'bg-white text-[#161891] shadow-xs' : 'text-slate-600'
            }`}
          >
            Thông báo ({roleNotifications.length})
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`h-9 px-2 rounded-lg text-[12px] font-bold transition ${
              activeTab === 'schedule' ? 'bg-white text-[#161891] shadow-xs' : 'text-slate-600'
            }`}
          >
            Lịch sắp tới
          </button>
          {canCompose && (
            <button
              onClick={() => setActiveTab('compose')}
              className={`h-9 px-2 rounded-lg text-[12px] font-bold transition ${
                activeTab === 'compose' ? 'bg-white text-[#161891] shadow-xs' : 'text-slate-600'
              }`}
            >
              Gửi tin
            </button>
          )}
        </div>

        {activeTab === 'inbox' && (
          <>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllNotificationsRead(currentRole)}
                className="w-full h-10 px-3 bg-[#EEF0FB] text-[#161891] text-[12px] font-bold rounded-xl flex items-center justify-center gap-1.5 transition"
              >
                <CheckCheck className="w-4 h-4" />
                <span>Đánh dấu tất cả đã đọc</span>
              </button>
            )}

            <div className="space-y-2.5">
              {roleNotifications.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => markNotificationRead(currentRole, n.id)}
                  className={`w-full text-left p-3.5 rounded-2xl border space-y-1.5 transition ${
                    n.unread
                      ? 'bg-[#F4F5FC] border-[#161891]/25'
                      : 'bg-[#F5F7FB] border-slate-200/70'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-[13px] font-bold text-slate-900 leading-5">{n.title}</h4>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        n.unread ? 'bg-[#161891] text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {n.unread ? 'Mới' : 'Đã đọc'}
                    </span>
                  </div>
                  <p className="text-[12px] text-slate-600 leading-relaxed">{n.content}</p>
                  <span className="block text-[11px] text-slate-400">{n.time}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {activeTab === 'schedule' && (
          <div className="space-y-2.5">
            <div className="p-3.5 bg-[#F4F5FC] border border-[#161891]/20 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold bg-[#161891] text-white px-2.5 py-0.5 rounded-full">
                  Sinh hoạt định kỳ
                </span>
                <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Nhắc 24h
                </span>
              </div>
              <div className="text-[14px] font-bold text-slate-900">{activeSession.title}</div>
              <div className="text-[12px] text-slate-600 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#161891]" /> {activeSession.date}
              </div>
              <div className="text-[12px] text-slate-600 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#161891]" /> {activeSession.location}
              </div>
            </div>

            {upcomingActivities.map((act) => (
              <div key={act.id} className="p-3.5 bg-[#F5F7FB] rounded-2xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#161891] bg-[#EEF0FB] px-2.5 py-0.5 rounded-full">
                    Tình nguyện
                  </span>
                  <span className="text-[12px] font-bold text-[#161891]">{act.points}</span>
                </div>
                <div className="text-[14px] font-bold text-slate-900">{act.title}</div>
                <div className="text-[12px] text-slate-600 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#161891]" /> {act.date}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'compose' && canCompose && (
          <form onSubmit={handleSendNotice} className="space-y-3">
            <div>
              <label className="block text-[12px] font-semibold text-slate-700 mb-1">
                Gửi tới nhóm / Chi đoàn
              </label>
              <select
                value={composeForm.targetGroup}
                onChange={(e) => {
                  const val = e.target.value;
                  setComposeForm({
                    ...composeForm,
                    targetGroup: val,
                    targetRole: val.includes('12 Bí thư') ? 'secretary' : 'member',
                  });
                }}
                className="w-full h-11 px-3 bg-[#F5F7FB] border border-slate-200 rounded-xl text-[13px]"
              >
                <option value="Nhóm công nhân làm xa KCN">Nhóm công nhân làm xa / KCN (12 ĐV)</option>
                <option value="Toàn Chi đoàn Khu phố 5">Toàn thể Chi đoàn Khu phố 5 (46 ĐV)</option>
                <option value="Nhóm đoàn viên tại địa phương">Nhóm đoàn viên tại địa phương (31 ĐV)</option>
                <option value="12 Bí thư Chi đoàn Phường Tam Hiệp">12 Bí thư Chi đoàn trực thuộc Phường</option>
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-slate-700 mb-1">
                Tiêu đề thông báo
              </label>
              <input
                type="text"
                required
                value={composeForm.title}
                onChange={(e) => setComposeForm({ ...composeForm, title: e.target.value })}
                className="w-full h-11 px-3 bg-[#F5F7FB] border border-slate-200 rounded-xl text-[13px]"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-slate-700 mb-1">
                Nội dung thông báo
              </label>
              <textarea
                rows={3}
                required
                value={composeForm.content}
                onChange={(e) => setComposeForm({ ...composeForm, content: e.target.value })}
                className="w-full p-3 bg-[#F5F7FB] border border-slate-200 rounded-xl text-[13px]"
              />
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-[#161891] hover:bg-[#0E1068] text-white font-bold text-[14px] rounded-xl flex items-center justify-center gap-1.5 transition"
            >
              <Send className="w-4 h-4" />
              <span>Phát thông báo ngay</span>
            </button>
          </form>
        )}

        <button
          onClick={onClose}
          className="w-full h-11 bg-slate-100 text-slate-700 text-[13px] font-bold rounded-xl"
        >
          Đóng
        </button>
      </div>
    </div>
  );
}
