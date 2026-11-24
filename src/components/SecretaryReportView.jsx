import React, { useState } from 'react';
import {
  Download, Send, CheckCircle2, Users, TrendingUp,
  Printer, FileText, ShieldCheck, X, Calendar, ArrowLeft
} from 'lucide-react';
import { INITIAL_BRANCH_DATA } from '../data/mockData';
import { useApp } from '../context/AppContext';

export default function SecretaryReportView({ onBack }) {
  const {
    members,
    scannedCount,
    makeupRequests,
    wardDataByMonth,
    kp5ReportSubmitted,
    submitBranchReportToWard,
    triggerGlobalToast,
  } = useApp();

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const localCount = members.filter((m) => m.type === 'local').length;
  const workingFarCount = members.filter((m) => m.type === 'working_far').length;
  const transferredCount = members.filter((m) => m.type === 'transferred').length;

  const kp5WardRecord = wardDataByMonth['11']?.branchesRank.find((b) => b.id === 'kp5') || {
    attended: 33,
    total: 46,
    rate: 71.7,
  };

  const approvedMakeupCount = makeupRequests.filter((r) => r.status === 'approved').length;
  const pendingMakeupCount = makeupRequests.filter((r) => r.status === 'pending').length;

  const handleExportCSV = () => {
    const header = ['STT', 'Họ và tên', 'Nhóm đoàn viên', 'Đơn vị / KCN', 'Ca làm việc', 'Điểm rèn luyện', 'Trạng thái'];
    const rows = members.map((m, idx) => [
      idx + 1,
      m.name,
      m.type === 'working_far' ? 'Đi làm xa / KCN' : m.type === 'transferred' ? 'Chuyển sinh hoạt' : 'Tại địa phương',
      m.workplace,
      m.shift,
      m.points,
      m.status,
    ]);
    const csvContent =
      '\uFEFF' +
      [header, ...rows]
        .map((r) => r.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'BaoCao_ChiDoan_KP5_Thang11_2026.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    triggerGlobalToast('Đã tải về bảng thống kê Excel (.csv) của Chi đoàn KP5!');
  };

  const handleSubmitToWard = () => {
    submitBranchReportToWard();
    triggerGlobalToast('Đã gửi báo cáo số hóa Chi đoàn KP5 lên Đoàn Phường Tam Hiệp!');
  };

  return (
    <div className="p-4 space-y-4 pb-8">
      {/* Thẻ tổng hợp Chi đoàn KP5 */}
      <div className="bg-[#161891] text-white rounded-2xl p-4 shadow-card">
        <span className="text-[11px] bg-white/15 px-2.5 py-0.5 rounded-full font-semibold">
          Báo cáo nội bộ Chi đoàn
        </span>
        <h2 className="text-[17px] font-bold mt-1.5">Chi đoàn Khu phố 5 — P. Tam Hiệp</h2>
        <p className="text-[12px] text-white/80 mt-0.5">
          Tổng hợp số liệu tháng 11/2026 nộp BCH Đoàn Phường
        </p>

        <div className="grid grid-cols-3 gap-2 mt-3.5 bg-white/10 rounded-xl p-2.5 text-center divide-x divide-white/15">
          <div>
            <div className="text-[18px] font-extrabold tabular-nums">{members.length}</div>
            <div className="text-[11px] text-white/80">Tổng ĐV</div>
          </div>
          <div>
            <div className="text-[18px] font-extrabold tabular-nums">{kp5WardRecord.rate}%</div>
            <div className="text-[11px] text-white/80">Tỷ lệ T11</div>
          </div>
          <div>
            <div className="text-[18px] font-extrabold tabular-nums">{scannedCount}</div>
            <div className="text-[11px] text-white/80">Đã quét QR</div>
          </div>
        </div>
      </div>

      {/* Cơ cấu 46 đoàn viên */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-[#161891]" />
          <h3 className="text-[15px] font-bold text-slate-900">Phân loại chất lượng ({members.length} ĐV)</h3>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-3 bg-[#EEF0FB] rounded-xl">
            <div className="text-[18px] font-extrabold text-[#161891] tabular-nums">{localCount}</div>
            <div className="text-[12px] text-slate-700 font-medium mt-0.5">Tại chỗ</div>
          </div>
          <div className="p-3 bg-[#F5F7FB] rounded-xl border border-slate-200/70">
            <div className="text-[18px] font-extrabold text-[#161891] tabular-nums">{workingFarCount}</div>
            <div className="text-[12px] text-slate-700 font-medium mt-0.5">Làm xa KCN</div>
          </div>
          <div className="p-3 bg-[#F5F7FB] rounded-xl border border-slate-200/70">
            <div className="text-[18px] font-extrabold text-slate-700 tabular-nums">{transferredCount}</div>
            <div className="text-[12px] text-slate-600 font-medium mt-0.5">Chuyển SH</div>
          </div>
        </div>
        <div className="text-[12px] text-slate-600 bg-[#F5F7FB] p-3 rounded-xl">
          Đơn sinh hoạt bù công nhân KCN: <strong className="text-slate-900">{approvedMakeupCount} đã duyệt</strong>,{' '}
          <strong className="text-[#161891]">{pendingMakeupCount} chờ duyệt</strong>.
        </div>
      </div>

      {/* Thống kê 3 kỳ gần nhất */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#161891]" />
          <h3 className="text-[15px] font-bold text-slate-900">Đối chiếu 03 kỳ sinh hoạt</h3>
        </div>
        <div className="space-y-2">
          {INITIAL_BRANCH_DATA.recentSessions.map((ses) => (
            <div key={ses.id} className="p-3 rounded-xl bg-[#F5F7FB] flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-bold text-slate-900 truncate">{ses.title}</div>
                <div className="text-[12px] text-slate-500 flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3.5 h-3.5" /> {ses.date}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[14px] font-extrabold text-[#161891] tabular-nums">{ses.attendees}/{ses.total}</div>
                <div className="text-[11px] text-slate-500 tabular-nums">{ses.rate}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hành động xuất & nộp Đoàn Phường */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-2.5">
        <button
          onClick={handleSubmitToWard}
          disabled={kp5ReportSubmitted}
          className={`w-full h-12 px-4 rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 transition active:scale-[0.98] ${
            kp5ReportSubmitted
              ? 'bg-emerald-600 text-white'
              : 'bg-[#161891] hover:bg-[#0E1068] text-white'
          }`}
        >
          {kp5ReportSubmitted ? <CheckCircle2 className="w-4 h-4" /> : <Send className="w-4 h-4" />}
          <span>
            {kp5ReportSubmitted
              ? 'Đã nộp báo cáo lên Đoàn Phường'
              : 'Nộp báo cáo lên Đoàn Phường'}
          </span>
        </button>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="h-11 px-3 bg-[#EEF0FB] text-[#161891] font-bold text-[13px] rounded-xl flex items-center justify-center gap-1.5 transition"
          >
            <FileText className="w-4 h-4" />
            <span>Xem phiếu</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="h-11 px-3 bg-[#F5F7FB] text-slate-800 border border-slate-200 font-bold text-[13px] rounded-xl flex items-center justify-center gap-1.5 transition"
          >
            <Download className="w-4 h-4" />
            <span>Xuất Excel</span>
          </button>
        </div>
      </div>

      {onBack && (
        <button
          onClick={onBack}
          className="w-full h-10 text-[13px] font-semibold text-slate-500 hover:text-slate-900 flex items-center justify-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Trang chủ Bí thư</span>
        </button>
      )}

      {/* Flutter ModalBottomSheet: Phiếu báo cáo Chi đoàn */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-[2px] flex items-end justify-center animate-fade-in">
          <div className="bg-white rounded-t-[28px] w-full max-w-[390px] max-h-[86dvh] overflow-y-auto shadow-2xl p-5 pb-7 space-y-4 animate-sheet-up">
            <div className="w-10 h-1 rounded-full bg-slate-300 mx-auto" />
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-bold text-slate-900">Phiếu Báo cáo Chi đoàn KP5</h3>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600"
                aria-label="Đóng"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-[#F5F7FB] p-4 rounded-2xl border border-slate-200 text-[12px] space-y-3">
              <div className="text-center border-b border-slate-200 pb-2.5">
                <div className="font-bold uppercase text-slate-700">ĐOÀN TNCS HỒ CHÍ MINH PHƯỜNG TAM HIỆP</div>
                <div className="font-bold uppercase text-[#161891]">BCH CHI ĐOÀN KHU PHỐ 5</div>
              </div>
              <div className="text-center font-bold text-[13px] uppercase text-slate-900">
                BÁO CÁO SINH HOẠT THÁNG 11/2026
              </div>
              <div className="space-y-1.5 text-slate-700 leading-relaxed">
                <p>1. Tổng số đoàn viên: <strong>{members.length} ĐV</strong> (Tại chỗ: {localCount}, Làm xa KCN: {workingFarCount}, Chuyển SH: {transferredCount}).</p>
                <p>2. Tỷ lệ tham dự tháng 11: <strong>{kp5WardRecord.attended}/{kp5WardRecord.total} ({kp5WardRecord.rate}%)</strong>.</p>
                <p>3. Kỳ sinh hoạt đang mở: Đã điểm danh <strong>{scannedCount}/{members.length} ĐV</strong>.</p>
              </div>
              <div className="pt-2 flex justify-end text-center">
                <div>
                  <div className="text-[11px] font-bold uppercase text-slate-600">TM. BCH CHI ĐOÀN KP5</div>
                  <div className="text-[13px] font-bold text-slate-900 mt-3">Nguyễn Văn An</div>
                  <div className="text-[11px] text-emerald-700 flex items-center justify-center gap-1 mt-0.5 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" /> Đã xác thực điện tử
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => window.print()}
                className="h-11 bg-[#161891] hover:bg-[#0E1068] text-white text-[13px] font-bold rounded-xl flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> In / PDF
              </button>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="h-11 bg-slate-100 text-slate-700 text-[13px] font-bold rounded-xl"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
