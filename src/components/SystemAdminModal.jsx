import React, { useState } from 'react';
import {
  ShieldCheck, Lock, Database, History, X, Download,
  Upload, CheckCircle2, Building2, KeyRound, ToggleLeft, ToggleRight, UserCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ROLE_PERMISSIONS, MONTHLY_WARD_DATA } from '../data/mockData';

export default function SystemAdminModal({ isOpen, onClose, currentRole }) {
  const {
    currentMember,
    auditLogs,
    securitySettings,
    updateSecuritySettings,
    exportBackupJSON,
    restoreBackupJSON,
    resetAppData,
    triggerGlobalToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState('account'); // 'account' | 'security' | 'logs' | 'backup'
  const [restoreFeedback, setRestoreFeedback] = useState(null);

  if (!isOpen) return null;

  const accountProfile =
    currentRole === 'secretary'
      ? {
          name: 'Nguyễn Văn An',
          code: 'CB-KP5-2026',
          roleName: 'Bí thư Chi đoàn Khu phố 5',
          unit: 'Phường Tam Hiệp, TP. Biên Hòa, Tỉnh Đồng Nai',
          phone: '0912.345.678',
          joinDate: '26/03/2017',
        }
      : currentRole === 'ward_officer'
      ? {
          name: 'Phan Thị Bích Thảo',
          code: 'CB-PHUONG-01',
          roleName: 'Bí thư Đoàn Phường Tam Hiệp',
          unit: 'BCH Đoàn Phường Tam Hiệp (12 Chi đoàn)',
          phone: '0908.123.999',
          joinDate: '26/03/2015',
        }
      : {
          name: currentMember.name,
          code: currentMember.memberCode,
          roleName: 'Đoàn viên • Công nhân KCN',
          unit: `${currentMember.branchName} • ${currentMember.workplace}`,
          phone: currentMember.phone,
          joinDate: currentMember.joinDate,
        };

  const handleDownloadBackup = () => {
    const json = exportBackupJSON();
    const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `DoanVienSo_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    triggerGlobalToast('Đã sao lưu toàn bộ dữ liệu hệ thống thành công (.json)!');
  };

  const handleRestoreFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const ok = restoreBackupJSON(String(reader.result || ''));
      if (ok) {
        setRestoreFeedback('Khôi phục dữ liệu từ bản sao lưu thành công!');
        triggerGlobalToast('Đã khôi phục dữ liệu hệ thống từ file backup!');
      } else {
        setRestoreFeedback('Tệp sao lưu không hợp lệ!');
      }
    };
    reader.readAsText(file);
  };

  const branches = MONTHLY_WARD_DATA['11']?.branchesRank || [];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-[2px] flex items-end justify-center animate-fade-in">
      <div className="bg-white rounded-t-[28px] w-full max-w-[390px] max-h-[86dvh] overflow-y-auto shadow-2xl p-5 pb-7 space-y-4 animate-sheet-up">
        <div className="w-10 h-1 rounded-full bg-slate-300 mx-auto" />

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-[#161891] text-white rounded-xl flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-slate-900">Quản trị & Bảo mật</h3>
              <p className="text-[12px] text-slate-500">Tài khoản, phân quyền & sao lưu</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Tabs */}
        <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded-xl">
          {[
            { id: 'account', label: 'Tài khoản' },
            { id: 'security', label: 'Quyền' },
            { id: 'logs', label: 'Nhật ký' },
            { id: 'backup', label: 'Sao lưu' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`h-9 rounded-lg text-[12px] font-bold transition ${
                activeTab === t.id ? 'bg-white text-[#161891] shadow-xs' : 'text-slate-600'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === 'account' && (
          <div className="space-y-3">
            <div className="bg-[#F4F5FC] border border-[#161891]/20 rounded-2xl p-3.5 space-y-2 text-[13px]">
              <div className="flex items-center gap-2 text-[#161891] font-bold">
                <UserCheck className="w-4 h-4" />
                <span>Tài khoản đang đăng nhập</span>
              </div>
              <div className="grid grid-cols-2 gap-y-1.5 text-[12px] pt-1">
                <span className="text-slate-500">Họ tên</span>
                <strong className="text-slate-900 text-right">{accountProfile.name}</strong>
                <span className="text-slate-500">Mã định danh</span>
                <strong className="text-[#161891] font-mono text-right">{accountProfile.code}</strong>
                <span className="text-slate-500">Vai trò</span>
                <span className="font-semibold text-slate-800 text-right">{accountProfile.roleName}</span>
                <span className="text-slate-500">Số điện thoại</span>
                <span className="font-mono text-slate-800 text-right">
                  {securitySettings.maskPhone ? '09xx.xxx.' + accountProfile.phone.slice(-3) : accountProfile.phone}
                </span>
                <span className="text-slate-500">Ngày vào Đoàn</span>
                <span className="text-slate-800 text-right">{accountProfile.joinDate}</span>
              </div>
              <div className="pt-2 border-t border-[#161891]/10 text-[12px] text-slate-600">
                <strong>Đơn vị:</strong> {accountProfile.unit}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[13px] text-slate-900 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-[#161891]" />
                  <span>12 Chi đoàn trực thuộc</span>
                </span>
                <span className="text-[11px] bg-[#EEF0FB] text-[#161891] font-bold px-2.5 py-0.5 rounded-full">
                  485 ĐV
                </span>
              </div>
              <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                {branches.map((b) => (
                  <div
                    key={b.id}
                    className="p-2.5 bg-[#F5F7FB] rounded-xl flex items-center justify-between text-[12px]"
                  >
                    <span className="font-semibold text-slate-800 truncate pr-2">{b.name}</span>
                    <span className="text-slate-500 shrink-0 tabular-nums">{b.total} ĐV</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-3">
            <div className="bg-[#F5F7FB] rounded-2xl p-3.5 space-y-3">
              <div className="font-bold text-[13px] text-slate-900 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-[#161891]" />
                <span>Thiết lập Bảo mật Hồ sơ</span>
              </div>

              {[
                {
                  key: 'maskPhone',
                  label: 'Ẩn một phần SĐT công khai',
                  desc: 'Bảo vệ thông tin cá nhân khi tra cứu',
                },
                {
                  key: 'twoFactorAuth',
                  label: 'Xác thực 2 lớp (OTP & GPS)',
                  desc: 'Ngăn điểm danh hộ và truy cập trái phép',
                },
                {
                  key: 'encryptOffline',
                  label: 'Mã hóa hàng đợi Ngoại tuyến',
                  desc: 'Bảo toàn dữ liệu lưu cục bộ khi mất mạng',
                },
              ].map((item) => {
                const enabled = securitySettings[item.key];
                return (
                  <div
                    key={item.key}
                    className="flex items-center justify-between gap-2 pt-2.5 border-t border-slate-200/70"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 text-[12px]">{item.label}</div>
                      <div className="text-[11px] text-slate-500">{item.desc}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateSecuritySettings({ [item.key]: !enabled })}
                      className="shrink-0"
                    >
                      {enabled ? (
                        <ToggleRight className="w-8 h-8 text-[#161891]" />
                      ) : (
                        <ToggleLeft className="w-8 h-8 text-slate-400" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="bg-white rounded-2xl p-3.5 border border-slate-200 space-y-2.5">
              <div className="font-bold text-[13px] text-slate-900 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-[#161891]" />
                <span>Ma trận Phân quyền (RBAC)</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[11px] border-collapse">
                  <thead>
                    <tr className="bg-[#F5F7FB] text-slate-700 font-bold">
                      <th className="p-2 text-left border border-slate-200">Chức năng</th>
                      <th className="p-2 text-center border border-slate-200">ĐV</th>
                      <th className="p-2 text-center border border-slate-200">BT</th>
                      <th className="p-2 text-center border border-slate-200">Xã</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ROLE_PERMISSIONS.map((perm, idx) => (
                      <tr key={idx}>
                        <td className="p-2 border border-slate-200 text-slate-700">{perm.feature}</td>
                        <td className="p-2 border border-slate-200 text-center">{perm.member ? '✓' : '—'}</td>
                        <td className="p-2 border border-slate-200 text-center font-bold text-[#161891]">
                          {perm.secretary ? '✓' : '—'}
                        </td>
                        <td className="p-2 border border-slate-200 text-center font-bold text-[#161891]">
                          {perm.ward_officer ? '✓' : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-[12px] text-slate-500">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <History className="w-4 h-4 text-[#161891]" />
                <span>Lịch sử thao tác gần đây</span>
              </span>
              <span>{auditLogs.length} bản ghi</span>
            </div>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3 bg-[#F5F7FB] rounded-xl space-y-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-[#161891] text-[12px] truncate">{log.actor}</span>
                    <span className="text-[11px] text-slate-400 shrink-0">{log.time}</span>
                  </div>
                  <p className="text-[12px] text-slate-700">{log.action}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'backup' && (
          <div className="bg-[#F5F7FB] rounded-2xl p-4 space-y-3">
            <div className="font-bold text-[14px] text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-[#161891]" />
              <span>Sao lưu & Khôi phục Dữ liệu</span>
            </div>
            <p className="text-[12px] text-slate-600 leading-relaxed">
              Xuất toàn bộ hồ sơ 46 đoàn viên, lịch sử sinh hoạt, đơn chuyển SH và bảng tin ra file JSON dự phòng.
            </p>

            <button
              type="button"
              onClick={handleDownloadBackup}
              className="w-full h-11 bg-[#161891] hover:bg-[#0E1068] text-white font-bold text-[13px] rounded-xl flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Tải bản sao lưu (.json)</span>
            </button>

            <label className="w-full h-11 bg-white border border-[#161891] text-[#161891] font-bold text-[13px] rounded-xl flex items-center justify-center gap-2 cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>Khôi phục từ file (.json)</span>
              <input type="file" accept=".json" onChange={handleRestoreFile} className="hidden" />
            </label>

            {restoreFeedback && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-[12px] text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{restoreFeedback}</span>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                resetAppData();
                triggerGlobalToast('Đã khôi phục dữ liệu gốc ban đầu!');
                onClose();
              }}
              className="w-full h-10 bg-rose-50 border border-rose-200 text-rose-700 font-bold rounded-xl text-[12px]"
            >
              Đặt lại dữ liệu gốc
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
