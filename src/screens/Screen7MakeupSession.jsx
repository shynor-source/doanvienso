import React, { useState } from 'react';
import {
  Clock, MapPin, CalendarDays, CheckCircle2, Check, BookOpen,
  Award, X, ShieldCheck, Briefcase, AlertTriangle, RotateCcw,
  FilePlus2, PlusCircle, QrCode, Trash2, Building2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QUIZ_QUESTIONS, SCHEDULE_WEEK_DAYS } from '../data/mockData';
import { useApp } from '../context/AppContext';

export default function Screen7MakeupSession({ currentRole = 'member', onNavigate }) {
  const {
    currentMember,
    activeSession,
    mySchedule,
    scheduleCatalog,
    makeupRequests,
    enrollScheduleItem,
    unenrollScheduleItem,
    createScheduleCatalogItem,
    completeELearningQuiz,
    handleMakeupRequestAction,
    submitAbsenceRequest,
    triggerGlobalToast,
  } = useApp();

  const [selectedDay, setSelectedDay] = useState('all'); // 'all' | '25/11/2026' ...
  const [activeTab, setActiveTab] = useState('timetable'); // 'timetable' | 'catalog' | 'requests'

  const [isAbsenceModalOpen, setIsAbsenceModalOpen] = useState(false);
  const [absenceForm, setAbsenceForm] = useState({
    reason: 'Lịch công tác đột xuất / Trùng giờ làm việc',
    proof: 'Xác nhận của đơn vị công tác',
    preferredMakeup: 'Chuyển sang tham gia chuyên đề trực tuyến',
  });

  const [isCreateScheduleOpen, setIsCreateScheduleOpen] = useState(false);
  const [newScheduleForm, setNewScheduleForm] = useState({
    title: '',
    category: 'Sinh hoạt',
    dateStr: '29/11/2026',
    dayOfWeek: 'CN',
    timeSlot: '08:00 - 10:30',
    room: 'Nhà văn hóa Khu phố 5',
    pointsValue: 20,
    isELearning: false,
    autoEnroll: true,
  });

  // Chuyên đề trực tuyến Quiz Modal
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const isOfficer = currentRole === 'secretary' || currentRole === 'ward_officer';

  const filteredSchedule = mySchedule
    .filter((item) => (selectedDay === 'all' ? true : item.dateStr === selectedDay))
    .sort((a, b) => a.dateStr.localeCompare(b.dateStr));

  const filteredCatalog = scheduleCatalog.filter((item) =>
    selectedDay === 'all' ? true : item.dateStr === selectedDay
  );

  const handleEnroll = (item) => {
    const res = enrollScheduleItem(item);
    if (!res.ok) {
      triggerGlobalToast('Hoạt động này đã có trong Lịch cá nhân của bạn.');
      return;
    }
    triggerGlobalToast(`Đã thêm "${item.title}" vào Lịch cá nhân (${item.dateStr})!`);
  };

  const handleCreateScheduleSubmit = (e) => {
    e.preventDefault();
    if (!newScheduleForm.title.trim()) return;
    const dayEntry = SCHEDULE_WEEK_DAYS.find((d) => d.key === newScheduleForm.dateStr);
    createScheduleCatalogItem({
      ...newScheduleForm,
      dayOfWeek: dayEntry ? dayEntry.label : 'CN',
      organizer: currentRole === 'ward_officer' ? 'Đoàn Phường Tam Hiệp' : 'BCH Chi đoàn Khu phố 5',
    });
    setIsCreateScheduleOpen(false);
    setNewScheduleForm({
      title: '',
      category: 'Sinh hoạt',
      dateStr: '29/11/2026',
      dayOfWeek: 'CN',
      timeSlot: '08:00 - 10:30',
      room: 'Nhà văn hóa Khu phố 5',
      pointsValue: 20,
      isELearning: false,
      autoEnroll: true,
    });
    triggerGlobalToast('Đã thêm hoạt động mới vào danh sách đăng ký Lịch!');
  };

  const handleSubmitAbsence = (e) => {
    e.preventDefault();
    if (!absenceForm.reason.trim()) return;
    submitAbsenceRequest({
      sessionTitle: activeSession.title,
      ...absenceForm,
    });
    setIsAbsenceModalOpen(false);
    triggerGlobalToast('Đã gửi đơn xin phép thành công!');
  };

  const handleSelectOption = (questionId, optionIndex) => {
    if (quizSubmitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmitQuiz = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) {
        score += 1;
      }
    });

    setQuizScore(score);
    setQuizSubmitted(true);

    if (score >= 2) {
      const res = completeELearningQuiz(score, QUIZ_QUESTIONS.length);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.65 },
        });
      } catch {
        // Fallback
      }
      if (res.pointsAwarded) {
        triggerGlobalToast(`Đạt ${score}/3 câu! Đã cấp chứng nhận chuyên đề & cộng +10 điểm.`);
      }
    }
  };

  const handleRetryQuiz = () => {
    setQuizSubmitted(false);
    setUserAnswers({});
    setQuizScore(0);
  };

  const pendingRequests = makeupRequests.filter((r) => r.status === 'pending');

  return (
    <div className="p-4 space-y-4 pb-8">
      {/* Header Lịch hoạt động cá nhân */}
      <div className="app-card p-4 space-y-3.5">
        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-bold text-[#161891] bg-[#EEF0FB] px-2.5 py-0.5 rounded-full">
              Tuần 25/11 — 30/11/2026
            </span>
            <h2 className="text-[16px] font-bold text-slate-900 mt-1.5">
              Lịch hoạt động cá nhân
            </h2>
            <p className="text-[12px] text-slate-500">
              {mySchedule.length} sự kiện đã đăng ký • Đồng bộ từ Bảng tin & Chi đoàn
            </p>
          </div>

          {isOfficer ? (
            <button
              type="button"
              onClick={() => setIsCreateScheduleOpen(true)}
              className="h-9 px-3 bg-[#161891] hover:bg-[#0E1068] text-white text-[12px] font-bold rounded-xl flex items-center gap-1 shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Tạo lịch</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsAbsenceModalOpen(true)}
              className="h-9 px-3 bg-[#EEF0FB] text-[#161891] text-[12px] font-bold rounded-xl flex items-center gap-1 shrink-0"
            >
              <FilePlus2 className="w-4 h-4" />
              <span>Báo vắng</span>
            </button>
          )}
        </div>

        {/* Thanh Lịch 7 Ngày */}
        <div className="grid grid-cols-7 gap-1 pt-1">
          {SCHEDULE_WEEK_DAYS.map((day) => {
            const active = selectedDay === day.key;
            const hasEvents =
              day.key === 'all'
                ? mySchedule.length > 0
                : mySchedule.some((s) => s.dateStr === day.key);

            return (
              <button
                key={day.key}
                type="button"
                onClick={() => setSelectedDay(day.key)}
                className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-0.5 transition ${
                  active
                    ? 'bg-[#161891] text-white shadow-xs'
                    : 'bg-[#F5F7FB] text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <span className={`text-[11px] font-medium ${active ? 'text-white/85' : 'text-slate-500'}`}>
                  {day.label}
                </span>
                <span className="text-[13px] font-extrabold tabular-nums">{day.dayNum}</span>
                <span
                  className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                    hasEvents
                      ? active
                        ? 'bg-white'
                        : 'bg-[#161891]'
                      : 'bg-transparent'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Segmented Control 3 Tab Lịch */}
      <div className="grid grid-cols-3 gap-1 bg-slate-200/70 p-1 rounded-xl">
        <button
          type="button"
          onClick={() => setActiveTab('timetable')}
          className={`h-10 rounded-lg text-[12px] font-bold transition ${
            activeTab === 'timetable' ? 'bg-white text-[#161891] shadow-xs' : 'text-slate-600'
          }`}
        >
          Lịch của tôi ({mySchedule.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('catalog')}
          className={`h-10 rounded-lg text-[12px] font-bold transition ${
            activeTab === 'catalog' ? 'bg-white text-[#161891] shadow-xs' : 'text-slate-600'
          }`}
        >
          Đăng ký ({scheduleCatalog.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('requests')}
          className={`h-10 rounded-lg text-[12px] font-bold transition ${
            activeTab === 'requests' ? 'bg-white text-[#161891] shadow-xs' : 'text-slate-600'
          }`}
        >
          Đơn phép ({makeupRequests.length})
        </button>
      </div>

      {/* TAB 1: LỊCH CÁ NHÂN CỦA TÔI */}
      {activeTab === 'timetable' && (
        <div className="space-y-3">
          {filteredSchedule.length === 0 ? (
            <div className="app-card p-6 text-center space-y-2.5">
              <CalendarDays className="w-8 h-8 mx-auto text-[#161891]/40" />
              <div className="text-[14px] font-bold text-slate-800">
                Không có lịch hoạt động trong ngày này
              </div>
              <p className="text-[12px] text-slate-500">
                Chọn &ldquo;Tất cả&rdquo; hoặc chuyển sang mục &ldquo;Đăng ký&rdquo; để thêm sự kiện, hoạt động vào lịch cá nhân.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('catalog')}
                className="h-9 px-4 bg-[#EEF0FB] text-[#161891] text-[12px] font-bold rounded-xl"
              >
                Khám phá hoạt động
              </button>
            </div>
          ) : (
            filteredSchedule.map((item) => {
              const startTime = item.timeSlot?.split('-')[0]?.trim() || '08:00';
              const endTime = item.timeSlot?.split('-')[1]?.trim() || '10:00';

              return (
                <div key={item.id} className="app-card p-4 flex gap-3.5">
                  {/* Cột Thời gian */}
                  <div className="w-14 shrink-0 text-right pt-0.5">
                    <div className="text-[13px] font-extrabold text-[#161891] tabular-nums">{startTime}</div>
                    <div className="text-[11px] font-medium text-slate-400 tabular-nums">{endTime}</div>
                    <div className="mt-1.5 inline-block px-1.5 py-0.5 rounded bg-[#F5F7FB] text-[11px] font-bold text-slate-600 tabular-nums">
                      {item.dayOfWeek} {item.dateStr.slice(0, 5)}
                    </div>
                  </div>

                  {/* Thanh dọc phân cách */}
                  <div className="w-1 rounded-full bg-[#161891] shrink-0" />

                  {/* Chi tiết lịch học / sự kiện */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold bg-[#EEF0FB] text-[#161891] px-2 py-0.5 rounded-md">
                        {item.category}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-700">{item.points}</span>
                    </div>

                    <h3 className="text-[14px] font-bold text-slate-900 leading-5">
                      {item.title}
                    </h3>

                    <div className="space-y-1 text-[12px] text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#161891] shrink-0" />
                        <span className="truncate">{item.room}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{item.organizer} • {item.format}</span>
                      </div>
                    </div>

                    <div className="pt-1.5 flex items-center gap-2">
                      {item.isELearning ? (
                        <button
                          type="button"
                          onClick={() => {
                            setIsQuizModalOpen(true);
                            setQuizSubmitted(false);
                            setUserAnswers({});
                          }}
                          className="h-9 px-3.5 bg-[#161891] hover:bg-[#0E1068] text-white text-[12px] font-bold rounded-xl flex items-center gap-1.5 transition"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Tham gia trực tuyến</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onNavigate?.(isOfficer ? 'create_qr' : 'scan_qr')}
                          className="h-9 px-3.5 bg-[#161891] hover:bg-[#0E1068] text-white text-[12px] font-bold rounded-xl flex items-center gap-1.5 transition"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>{isOfficer ? 'Mở QR' : 'Điểm danh QR'}</span>
                        </button>
                      )}

                      {!item.mandatory && (
                        <button
                          type="button"
                          onClick={() => {
                            unenrollScheduleItem(item.id);
                            triggerGlobalToast(`Đã hủy đăng ký "${item.title}" khỏi Lịch cá nhân.`);
                          }}
                          className="h-9 px-2.5 bg-[#F5F7FB] hover:bg-rose-50 text-slate-500 hover:text-rose-600 text-[12px] font-semibold rounded-xl flex items-center gap-1 transition"
                          title="Xóa khỏi lịch cá nhân"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hủy lịch</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: DANH MỤC ĐĂNG KÝ HOẠT ĐỘNG */}
      {activeTab === 'catalog' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-[13px] font-bold text-slate-800">
              Lịch sinh hoạt, Chuyên đề & Sự kiện mở đăng ký
            </span>
            <span className="text-[12px] text-[#161891] font-semibold">{filteredCatalog.length} mục</span>
          </div>

          {filteredCatalog.map((item) => {
            const isEnrolled = mySchedule.some((s) => s.id === item.id || s.title === item.title);

            return (
              <div key={item.id} className="app-card p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-bold bg-[#EEF0FB] text-[#161891] px-2.5 py-0.5 rounded-full">
                        {item.category}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-700">{item.points}</span>
                    </div>
                    <h4 className="text-[15px] font-bold text-slate-900 mt-1.5 leading-5">
                      {item.title}
                    </h4>
                  </div>
                  <span className="text-[11px] bg-[#F5F7FB] text-slate-600 font-semibold px-2.5 py-1 rounded-full shrink-0">
                    {item.seatsLeft === 999 ? 'Không giới hạn' : `Còn ${item.seatsLeft} suất`}
                  </span>
                </div>

                <div className="space-y-1.5 text-[12px] text-slate-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#161891] shrink-0" />
                    <span className="font-semibold text-slate-800">
                      {item.dayOfWeek}, {item.dateStr} • {item.timeSlot}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#161891] shrink-0" />
                    <span className="truncate">{item.room} ({item.organizer})</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[12px] text-slate-500">{item.format}</span>

                  <button
                    type="button"
                    onClick={() => handleEnroll(item)}
                    disabled={isEnrolled}
                    className={`h-10 px-4 rounded-xl text-[12px] font-bold flex items-center gap-1.5 transition shrink-0 ${
                      isEnrolled
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-[#161891] hover:bg-[#0E1068] text-white'
                    }`}
                  >
                    {isEnrolled ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Đã có trong Lịch</span>
                      </>
                    ) : (
                      <>
                        <PlusCircle className="w-4 h-4" />
                        <span>Đăng ký vào Lịch</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: ĐƠN PHÉP & XÉT DUYỆT LỊCH */}
      {activeTab === 'requests' && (
        <div className="space-y-3">
          {!isOfficer && (
            <button
              type="button"
              onClick={() => setIsAbsenceModalOpen(true)}
              className="w-full h-11 bg-[#161891] hover:bg-[#0E1068] text-white font-bold text-[13px] rounded-xl flex items-center justify-center gap-2 transition"
            >
              <FilePlus2 className="w-4 h-4" />
              <span>Gửi đơn xin phép / Đổi lịch trực tuyến</span>
            </button>
          )}

          {isOfficer && (
            <div className="app-card p-3.5 flex items-center justify-between">
              <div className="text-[13px] font-bold text-slate-900">
                Đang chờ phê duyệt: <span className="text-[#161891]">{pendingRequests.length} đơn</span>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateScheduleOpen(true)}
                className="text-[12px] font-bold text-[#161891]"
              >
                + Thêm lịch mới
              </button>
            </div>
          )}

          {makeupRequests.map((req) => (
            <div key={req.id} className="app-card p-4 space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-[14px] font-bold text-slate-900">{req.memberName}</h4>
                  <div className="text-[12px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <Briefcase className="w-3.5 h-3.5" /> {req.workplace}
                  </div>
                </div>
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                    req.status === 'approved'
                      ? 'bg-emerald-50 text-emerald-700'
                      : req.status === 'clarify_requested'
                      ? 'bg-rose-50 text-rose-700'
                      : 'bg-[#EEF0FB] text-[#161891]'
                  }`}
                >
                  {req.status === 'approved'
                    ? 'Đã duyệt'
                    : req.status === 'clarify_requested'
                    ? 'Cần bổ sung'
                    : 'Chờ duyệt'}
                </span>
              </div>

              <div className="bg-[#F5F7FB] p-3 rounded-xl text-[12px] space-y-1 text-slate-700">
                <div><strong>Nội dung đăng ký:</strong> {req.registeredMakeup}</div>
                <div><strong>Lý do:</strong> {req.reason}</div>
                <div className="text-emerald-700 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> {req.proof}
                </div>
              </div>

              {isOfficer && req.status === 'pending' && (
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => {
                      handleMakeupRequestAction(req.id, 'approve');
                      triggerGlobalToast(`Đã phê duyệt đơn của Đ/c ${req.memberName}!`);
                    }}
                    className="flex-1 h-10 bg-[#161891] hover:bg-[#0E1068] text-white font-bold text-[12px] rounded-xl flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" /> Phê duyệt
                  </button>
                  <button
                    onClick={() => {
                      handleMakeupRequestAction(req.id, 'clarify');
                      triggerGlobalToast(`Đã gửi yêu cầu bổ sung tới Đ/c ${req.memberName}.`);
                    }}
                    className="h-10 px-3.5 bg-slate-100 text-slate-700 font-semibold text-[12px] rounded-xl"
                  >
                    Bổ sung
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Flutter ModalBottomSheet: Tạo lịch mới (Bí thư / Cán bộ Đoàn) */}
      {isCreateScheduleOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-[2px] flex items-end justify-center animate-fade-in">
          <form
            onSubmit={handleCreateScheduleSubmit}
            className="bg-white rounded-t-[28px] p-5 pb-7 max-w-[390px] w-full shadow-2xl space-y-3.5 animate-sheet-up"
          >
            <div className="w-10 h-1 rounded-full bg-slate-300 mx-auto" />
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-bold text-slate-900">Tạo Lịch Sinh hoạt / Hoạt động</h3>
              <button type="button" onClick={() => setIsCreateScheduleOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-slate-700 mb-1">Tên sự kiện / hoạt động *</label>
              <input
                type="text"
                required
                value={newScheduleForm.title}
                onChange={(e) => setNewScheduleForm({ ...newScheduleForm, title: e.target.value })}
                placeholder="VD: Tập huấn Kỹ năng Truyền thông Số"
                className="w-full h-11 px-3 bg-[#F5F7FB] border border-slate-200 rounded-xl text-[13px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">Ngày diễn ra</label>
                <select
                  value={newScheduleForm.dateStr}
                  onChange={(e) => setNewScheduleForm({ ...newScheduleForm, dateStr: e.target.value })}
                  className="w-full h-11 px-2.5 bg-[#F5F7FB] border border-slate-200 rounded-xl text-[13px]"
                >
                  {SCHEDULE_WEEK_DAYS.filter((d) => d.key !== 'all').map((d) => (
                    <option key={d.key} value={d.key}>
                      {d.label} — {d.key}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">Khung giờ</label>
                <input
                  type="text"
                  required
                  value={newScheduleForm.timeSlot}
                  onChange={(e) => setNewScheduleForm({ ...newScheduleForm, timeSlot: e.target.value })}
                  className="w-full h-11 px-3 bg-[#F5F7FB] border border-slate-200 rounded-xl text-[13px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-slate-700 mb-1">Địa điểm tổ chức</label>
              <input
                type="text"
                required
                value={newScheduleForm.room}
                onChange={(e) => setNewScheduleForm({ ...newScheduleForm, room: e.target.value })}
                className="w-full h-11 px-3 bg-[#F5F7FB] border border-slate-200 rounded-xl text-[13px]"
              />
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-[#161891] hover:bg-[#0E1068] text-white font-bold text-[14px] rounded-xl"
            >
              Thêm vào danh sách đăng ký Lịch
            </button>
          </form>
        </div>
      )}

      {/* Flutter ModalBottomSheet: Đơn xin phép */}
      {isAbsenceModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-[2px] flex items-end justify-center animate-fade-in">
          <form
            onSubmit={handleSubmitAbsence}
            className="bg-white rounded-t-[28px] p-5 pb-7 max-w-[390px] w-full shadow-2xl space-y-3.5 animate-sheet-up"
          >
            <div className="w-10 h-1 rounded-full bg-slate-300 mx-auto" />
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-bold text-slate-900">Đơn Xin phép & Đổi lịch</h3>
              <button type="button" onClick={() => setIsAbsenceModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-[#F5F7FB] rounded-xl text-[12px] text-slate-700">
              <strong>Buổi xin phép:</strong> {activeSession.title}
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-slate-700 mb-1">Lý do *</label>
              <textarea
                rows={2}
                required
                value={absenceForm.reason}
                onChange={(e) => setAbsenceForm({ ...absenceForm, reason: e.target.value })}
                className="w-full p-3 bg-[#F5F7FB] border border-slate-200 rounded-xl text-[13px]"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-slate-700 mb-1">Minh chứng đính kèm</label>
              <input
                type="text"
                value={absenceForm.proof}
                onChange={(e) => setAbsenceForm({ ...absenceForm, proof: e.target.value })}
                className="w-full h-11 px-3 bg-[#F5F7FB] border border-slate-200 rounded-xl text-[13px]"
              />
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-[#161891] hover:bg-[#0E1068] text-white font-bold text-[14px] rounded-xl"
            >
              Gửi đơn xét duyệt
            </button>
          </form>
        </div>
      )}

      {/* Flutter ModalBottomSheet: Chuyên đề trực tuyến Quiz */}
      {isQuizModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-[2px] flex items-end justify-center animate-fade-in">
          <div className="bg-white rounded-t-[28px] w-full max-w-[390px] max-h-[88dvh] overflow-y-auto shadow-2xl space-y-4 p-5 pb-7 animate-sheet-up">
            <div className="w-10 h-1 rounded-full bg-slate-300 mx-auto" />
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-[#EEF0FB] text-[#161891] rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-slate-900">Chuyên đề trực tuyến: Chuyển đổi số</h3>
                  <p className="text-[12px] text-slate-500">Đúng tối thiểu 2/3 câu để hoàn thành</p>
                </div>
              </div>
              <button
                onClick={() => setIsQuizModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!quizSubmitted ? (
              <div className="space-y-4">
                {QUIZ_QUESTIONS.map((q, qIdx) => (
                  <div key={q.id} className="space-y-2">
                    <div className="font-bold text-[13px] text-slate-900 leading-snug">
                      <span className="text-[#161891] mr-1">Câu {qIdx + 1}:</span>
                      {q.question}
                    </div>

                    <div className="space-y-1.5">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = userAnswers[q.id] === optIdx;
                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => handleSelectOption(q.id, optIdx)}
                            className={`w-full text-left p-3 rounded-xl text-[12px] font-medium transition border ${
                              isSelected
                                ? 'bg-[#EEF0FB] border-[#161891] text-[#161891] font-bold'
                                : 'bg-[#F5F7FB] border-slate-200 text-slate-700'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <button
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(userAnswers).length < QUIZ_QUESTIONS.length}
                  className="w-full h-12 bg-[#161891] hover:bg-[#0E1068] disabled:opacity-50 text-white font-bold text-[14px] rounded-xl flex items-center justify-center gap-2"
                >
                  <Award className="w-4 h-4" />
                  <span>Nộp bài & Chấm điểm</span>
                </button>
              </div>
            ) : quizScore >= 2 ? (
              <div className="space-y-4 text-center">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                    Đạt {quizScore}/{QUIZ_QUESTIONS.length} câu
                  </span>
                  <h3 className="text-[18px] font-extrabold text-slate-900 mt-2">Hoàn thành chuyên đề!</h3>
                </div>

                <div className="bg-[#F5F7FB] p-4 rounded-2xl border border-[#161891]/20 text-left space-y-2 text-[12px] text-slate-700">
                  <div className="text-center pb-2 border-b border-slate-200">
                    <span className="text-[11px] font-bold text-[#161891]">TỈNH ĐOÀN ĐỒNG NAI</span>
                    <h4 className="text-[13px] font-extrabold text-slate-900 mt-0.5">
                      CHỨNG NHẬN HOÀN THÀNH CHUYÊN ĐỀ
                    </h4>
                  </div>
                  <div>Đoàn viên: <strong className="text-slate-900">{currentMember.name}</strong></div>
                  <div>Điểm cộng: <strong className="text-[#161891]">+10 điểm</strong></div>
                  <div>Mã xác thực: <span className="font-mono text-[#161891] font-bold">DN-EL-2026-8831</span></div>
                </div>

                <button
                  onClick={() => setIsQuizModalOpen(false)}
                  className="w-full h-12 bg-[#161891] text-white font-bold text-[14px] rounded-xl"
                >
                  Hoàn tất
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-center">
                <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-[17px] font-bold text-slate-900">Chưa đạt ({quizScore}/3 câu)</h3>
                  <p className="text-[13px] text-slate-600 mt-1">
                    Cần đúng tối thiểu 2/3 câu hỏi để hoàn thành chuyên đề.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={handleRetryQuiz}
                    className="h-11 bg-[#161891] text-white font-bold text-[13px] rounded-xl flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-4 h-4" /> Làm lại
                  </button>
                  <button
                    onClick={() => setIsQuizModalOpen(false)}
                    className="h-11 bg-slate-100 text-slate-700 font-bold text-[13px] rounded-xl"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
