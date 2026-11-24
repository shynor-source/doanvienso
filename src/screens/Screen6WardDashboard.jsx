import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet, Download, BarChart3, FileText,
  Printer, X, ShieldCheck, Bell, Search, Users, Award, Trophy
} from 'lucide-react';
import { WARD_DATA } from '../data/mockData';
import { useApp } from '../context/AppContext';

export default function Screen6WardDashboard({
  viewMode = 'overview',
  exportModalTrigger = 0,
  onConsumeExportTrigger,
}) {
  const {
    wardDataByMonth,
    remindBranchReport,
    members,
    volunteerActivities,
    triggerGlobalToast,
  } = useApp();

  const [internalView, setInternalView] = useState(viewMode);
  const [selectedMonth, setSelectedMonth] = useState('11'); // '09' | '10' | '11'
  const [reportPeriod, setReportPeriod] = useState('month'); // 'month' | 'quarter' | 'year'
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf'); // 'pdf' | 'excel'
  const [branchFilter, setBranchFilter] = useState('all'); // 'all' | 'submitted' | 'pending'
  const [branchSearch, setBranchSearch] = useState('');
  const [selectedBranch, setSelectedBranch] = useState(null);

  useEffect(() => {
    setInternalView(viewMode);
  }, [viewMode]);

  const showToast = (msg) => {
    triggerGlobalToast(msg);
  };

  useEffect(() => {
    if (exportModalTrigger > 0) {
      setExportFormat('pdf');
      setIsExportModalOpen(true);
      onConsumeExportTrigger?.();
    }
  }, [exportModalTrigger, onConsumeExportTrigger]);

  const currentMonthData = wardDataByMonth[selectedMonth];
  const officerInfo = WARD_DATA.officer;

  const submittedBranchesCount = currentMonthData.branchesRank.filter(
    (b) => b.status === 'submitted'
  ).length;
  const kp5Branch = currentMonthData.branchesRank.find((b) => b.id === 'kp5');

  const handleOpenExport = (format) => {
    setExportFormat(format);
    setIsExportModalOpen(true);
  };

  const handleDownloadCSV = () => {
    const headers = ['STT', 'Chi đoàn', 'Bí thư phụ trách', 'Tổng ĐV', 'Đã dự', 'Tỷ lệ (%)', 'Tình trạng'];
    const rows = currentMonthData.branchesRank.map((b, idx) => [
      idx + 1,
      b.name,
      b.secretary || 'Bí thư Chi đoàn',
      b.total,
      b.attended,
      `${b.rate}%`,
      b.status === 'submitted' ? 'Đã nộp' : b.reminded ? 'Đã nhắc Zalo' : 'Chưa nộp',
    ]);

    const csvContent =
      '\uFEFF' +
      [headers, ...rows]
        .map((r) => r.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BaoCao_DoanVu_TamHiep_T${selectedMonth}_2026.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Đã xuất file BaoCao_DoanVu_TamHiep_T${selectedMonth}_2026.csv!`);
  };

  const handlePrintPDF = () => {
    window.print();
    showToast('Đã mở hộp thoại In / Lưu PDF văn bản Đoàn vụ!');
  };

  const handleRemindBranch = (branch, e) => {
    if (e) e.stopPropagation();
    remindBranchReport(selectedMonth, branch.id);
    showToast(`Đã gửi tin nhắn nhắc nộp báo cáo tới ${branch.name}!`);
  };

  const filteredBranches = currentMonthData.branchesRank.filter((b) => {
    const matchFilter =
      branchFilter === 'all'
        ? true
        : branchFilter === 'submitted'
        ? b.status === 'submitted'
        : b.status !== 'submitted';
    const matchSearch =
      b.name.toLowerCase().includes(branchSearch.toLowerCase()) ||
      (b.secretary && b.secretary.toLowerCase().includes(branchSearch.toLowerCase()));
    return matchFilter && matchSearch;
  });

  const renderBranchCard = (branch, index) => {
    const needsReminder = branch.status !== 'submitted' || branch.rate < 65;

    return (
      <div
        key={branch.id}
        onClick={() => setSelectedBranch(branch)}
        className={`p-3.5 rounded-2xl border transition cursor-pointer ${
          branch.highlight
            ? 'bg-[#F4F5FC] border-[#161891]/30'
            : 'bg-white border-slate-100 hover:border-slate-300 shadow-xs'
        }`}
      >
        <div className="flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0 tabular-nums ${
                index < 3 ? 'bg-[#161891] text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[14px] font-bold text-slate-900 truncate">{branch.name}</div>
              <div className="text-[12px] text-slate-500 truncate">
                {branch.secretary} • {branch.type}
              </div>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="text-[15px] font-extrabold text-[#161891] tabular-nums">{branch.rate}%</div>
            <div className="text-[11px] text-slate-500 tabular-nums">
              {branch.attended}/{branch.total}
            </div>
          </div>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-2 mt-2.5 overflow-hidden">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              branch.rate >= 75 ? 'bg-[#161891]' : branch.rate >= 65 ? 'bg-[#161891]/70' : 'bg-amber-500'
            }`}
            style={{ width: `${branch.rate}%` }}
          />
        </div>

        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100 gap-2">
          <span
            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
              branch.status === 'submitted'
                ? 'bg-emerald-50 text-emerald-700'
                : branch.reminded
                ? 'bg-[#EEF0FB] text-[#161891]'
                : 'bg-rose-50 text-rose-700'
            }`}
          >
            {branch.status === 'submitted'
              ? 'Đã nộp'
              : branch.reminded
              ? 'Đã nhắc nộp'
              : 'Chưa nộp'}
          </span>

          {needsReminder && (
            <button
              type="button"
              onClick={(e) => handleRemindBranch(branch, e)}
              className={`h-8 px-3 rounded-lg text-[12px] font-bold flex items-center gap-1.5 transition ${
                branch.reminded
                  ? 'bg-[#EEF0FB] text-[#161891]'
                  : 'bg-[#161891] text-white'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>{branch.reminded ? 'Nhắc lại' : 'Nhắc nộp'}</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 space-y-4 pb-8">
      {/* Thẻ Cán bộ Đoàn Xã Super-App */}
      <div className="hero-mesh text-white rounded-2xl p-4 space-y-3.5">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <span className="text-[11px] bg-white/15 px-2.5 py-0.5 rounded-full font-semibold">
              Cấp Xã / Phường • {currentMonthData.totalBranches} Chi đoàn
            </span>
            <h2 className="text-[17px] font-bold mt-1.5 truncate">{WARD_DATA.name}</h2>
            <p className="text-[12px] text-white/80 truncate">
              {officerInfo.role} — {officerInfo.name}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1.5 bg-white/10 p-1 rounded-xl">
          {[
            { key: '09', label: 'Tháng 09' },
            { key: '10', label: 'Tháng 10' },
            { key: '11', label: 'Tháng 11' },
          ].map((m) => (
            <button
              key={m.key}
              onClick={() => setSelectedMonth(m.key)}
              className={`h-9 rounded-lg text-[12px] font-bold transition ${
                selectedMonth === m.key
                  ? 'bg-white text-[#161891] shadow-xs'
                  : 'text-white/80 hover:bg-white/10'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-2 text-center divide-x divide-white/15">
          <div>
            <div className="text-[17px] font-extrabold tabular-nums">{currentMonthData.totalBranches}</div>
            <div className="text-[11px] text-white/80">Chi đoàn</div>
          </div>
          <div>
            <div className="text-[17px] font-extrabold tabular-nums">{currentMonthData.totalMembers}</div>
            <div className="text-[11px] text-white/80">Đoàn viên</div>
          </div>
          <div>
            <div className="text-[17px] font-extrabold tabular-nums">{currentMonthData.averageAttendanceRate}</div>
            <div className="text-[11px] text-white/80">Tỷ lệ SH</div>
          </div>
          <div>
            <div className="text-[17px] font-extrabold tabular-nums">{volunteerActivities.length}</div>
            <div className="text-[11px] text-white/80">Sự kiện</div>
          </div>
        </div>
      </div>

      {/* Thanh chuyển đổi 4 phân hệ */}
      <div className="grid grid-cols-4 gap-1 bg-slate-200/70 p-1 rounded-xl">
        {[
          { id: 'overview', label: 'Tổng hợp' },
          { id: 'branches', label: '12 CĐ' },
          { id: 'reports', label: 'Báo cáo' },
          { id: 'rewards', label: 'Thi đua' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setInternalView(tab.id)}
            className={`h-10 rounded-lg text-[12px] font-bold transition ${
              internalView === tab.id ? 'bg-white text-[#161891] shadow-xs' : 'text-slate-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* VIEW MODE: 12 CHI ĐOÀN */}
      {internalView === 'branches' && (
        <div className="space-y-3">
          <div className="app-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#161891]" />
                <h3 className="text-[15px] font-bold text-slate-900">12 Chi đoàn trực thuộc</h3>
              </div>
              <span className="text-[12px] font-bold text-[#161891] bg-[#EEF0FB] px-2.5 py-0.5 rounded-full tabular-nums">
                {submittedBranchesCount}/12 nộp
              </span>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={branchSearch}
                onChange={(e) => setBranchSearch(e.target.value)}
                placeholder="Tìm Chi đoàn hoặc Bí thư..."
                className="w-full h-11 pl-10 pr-3 bg-[#F5F7FB] border border-slate-200 rounded-xl text-[13px] focus:outline-none focus:border-[#161891]"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'all', label: `Tất cả (${currentMonthData.branchesRank.length})` },
                { key: 'submitted', label: `Đã nộp (${submittedBranchesCount})` },
                { key: 'pending', label: `Chưa nộp (${currentMonthData.branchesRank.length - submittedBranchesCount})` },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setBranchFilter(tab.key)}
                  className={`h-9 rounded-xl text-[12px] font-bold transition ${
                    branchFilter === tab.key
                      ? 'bg-[#161891] text-white'
                      : 'bg-[#F5F7FB] text-slate-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5">
            {filteredBranches.map((branch, idx) => renderBranchCard(branch, idx))}
          </div>
        </div>
      )}

      {/* VIEW MODE: THI ĐUA XÃ */}
      {internalView === 'rewards' && (
        <div className="space-y-4">
          <div className="app-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#161891]" />
                <h3 className="text-[15px] font-bold text-slate-900">Top 3 Thi đua Phường</h3>
              </div>
              <span className="text-[11px] bg-[#EEF0FB] text-[#161891] font-bold px-2.5 py-0.5 rounded-full">
                {currentMonthData.monthLabel}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {currentMonthData.branchesRank.slice(0, 3).map((b, idx) => (
                <div
                  key={b.id}
                  className={`p-3 rounded-xl border text-center space-y-1 ${
                    idx === 0 ? 'bg-[#EEF0FB] border-[#161891]/30' : 'bg-[#F5F7FB] border-slate-200/70'
                  }`}
                >
                  <div className="text-[12px] font-extrabold text-[#161891]">#{idx + 1}</div>
                  <div className="text-[12px] font-bold text-slate-900 line-clamp-2 leading-4">{b.name}</div>
                  <div className="text-[14px] font-extrabold text-[#161891] tabular-nums">{b.rate}%</div>
                </div>
              ))}
            </div>
          </div>

          <div className="app-card p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#161891]" />
              <h3 className="text-[15px] font-bold text-slate-900">Điểm thi đua 12 Chi đoàn</h3>
            </div>

            <div className="space-y-2">
              {currentMonthData.branchesRank.map((b, idx) => {
                const innovationBonus = b.highlight ? 15 : b.status === 'submitted' ? 5 : 0;
                const totalScore = Math.min(100, Math.round(b.rate + innovationBonus));
                return (
                  <div
                    key={b.id}
                    className={`p-3.5 rounded-xl border flex items-center justify-between gap-2.5 ${
                      b.highlight ? 'bg-[#F4F5FC] border-[#161891]/30' : 'bg-[#F5F7FB] border-slate-200/70'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-bold text-slate-900 truncate">
                        #{idx + 1} {b.name}
                      </div>
                      <div className="text-[12px] text-slate-500 mt-0.5">
                        Chuyên cần {b.rate}% • {b.status === 'submitted' ? 'Nộp đúng hạn' : 'Chưa nộp'}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[15px] font-extrabold text-[#161891] tabular-nums">{totalScore} đ</div>
                      <button
                        type="button"
                        onClick={() => showToast(`Đã ghi nhận đề xuất biểu dương ${b.name}!`)}
                        className="text-[11px] font-bold text-[#161891]"
                      >
                        Đề xuất khen
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE: BÁO CÁO HOẶC OVERVIEW */}
      {(internalView === 'overview' || internalView === 'reports') && (
        <>
          <div className="app-card p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-[#EEF0FB] text-[#161891] rounded-xl flex items-center justify-center shrink-0">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-slate-900">
                    Báo cáo ({reportPeriod === 'month' ? currentMonthData.monthLabel : reportPeriod === 'quarter' ? 'Quý IV/2026' : 'Năm 2026'})
                  </h3>
                  <p className="text-[12px] text-slate-500">
                    {submittedBranchesCount}/12 Chi đoàn • {volunteerActivities.length} hoạt động
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-xl">
              {[
                { id: 'month', label: 'Tháng' },
                { id: 'quarter', label: 'Quý' },
                { id: 'year', label: 'Cả Năm' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setReportPeriod(p.id)}
                  className={`h-9 rounded-lg text-[12px] font-bold transition ${
                    reportPeriod === p.id ? 'bg-white text-[#161891] shadow-xs' : 'text-slate-600'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => handleOpenExport('pdf')}
                className="h-11 px-3 bg-[#161891] hover:bg-[#0E1068] text-white font-bold text-[13px] rounded-xl flex items-center justify-center gap-1.5 transition"
              >
                <FileText className="w-4 h-4" />
                <span>Xem trước PDF</span>
              </button>

              <button
                onClick={handleDownloadCSV}
                className="h-11 px-3 bg-[#EEF0FB] text-[#161891] font-bold text-[13px] rounded-xl flex items-center justify-center gap-1.5 transition"
              >
                <Download className="w-4 h-4" />
                <span>Xuất Excel</span>
              </button>
            </div>
          </div>

          {internalView === 'reports' && (
            <div className="app-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[14px] font-bold text-slate-900">Bảng tổng hợp 12 Chi đoàn</h3>
                <button
                  onClick={handlePrintPDF}
                  className="text-[12px] font-bold text-[#161891] flex items-center gap-1"
                >
                  <Printer className="w-4 h-4" /> In
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[12px] border-collapse border border-slate-200 text-left tabular-nums">
                  <thead>
                    <tr className="bg-[#F5F7FB] text-slate-900 font-bold">
                      <th className="border border-slate-200 p-2">#</th>
                      <th className="border border-slate-200 p-2">Chi đoàn</th>
                      <th className="border border-slate-200 p-2 text-center">Dự</th>
                      <th className="border border-slate-200 p-2 text-center">Tỷ lệ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentMonthData.branchesRank.map((b, idx) => (
                      <tr key={b.id} className={b.highlight ? 'bg-[#EEF0FB]/60 font-semibold' : ''}>
                        <td className="border border-slate-200 p-2 text-center">{idx + 1}</td>
                        <td className="border border-slate-200 p-2">{b.name}</td>
                        <td className="border border-slate-200 p-2 text-center">{b.attended}/{b.total}</td>
                        <td className="border border-slate-200 p-2 text-center font-bold text-[#161891]">{b.rate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {internalView === 'overview' && (
            <div className="app-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#161891]" />
                  <h3 className="text-[15px] font-bold text-slate-900">So sánh 12 Chi đoàn</h3>
                </div>
                <span className="text-[12px] text-slate-500">{currentMonthData.monthLabel}</span>
              </div>

              <div className="space-y-2.5">
                {currentMonthData.branchesRank.map((branch, index) => renderBranchCard(branch, index))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Flutter ModalBottomSheet: Chi tiết Chi đoàn */}
      {selectedBranch && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-[2px] flex items-end justify-center animate-fade-in">
          <div className="bg-white rounded-t-[28px] w-full max-w-[390px] shadow-2xl p-5 pb-7 space-y-4 animate-sheet-up">
            <div className="w-10 h-1 rounded-full bg-slate-300 mx-auto" />
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold bg-[#EEF0FB] text-[#161891] px-2.5 py-0.5 rounded-full">
                  {selectedBranch.type}
                </span>
                <h3 className="text-[16px] font-bold text-slate-900 mt-1.5">{selectedBranch.name}</h3>
                <p className="text-[13px] text-slate-500">{selectedBranch.secretary}</p>
              </div>
              <button
                onClick={() => setSelectedBranch(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-3 bg-[#F5F7FB] rounded-xl">
                <div className="text-[18px] font-extrabold text-slate-900 tabular-nums">{selectedBranch.total}</div>
                <div className="text-[12px] text-slate-500">Tổng ĐV</div>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl">
                <div className="text-[18px] font-extrabold text-emerald-700 tabular-nums">{selectedBranch.attended}</div>
                <div className="text-[12px] text-emerald-800">Đã dự</div>
              </div>
              <div className="p-3 bg-[#EEF0FB] rounded-xl">
                <div className="text-[18px] font-extrabold text-[#161891] tabular-nums">{selectedBranch.rate}%</div>
                <div className="text-[12px] text-[#161891]">Tỷ lệ</div>
              </div>
            </div>

            {selectedBranch.id === 'kp5' && (
              <div className="bg-[#F5F7FB] rounded-xl p-3.5 text-[13px] space-y-1 text-slate-700">
                <div className="font-bold text-[#161891]">Cơ cấu Chi đoàn KP5:</div>
                <div>• Tại địa phương: {members.filter((m) => m.type === 'local').length} ĐV</div>
                <div>• Đi làm xa: {members.filter((m) => m.type === 'working_far').length} ĐV</div>
                <div>• Chuyển sinh hoạt: {members.filter((m) => m.type === 'transferred').length} ĐV</div>
              </div>
            )}

            <div className="flex gap-2.5">
              {selectedBranch.status !== 'submitted' && (
                <button
                  onClick={() => {
                    handleRemindBranch(selectedBranch);
                    setSelectedBranch(null);
                  }}
                  className="flex-1 h-11 bg-[#161891] text-white text-[13px] font-bold rounded-xl flex items-center justify-center gap-1.5"
                >
                  <Bell className="w-4 h-4" /> Nhắc nộp
                </button>
              )}
              <button
                onClick={() => setSelectedBranch(null)}
                className="flex-1 h-11 bg-slate-100 text-slate-700 text-[13px] font-bold rounded-xl"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Flutter ModalBottomSheet: Xem trước Báo cáo */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-[2px] flex items-end justify-center animate-fade-in">
          <div className="bg-white rounded-t-[28px] w-full max-w-[390px] max-h-[86dvh] overflow-y-auto shadow-2xl p-5 pb-7 space-y-4 animate-sheet-up">
            <div className="w-10 h-1 rounded-full bg-slate-300 mx-auto" />
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold bg-[#EEF0FB] text-[#161891] px-2.5 py-0.5 rounded-full">
                  Xem trước Văn bản Số hóa
                </span>
                <h3 className="text-[16px] font-bold text-slate-900 mt-1.5">
                  Báo cáo Thể thức Đoàn TNCS HCM
                </h3>
              </div>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-[#F5F7FB] p-4 rounded-2xl border border-slate-200 text-slate-800 space-y-3 text-[12px] leading-relaxed">
              <div className="flex justify-between items-start text-center border-b border-slate-200 pb-2.5 gap-2">
                <div>
                  <div className="font-bold text-[11px] uppercase">ĐOÀN TNCS HỒ CHÍ MINH</div>
                  <div className="font-bold text-[11px] uppercase text-[#161891]">BCH ĐOÀN P. TAM HIỆP</div>
                  <div className="text-[11px] text-slate-500">{currentMonthData.reportNumber}</div>
                </div>
                <div>
                  <div className="font-bold text-[11px] uppercase">CHXHCN VIỆT NAM</div>
                  <div className="font-bold text-[11px] underline">Độc lập - Tự do - Hạnh phúc</div>
                </div>
              </div>

              <div className="text-center">
                <h2 className="font-bold text-[13px] uppercase text-slate-950">
                  BÁO CÁO CÔNG TÁC ĐOÀN {currentMonthData.monthLabel}
                </h2>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Kính gửi: Ban Thường vụ Thành Đoàn Biên Hòa
                </div>
              </div>

              <div className="space-y-1.5">
                <p>1. Quy mô: <strong>{currentMonthData.totalBranches} chi đoàn</strong> ({currentMonthData.totalMembers} ĐV).</p>
                <p>2. Tỷ lệ tham dự bình quân: <strong>{currentMonthData.averageAttendanceRate}</strong> ({submittedBranchesCount}/12 đã nộp).</p>
                <p>3. Chi đoàn Khu phố 5 đạt tỷ lệ tham dự <strong>{kp5Branch ? `${kp5Branch.rate}%` : '71.7%'}</strong>.</p>
              </div>

              <div className="pt-2 flex justify-between items-end">
                <div className="text-[11px] text-slate-500">
                  <div className="font-bold">Nơi nhận:</div>
                  <div>- BTV Thành Đoàn;</div>
                  <div>- Lưu: VP.</div>
                </div>
                <div className="text-center">
                  <div className="text-[11px] font-bold uppercase text-slate-800">TM. BCH ĐOÀN PHƯỜNG</div>
                  <div className="font-bold text-slate-900 text-[13px] mt-3">Phan Thị Bích Thảo</div>
                  <div className="text-[11px] text-emerald-700 font-semibold flex items-center justify-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> Ký số điện tử
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={exportFormat === 'excel' ? handleDownloadCSV : handlePrintPDF}
                className="h-11 bg-[#161891] hover:bg-[#0E1068] text-white font-bold text-[13px] rounded-xl flex items-center justify-center gap-1.5"
              >
                {exportFormat === 'excel' ? <Download className="w-4 h-4" /> : <Printer className="w-4 h-4" />}
                <span>{exportFormat === 'excel' ? 'Tải Excel (.csv)' : 'In / Lưu PDF'}</span>
              </button>

              <button
                onClick={handleDownloadCSV}
                className="h-11 bg-[#EEF0FB] text-[#161891] font-bold text-[13px] rounded-xl flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Tải CSV</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
