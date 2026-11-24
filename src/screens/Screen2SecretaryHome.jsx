import React from 'react';
import {
  Users, QrCode, Calendar, TrendingUp, MapPin, CalendarDays,
  ChevronRight, CheckCircle, FileText, CheckCircle2,
  ShieldCheck, Check, Briefcase, WifiOff, RefreshCw, Newspaper
} from 'lucide-react';
import { INITIAL_BRANCH_DATA } from '../data/mockData';
import { useApp } from '../context/AppContext';

export default function Screen2SecretaryHome({ onNavigate }) {
  const {
    members,
    activeSession,
    scannedCount,
    makeupRequests,
    handleMakeupRequestAction,
    wardDataByMonth,
    offlineQueue,
    isOffline,
    syncOfflineQueue,
    triggerGlobalToast,
  } = useApp();

  const data = INITIAL_BRANCH_DATA;

  const localCount = members.filter((m) => m.type === 'local').length;
  const workingFarCount = members.filter((m) => m.type === 'working_far').length;
  const transferredCount = members.filter((m) => m.type === 'transferred').length;

  const pendingRequests = makeupRequests.filter((r) => r.status === 'pending');
  const approvedCount = makeupRequests.filter((r) => r.status === 'approved').length;

  const kp5Month11 = wardDataByMonth['11']?.branchesRank.find((b) => b.id === 'kp5') || {
    attended: 33,
    total: 46,
    rate: 71.7,
  };

  const onApprove = (req) => {
    handleMakeupRequestAction(req.id, 'approve');
    triggerGlobalToast(`Đã duyệt đơn cho Đ/c ${req.memberName} & đồng bộ số liệu Chi đoàn.`);
  };

  const onClarify = (req) => {
    handleMakeupRequestAction(req.id, 'clarify');
    triggerGlobalToast(`Đã gửi yêu cầu bổ sung minh chứng tới Đ/c ${req.memberName}.`);
  };

  return (
    <div className="p-4 space-y-4 pb-8">
      {/* Thẻ Bí thư Chi đoàn Super-App */}
      <div className="hero-mesh text-white rounded-2xl p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <span className="inline-block text-[11px] font-semibold bg-white/15 text-white px-2.5 py-0.5 rounded-full">
              {data.name}
            </span>
            <h2 className="text-[17px] font-bold mt-1.5 leading-6 truncate">
              {data.secretary.name}
            </h2>
            <p className="text-[12px] text-white/80 truncate">
              Bí thư Chi đoàn • {data.ward}
            </p>
          </div>
          <img
            src={data.secretary.avatar}
            alt={data.secretary.name}
            className="w-12 h-12 rounded-full border-2 border-white/90 object-cover shrink-0"
          />
        </div>

        <div className="mt-3.5 bg-white/10 rounded-xl p-2.5 grid grid-cols-3 text-center divide-x divide-white/15">
          <div>
            <div className="text-[18px] font-extrabold tabular-nums leading-6">{members.length}</div>
            <div className="text-[11px] text-white/80 mt-0.5">Tổng ĐV</div>
          </div>
          <div>
            <div className="text-[18px] font-extrabold tabular-nums leading-6">{workingFarCount}</div>
            <div className="text-[11px] text-white/80 mt-0.5">Làm xa</div>
          </div>
          <div>
            <div className="text-[18px] font-extrabold tabular-nums leading-6">{kp5Month11.rate}%</div>
            <div className="text-[11px] text-white/80 mt-0.5">Tỷ lệ T11</div>
          </div>
        </div>
      </div>

      {/* Hàng đợi ngoại tuyến */}
      {offlineQueue.length > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3.5 flex items-center justify-between gap-3">
          <div className="flex items-start gap-2.5 min-w-0">
            <WifiOff className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
            <div className="text-[12px] text-amber-900">
              <div className="font-bold">{offlineQueue.length} lượt điểm danh lưu ngoại tuyến</div>
              <p className="text-[11px] text-amber-800 mt-0.5">
                {isOffline ? 'Tự động đồng bộ khi có kết nối mạng.' : 'Đã có mạng, chạm để đồng bộ.'}
              </p>
            </div>
          </div>
          {!isOffline && (
            <button
              onClick={() => {
                syncOfflineQueue();
                triggerGlobalToast('Đã đồng bộ toàn bộ hàng đợi ngoại tuyến!');
              }}
              className="h-9 px-3 bg-[#161891] text-white font-bold rounded-xl text-[12px] flex items-center gap-1.5 shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Đồng bộ</span>
            </button>
          )}
        </div>
      )}

      {/* Thẻ Buổi sinh hoạt đang mở */}
      <div className="app-card p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold bg-[#EEF0FB] text-[#161891] px-2.5 py-1 rounded-full">
            Đang mở điểm danh
          </span>
          <span className="text-[12px] font-bold text-[#161891] tabular-nums">
            {scannedCount}/{members.length} ĐV có mặt
          </span>
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

        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-[#161891] h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, Math.round((scannedCount / members.length) * 100))}%` }}
          />
        </div>

        <div className="grid grid-cols-2 gap-2.5 pt-0.5">
          <button
            onClick={() => onNavigate('create_qr')}
            className="h-11 px-3 bg-[#161891] hover:bg-[#0E1068] text-white text-[13px] font-bold rounded-xl flex items-center justify-center gap-1.5 active:scale-[0.98] transition"
          >
            <QrCode className="w-4 h-4" />
            <span>Mã QR & Triệu tập</span>
          </button>

          <button
            onClick={() => onNavigate('makeup')}
            className="h-11 px-3 bg-[#EEF0FB] hover:bg-[#E1E4F8] text-[#161891] text-[13px] font-bold rounded-xl flex items-center justify-center gap-1.5 active:scale-[0.98] transition"
          >
            <CalendarDays className="w-4 h-4" />
            <span>Lịch hoạt động</span>
          </button>
        </div>
      </div>

      {/* Cơ cấu 46 Đoàn viên */}
      <div className="app-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-bold text-slate-900">Cơ cấu Đoàn viên</h3>
          <button
            onClick={() => onNavigate('members')}
            className="text-[12px] font-bold text-[#161891] flex items-center gap-0.5"
          >
            <span>Chi tiết</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          <div className="bg-[#F5F7FB] rounded-xl p-3 text-center">
            <div className="text-[18px] font-extrabold text-slate-900 tabular-nums">{localCount}</div>
            <div className="text-[12px] font-medium text-slate-600 mt-0.5">Tại chỗ</div>
          </div>

          <div className="bg-[#EEF0FB] rounded-xl p-3 text-center">
            <div className="text-[18px] font-extrabold text-[#161891] tabular-nums">{workingFarCount}</div>
            <div className="text-[12px] font-semibold text-[#161891] mt-0.5">Làm xa</div>
          </div>

          <div className="bg-[#F5F7FB] rounded-xl p-3 text-center">
            <div className="text-[18px] font-extrabold text-slate-700 tabular-nums">{transferredCount}</div>
            <div className="text-[12px] font-medium text-slate-600 mt-0.5">Chuyển SH</div>
          </div>
        </div>
      </div>

      {/* Xét duyệt đơn xin phép / đăng ký lịch */}
      <div className="app-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#161891]" />
            <h3 className="text-[15px] font-bold text-slate-900">Đơn Xin phép & Đổi lịch</h3>
          </div>
          <span className="text-[12px] font-semibold text-slate-500 tabular-nums">
            {pendingRequests.length} chờ • {approvedCount} duyệt
          </span>
        </div>

        {pendingRequests.length > 0 ? (
          <div className="space-y-2.5">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="p-3.5 bg-[#F5F7FB] rounded-xl border border-slate-200/60 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="text-[14px] font-bold text-slate-900">{req.memberName}</h4>
                    <div className="text-[12px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <Briefcase className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{req.workplace}</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold bg-[#EEF0FB] text-[#161891] px-2.5 py-0.5 rounded-full shrink-0">
                    Chờ duyệt
                  </span>
                </div>

                <div className="text-[12px] text-slate-700 bg-white p-2.5 rounded-xl space-y-1">
                  <div><strong>Đăng ký:</strong> {req.registeredMakeup}</div>
                  <div><strong>Lý do:</strong> {req.reason}</div>
                  <div className="text-emerald-700 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{req.proof}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onApprove(req)}
                    className="flex-1 h-10 bg-[#161891] hover:bg-[#0E1068] text-white font-bold text-[12px] rounded-xl flex items-center justify-center gap-1.5 transition"
                  >
                    <Check className="w-4 h-4" />
                    <span>Phê duyệt</span>
                  </button>

                  <button
                    onClick={() => onClarify(req)}
                    className="h-10 px-3.5 bg-white border border-slate-200 text-slate-700 font-semibold text-[12px] rounded-xl transition"
                  >
                    Bổ sung
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-3 bg-[#F5F7FB] rounded-xl text-center text-[13px] text-slate-600 flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Đã xử lý toàn bộ đơn đăng ký.</span>
          </div>
        )}
      </div>

      {/* Biểu đồ 3 kỳ gần nhất */}
      <div className="app-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#161891]" />
            <h3 className="text-[15px] font-bold text-slate-900">Tham dự 03 kỳ gần nhất</h3>
          </div>
          <span className="text-[11px] font-bold text-[#161891] bg-[#EEF0FB] px-2.5 py-0.5 rounded-full">
            +30.4% tăng trưởng
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-1">
          {data.recentSessions.map((session, idx) => {
            const attendees = idx === 2 ? kp5Month11.attended : session.attendees;
            const rateStr = idx === 2 ? `${kp5Month11.rate}%` : session.rate;
            const heightPercent = Math.round((attendees / 46) * 100);
            return (
              <div key={session.id} className="flex flex-col items-center">
                <div className="w-full bg-[#F5F7FB] rounded-xl h-24 flex items-end p-1.5">
                  <div
                    className={`w-full rounded-lg transition-all duration-300 flex items-center justify-center text-white text-[12px] font-bold tabular-nums ${
                      idx === 2
                        ? 'bg-[#161891]'
                        : idx === 1
                        ? 'bg-[#161891]/50'
                        : 'bg-[#161891]/75'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  >
                    {attendees}
                  </div>
                </div>
                <div className="mt-1.5 text-center">
                  <span className="block text-[12px] font-bold text-slate-800 tabular-nums">
                    {session.date.slice(0, 5)}
                  </span>
                  <span className="block text-[11px] text-slate-500 tabular-nums">{rateStr}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lối tắt nhanh */}
      <div className="grid grid-cols-3 gap-2.5">
        <button
          onClick={() => onNavigate('members')}
          className="app-card h-[72px] p-2.5 hover:border-[#161891]/40 flex flex-col items-center justify-center gap-1.5 transition"
        >
          <Users className="w-5 h-5 text-[#161891]" />
          <span className="text-[12px] font-bold text-slate-800">{members.length} Hồ sơ</span>
        </button>

        <button
          onClick={() => onNavigate('social')}
          className="app-card h-[72px] p-2.5 hover:border-[#161891]/40 flex flex-col items-center justify-center gap-1.5 transition"
        >
          <Newspaper className="w-5 h-5 text-[#161891]" />
          <span className="text-[12px] font-bold text-slate-800">Bảng tin</span>
        </button>

        <button
          onClick={() => onNavigate('reports')}
          className="app-card h-[72px] p-2.5 hover:border-[#161891]/40 flex flex-col items-center justify-center gap-1.5 transition"
        >
          <FileText className="w-5 h-5 text-[#161891]" />
          <span className="text-[12px] font-bold text-slate-800">Báo cáo</span>
        </button>
      </div>
    </div>
  );
}
