import React from 'react';
import {
  Home, QrCode, Users, CalendarDays, Newspaper, LayoutGrid
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function BottomNav({ activeTab, onTabChange, currentRole }) {
  const { mySchedule, makeupRequests } = useApp();

  const pendingMakeupCount = makeupRequests.filter((r) => r.status === 'pending').length;

  // Thanh điều hướng 5 mục chuẩn Flutter Material 3 NavigationBar với tab Lịch cá nhân & Tiện ích (Menu)
  const getNavItems = () => {
    if (currentRole === 'secretary') {
      return [
        { id: 'home', label: 'Trang chủ', icon: Home, hasDot: pendingMakeupCount > 0 },
        { id: 'makeup', label: 'Lịch', icon: CalendarDays, hasDot: mySchedule.length > 0 },
        { id: 'qr_action', label: 'Mã QR', icon: QrCode },
        { id: 'social', label: 'Bảng tin', icon: Newspaper },
        { id: 'menu', label: 'Tiện ích', icon: LayoutGrid },
      ];
    } else if (currentRole === 'member') {
      return [
        { id: 'home', label: 'Trang chủ', icon: Home },
        { id: 'makeup', label: 'Lịch', icon: CalendarDays, hasDot: mySchedule.length > 0 },
        { id: 'qr_action', label: 'Quét QR', icon: QrCode },
        { id: 'social', label: 'Bảng tin', icon: Newspaper },
        { id: 'menu', label: 'Tiện ích', icon: LayoutGrid },
      ];
    } else {
      return [
        { id: 'home', label: 'Tổng hợp', icon: Home },
        { id: 'makeup', label: 'Lịch', icon: CalendarDays },
        { id: 'branches', label: 'Chi đoàn', icon: Users },
        { id: 'social', label: 'Bảng tin', icon: Newspaper },
        { id: 'menu', label: 'Tiện ích', icon: LayoutGrid },
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="sticky bottom-0 left-0 right-0 bg-white border-t border-slate-200/80 shadow-mobile z-40 shrink-0 select-none">
      {/* NavigationBar (64dp) */}
      <div className="grid grid-cols-5 h-16 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className="flex flex-col items-center justify-center gap-1 focus:outline-none active:scale-95 transition-transform"
              aria-current={isActive ? 'page' : undefined}
            >
              <div
                className={`relative w-12 h-7 rounded-full flex items-center justify-center transition-colors ${
                  isActive
                    ? 'bg-[#161891] text-white'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-[19px] h-[19px]" strokeWidth={isActive ? 2.3 : 1.9} />
                {item.hasDot && !isActive && (
                  <span className="absolute top-1 right-2.5 w-2 h-2 rounded-full bg-[#161891] ring-2 ring-white" />
                )}
              </div>
              <span
                className={`text-[11px] leading-3 tracking-tight whitespace-nowrap ${
                  isActive ? 'font-bold text-[#161891]' : 'font-medium text-slate-500'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* System Gesture Home Indicator (16dp Safe Area) */}
      <div className="h-4 flex items-center justify-center bg-white" aria-hidden="true">
        <div className="w-32 h-1 rounded-full bg-slate-300/90" />
      </div>
    </nav>
  );
}
