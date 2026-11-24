import React from 'react';
import logoUrl from '../assets/doantn.png';
import { ArrowLeft, Bell, LogOut, Wifi, WifiOff, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Header({
  title,
  subtitle,
  showBack,
  onBack,
  currentRole,
  onOpenNotification,
  onOpenAdmin,
  onLogout
}) {
  const { isOffline, setIsOffline, offlineQueue, notifications } = useApp();

  const roleNotifications = notifications[currentRole] || [];
  const unreadCount = roleNotifications.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shrink-0 select-none">
      {/* OS Status Bar (44dp) */}
      <div className="h-11 px-5 flex items-center justify-between bg-white text-slate-900">
        <span className="text-[13px] font-bold tracking-tight tabular-nums">09:41</span>

        {/* Dynamic Island Cutout (Preview trên Desktop) */}
        <div
          className="hidden sm:block w-[92px] h-[24px] bg-[#0B0F19] rounded-full"
          aria-hidden="true"
        />

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsOffline(!isOffline)}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold transition active:scale-95 ${
              isOffline
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-[#EEF0FB] text-[#161891]'
            }`}
            title="Chạm để mô phỏng trạng thái mạng 5G / Ngoại tuyến"
          >
            {isOffline ? (
              <>
                <WifiOff className="w-3 h-3" />
                <span>Offline{offlineQueue.length > 0 ? ` (${offlineQueue.length})` : ''}</span>
              </>
            ) : (
              <>
                <Wifi className="w-3 h-3" />
                <span>5G</span>
              </>
            )}
          </button>

          {/* Battery Indicator SVG */}
          <div className="flex items-center gap-0.5" aria-hidden="true">
            <div className="w-5 h-2.5 border border-slate-700 rounded-[3px] p-[1.5px] flex items-center">
              <div className="h-full bg-slate-800 w-4/5 rounded-[1px]"></div>
            </div>
            <div className="w-[2px] h-1 bg-slate-700 rounded-r-sm"></div>
          </div>
        </div>
      </div>

      {/* Flutter AppBar (56dp) */}
      <div className="h-14 px-4 flex items-center justify-between gap-2 bg-white">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {showBack ? (
            <button
              type="button"
              onClick={onBack}
              className="w-10 h-10 -ml-1.5 rounded-full flex items-center justify-center text-slate-800 hover:bg-slate-100 active:scale-95 transition shrink-0"
              aria-label="Quay lại"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <img
              src={logoUrl}
              alt="Logo Đoàn TNCS"
              className="w-9 h-9 rounded-xl bg-white border border-slate-200 object-contain p-0.5 shrink-0"
              aria-hidden="true"
            />
          )}

          <div className="min-w-0 flex-1">
            <h1 className="text-[16px] font-bold text-slate-900 leading-5 truncate tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-[12px] font-medium text-slate-500 leading-4 truncate mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-0.5 shrink-0">
          {onOpenAdmin && (
            <button
              type="button"
              onClick={onOpenAdmin}
              className="w-9 h-9 rounded-full flex items-center justify-center text-slate-600 hover:text-[#161891] hover:bg-[#EEF0FB] transition active:scale-95"
              title="Tài khoản & Bảo mật"
              aria-label="Quản trị và bảo mật"
            >
              <ShieldCheck className="w-[19px] h-[19px]" />
            </button>
          )}

          <button
            type="button"
            onClick={onOpenNotification}
            className="relative w-9 h-9 rounded-full flex items-center justify-center text-slate-600 hover:text-[#161891] hover:bg-[#EEF0FB] transition active:scale-95"
            title="Lịch & Thông báo"
            aria-label="Thông báo Đoàn vụ"
          >
            <Bell className="w-[19px] h-[19px]" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-[#161891] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white tabular-nums">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition active:scale-95"
            title="Đăng xuất"
            aria-label="Đăng xuất"
          >
            <LogOut className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>
    </header>
  );
}
