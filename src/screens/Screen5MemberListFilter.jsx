import React, { useState } from 'react';
import {
  Users, Search, Phone, MessageSquare, Briefcase,
  CheckCircle, AlertTriangle, X, Calendar, Sparkles, ChevronRight,
  UserPlus, FileSpreadsheet, Download, Upload, ArrowLeftRight,
  Edit3, Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EXCEL_IMPORT_BATCH } from '../data/mockData';

export default function Screen5MemberListFilter() {
  const {
    members,
    transferRequests,
    securitySettings,
    sendMemberMakeupReminder,
    createMemberProfile,
    updateMemberProfile,
    importMembersBatch,
    submitTransferRequest,
    processTransferRequest,
    triggerGlobalToast,
  } = useApp();

  const [sectionTab, setSectionTab] = useState('list'); // 'list' | 'transfer'
  const [filterType, setFilterType] = useState('all'); // 'all' | 'local' | 'working_far' | 'transferred'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [isEditingMember, setIsEditingMember] = useState(false);
  const [editForm, setEditForm] = useState({});

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [newMemberForm, setNewMemberForm] = useState({
    name: '',
    phone: '',
    memberCode: `ĐV-DN-${String(members.length + 1).padStart(3, '0')}`,
    joinDate: '26/03/2024',
    occupation: 'Công nhân sản xuất KCN',
    type: 'working_far',
    workplace: 'KCN Amata Biên Hòa',
    shift: 'Ca 1 (06h - 14h)',
  });

  const [transferForm, setTransferForm] = useState({
    memberName: 'Nguyễn Tấn Đạt',
    memberCode: 'ĐV-DN-013',
    direction: 'outgoing',
    fromBranch: 'Chi đoàn Khu phố 5 - P. Tam Hiệp',
    toBranch: 'Chi đoàn Công ty Pouchen - KCN Biên Hòa 1',
    reason: 'Chuyển nơi làm việc và chỗ ở sang gần KCN Biên Hòa 1',
  });

  const maskPhone = (phone) => {
    if (!securitySettings?.maskPhone || !phone) return phone;
    return phone.slice(0, 4) + '.xxx.' + phone.slice(-3);
  };

  const filteredMembers = members.filter((m) => {
    const matchType =
      filterType === 'all'
        ? true
        : filterType === 'local'
        ? m.type === 'local'
        : filterType === 'working_far'
        ? m.type === 'working_far'
        : filterType === 'transferred'
        ? m.type === 'transferred'
        : true;

    const q = searchQuery.toLowerCase();
    const matchSearch =
      m.name.toLowerCase().includes(q) ||
      m.phone.includes(searchQuery) ||
      (m.memberCode && m.memberCode.toLowerCase().includes(q)) ||
      (m.workplace && m.workplace.toLowerCase().includes(q));

    return matchType && matchSearch;
  });

  const counts = {
    all: members.length,
    local: members.filter((m) => m.type === 'local').length,
    working_far: members.filter((m) => m.type === 'working_far').length,
    transferred: members.filter((m) => m.type === 'transferred').length,
  };

  const handleExportMembersCSV = () => {
    const header = [
      'Mã ĐV',
      'Họ và tên',
      'Số điện thoại',
      'Ngày vào Đoàn',
      'Nghề nghiệp',
      'Nơi sinh hoạt',
      'Đơn vị làm việc',
      'Phân loại',
      'Ca làm việc',
      'Điểm rèn luyện',
    ];
    const rows = members.map((m) => [
      m.memberCode || '',
      m.name,
      maskPhone(m.phone),
      m.joinDate || '26/03/2020',
      m.occupation || 'Đoàn viên',
      m.branchName || 'Chi đoàn Khu phố 5',
      m.workplace,
      m.type === 'working_far' ? 'Đi làm xa / KCN' : m.type === 'transferred' ? 'Chuyển SH' : 'Tại địa phương',
      m.shift,
      m.points,
    ]);
    const csv =
      '\uFEFF' +
      [header, ...rows]
        .map((r) => r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(','))
        .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'HoSo_DoanVien_ChiDoanKP5.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    triggerGlobalToast(`Đã xuất danh sách ${members.length} hồ sơ đoàn viên (.csv)!`);
  };

  const handleCreateMember = (e) => {
    e.preventDefault();
    if (!newMemberForm.name.trim()) return;
    createMemberProfile(newMemberForm);
    setIsCreateModalOpen(false);
    triggerGlobalToast(`Đã thêm hồ sơ đoàn viên ${newMemberForm.name} vào Chi đoàn KP5!`);
  };

  const handleImportSampleExcel = () => {
    importMembersBatch(EXCEL_IMPORT_BATCH);
    setIsImportModalOpen(false);
    triggerGlobalToast(`Đã nhập hàng loạt ${EXCEL_IMPORT_BATCH.length} đoàn viên từ tệp Excel thành công!`);
  };

  const handleCSVUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || '');
      const lines = text.split(/\r?\n/).filter((l) => l.trim());
      if (lines.length <= 1) {
        handleImportSampleExcel();
        return;
      }
      const parsed = lines.slice(1).slice(0, 10).map((line) => {
        const cols = line.split(',').map((s) => s.replace(/^"|"$/g, '').trim());
        return {
          name: cols[0] || 'Đoàn viên mới',
          phone: cols[1] || '0909.111.222',
          type: cols[2]?.includes('xa') ? 'working_far' : 'local',
          workplace: cols[3] || 'KCN Biên Hòa',
          shift: cols[4] || 'Ca ngày',
        };
      });
      importMembersBatch(parsed);
      setIsImportModalOpen(false);
      triggerGlobalToast(`Đã nhập ${parsed.length} hồ sơ từ file "${file.name}"!`);
    };
    reader.readAsText(file);
  };

  const openMemberModal = (member) => {
    setSelectedMember(member);
    setIsEditingMember(false);
    setEditForm({
      phone: member.phone,
      occupation: member.occupation || 'Đoàn viên',
      workplace: member.workplace,
      shift: member.shift,
      type: member.type,
    });
  };

  const handleSaveEditMember = () => {
    if (!selectedMember) return;
    updateMemberProfile(selectedMember.id, editForm);
    setSelectedMember({ ...selectedMember, ...editForm });
    setIsEditingMember(false);
    triggerGlobalToast(`Đã cập nhật hồ sơ điện tử của Đ/c ${selectedMember.name}!`);
  };

  const handleSubmitTransfer = (e) => {
    e.preventDefault();
    if (!transferForm.toBranch.trim() || !transferForm.reason.trim()) return;
    submitTransferRequest(transferForm);
    triggerGlobalToast(`Đã gửi yêu cầu chuyển sinh hoạt cho Đ/c ${transferForm.memberName}!`);
  };

  return (
    <div className="p-4 space-y-4 pb-8">
      {/* SegmentedButton: Hồ sơ Đoàn viên vs Chuyển sinh hoạt */}
      <div className="grid grid-cols-2 gap-1 bg-slate-200/70 p-1 rounded-xl">
        <button
          onClick={() => setSectionTab('list')}
          className={`h-10 rounded-lg text-[13px] font-bold transition flex items-center justify-center gap-1.5 ${
            sectionTab === 'list' ? 'bg-white text-[#161891] shadow-xs' : 'text-slate-600'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Hồ sơ ({counts.all})</span>
        </button>

        <button
          onClick={() => setSectionTab('transfer')}
          className={`h-10 rounded-lg text-[13px] font-bold transition flex items-center justify-center gap-1.5 ${
            sectionTab === 'transfer' ? 'bg-white text-[#161891] shadow-xs' : 'text-slate-600'
          }`}
        >
          <ArrowLeftRight className="w-4 h-4" />
          <span>Chuyển SH ({transferRequests.length})</span>
        </button>
      </div>

      {sectionTab === 'list' ? (
        <>
          {/* Search & Actions Card */}
          <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-xs space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm tên, mã ĐV, SĐT, KCN..."
                className="w-full h-11 pl-10 pr-8 bg-[#F5F7FB] border border-slate-200 rounded-xl text-[13px] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#161891]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-700"
                  aria-label="Xóa tìm kiếm"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="h-10 px-2 bg-[#161891] hover:bg-[#0E1068] text-white text-[12px] font-bold rounded-xl flex items-center justify-center gap-1.5 transition"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Tạo ĐV</span>
              </button>
              <button
                type="button"
                onClick={() => setIsImportModalOpen(true)}
                className="h-10 px-2 bg-[#EEF0FB] hover:bg-[#E1E4F8] text-[#161891] text-[12px] font-bold rounded-xl flex items-center justify-center gap-1.5 transition"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Nhập Excel</span>
              </button>
              <button
                type="button"
                onClick={handleExportMembersCSV}
                className="h-10 px-2 bg-[#F5F7FB] hover:bg-slate-200/70 text-slate-800 text-[12px] font-bold rounded-xl flex items-center justify-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Xuất DS</span>
              </button>
            </div>
          </div>

          {/* 4 Filter Chips */}
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { id: 'all', label: 'Tất cả', count: counts.all },
              { id: 'local', label: 'Tại chỗ', count: counts.local },
              { id: 'working_far', label: 'Làm xa', count: counts.working_far },
              { id: 'transferred', label: 'Chuyển SH', count: counts.transferred },
            ].map((chip) => {
              const active = filterType === chip.id;
              return (
                <button
                  key={chip.id}
                  onClick={() => setFilterType(chip.id)}
                  className={`h-11 rounded-xl text-[12px] font-bold text-center transition flex flex-col items-center justify-center leading-tight ${
                    active
                      ? 'bg-[#161891] text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600'
                  }`}
                >
                  <span>{chip.label}</span>
                  <span className={`text-[11px] tabular-nums ${active ? 'text-white/80' : 'text-[#161891]'}`}>
                    {chip.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Danh sách ListTile 2 dòng gọn gàng chuẩn Flutter */}
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1 text-[12px] text-slate-500">
              <span>Hiển thị <strong className="text-slate-800">{filteredMembers.length}</strong> đoàn viên</span>
              <span>Chạm để xem chi tiết</span>
            </div>

            {filteredMembers.map((member) => (
              <div
                key={member.id}
                onClick={() => openMemberModal(member)}
                className="bg-white rounded-2xl p-3.5 border border-slate-200/80 hover:border-[#161891]/40 shadow-xs flex items-center justify-between gap-3 cursor-pointer active:scale-[0.99] transition"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-11 h-11 rounded-full border border-slate-200 object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-[14px] font-bold text-slate-900 truncate">{member.name}</h4>
                      {member.type === 'working_far' && (
                        <span className="text-[11px] font-semibold bg-[#EEF0FB] text-[#161891] px-2 py-0.5 rounded-md shrink-0">
                          KCN
                        </span>
                      )}
                      {member.type === 'transferred' && (
                        <span className="text-[11px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md shrink-0">
                          Chuyển SH
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] text-slate-500 truncate mt-0.5">
                      {member.memberCode} • {member.workplace}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right">
                    <div className="text-[14px] font-extrabold text-[#161891] tabular-nums">{member.points} đ</div>
                    <div className="text-[11px] text-slate-400">{member.shift}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            ))}

            {filteredMembers.length === 0 && (
              <div className="bg-white rounded-2xl p-6 text-center text-slate-400 space-y-2 border border-slate-200">
                <Users className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-[14px] font-semibold text-slate-700">Không tìm thấy đoàn viên</p>
                <p className="text-[12px]">Thử thay đổi từ khóa hoặc bộ lọc phân loại</p>
              </div>
            )}
          </div>
        </>
      ) : (
        /* Tab Chuyển sinh hoạt Đoàn */
        <div className="space-y-4">
          <div className="bg-[#161891] text-white rounded-2xl p-4 shadow-card">
            <span className="text-[11px] font-semibold bg-white/15 px-2.5 py-0.5 rounded-full">
              Chuyển sinh hoạt trực tuyến
            </span>
            <h3 className="text-[16px] font-bold mt-1.5">Tiếp nhận & Đồng bộ Hồ sơ</h3>
            <p className="text-[12px] text-white/80 mt-0.5">
              Kết nối Chi đoàn cũ — mới và lưu trữ lịch sử xử lý 4 bước.
            </p>
          </div>

          <form onSubmit={handleSubmitTransfer} className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
            <div className="font-bold text-[15px] text-slate-900 flex items-center gap-2">
              <ArrowLeftRight className="w-4 h-4 text-[#161891]" />
              <span>Gửi Yêu cầu mới</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">Đoàn viên</label>
                <input
                  type="text"
                  required
                  value={transferForm.memberName}
                  onChange={(e) => setTransferForm({ ...transferForm, memberName: e.target.value })}
                  className="w-full h-10 px-3 bg-[#F5F7FB] border border-slate-200 rounded-xl text-[13px]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">Loại hồ sơ</label>
                <select
                  value={transferForm.direction}
                  onChange={(e) => setTransferForm({ ...transferForm, direction: e.target.value })}
                  className="w-full h-10 px-2.5 bg-[#F5F7FB] border border-slate-200 rounded-xl text-[13px]"
                >
                  <option value="outgoing">Chuyển đi</option>
                  <option value="incoming">Chuyển đến</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-slate-700 mb-1">Chi đoàn tiếp nhận mới</label>
              <input
                type="text"
                required
                value={transferForm.toBranch}
                onChange={(e) => setTransferForm({ ...transferForm, toBranch: e.target.value })}
                className="w-full h-10 px-3 bg-[#F5F7FB] border border-slate-200 rounded-xl text-[13px]"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-slate-700 mb-1">Lý do chuyển</label>
              <input
                type="text"
                required
                value={transferForm.reason}
                onChange={(e) => setTransferForm({ ...transferForm, reason: e.target.value })}
                className="w-full h-10 px-3 bg-[#F5F7FB] border border-slate-200 rounded-xl text-[13px]"
              />
            </div>

            <button
              type="submit"
              className="w-full h-11 bg-[#161891] hover:bg-[#0E1068] text-white font-bold text-[13px] rounded-xl transition"
            >
              Gửi hồ sơ chuyển sinh hoạt
            </button>
          </form>

          <div className="space-y-3">
            <div className="text-[13px] font-bold text-slate-800 px-1">
              Hồ sơ đang xử lý ({transferRequests.length})
            </div>
            {transferRequests.map((tr) => (
              <div key={tr.id} className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-bold text-slate-900">{tr.memberName}</span>
                      <span className="text-[11px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        {tr.memberCode}
                      </span>
                    </div>
                    <span
                      className={`inline-block mt-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                        tr.direction === 'incoming'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-[#EEF0FB] text-[#161891]'
                      }`}
                    >
                      {tr.direction === 'incoming' ? 'Chuyển đến KP5' : 'Chuyển đi đơn vị khác'}
                    </span>
                  </div>

                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                      tr.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-700'
                        : tr.status === 'rejected'
                        ? 'bg-rose-50 text-rose-700'
                        : 'bg-[#EEF0FB] text-[#161891]'
                    }`}
                  >
                    {tr.status === 'completed'
                      ? 'Đã đồng bộ'
                      : tr.status === 'rejected'
                      ? 'Trả lại'
                      : tr.status === 'approved_source'
                      ? 'Chờ nơi đến'
                      : 'Chờ duyệt'}
                  </span>
                </div>

                <div className="bg-[#F5F7FB] p-3 rounded-xl text-[12px] space-y-1 text-slate-700">
                  <div><strong>Từ:</strong> {tr.fromBranch}</div>
                  <div><strong>Đến:</strong> {tr.toBranch}</div>
                  <div><strong>Lý do:</strong> {tr.reason} ({tr.submittedAt})</div>
                </div>

                <div className="grid grid-cols-4 gap-1.5 text-[11px] text-center">
                  {['Gửi đơn', 'Chi đoàn cũ', 'Phường', 'Hoàn tất'].map((stepLabel, idx) => {
                    const done = tr.step >= idx + 1;
                    return (
                      <div
                        key={stepLabel}
                        className={`py-1.5 px-1 rounded-lg font-semibold ${
                          done ? 'bg-[#161891] text-white' : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {stepLabel}
                      </div>
                    );
                  })}
                </div>

                {(tr.status === 'pending' || tr.status === 'approved_source') && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => {
                        processTransferRequest(tr.id, 'approve');
                        triggerGlobalToast(`Đã phê duyệt & đồng bộ dữ liệu chuyển SH cho ${tr.memberName}!`);
                      }}
                      className="h-10 bg-[#161891] hover:bg-[#0E1068] text-white font-bold text-[12px] rounded-xl flex items-center justify-center gap-1"
                    >
                      <Check className="w-4 h-4" />
                      <span>Duyệt & Đồng bộ</span>
                    </button>
                    <button
                      onClick={() => {
                        processTransferRequest(tr.id, 'reject');
                        triggerGlobalToast(`Đã trả lại hồ sơ chuyển SH của ${tr.memberName}.`);
                      }}
                      className="h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[12px] rounded-xl"
                    >
                      Yêu cầu bổ sung
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Flutter ModalBottomSheet: Chi tiết & Sửa hồ sơ Đoàn viên */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-[2px] flex items-end justify-center animate-fade-in">
          <div className="bg-white rounded-t-[28px] w-full max-w-[390px] max-h-[86dvh] overflow-y-auto shadow-2xl p-5 pb-7 space-y-4 animate-sheet-up">
            <div className="w-10 h-1 rounded-full bg-slate-300 mx-auto" />

            <div className="flex items-center justify-between">
              <span className="text-[12px] font-bold bg-[#EEF0FB] text-[#161891] px-3 py-1 rounded-full font-mono">
                {selectedMember.memberCode}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsEditingMember(!isEditingMember)}
                  className="w-9 h-9 rounded-full bg-[#EEF0FB] text-[#161891] flex items-center justify-center transition"
                  title="Chỉnh sửa hồ sơ"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 transition"
                  aria-label="Đóng"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3.5 bg-[#F5F7FB] p-3.5 rounded-2xl">
              <img
                src={selectedMember.avatar}
                alt={selectedMember.name}
                className="w-14 h-14 rounded-full border-2 border-[#161891] object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h3 className="text-[16px] font-bold text-slate-900 truncate">{selectedMember.name}</h3>
                <p className="text-[13px] text-slate-500 font-mono mt-0.5">{maskPhone(selectedMember.phone)}</p>
                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#EEF0FB] text-[#161891]">
                    {selectedMember.type === 'working_far'
                      ? 'Công nhân KCN'
                      : selectedMember.type === 'transferred'
                      ? 'Chuyển SH'
                      : 'Tại địa phương'}
                  </span>
                  <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                    {selectedMember.points} điểm
                  </span>
                </div>
              </div>
            </div>

            {isEditingMember ? (
              <div className="bg-[#F5F7FB] p-3.5 rounded-2xl space-y-2.5">
                <div className="text-[13px] font-bold text-[#161891]">Cập nhật hồ sơ điện tử</div>
                <div>
                  <label className="text-[12px] text-slate-600 font-semibold">Số điện thoại</label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-[13px] mt-0.5"
                  />
                </div>
                <div>
                  <label className="text-[12px] text-slate-600 font-semibold">Nghề nghiệp</label>
                  <input
                    type="text"
                    value={editForm.occupation}
                    onChange={(e) => setEditForm({ ...editForm, occupation: e.target.value })}
                    className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-[13px] mt-0.5"
                  />
                </div>
                <div>
                  <label className="text-[12px] text-slate-600 font-semibold">Đơn vị / KCN</label>
                  <input
                    type="text"
                    value={editForm.workplace}
                    onChange={(e) => setEditForm({ ...editForm, workplace: e.target.value })}
                    className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-[13px] mt-0.5"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[12px] text-slate-600 font-semibold">Ca làm</label>
                    <input
                      type="text"
                      value={editForm.shift}
                      onChange={(e) => setEditForm({ ...editForm, shift: e.target.value })}
                      className="w-full h-10 px-2.5 bg-white border border-slate-200 rounded-xl text-[13px] mt-0.5"
                    />
                  </div>
                  <div>
                    <label className="text-[12px] text-slate-600 font-semibold">Phân loại</label>
                    <select
                      value={editForm.type}
                      onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                      className="w-full h-10 px-2 bg-white border border-slate-200 rounded-xl text-[13px] mt-0.5"
                    >
                      <option value="local">Tại địa phương</option>
                      <option value="working_far">Đi làm xa</option>
                      <option value="transferred">Chuyển SH</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={handleSaveEditMember}
                  className="w-full h-11 bg-[#161891] text-white font-bold rounded-xl text-[13px]"
                >
                  Lưu thay đổi hồ sơ
                </button>
              </div>
            ) : (
              <div className="bg-[#F5F7FB] rounded-2xl p-3.5 space-y-2 text-[13px] text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Ngày vào Đoàn</span>
                  <strong className="text-slate-900">{selectedMember.joinDate}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nghề nghiệp</span>
                  <strong className="text-slate-900">{selectedMember.occupation}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Chi đoàn</span>
                  <strong className="text-[#161891]">{selectedMember.branchName}</strong>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-slate-500 shrink-0">Nơi làm việc</span>
                  <strong className="text-slate-900 text-right truncate">{selectedMember.workplace}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Lịch ca kíp</span>
                  <span className="font-bold text-[#161891]">{selectedMember.shift}</span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <h4 className="text-[13px] font-bold text-slate-900 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#161891]" />
                <span>Lịch sử 03 kỳ gần nhất</span>
              </h4>
              <div className="space-y-1.5">
                {selectedMember.attendanceHistory ? (
                  selectedMember.attendanceHistory.map((rec, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#F5F7FB] rounded-xl flex items-center justify-between text-[12px]"
                    >
                      <span className="font-semibold text-slate-800">{rec.month}</span>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                          rec.status === 'present'
                            ? 'bg-emerald-100 text-emerald-800'
                            : rec.status === 'makeup'
                            ? 'bg-[#EEF0FB] text-[#161891]'
                            : rec.status === 'military' || rec.status === 'transferred'
                            ? 'bg-slate-200 text-slate-700'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {rec.status === 'present' && <CheckCircle className="w-3 h-3" />}
                        {rec.status === 'makeup' && <Sparkles className="w-3 h-3" />}
                        {rec.status === 'absent' && <AlertTriangle className="w-3 h-3" />}
                        {rec.label}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-3 bg-[#F5F7FB] rounded-xl text-slate-500 text-[12px]">
                    Tham dự đầy đủ các kỳ sinh hoạt thường kỳ.
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => triggerGlobalToast(`Đang kết nối cuộc gọi đến ${selectedMember.name}...`)}
                  className="h-11 bg-[#EEF0FB] text-[#161891] font-bold text-[13px] rounded-xl flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-4 h-4" />
                  <span>Gọi điện</span>
                </button>
                <button
                  onClick={() => triggerGlobalToast(`Đã mở Zalo gửi tin nhắn tới ${selectedMember.name}!`)}
                  className="h-11 bg-[#161891] text-white font-bold text-[13px] rounded-xl flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Nhắn Zalo</span>
                </button>
              </div>

              {selectedMember.type === 'working_far' && (
                <button
                  onClick={() => {
                    sendMemberMakeupReminder(selectedMember);
                    triggerGlobalToast(`Đã gửi nhắc hẹn Sinh hoạt bù tới Đ/c ${selectedMember.name}!`);
                  }}
                  className="w-full h-11 bg-white border border-[#161891]/30 text-[#161891] font-bold text-[12px] rounded-xl flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Nhắc hẹn Đăng ký Sinh hoạt Bù</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Flutter ModalBottomSheet: Tạo mới ĐV */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-[2px] flex items-end justify-center animate-fade-in">
          <form
            onSubmit={handleCreateMember}
            className="bg-white rounded-t-[28px] p-5 pb-7 max-w-[390px] w-full shadow-2xl space-y-3.5 animate-sheet-up"
          >
            <div className="w-10 h-1 rounded-full bg-slate-300 mx-auto" />
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-bold text-slate-900">Tạo Hồ sơ Đoàn viên</h3>
              <button type="button" onClick={() => setIsCreateModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="col-span-2">
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">Họ và tên *</label>
                <input
                  type="text"
                  required
                  value={newMemberForm.name}
                  onChange={(e) => setNewMemberForm({ ...newMemberForm, name: e.target.value })}
                  placeholder="Nhập họ tên đoàn viên"
                  className="w-full h-10 px-3 bg-[#F5F7FB] border border-slate-200 rounded-xl text-[13px]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">Mã đoàn viên</label>
                <input
                  type="text"
                  value={newMemberForm.memberCode}
                  onChange={(e) => setNewMemberForm({ ...newMemberForm, memberCode: e.target.value })}
                  className="w-full h-10 px-3 bg-[#F5F7FB] border border-slate-200 rounded-xl text-[13px] font-mono"
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">Số điện thoại *</label>
                <input
                  type="tel"
                  required
                  value={newMemberForm.phone}
                  onChange={(e) => setNewMemberForm({ ...newMemberForm, phone: e.target.value })}
                  placeholder="09xx.xxx.xxx"
                  className="w-full h-10 px-3 bg-[#F5F7FB] border border-slate-200 rounded-xl text-[13px]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">Ngày vào Đoàn</label>
                <input
                  type="text"
                  value={newMemberForm.joinDate}
                  onChange={(e) => setNewMemberForm({ ...newMemberForm, joinDate: e.target.value })}
                  className="w-full h-10 px-3 bg-[#F5F7FB] border border-slate-200 rounded-xl text-[13px]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">Phân loại</label>
                <select
                  value={newMemberForm.type}
                  onChange={(e) => setNewMemberForm({ ...newMemberForm, type: e.target.value })}
                  className="w-full h-10 px-2.5 bg-[#F5F7FB] border border-slate-200 rounded-xl text-[13px]"
                >
                  <option value="working_far">Đi làm xa / KCN</option>
                  <option value="local">Tại địa phương</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">Đơn vị / KCN</label>
                <input
                  type="text"
                  value={newMemberForm.workplace}
                  onChange={(e) => setNewMemberForm({ ...newMemberForm, workplace: e.target.value })}
                  className="w-full h-10 px-3 bg-[#F5F7FB] border border-slate-200 rounded-xl text-[13px]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-[#161891] text-white font-bold text-[14px] rounded-xl"
            >
              Lưu hồ sơ đoàn viên
            </button>
          </form>
        </div>
      )}

      {/* Flutter ModalBottomSheet: Nhập hàng loạt từ Excel */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-[2px] flex items-end justify-center animate-fade-in">
          <div className="bg-white rounded-t-[28px] p-5 pb-7 max-w-[390px] w-full shadow-2xl space-y-4 animate-sheet-up">
            <div className="w-10 h-1 rounded-full bg-slate-300 mx-auto" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-[#161891]" />
                <h3 className="text-[16px] font-bold text-slate-900">Nhập từ Excel / CSV</h3>
              </div>
              <button onClick={() => setIsImportModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[13px] text-slate-600 leading-relaxed">
              Tải lên file danh sách đoàn viên (.csv / .xlsx) hoặc nhập nhanh lô công nhân KCN mới.
            </p>

            <label className="w-full py-4 px-4 bg-[#EEF0FB] border border-dashed border-[#161891]/40 rounded-2xl flex flex-col items-center justify-center gap-1.5 cursor-pointer text-[#161891] font-bold text-[13px]">
              <Upload className="w-5 h-5" />
              <span>Chọn tệp Excel / CSV từ thiết bị</span>
              <input type="file" accept=".csv,.txt" onChange={handleCSVUpload} className="hidden" />
            </label>

            <div className="p-3.5 bg-[#F5F7FB] rounded-2xl space-y-1.5">
              <div className="font-bold text-[#161891] text-[12px]">
                Dữ liệu mẫu sẵn sàng ({EXCEL_IMPORT_BATCH.length} ĐV)
              </div>
              {EXCEL_IMPORT_BATCH.map((row) => (
                <div key={row.phone} className="text-[12px] text-slate-700 flex justify-between gap-2">
                  <span className="font-medium truncate">{row.name}</span>
                  <span className="text-slate-500 truncate">{row.workplace}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleImportSampleExcel}
              className="w-full h-12 bg-[#161891] hover:bg-[#0E1068] text-white font-bold text-[14px] rounded-xl"
            >
              Nhập danh sách này ngay
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
