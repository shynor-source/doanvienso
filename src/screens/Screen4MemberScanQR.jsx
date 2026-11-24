import React, { useState } from 'react';
import {
  Camera, CheckCircle2, History, AlertTriangle, ArrowRight,
  Calendar, MapPin, Clock, RefreshCw, Lock, WifiOff, Navigation, Newspaper
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { SOCIAL_EVENT_PRESETS } from '../data/mockData';

export default function Screen4MemberScanQR({ activeTab = 'scan', onTabChange, onNavigate, onNavigateSocial }) {
  const {
    currentMember,
    userPoints,
    activeSession,
    scannedMemberIds,
    attendanceHistory,
    offlineQueue,
    isOffline,
    syncOfflineQueue,
    recordMemberQRCheckIn,
    setPreselectedSocialEvent,
    triggerGlobalToast,
  } = useApp();

  const [scanState, setScanState] = useState('idle'); // 'idle' | 'scanning'
  const [modalResult, setModalResult] = useState(null); // null | { offline, timestamp, distanceMeters }
  const [geoError, setGeoError] = useState(null);
  const [simulateOutOfRange, setSimulateOutOfRange] = useState(false);

  const setTab = (tab) => {
    if (onTabChange) onTabChange(tab);
  };

  const hasCheckedIn = scannedMemberIds.includes(currentMember.id);
  const hasQueuedOffline = offlineQueue.some(
    (q) => q.memberId === currentMember.id && q.sessionId === activeSession.id
  );
  const distanceMeters = simulateOutOfRange ? 320 : 35;

  const handleSimulateScan = () => {
    setGeoError(null);

    if (hasCheckedIn || hasQueuedOffline) {
      setGeoError('Bạn đã điểm danh buổi sinh hoạt này rồi. Hệ thống chặn điểm danh trùng lặp.');
      return;
    }

    setScanState('scanning');
    setTimeout(() => {
      setScanState('idle');

      // Kiểm tra bán kính GPS Geofencing (< 100m)
      if (activeSession.geofenceRequired && simulateOutOfRange) {
        setGeoError(
          `Từ chối điểm danh: Vị trí hiện tại cách Nhà văn hóa KP5 ${distanceMeters}m (vượt bán kính 100m). Vui lòng di chuyển lại gần hoặc đăng ký sinh hoạt bù.`
        );
        return;
      }

      const res = recordMemberQRCheckIn({ distanceMeters });
      if (!res.ok) {
        setGeoError('Bạn đã điểm danh buổi sinh hoạt này trước đó.');
        return;
      }

      setModalResult({
        offline: res.offline,
        timestamp: res.timestamp,
        distanceMeters,
      });

      if (!res.offline) {
        try {
          confetti({
            particleCount: 80,
            spread: 65,
            origin: { y: 0.65 },
          });
        } catch {
          // Fallback
        }
      }
    }, 850);
  };

  return (
    <div className="p-4 space-y-4 pb-8">
      {/* SegmentedButton chuẩn Flutter M3 */}
      <div className="grid grid-cols-2 bg-slate-200/70 p-1 rounded-xl gap-1">
        <button
          onClick={() => setTab('scan')}
          className={`h-10 text-[13px] font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
            activeTab === 'scan' ? 'bg-white text-[#161891] shadow-xs' : 'text-slate-600'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Quét mã QR</span>
        </button>
        <button
          onClick={() => setTab('history')}
          className={`h-10 text-[13px] font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
            activeTab === 'history' ? 'bg-white text-[#161891] shadow-xs' : 'text-slate-600'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Lịch sử ({attendanceHistory.length + offlineQueue.length})</span>
        </button>
      </div>

      {/* Thẻ thông tin ngắn gọn */}
      <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={currentMember.avatar}
            alt={currentMember.name}
            className="w-11 h-11 rounded-full border-2 border-[#161891]/20 object-cover shrink-0"
          />
          <div className="min-w-0">
            <h3 className="text-[14px] font-bold text-slate-900 truncate">{currentMember.name}</h3>
            <p className="text-[12px] text-slate-500 truncate">{currentMember.workplace} • {currentMember.shift}</p>
          </div>
        </div>

        <span className="px-2.5 py-1 bg-[#EEF0FB] text-[#161891] text-[12px] font-extrabold rounded-full tabular-nums shrink-0">
          {userPoints} đ
        </span>
      </div>

      {activeTab === 'scan' ? (
        <div className="space-y-3.5">
          {isOffline && (
            <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3.5 flex items-start gap-2.5 text-[12px] text-amber-900">
              <WifiOff className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold">Chế độ Ngoại tuyến (Sóng yếu KCN)</div>
                <p className="mt-0.5 leading-relaxed">
                  Lượt quét QR sẽ được lưu cục bộ trên máy và tự động đồng bộ khi có mạng.
                </p>
              </div>
            </div>
          )}

          {geoError && (
            <div className="bg-rose-50 border border-rose-300 text-rose-900 rounded-2xl p-3.5 text-[12px] flex items-start gap-2 animate-fade-in">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{geoError}</span>
            </div>
          )}

          {(hasCheckedIn || hasQueuedOffline) && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl p-3.5 text-[12px] flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate font-medium">
                  {hasCheckedIn
                    ? 'Đã điểm danh buổi sinh hoạt này.'
                    : 'Đã lưu điểm danh cục bộ - Chờ đồng bộ.'}
                </span>
              </div>
              <button
                onClick={() => setTab('history')}
                className="text-[12px] font-bold text-[#161891] shrink-0"
              >
                Lịch sử
              </button>
            </div>
          )}

          {/* Camera Viewport chuẩn tỉ lệ Mobile */}
          <div className="relative bg-slate-950 rounded-3xl p-4 h-[276px] overflow-hidden shadow-md flex flex-col items-center justify-between">
            {/* Thanh GPS & Bảo mật trên đầu khung Camera */}
            <div className="relative z-10 w-full flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  setSimulateOutOfRange(!simulateOutOfRange);
                  setGeoError(null);
                }}
                className={`h-8 px-2.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 transition ${
                  simulateOutOfRange
                    ? 'bg-rose-600 text-white'
                    : 'bg-white/15 text-white backdrop-blur-md'
                }`}
                title="Chạm để thử trường hợp ngoài bán kính GPS 100m"
              >
                <Navigation className="w-3 h-3" />
                <span>{simulateOutOfRange ? `Ngoài vùng (${distanceMeters}m)` : `GPS OK (${distanceMeters}m)`}</span>
              </button>

              <span className="h-8 px-2.5 rounded-full bg-white/10 text-white/90 text-[11px] font-medium flex items-center gap-1 backdrop-blur-md">
                <Lock className="w-3 h-3 text-emerald-400" />
                QR Động
              </span>
            </div>

            {/* Khung ngắm QR */}
            <div className="relative z-10 w-44 h-44 border border-white/25 rounded-2xl p-2 flex items-center justify-center">
              <div className="absolute -top-0.5 -left-0.5 w-6 h-6 border-t-[3px] border-l-[3px] border-white rounded-tl-xl" />
              <div className="absolute -top-0.5 -right-0.5 w-6 h-6 border-t-[3px] border-r-[3px] border-white rounded-tr-xl" />
              <div className="absolute -bottom-0.5 -left-0.5 w-6 h-6 border-b-[3px] border-l-[3px] border-white rounded-bl-xl" />
              <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 border-b-[3px] border-r-[3px] border-white rounded-br-xl" />

              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-blue-300 to-transparent animate-scan" />

              {scanState === 'scanning' && (
                <div className="absolute inset-0 bg-[#161891]/40 backdrop-blur-[1px] flex flex-col items-center justify-center text-white rounded-2xl">
                  <RefreshCw className="w-7 h-7 animate-spin" />
                  <span className="text-[12px] font-bold mt-2">Đang xác thực GPS...</span>
                </div>
              )}
            </div>

            <div className="relative z-10 text-center text-[12px] text-white/80 font-medium">
              Đưa mã QR của Bí thư vào khung ({activeSession.qrToken})
            </div>
          </div>

          <button
            onClick={handleSimulateScan}
            disabled={scanState === 'scanning' || hasCheckedIn || hasQueuedOffline}
            className="w-full h-12 bg-[#161891] hover:bg-[#0E1068] disabled:opacity-50 text-white font-bold text-[14px] rounded-2xl shadow-sm flex items-center justify-center gap-2 transition active:scale-[0.98]"
          >
            <Camera className="w-4 h-4" />
            <span>
              {hasCheckedIn
                ? 'Đã hoàn thành điểm danh'
                : hasQueuedOffline
                ? 'Đã lưu điểm danh ngoại tuyến'
                : isOffline
                ? 'Quét QR (Lưu cục bộ)'
                : 'Quét mã QR Điểm danh ngay'}
            </span>
          </button>

          {/* Gợi ý Lịch cá nhân */}
          <div className="app-card p-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EEF0FB] text-[#161891] flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-bold text-slate-900">Bận lịch công tác giờ sinh hoạt?</div>
              <p className="text-[12px] text-slate-500 mt-0.5 leading-relaxed">
                Mở Lịch cá nhân để đăng ký khung giờ khác hoặc hoàn thành chuyên đề trực tuyến.
              </p>
              <button
                onClick={() => onNavigate('makeup')}
                className="mt-2 text-[12px] font-bold text-[#161891] flex items-center gap-1"
              >
                <span>Mở Lịch cá nhân</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Tab Lịch sử tham gia */
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[12px] text-slate-500 px-1">
            <span>Đã ghi nhận {attendanceHistory.length} kỳ sinh hoạt</span>
            <span className="text-emerald-700 font-bold">Chuyên cần tốt</span>
          </div>

          {offlineQueue.map((item) => (
            <div
              key={item.id}
              className="bg-amber-50 rounded-2xl p-3.5 border border-amber-300 space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-[14px] font-bold text-slate-900 leading-5">{item.sessionTitle}</h4>
                  <div className="flex items-center gap-1.5 text-[12px] text-slate-600 mt-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-700" />
                    <span>{item.timestamp}</span>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 shrink-0">
                  Chờ đồng bộ
                </span>
              </div>

              <div className="pt-2 border-t border-amber-200 flex items-center justify-between text-[12px]">
                <span className="text-amber-900">{item.typeLabel}</span>
                {!isOffline && (
                  <button
                    onClick={() => {
                      syncOfflineQueue();
                      triggerGlobalToast('Đã đồng bộ dữ liệu ngoại tuyến thành công!');
                    }}
                    className="h-8 px-3 bg-[#161891] text-white font-bold rounded-lg text-[11px]"
                  >
                    Đồng bộ ngay
                  </button>
                )}
              </div>
            </div>
          ))}

          {attendanceHistory.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-xs space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h4 className="text-[14px] font-bold text-slate-900 leading-5">{item.sessionName}</h4>
                  <div className="flex items-center gap-1.5 text-[12px] text-slate-500 mt-1">
                    <Calendar className="w-3.5 h-3.5 text-[#161891]" />
                    <span>{item.date}</span>
                  </div>
                </div>
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                    item.status === 'attended'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-[#EEF0FB] text-[#161891]'
                  }`}
                >
                  {item.badge}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[12px] gap-2">
                <span className="text-slate-500 truncate">{item.type}</span>
                <span className="font-bold text-[#161891] shrink-0">{item.pointsEarned}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Flutter ModalBottomSheet: Kết quả điểm danh */}
      {modalResult && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-[2px] flex items-end justify-center animate-fade-in">
          <div className="bg-white w-full max-w-[390px] rounded-t-[28px] p-5 pb-7 shadow-2xl space-y-4 animate-sheet-up">
            <div className="w-10 h-1 rounded-full bg-slate-300 mx-auto" />

            <div className="text-center space-y-2">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto ${
                  modalResult.offline ? 'bg-amber-100 text-amber-700' : 'bg-[#EEF0FB] text-[#161891]'
                }`}
              >
                {modalResult.offline ? <WifiOff className="w-7 h-7" /> : <CheckCircle2 className="w-8 h-8" />}
              </div>

              <h3 className="text-[18px] font-extrabold text-slate-900">
                {modalResult.offline ? 'Đã lưu điểm danh cục bộ' : 'Điểm danh thành công'}
              </h3>
              <p className="text-[13px] text-slate-600 leading-relaxed">
                {modalResult.offline
                  ? 'Hệ thống sẽ tự động đồng bộ và cộng +10 điểm khi có kết nối mạng trở lại.'
                  : `Đã ghi nhận có mặt của ${currentMember.name} tại Nhà văn hóa KP5.`}
              </p>
            </div>

            <div className="bg-[#F5F7FB] p-3.5 rounded-2xl text-[13px] space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Thời gian</span>
                <strong className="text-slate-900 font-mono">{modalResult.timestamp}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Định vị GPS</span>
                <strong className="text-emerald-700">NVH KP5 ({modalResult.distanceMeters}m)</strong>
              </div>
              {!modalResult.offline && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Điểm tích lũy</span>
                  <strong className="text-[#161891] font-extrabold">+10đ ({userPoints} đ)</strong>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  setModalResult(null);
                  setTab('history');
                }}
                className="w-full h-12 bg-[#161891] hover:bg-[#0E1068] text-white font-bold rounded-xl text-[14px] transition"
              >
                Hoàn tất & Xem lịch sử
              </button>

              {onNavigateSocial && (
                <button
                  onClick={() => {
                    setPreselectedSocialEvent({
                      eventTag: activeSession.title,
                      imageUrl: SOCIAL_EVENT_PRESETS[2].imageUrl,
                      defaultContent: `Vừa hoàn thành điểm danh QR 2 lớp tại buổi "${activeSession.title}" cùng anh chị em Chi đoàn Khu phố 5!`,
                    });
                    setModalResult(null);
                    onNavigateSocial();
                  }}
                  className="w-full h-11 bg-[#EEF0FB] text-[#161891] font-bold rounded-xl text-[13px] flex items-center justify-center gap-2 transition"
                >
                  <Newspaper className="w-4 h-4" />
                  <span>Chia sẻ ảnh lên Bảng tin Social</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
