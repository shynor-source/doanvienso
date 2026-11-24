import React from 'react';
import logoUrl from '../assets/doantn.png';
import {
  QrCode, Calendar, MapPin, Clock, CalendarDays,
  CheckCircle2, WifiOff, RefreshCw, ArrowRight, Heart, Newspaper, LayoutGrid
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function MemberHomeView({ onNavigate }) {
  const {
    currentMember,
    userPoints,
    activeSession,
    scannedMemberIds,
    offlineQueue,
    isOffline,
    syncOfflineQueue,
    mySchedule,
    volunteerActivities,
    registeredVolunteerIds,
    socialPosts,
    triggerGlobalToast,
  } = useApp();

  const hasCheckedIn = scannedMemberIds.includes(currentMember.id);
  const hasQueuedOffline = offlineQueue.some(
    (q) => q.memberId === currentMember.id && q.sessionId === activeSession.id
  );
  const upcomingVolunteerCount = volunteerActivities.filter((a) => a.status === 'upcoming').length;
  const upcomingSchedulePreview = mySchedule.slice(0, 2);

  return (
    <div className="p-4 space-y-4 pb-8">
      {/* Thẻ Hồ sơ Đoàn viên Super-App */}
      <div className="hero-mesh text-white rounded-2xl p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-12 h-12 rounded-xl bg-white border-2 border-white/90 flex items-center justify-center shrink-0">
              <img src={logoUrl} alt="Logo" className="w-full h-full object-contain p-1" />
            </div>
            <div className="min-w-0">
              <span className="inline-block text-[11px] bg-white/15 text-white px-2.5 py-0.5 rounded-full font-semibold">
                {currentMember.branchName}
              </span>
              <h2 className="text-[16px] font-bold mt-1 leading-6 truncate">{currentMember.name}</h2>
              <p className="text-[12px] text-white/80 truncate">
                {currentMember.memberCode} • Đoàn viên chính thức
              </p>
            </div>
          </div>

          <div className="text-right shrink-0 bg-white text-[#161891] px-3 py-2 rounded-xl shadow-xs">
            <div className="text-[17px] font-extrabold tabular-nums leading-none">{userPoints} đ</div>
            <div className="text-[11px] font-bold mt-1">
              {userPoints >= 90 ? 'Xuất sắc' : userPoints >= 75 ? 'Khá' : 'Tiên tiến'}
            </div>
          </div>
        </div>
      </div>

      {/* Hàng đợi ngoại tuyến */}
      {offlineQueue.length > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3.5 flex items-center justify-between gap-3">
          <div className="flex items-start gap-2.5 min-w-0">
            <WifiOff className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
            <div className="text-[12px] text-amber-900">
              <div className="font-bold">{offlineQueue.length} lượt điểm danh lưu cục bộ</div>
              <p className="text-[11px] text-amber-800 mt-0.5">
                {isOffline ? 'Tự động đồng bộ khi có mạng lại.' : 'Đã có mạng, chạm để đồng bộ.'}
              </p>
            </div>
          </div>
          {!isOffline && (
            <button
              onClick={() => {
                syncOfflineQueue();
                triggerGlobalToast('Đã đồng bộ dữ liệu ngoại tuyến thành công!');
              }}
              className="h-9 px-3 bg-[#161891] text-white font-bold rounded-xl text-[12px] flex items-center gap-1.5 shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Đồng bộ</span>
            </button>
          )}
        </div>
      )}

      {/* Thẻ Buổi sinh hoạt hiện tại & Nút Quét QR */}
      <div className="app-card p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold bg-[#EEF0FB] text-[#161891] px-2.5 py-1 rounded-full">
            Sinh hoạt kỳ này
          </span>
          {hasCheckedIn ? (
            <span className="text-[12px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Đã điểm danh
            </span>
          ) : hasQueuedOffline ? (
            <span className="text-[12px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Chờ đồng bộ
            </span>
          ) : (
            <span className="text-[12px] font-bold text-[#161891] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Đang mở điểm danh
            </span>
          )}
        </div>

        <div>
          <h3 className="text-[15px] font-bold text-slate-900 leading-5">{activeSession.title}</h3>
          <div className="mt-2 space-y-1.5 text-[13px] text-slate-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#161891] shrink-0" />
              <span>{activeSession.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#161891] shrink-0" />
              <span className="truncate">{activeSession.location}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onNavigate('scan_qr')}
          className={`w-full h-12 px-4 rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 transition active:scale-[0.98] ${
            hasCheckedIn
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-[#161891] hover:bg-[#0E1068] text-white'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>
            {hasCheckedIn
              ? 'Xem trạng thái & Lịch sử điểm danh'
              : 'Quét mã QR Điểm danh ngay'}
          </span>
        </button>
      </div>

      {/* Lịch cá nhân sắp tới */}
      <div className="app-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-[#161891]" />
            <h3 className="text-[15px] font-bold text-slate-900">Lịch cá nhân sắp tới</h3>
          </div>
          <button
            onClick={() => onNavigate('makeup')}
            className="text-[12px] font-bold text-[#161891] flex items-center gap-0.5"
          >
            <span>Xem toàn bộ</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {upcomingSchedulePreview.map((item) => (
            <div
              key={item.id}
              onClick={() => onNavigate('makeup')}
              className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-11 h-11 rounded-xl bg-[#EEF0FB] text-[#161891] flex flex-col items-center justify-center shrink-0">
                  <span className="text-[11px] font-bold leading-none">{item.dayOfWeek}</span>
                  <span className="text-[12px] font-extrabold tabular-nums mt-0.5">
                    {item.dateStr.slice(0, 5)}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-bold text-slate-900 truncate">{item.title}</div>
                  <div className="text-[12px] text-slate-500 truncate mt-0.5">
                    {item.timeSlot} • {item.room}
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-bold text-[#161891] bg-[#F5F7FB] px-2 py-1 rounded-lg shrink-0">
                {item.category}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Lối tắt nhanh 4 phân hệ */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={() => onNavigate('makeup')}
          className="app-card h-[72px] p-3.5 hover:border-[#161891]/40 flex items-center gap-3 text-left transition"
        >
          <div className="w-10 h-10 bg-[#EEF0FB] text-[#161891] rounded-xl flex items-center justify-center shrink-0">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[13px] font-bold text-slate-900 truncate">Lịch cá nhân</div>
            <div className="text-[11px] text-slate-500 truncate">{mySchedule.length} lịch đăng ký</div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('rewards')}
          className="app-card h-[72px] p-3.5 hover:border-[#161891]/40 flex items-center gap-3 text-left transition"
        >
          <div className="w-10 h-10 bg-[#EEF0FB] text-[#161891] rounded-xl flex items-center justify-center shrink-0">
            <Heart className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[13px] font-bold text-slate-900 truncate">Thi đua</div>
            <div className="text-[11px] text-slate-500 truncate">
              {upcomingVolunteerCount} mới • {registeredVolunteerIds.length} ĐK
            </div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('social')}
          className="app-card h-[72px] p-3.5 hover:border-[#161891]/40 flex items-center gap-3 text-left transition"
        >
          <div className="w-10 h-10 bg-[#EEF0FB] text-[#161891] rounded-xl flex items-center justify-center shrink-0">
            <Newspaper className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[13px] font-bold text-slate-900 truncate">Bảng tin</div>
            <div className="text-[11px] text-slate-500 truncate">{socialPosts.length} bài sự kiện</div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('menu')}
          className="app-card h-[72px] p-3.5 hover:border-[#161891]/40 flex items-center gap-3 text-left transition"
        >
          <div className="w-10 h-10 bg-[#EEF0FB] text-[#161891] rounded-xl flex items-center justify-center shrink-0">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[13px] font-bold text-slate-900 truncate">Tiện ích</div>
            <div className="text-[11px] text-slate-500 truncate">Tất cả tính năng</div>
          </div>
        </button>
      </div>
    </div>
  );
}
