import React, { useState } from 'react';
import logoUrl from '../assets/doantn.png';
import {
  UserCheck, User, Building2, ArrowRight, ShieldCheck, Smartphone,
  CheckCircle2, UserPlus, KeyRound, Wifi, WifiOff
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Screen1RoleLogin({ onSelectRole }) {
  const { registerNewAccount, isOffline, setIsOffline, triggerGlobalToast } = useApp();

  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [selectedRole, setSelectedRole] = useState('secretary');
  const [phoneNumber, setPhoneNumber] = useState('0912.345.678');
  const [otpCode, setOtpCode] = useState('2603');
  const [showOtpStep, setShowOtpStep] = useState(false);

  const [regForm, setRegForm] = useState({
    name: '',
    phone: '',
    memberCode: 'ĐV-DN-047',
    joinDate: '26/03/2024',
    occupation: 'Công nhân sản xuất KCN',
    workplace: 'KCN Biên Hòa 2',
    branchName: 'Chi đoàn Khu phố 5',
  });

  const roles = [
    {
      id: 'secretary',
      title: 'Bí thư Chi đoàn cơ sở',
      subtitle: 'Nguyễn Văn An • Chi đoàn Khu phố 5',
      desc: 'Tạo sinh hoạt, phát mã QR động, quản lý hồ sơ và xét duyệt lịch',
      icon: UserCheck,
      samplePhone: '0912.345.678',
    },
    {
      id: 'member',
      title: 'Đoàn viên Thanh niên',
      subtitle: 'Trần Minh Quân • Chi đoàn Khu phố 5',
      desc: 'Quét QR 1 chạm, quản lý lịch cá nhân và đăng ký sự kiện',
      icon: User,
      samplePhone: '0981.112.233',
    },
    {
      id: 'ward_officer',
      title: 'Cán bộ Đoàn Xã / Phường',
      subtitle: 'Phan Thị Bích Thảo • Đoàn Phường Tam Hiệp',
      desc: 'Giám sát 12 chi đoàn, phát động sự kiện và xuất báo cáo',
      icon: Building2,
      samplePhone: '0908.123.999',
    },
  ];

  const handleSelectRole = (roleId) => {
    setSelectedRole(roleId);
    const target = roles.find((r) => r.id === roleId);
    if (target) setPhoneNumber(target.samplePhone);
  };

  const handleLogin = () => {
    onSelectRole(selectedRole);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!regForm.name.trim() || !regForm.phone.trim()) return;
    registerNewAccount({
      ...regForm,
      type: regForm.occupation.toLowerCase().includes('kcn') ? 'working_far' : 'local',
      shift: 'Ca ngày',
    });
    triggerGlobalToast(`Đăng ký & xác thực tài khoản "${regForm.name}" thành công!`);
    setSelectedRole('member');
    setPhoneNumber(regForm.phone);
    setAuthMode('login');
    onSelectRole('member');
  };

  return (
    <div className="min-h-full flex flex-col bg-white select-none">
      {/* OS Status Bar (44dp) */}
      <div className="h-11 px-5 flex items-center justify-between bg-white text-slate-900 shrink-0">
        <span className="text-[13px] font-bold tracking-tight tabular-nums">09:41</span>
        <div
          className="hidden sm:block w-[92px] h-[24px] bg-[#0B0F19] rounded-full"
          aria-hidden="true"
        />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsOffline(!isOffline)}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold transition ${
              isOffline ? 'bg-amber-100 text-amber-900' : 'bg-[#EEF0FB] text-[#161891]'
            }`}
          >
            {isOffline ? <WifiOff className="w-3 h-3" /> : <Wifi className="w-3 h-3" />}
            <span>{isOffline ? 'Offline' : '5G'}</span>
          </button>
          <div className="w-5 h-2.5 border border-slate-700 rounded-[3px] p-[1.5px] flex items-center" aria-hidden="true">
            <div className="h-full bg-slate-800 w-4/5 rounded-[1px]"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-between px-4 pt-2 pb-5">
        <div>
          {/* App Identity */}
          <div className="text-center">
            <img
              src={logoUrl}
              alt="Logo Đoàn TNCS"
              className="w-14 h-14 object-contain mx-auto"
            />
            <div className="mt-2.5">
              <span className="inline-block px-3 py-1 bg-[#EEF0FB] text-[#161891] text-[11px] font-bold rounded-full">
                Đoàn TNCS Hồ Chí Minh Tỉnh Đồng Nai
              </span>
            </div>
            <h1 className="text-[22px] font-extrabold tracking-tight text-slate-900 mt-2">
              Đoàn Viên Số
            </h1>
            <p className="text-[13px] text-slate-500 mt-0.5">
              Quản lý chi đoàn & kết nối thanh niên công nhân KCN
            </p>
          </div>

          {/* Material 3 SegmentedButton */}
          <div className="mt-4 grid grid-cols-2 bg-slate-100 p-1 rounded-xl border border-slate-200/70">
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className={`h-9 rounded-lg text-[13px] font-bold transition ${
                authMode === 'login' ? 'bg-white text-[#161891] shadow-xs' : 'text-slate-600'
              }`}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('register')}
              className={`h-9 rounded-lg text-[13px] font-bold transition flex items-center justify-center gap-1.5 ${
                authMode === 'register' ? 'bg-white text-[#161891] shadow-xs' : 'text-slate-600'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Đăng ký mới</span>
            </button>
          </div>

          {authMode === 'login' ? (
            <div className="mt-4 space-y-2.5">
              <div className="flex items-center justify-between px-0.5">
                <span className="text-[12px] font-bold text-slate-700">
                  Chọn vai trò sử dụng
                </span>
                <span className="text-[11px] text-[#161891] font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Phân quyền RBAC
                </span>
              </div>

              {roles.map((r) => {
                const Icon = r.icon;
                const isSelected = selectedRole === r.id;

                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleSelectRole(r.id)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center gap-3 active:scale-[0.99] ${
                      isSelected
                        ? 'border-[#161891] bg-[#F4F5FC] ring-1 ring-[#161891]/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? 'bg-[#161891] text-white' : 'bg-[#EEF0FB] text-[#161891]'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-bold text-slate-900 leading-5 truncate">
                        {r.title}
                      </div>
                      <div className="text-[12px] font-semibold text-[#161891] leading-4 truncate mt-0.5">
                        {r.subtitle}
                      </div>
                      <p className="text-[12px] text-slate-500 leading-4 truncate mt-0.5">
                        {r.desc}
                      </p>
                    </div>

                    <div className="shrink-0">
                      {isSelected ? (
                        <CheckCircle2 className="w-5 h-5 text-[#161891]" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            /* Form Đăng ký tài khoản mới */
            <form onSubmit={handleRegisterSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">
                  Họ và tên *
                </label>
                <input
                  type="text"
                  required
                  value={regForm.name}
                  onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                  placeholder="VD: Nguyễn Minh Tâm"
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-[13px] focus:outline-none focus:border-[#161891]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    required
                    value={regForm.phone}
                    onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                    placeholder="09xx.xxx.xxx"
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-[13px] focus:outline-none focus:border-[#161891]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1">
                    Mã đoàn viên
                  </label>
                  <input
                    type="text"
                    value={regForm.memberCode}
                    onChange={(e) => setRegForm({ ...regForm, memberCode: e.target.value })}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-mono focus:outline-none focus:border-[#161891]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1">
                    Ngày vào Đoàn
                  </label>
                  <input
                    type="text"
                    value={regForm.joinDate}
                    onChange={(e) => setRegForm({ ...regForm, joinDate: e.target.value })}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-[13px]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1">
                    Nghề nghiệp
                  </label>
                  <input
                    type="text"
                    value={regForm.occupation}
                    onChange={(e) => setRegForm({ ...regForm, occupation: e.target.value })}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-[13px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">
                  Đơn vị làm việc / Nơi sinh hoạt
                </label>
                <input
                  type="text"
                  value={regForm.workplace}
                  onChange={(e) => setRegForm({ ...regForm, workplace: e.target.value })}
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-[13px]"
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-[#161891] hover:bg-[#0E1068] text-white font-bold text-[14px] rounded-xl shadow-sm flex items-center justify-center gap-2 transition active:scale-[0.98]"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Hoàn tất đăng ký & Đăng nhập</span>
              </button>
            </form>
          )}
        </div>

        {/* Bottom Login Input & CTA */}
        {authMode === 'login' && (
          <div className="space-y-2.5 pt-3">
            <div className="h-12 px-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2">
              <label className="flex items-center gap-2 min-w-0 flex-1">
                <Smartphone className="w-4 h-4 text-[#161891] shrink-0" />
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="font-semibold text-[13px] text-slate-900 bg-transparent focus:outline-none w-full min-w-0 tabular-nums"
                  aria-label="Số điện thoại hoặc định danh Đoàn viên"
                />
              </label>
              <button
                type="button"
                onClick={() => setShowOtpStep(!showOtpStep)}
                className="h-7 px-2.5 bg-[#EEF0FB] text-[#161891] font-bold text-[11px] rounded-lg shrink-0 flex items-center gap-1"
              >
                <KeyRound className="w-3 h-3" />
                <span>{showOtpStep ? 'Ẩn OTP' : 'Mã OTP'}</span>
              </button>
            </div>

            {showOtpStep && (
              <div className="h-11 px-3.5 bg-[#EEF0FB] border border-[#161891]/20 rounded-xl flex items-center justify-between text-[13px]">
                <span className="text-[#161891] font-semibold">Xác thực OTP SMS</span>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-24 h-8 text-center font-mono font-bold bg-white border border-[#161891]/30 rounded-lg text-[#161891]"
                />
              </div>
            )}

            <button
              type="button"
              onClick={handleLogin}
              className="w-full h-12 bg-[#161891] hover:bg-[#0E1068] text-white font-bold text-[14px] rounded-xl shadow-sm flex items-center justify-center gap-2 transition active:scale-[0.98]"
            >
              <span>Đăng nhập vào hệ thống</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-1 flex justify-center" aria-hidden="true">
              <div className="w-32 h-1 rounded-full bg-slate-300" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
