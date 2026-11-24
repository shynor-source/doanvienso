import React, { useState } from 'react';
import logoUrl from '../assets/doantn.png';
import {
  Home, CalendarDays, QrCode, Newspaper, Award, Users, History,
  FileSpreadsheet, Building2, Trophy, Bell, ShieldCheck, Search,
  ChevronDown, ChevronRight, Layers, LogOut, Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INITIAL_BRANCH_DATA } from '../data/mockData';

export default function Screen10UtilitiesMenu({
  currentRole,
  onNavigateScreen,
  onOpenRoleModal,
  onOpenNotification,
  onOpenAdmin,
  onLogout,
}) {
  const { currentMember, userPoints, mySchedule, members, socialPosts, volunteerActivities } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [openGroup, setOpenGroup] = useState('phongtrao'); // 'phongtrao' | 'quanly' | 'hethong' | null

  const profileInfo =
    currentRole === 'secretary'
      ? {
          name: INITIAL_BRANCH_DATA.secretary.name,
          subtitle: 'Bí thư Chi đoàn • Khu phố 5',
          avatar: INITIAL_BRANCH_DATA.secretary.avatar,
          badge: `${members.length} ĐV`,
        }
      : currentRole === 'ward_officer'
      ? {
          name: 'Phan Thị Bích Thảo',
          subtitle: 'Cán bộ Đoàn • Phường Tam Hiệp',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
          badge: '12 Chi đoàn',
        }
      : {
          name: currentMember.name,
          subtitle: `Đoàn viên • ${currentMember.branchName}`,
          avatar: currentMember.avatar,
          badge: `${userPoints} đ`,
        };

  const allShortcuts = [
    {
      id: 'home',
      label: 'Trang chủ',
      sub: 'Tổng quan hoạt động',
      icon: Home,
      color: 'bg-[#EEF0FB] text-[#161891]',
      action: () => onNavigateScreen(currentRole === 'ward_officer' ? 'ward_dash' : 'home'),
    },
    {
      id: 'schedule',
      label: 'Lịch hoạt động cá nhân',
      sub: `${mySchedule.length} sự kiện đã đăng ký`,
      icon: CalendarDays,
      color: 'bg-sky-50 text-sky-700',
      action: () => onNavigateScreen('makeup'),
    },
    {
      id: 'qr',
      label: currentRole === 'secretary' ? 'Mã QR Điểm danh' : 'Quét QR Điểm danh',
      sub: 'Xác thực 2 lớp GPS',
      icon: QrCode,
      color: 'bg-indigo-50 text-[#161891]',
      action: () => onNavigateScreen(currentRole === 'secretary' ? 'create_qr' : 'scan_qr'),
    },
    {
      id: 'social',
      label: 'Bảng tin Đoàn viên',
      sub: `${socialPosts.length} bài viết sự kiện`,
      icon: Newspaper,
      color: 'bg-blue-50 text-blue-700',
      action: () => onNavigateScreen('social'),
    },
    {
      id: 'rewards',
      label: 'Thi đua & Đổi quà',
      sub: `${volunteerActivities.length} phong trào mới`,
      icon: Award,
      color: 'bg-amber-50 text-amber-700',
      action: () => onNavigateScreen('rewards'),
    },
    {
      id: 'members',
      label: 'Hồ sơ & Danh bạ',
      sub: `${members.length} hồ sơ • Chuyển SH`,
      icon: Users,
      color: 'bg-emerald-50 text-emerald-700',
      action: () => onNavigateScreen('members'),
    },
    {
      id: 'history',
      label: 'Lịch sử tham gia',
      sub: 'Điểm rèn luyện cá nhân',
      icon: History,
      color: 'bg-violet-50 text-violet-700',
      action: () => onNavigateScreen('history'),
    },
    {
      id: 'reports',
      label: 'Báo cáo & Thống kê',
      sub: 'Tổng hợp Excel / PDF',
      icon: FileSpreadsheet,
      color: 'bg-cyan-50 text-cyan-700',
      action: () => onNavigateScreen(currentRole === 'ward_officer' ? 'ward_reports' : 'reports'),
    },
    {
      id: 'branches',
      label: 'Quản lý 12 Chi đoàn',
      sub: 'Theo dõi cấp Phường/Xã',
      icon: Building2,
      color: 'bg-teal-50 text-teal-700',
      action: () => onNavigateScreen('ward_branches'),
    },
    {
      id: 'ward_rank',
      label: 'Xếp hạng Chi đoàn',
      sub: 'Thi đua toàn Phường',
      icon: Trophy,
      color: 'bg-orange-50 text-orange-700',
      action: () => onNavigateScreen('ward_rewards'),
    },
  ];

  const q = searchQuery.trim().toLowerCase();
  const filteredShortcuts = allShortcuts.filter(
    (item) =>
      !q ||
      item.label.toLowerCase().includes(q) ||
      item.sub.toLowerCase().includes(q)
  );

  return (
    <div className="p-4 space-y-4 pb-8">
      {/* Thẻ Tài khoản phong cách Facebook Menu */}
      <div className="app-card p-3.5 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-12 h-12 rounded-full border border-slate-200 bg-white flex items-center justify-center shrink-0">
              <img src={logoUrl} alt="Logo" className="w-full h-full object-contain p-1" />
            </div>
            <div className="min-w-0">
              <h2 className="text-[15px] font-bold text-slate-900 truncate">{profileInfo.name}</h2>
              <p className="text-[12px] text-slate-500 truncate">{profileInfo.subtitle}</p>
            </div>
          </div>

          <span className="px-2.5 py-1 bg-[#EEF0FB] text-[#161891] text-[12px] font-extrabold rounded-full shrink-0 tabular-nums">
            {profileInfo.badge}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onOpenRoleModal}
            className="h-9 px-3 bg-[#F5F7FB] hover:bg-slate-200/70 text-slate-800 text-[12px] font-bold rounded-xl flex items-center justify-center gap-1.5 transition"
          >
            <Layers className="w-3.5 h-3.5 text-[#161891]" />
            <span>Đổi vai trò</span>
          </button>
          <button
            type="button"
            onClick={onOpenAdmin}
            className="h-9 px-3 bg-[#EEF0FB] hover:bg-[#E1E4F8] text-[#161891] text-[12px] font-bold rounded-xl flex items-center justify-center gap-1.5 transition"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Tài khoản & Quyền</span>
          </button>
        </div>
      </div>

      {/* Tìm kiếm nhanh tiện ích */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm tiện ích, chức năng ứng dụng..."
          className="w-full h-11 pl-10 pr-4 bg-white border border-slate-200 rounded-2xl text-[13px] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#161891]"
        />
      </div>

      {/* Grid Lối tắt Tất cả Tiện ích (2 cột chuẩn Super-App) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-0.5">
          <h3 className="text-[14px] font-bold text-slate-900">Tất cả lối tắt tiện ích</h3>
          <span className="text-[12px] text-slate-500 font-medium">{filteredShortcuts.length} mục</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {filteredShortcuts.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={item.action}
                className="app-card p-3.5 text-left hover:border-[#161891]/35 active:scale-[0.98] transition flex flex-col justify-between min-h-[96px]"
              >
                <div className={`w-9 h-9 rounded-xl ${item.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="mt-2.5">
                  <div className="text-[13px] font-bold text-slate-900 leading-4 truncate">
                    {item.label}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">{item.sub}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Nhóm Tiện ích Mở rộng (Dễ dàng bổ sung module sau này) */}
      <div className="app-card overflow-hidden divide-y divide-slate-100">
        <div>
          <button
            type="button"
            onClick={() => setOpenGroup(openGroup === 'phongtrao' ? null : 'phongtrao')}
            className="w-full p-4 flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#EEF0FB] text-[#161891] flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[14px] font-bold text-slate-900">Phong trào & Hoạt động</div>
                <div className="text-[12px] text-slate-500">Lịch cá nhân, Chuyên đề, Ví quà</div>
              </div>
            </div>
            {openGroup === 'phongtrao' ? (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-400" />
            )}
          </button>
          {openGroup === 'phongtrao' && (
            <div className="px-4 pb-3 space-y-1.5">
              <button
                type="button"
                onClick={() => onNavigateScreen('makeup')}
                className="w-full h-10 px-3 bg-[#F5F7FB] rounded-xl text-[13px] font-semibold text-slate-800 flex items-center justify-between"
              >
                <span>Lịch hoạt động & Đăng ký chuyên đề</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
              <button
                type="button"
                onClick={() => onNavigateScreen('rewards')}
                className="w-full h-10 px-3 bg-[#F5F7FB] rounded-xl text-[13px] font-semibold text-slate-800 flex items-center justify-between"
              >
                <span>Hoạt động Tình nguyện & Ví Voucher</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          )}
        </div>

        <div>
          <button
            type="button"
            onClick={() => setOpenGroup(openGroup === 'hethong' ? null : 'hethong')}
            className="w-full p-4 flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[14px] font-bold text-slate-900">Thông báo & Hệ thống</div>
                <div className="text-[12px] text-slate-500">Hộp thư nhắc lịch, sao lưu dữ liệu</div>
              </div>
            </div>
            {openGroup === 'hethong' ? (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-400" />
            )}
          </button>
          {openGroup === 'hethong' && (
            <div className="px-4 pb-3 space-y-1.5">
              <button
                type="button"
                onClick={onOpenNotification}
                className="w-full h-10 px-3 bg-[#F5F7FB] rounded-xl text-[13px] font-semibold text-slate-800 flex items-center justify-between"
              >
                <span>Hộp thư Thông báo & Lịch sắp tới</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
              <button
                type="button"
                onClick={onOpenAdmin}
                className="w-full h-10 px-3 bg-[#F5F7FB] rounded-xl text-[13px] font-semibold text-slate-800 flex items-center justify-between"
              >
                <span>Phân quyền, Nhật ký & Sao lưu JSON</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Nút Đăng xuất */}
      <button
        type="button"
        onClick={onLogout}
        className="w-full h-11 bg-white border border-slate-200 hover:bg-rose-50 hover:border-rose-200 text-slate-700 hover:text-rose-700 font-bold text-[13px] rounded-2xl flex items-center justify-center gap-2 transition"
      >
        <LogOut className="w-4 h-4" />
        <span>Đăng xuất khỏi tài khoản</span>
      </button>
    </div>
  );
}
