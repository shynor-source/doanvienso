import React from 'react';
import { UserCheck, User, Building2, Check, X, Sparkles, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function RoleSwitcherModal({
  isOpen,
  onClose,
  currentRole,
  onSelectRole,
  activeScreen,
  onJumpToScreen
}) {
  const { resetAppData, triggerGlobalToast } = useApp();

  if (!isOpen) return null;

  const roles = [
    { id: 'secretary', name: 'Bí thư Chi đoàn cơ sở', desc: 'Nguyễn Văn An • Chi đoàn KP5', icon: UserCheck },
    { id: 'member', name: 'Đoàn viên Thanh niên', desc: 'Trần Minh Quân • Chi đoàn KP5', icon: User },
    { id: 'ward_officer', name: 'Cán bộ Đoàn Xã / Phường', desc: 'Phan Thị Bích Thảo • P. Tam Hiệp', icon: Building2 },
  ];

  const isWardScreen = ['ward_dash', 'ward_branches', 'ward_reports', 'ward_rewards'].includes(activeScreen) ||
    (activeScreen === 'home' && currentRole === 'ward_officer');

  const screens = [
    { id: 'login', label: '1. Đăng nhập & Đăng ký', match: activeScreen === 'login' },
    { id: 'home', label: '2. Trang chủ Chi đoàn (Bí thư)', match: activeScreen === 'home' && currentRole === 'secretary' },
    { id: 'create_qr', label: '3. Sinh hoạt, QR & Lưu trữ', match: activeScreen === 'create_qr' },
    { id: 'scan_qr', label: '4. Quét QR & Lịch sử', match: activeScreen === 'scan_qr' },
    { id: 'members', label: '5. Danh bạ Hồ sơ & Chuyển SH', match: activeScreen === 'members' },
    { id: 'ward_dash', label: '6. Tổng hợp Xã & Báo cáo', match: isWardScreen },
    { id: 'makeup', label: '7. Lịch hoạt động cá nhân', match: activeScreen === 'makeup' },
    { id: 'rewards', label: '8. Thi đua, Huy hiệu & Đổi quà', match: activeScreen === 'rewards' },
    { id: 'social', label: '9. Bảng tin Sự kiện Đoàn', match: activeScreen === 'social' },
    { id: 'menu', label: '10. Menu Tiện ích (Super-App)', match: activeScreen === 'menu' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-[2px] flex items-end justify-center animate-fade-in">
      <div className="bg-white rounded-t-[28px] p-5 pb-7 max-w-[390px] w-full shadow-2xl space-y-4 max-h-[86dvh] overflow-y-auto animate-sheet-up">
        <div className="w-10 h-1 rounded-full bg-slate-300 mx-auto" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-[#161891] text-white rounded-xl flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-slate-900">Đổi góc nhìn vai trò</h3>
              <p className="text-[12px] text-slate-500">Chuyển đổi nhanh 3 nhóm người dùng</p>
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

        {/* Chuyển Vai Trò */}
        <div className="space-y-2">
          <span className="text-[12px] font-bold text-slate-600 block">
            1. Vai trò tài khoản
          </span>
          {roles.map((r) => {
            const Icon = r.icon;
            const isSelected = currentRole === r.id;
            return (
              <button
                key={r.id}
                onClick={() => {
                  onSelectRole(r.id);
                  onClose();
                }}
                className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition ${
                  isSelected ? 'border-[#161891] bg-[#F4F5FC]' : 'border-slate-200 hover:bg-[#F5F7FB]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-[#161891] text-white' : 'bg-[#EEF0FB] text-[#161891]'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] font-bold text-slate-900 truncate">{r.name}</div>
                    <div className="text-[12px] text-slate-500 truncate">{r.desc}</div>
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-[#161891] shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Nhảy Trực Tiếp Màn Hình */}
        <div className="space-y-1.5">
          <span className="text-[12px] font-bold text-slate-600 block">
            2. Lối tắt các màn hình Flutter
          </span>
          {screens.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                onJumpToScreen(s.id);
                onClose();
              }}
              className={`w-full h-10 px-3.5 rounded-xl text-left text-[13px] transition flex items-center justify-between ${
                s.match
                  ? 'bg-[#161891] text-white font-bold'
                  : 'bg-[#F5F7FB] hover:bg-slate-200/70 text-slate-800 font-medium'
              }`}
            >
              <span>{s.label}</span>
              {s.match && <Check className="w-4 h-4" />}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            resetAppData();
            triggerGlobalToast('Đã khôi phục toàn bộ dữ liệu gốc!');
            onClose();
          }}
          className="w-full h-10 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 rounded-xl text-[12px] font-bold flex items-center justify-center gap-1.5 transition"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Khôi phục dữ liệu mặc định</span>
        </button>
      </div>
    </div>
  );
}
