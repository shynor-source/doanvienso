import React, { useState, useEffect } from 'react';
import {
  QrCode, RefreshCw, Share2, Copy, Check, Users, Shield,
  MapPin, Calendar, ToggleLeft, ToggleRight, Sparkles,
  PlusCircle, UserCheck, CheckCircle2, Archive, ShieldAlert
} from 'lucide-react';
import { useApp } from '../context/AppContext';

function buildDynamicQRCells(seed = 1, token = '') {
  const cells = [];
  const hashSeed =
    seed * 31 +
    token.split('').reduce((acc, ch, idx) => acc + ch.charCodeAt(0) * (idx + 3), 0);

  for (let row = 0; row < 11; row++) {
    for (let col = 0; col < 11; col++) {
      const inTopLeft = row < 4 && col < 4;
      const inTopRight = row < 4 && col >= 7;
      const inBottomLeft = row >= 7 && col < 4;
      const inCenterLogo = row >= 4 && row <= 6 && col >= 4 && col <= 6;
      if (inTopLeft || inTopRight || inBottomLeft || inCenterLogo) continue;

      const val = (hashSeed + row * 17 + col * 29 + row * col * 7) % 5;
      if (val === 0 || val === 2 || val === 4) {
        cells.push({
          key: `${row}-${col}`,
          x: 6 + col * 8,
          y: 6 + row * 8,
          fill: '#161891',
        });
      }
    }
  }
  return cells;
}

export default function Screen3CreateSessionQR() {
  const {
    activeSession,
    updateActiveSession,
    rotateQRToken,
    members,
    scannedMemberIds,
    scannedCount,
    markManualAttendance,
    sessionArchive,
    isOffline,
    triggerGlobalToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState('qr'); // 'qr' | 'summoned' | 'manual' | 'archive' | 'create'
  const [summonedFilter, setSummonedFilter] = useState('all'); // 'all' | 'present' | 'absent'
  const [exceptionReason, setExceptionReason] = useState('Điện thoại hết pin tại buổi họp');
  const [archivePeriod, setArchivePeriod] = useState('month'); // 'month' | 'quarter' | 'year'

  const [formState, setFormState] = useState({
    title: activeSession.title,
    date: activeSession.date,
    location: activeSession.location,
    format: activeSession.format || 'hybrid',
    refreshSeconds: activeSession.refreshSeconds || 60,
    geofenceRequired: activeSession.geofenceRequired !== false,
    allowShiftCatchup: activeSession.allowShiftCatchup !== false,
  });

  const [countdown, setCountdown] = useState(activeSession.refreshSeconds || 60);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCountdown(activeSession.refreshSeconds || 60);
  }, [activeSession.refreshSeconds, activeSession.qrToken]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          rotateQRToken();
          return activeSession.refreshSeconds || 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [activeSession.refreshSeconds, rotateQRToken]);

  const handleCopyLink = async () => {
    const link = `${window.location.origin}/?checkin=${activeSession.qrToken}`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(link);
      }
    } catch {
      // Fallback
    }
    setCopied(true);
    triggerGlobalToast(`Đã sao chép link điểm danh (${activeSession.qrToken})!`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefreshQR = () => {
    rotateQRToken();
    setCountdown(activeSession.refreshSeconds || 60);
    triggerGlobalToast('Đã sinh mã QR động mới chống chụp ảnh điểm danh hộ!');
  };

  const handleSaveNewSession = (e) => {
    e.preventDefault();
    updateActiveSession(formState, true);
    setActiveTab('qr');
    triggerGlobalToast('Đã khởi tạo buổi sinh hoạt mới & triệu tập đoàn viên Chi đoàn KP5!');
  };

  // Danh sách triệu tập (loại trừ ĐV chuyển SH / nghĩa vụ)
  const summonedMembers = members.filter((m) => m.type !== 'transferred');
  const exemptMembers = members.filter((m) => m.type === 'transferred');
  const localAttendedCount = summonedMembers.filter(
    (m) => m.type === 'local' && scannedMemberIds.includes(m.id)
  ).length;
  const workingFarAttendedCount = summonedMembers.filter(
    (m) => m.type === 'working_far' && scannedMemberIds.includes(m.id)
  ).length;

  const filteredSummoned = summonedMembers.filter((m) => {
    const isPresent = scannedMemberIds.includes(m.id);
    if (summonedFilter === 'present') return isPresent;
    if (summonedFilter === 'absent') return !isPresent;
    return true;
  });

  const qrCells = buildDynamicQRCells(activeSession.qrSeed || 1, activeSession.qrToken || '');
  const refreshDuration = activeSession.refreshSeconds || 60;
  const countdownPct = Math.max(0, Math.min(100, Math.round((countdown / refreshDuration) * 100)));

  return (
    <div className="p-4 space-y-4 pb-8">
      {/* Thanh Chip Tab cuộn ngang chuẩn Mobile */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5">
        {[
          { id: 'qr', label: 'Mã QR', icon: QrCode },
          { id: 'summoned', label: 'Triệu tập', icon: Users },
          { id: 'manual', label: 'Ngoại lệ', icon: UserCheck },
          { id: 'archive', label: 'Lưu trữ', icon: Archive },
          { id: 'create', label: 'Tạo mới', icon: PlusCircle },
        ].map((t) => {
          const Icon = t.icon;
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`h-10 px-3.5 rounded-xl text-[12px] font-bold transition flex items-center gap-1.5 shrink-0 ${
                active
                  ? 'bg-[#161891] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-[#161891]/40'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab === 'create' && (
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 bg-[#EEF0FB] text-[#161891] rounded-xl flex items-center justify-center shrink-0">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-slate-900">Tạo Buổi Sinh hoạt mới</h3>
              <p className="text-[12px] text-slate-500">
                Triệu tập {summonedMembers.length} ĐV (Miễn {exemptMembers.length} chuyển SH)
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveNewSession} className="space-y-3">
            <div>
              <label className="block text-[12px] font-semibold text-slate-700 mb-1">
                Chủ đề sinh hoạt
              </label>
              <input
                type="text"
                required
                value={formState.title}
                onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-[13px] text-slate-900 focus:outline-none focus:border-[#161891]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">
                  Thời gian
                </label>
                <input
                  type="text"
                  required
                  value={formState.date}
                  onChange={(e) => setFormState({ ...formState, date: e.target.value })}
                  className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-[13px] text-slate-900"
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">
                  Hình thức
                </label>
                <select
                  value={formState.format}
                  onChange={(e) => setFormState({ ...formState, format: e.target.value })}
                  className="w-full h-11 px-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[13px] text-slate-900"
                >
                  <option value="direct">Trực tiếp tại NVH</option>
                  <option value="hybrid">Kết hợp Trực tuyến</option>
                  <option value="online">Trực tuyến 100%</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-slate-700 mb-1">
                Địa điểm tổ chức
              </label>
              <input
                type="text"
                required
                value={formState.location}
                onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-[13px] text-slate-900"
              />
            </div>

            <div className="bg-[#F5F7FB] p-3.5 rounded-xl border border-slate-200/80 space-y-3">
              <span className="font-bold text-slate-800 flex items-center gap-1.5 text-[13px]">
                <Shield className="w-4 h-4 text-[#161891]" />
                Bảo mật QR Động & Định vị GPS
              </span>

              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800 block text-[12px]">Chu kỳ đổi mã QR</span>
                  <span className="text-[11px] text-slate-500">Chống điểm danh hộ</span>
                </div>
                <div className="flex gap-1.5">
                  {[30, 60, 90].map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => setFormState({ ...formState, refreshSeconds: sec })}
                      className={`h-8 px-2.5 rounded-lg text-[12px] font-bold transition tabular-nums ${
                        formState.refreshSeconds === sec
                          ? 'bg-[#161891] text-white'
                          : 'bg-white border border-slate-200 text-slate-600'
                      }`}
                    >
                      {sec}s
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                <div>
                  <span className="font-semibold text-slate-800 block text-[12px]">Geofencing GPS</span>
                  <span className="text-[11px] text-slate-500">Bán kính hợp lệ 100m</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormState({ ...formState, geofenceRequired: !formState.geofenceRequired })}
                >
                  {formState.geofenceRequired ? (
                    <ToggleRight className="w-8 h-8 text-[#161891]" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-slate-400" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-[#161891] hover:bg-[#0E1068] text-white font-bold rounded-xl shadow-sm flex items-center justify-center gap-2 text-[14px]"
            >
              <QrCode className="w-4 h-4" />
              <span>Khởi tạo buổi họp & Sinh mã QR</span>
            </button>
          </form>
        </div>
      )}

      {activeTab === 'summoned' && (
        <div className="space-y-3">
          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-slate-900">Danh sách Triệu tập</h3>
              <span className="text-[12px] font-bold bg-[#EEF0FB] text-[#161891] px-2.5 py-0.5 rounded-full tabular-nums">
                {scannedCount}/{summonedMembers.length} có mặt
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setSummonedFilter('all')}
                className={`h-10 rounded-xl text-[12px] font-bold border transition ${
                  summonedFilter === 'all'
                    ? 'bg-[#161891] text-white border-[#161891]'
                    : 'bg-[#F5F7FB] text-slate-700 border-slate-200'
                }`}
              >
                Tất cả ({summonedMembers.length})
              </button>
              <button
                onClick={() => setSummonedFilter('present')}
                className={`h-10 rounded-xl text-[12px] font-bold border transition ${
                  summonedFilter === 'present'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-[#F5F7FB] text-emerald-700 border-slate-200'
                }`}
              >
                Có mặt ({scannedCount})
              </button>
              <button
                onClick={() => setSummonedFilter('absent')}
                className={`h-10 rounded-xl text-[12px] font-bold border transition ${
                  summonedFilter === 'absent'
                    ? 'bg-rose-600 text-white border-rose-600'
                    : 'bg-[#F5F7FB] text-rose-700 border-slate-200'
                }`}
              >
                Vắng ({Math.max(0, summonedMembers.length - scannedCount)})
              </button>
            </div>
            <p className="text-[12px] text-slate-500">
              Miễn triệu tập {exemptMembers.length} đoàn viên đang chuyển sinh hoạt / nghĩa vụ quân sự.
            </p>
          </div>

          <div className="space-y-2">
            {filteredSummoned.map((m) => {
              const isPresent = scannedMemberIds.includes(m.id);
              return (
                <div
                  key={m.id}
                  className="bg-white p-3.5 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-2.5"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-[14px] font-bold text-slate-900 truncate">{m.name}</div>
                    <div className="text-[12px] text-slate-500 truncate mt-0.5">
                      {m.memberCode} • {m.workplace} ({m.shift})
                    </div>
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
                      isPresent ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {isPresent ? 'Có mặt' : 'Chưa dự'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'manual' && (
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-[#EEF0FB] text-[#161891] rounded-xl flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-slate-900">Điểm danh Ngoại lệ</h3>
                <p className="text-[12px] text-slate-500">
                  {isOffline ? 'Ngoại tuyến: Lưu cục bộ' : 'Xác nhận ĐV không quét được QR'}
                </p>
              </div>
            </div>
            <span className="text-[12px] font-bold bg-[#EEF0FB] text-[#161891] px-2.5 py-1 rounded-full tabular-nums shrink-0">
              {scannedCount}/{summonedMembers.length}
            </span>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-slate-700 mb-1">
              Lý do xác nhận ngoại lệ
            </label>
            <select
              value={exceptionReason}
              onChange={(e) => setExceptionReason(e.target.value)}
              className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-medium text-slate-800"
            >
              <option value="Điện thoại hết pin tại buổi họp">Điện thoại hết pin tại buổi họp</option>
              <option value="Khu vực sóng yếu không tải được camera">Khu vực sóng yếu không tải được camera</option>
              <option value="Đoàn viên quên mang điện thoại thông minh">Đoàn viên quên mang điện thoại thông minh</option>
              <option value="Tham gia trực dân quân / công tác đột xuất">Tham gia trực dân quân / công tác đột xuất</option>
            </select>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto pr-0.5">
            {summonedMembers.map((m) => {
              const isPresent = scannedMemberIds.includes(m.id);
              return (
                <div
                  key={m.id}
                  className="p-3 rounded-xl border border-slate-200/80 bg-[#F5F7FB] flex items-center justify-between gap-2.5"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-bold text-slate-900 truncate">{m.name}</div>
                    <div className="text-[12px] text-slate-500 truncate">
                      {m.workplace} • {m.shift}
                    </div>
                  </div>
                  {isPresent ? (
                    <span className="text-[12px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Có mặt
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        const res = markManualAttendance(m.id, exceptionReason);
                        if (res.ok) {
                          triggerGlobalToast(
                            res.offline
                              ? `Đã lưu xác nhận ngoại lệ cho ${m.name} (Offline)!`
                              : `Đã xác nhận điểm danh ngoại lệ cho ${m.name} (+10đ)!`
                          );
                        }
                      }}
                      className="h-9 px-3 bg-[#161891] hover:bg-[#0E1068] text-white text-[12px] font-bold rounded-xl shrink-0"
                    >
                      Xác nhận
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'archive' && (
        <div className="space-y-3">
          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-slate-900">Lưu trữ Lịch sử 2026</h3>
              <span className="text-[12px] font-bold text-[#161891]">{sessionArchive.length} kỳ</span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-xl">
              {[
                { id: 'month', label: 'Tháng' },
                { id: 'quarter', label: 'Quý' },
                { id: 'year', label: 'Năm 2026' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setArchivePeriod(p.id)}
                  className={`h-9 rounded-lg text-[12px] font-bold transition ${
                    archivePeriod === p.id ? 'bg-white text-[#161891] shadow-xs' : 'text-slate-600'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {archivePeriod === 'quarter' ? (
            <div className="space-y-2.5">
              {['Quý IV/2026', 'Quý III/2026', 'Quý II/2026', 'Quý I/2026'].map((q) => {
                const items = sessionArchive.filter((s) => s.quarter === q);
                const avg = items.length
                  ? (items.reduce((acc, it) => acc + parseFloat(it.rate), 0) / items.length).toFixed(1)
                  : '0';
                return (
                  <div
                    key={q}
                    className="bg-white p-4 rounded-2xl border border-slate-200/90 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-[14px] font-bold text-[#161891]">{q}</div>
                      <div className="text-[12px] text-slate-500 mt-0.5">{items.length} kỳ sinh hoạt định kỳ</div>
                    </div>
                    <div className="text-[18px] font-extrabold text-slate-900 tabular-nums">{avg}%</div>
                  </div>
                );
              })}
            </div>
          ) : archivePeriod === 'year' ? (
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 space-y-3">
              <div className="text-[15px] font-bold text-[#161891]">Tổng kết Năm 2026 — Chi đoàn KP5</div>
              <div className="grid grid-cols-2 gap-2.5 text-center">
                <div className="p-3.5 bg-[#F5F7FB] rounded-xl">
                  <div className="text-[20px] font-extrabold text-[#161891] tabular-nums">{sessionArchive.length} kỳ</div>
                  <div className="text-[12px] text-slate-600 mt-0.5">Đã lưu trữ</div>
                </div>
                <div className="p-3.5 bg-[#EEF0FB] rounded-xl">
                  <div className="text-[20px] font-extrabold text-[#161891] tabular-nums">70.9%</div>
                  <div className="text-[12px] text-slate-600 mt-0.5">Chuyên cần năm</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              {sessionArchive.map((arc) => (
                <div
                  key={arc.id}
                  className="bg-white p-3.5 rounded-2xl border border-slate-200/90 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <span className="text-[11px] font-bold text-[#161891] bg-[#EEF0FB] px-2.5 py-0.5 rounded-full">
                      {arc.period}
                    </span>
                    <div className="text-[14px] font-bold text-slate-900 mt-1.5 truncate">{arc.title}</div>
                    <div className="text-[12px] text-slate-500 truncate">{arc.location}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[15px] font-extrabold text-[#161891] tabular-nums">{arc.rate}</div>
                    <div className="text-[12px] text-slate-500 tabular-nums">{arc.attended}/{arc.total} ĐV</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'qr' && (
        <>
          {/* Thẻ Thông tin buổi sinh hoạt */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold bg-[#EEF0FB] text-[#161891] px-2.5 py-1 rounded-full">
                Chi đoàn Khu phố 5
              </span>
              <span className="text-[12px] font-bold text-emerald-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Đang mở điểm danh
              </span>
            </div>

            <h2 className="text-[15px] font-bold text-slate-900 leading-5">
              {activeSession.title}
            </h2>
            <div className="space-y-1 text-[13px] text-slate-600">
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

          {/* Thẻ Vé QR Động chuẩn Mobile Pass */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs text-center space-y-4">
            <div className="flex items-center justify-center gap-1.5 text-[12px] font-bold text-[#161891]">
              <Shield className="w-4 h-4" />
              <span>Mã QR Động • Token {activeSession.qrToken}</span>
            </div>

            <div className="w-52 h-52 mx-auto p-3.5 bg-white rounded-2xl border-2 border-[#161891]/20 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <rect x="5" y="5" width="26" height="26" rx="4" fill="#161891" />
                <rect x="9" y="9" width="18" height="18" rx="2" fill="#fff" />
                <rect x="13" y="13" width="10" height="10" rx="1" fill="#161891" />

                <rect x="69" y="5" width="26" height="26" rx="4" fill="#161891" />
                <rect x="73" y="9" width="18" height="18" rx="2" fill="#fff" />
                <rect x="77" y="13" width="10" height="10" rx="1" fill="#161891" />

                <rect x="5" y="69" width="26" height="26" rx="4" fill="#161891" />
                <rect x="9" y="73" width="18" height="18" rx="2" fill="#fff" />
                <rect x="13" y="77" width="10" height="10" rx="1" fill="#161891" />

                {qrCells.map((c) => (
                  <rect key={c.key} x={c.x} y={c.y} width="6" height="6" rx="1" fill={c.fill} />
                ))}

                <circle cx="50" cy="50" r="11" fill="#fff" stroke="#161891" strokeWidth="2" />
                <circle cx="50" cy="50" r="8" fill="#161891" />
              </svg>
            </div>

            <div className="space-y-1.5">
              <div className="text-[13px] font-medium text-slate-600">
                Làm mới tự động sau{' '}
                <strong className="text-[#161891] font-mono tabular-nums">{countdown}s</strong>
              </div>
              <div className="w-44 mx-auto h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#161891] rounded-full transition-all duration-1000"
                  style={{ width: `${countdownPct}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                onClick={handleRefreshQR}
                className="h-10 px-2 bg-[#F5F7FB] hover:bg-slate-200/70 text-slate-800 text-[12px] font-bold rounded-xl flex items-center justify-center gap-1 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Đổi mã</span>
              </button>
              <button
                onClick={handleCopyLink}
                className="h-10 px-2 bg-[#EEF0FB] hover:bg-[#E1E4F8] text-[#161891] text-[12px] font-bold rounded-xl flex items-center justify-center gap-1 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Đã chép' : 'Chép link'}</span>
              </button>
              <button
                onClick={() => triggerGlobalToast(`Đã gửi link & mã ${activeSession.qrToken} vào nhóm Zalo Chi đoàn KP5!`)}
                className="h-10 px-2 bg-[#161891] hover:bg-[#0E1068] text-white text-[12px] font-bold rounded-xl flex items-center justify-center gap-1 transition"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Gửi Zalo</span>
              </button>
            </div>
          </div>

          {/* Tiến độ thời gian thực */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-bold text-slate-900">Tiến độ điểm danh</span>
              <span className="text-[13px] font-extrabold text-[#161891] tabular-nums">
                {scannedCount} / {summonedMembers.length} ĐV ({Math.round((scannedCount / summonedMembers.length) * 100)}%)
              </span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-[#161891] h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (scannedCount / summonedMembers.length) * 100)}%` }}
              />
            </div>

            <div className="flex justify-between text-[12px] text-slate-600 pt-0.5">
              <span>Tại chỗ: {localAttendedCount}/31</span>
              <span className="text-[#161891] font-semibold">Làm ca KCN: {workingFarAttendedCount}/12</span>
            </div>
          </div>

          {/* Toggle ca bù */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-[14px] font-bold text-slate-900">
                <Sparkles className="w-4 h-4 text-[#161891]" />
                <span>Cho phép đăng ký ca bù</span>
              </div>
              <p className="text-[12px] text-slate-500 mt-0.5">
                Đoàn viên ca đêm đăng ký ghép hoặc E-Learning
              </p>
            </div>
            <button
              onClick={() => updateActiveSession({ allowShiftCatchup: !activeSession.allowShiftCatchup })}
              aria-label="Bật tắt cho phép đăng ký ca bù"
            >
              {activeSession.allowShiftCatchup ? (
                <ToggleRight className="w-9 h-9 text-[#161891]" />
              ) : (
                <ToggleLeft className="w-9 h-9 text-slate-400" />
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
