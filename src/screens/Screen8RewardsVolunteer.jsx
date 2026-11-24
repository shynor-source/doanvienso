import React, { useState } from 'react';
import {
  Award, Heart, Calendar, CheckCircle2, Gift,
  X, Fuel, Film, Shirt, Bus, Download, MapPin,
  Wallet, Users, Check, PlusCircle, QrCode, Camera,
  Trophy, Zap, Share2, Newspaper, Upload
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { SOCIAL_EVENT_PRESETS } from '../data/mockData';

export default function Screen8RewardsVolunteer({ onNavigateSocial }) {
  const {
    currentMember,
    members,
    userPoints,
    rewardItems,
    vouchers,
    volunteerActivities,
    registeredVolunteerIds,
    volunteerCheckedInIds,
    volunteerProofs,
    digitalBadges,
    redeemReward,
    toggleVolunteerRegistration,
    createVolunteerActivity,
    checkInVolunteerQR,
    submitVolunteerProof,
    awardBonusPoints,
    setPreselectedSocialEvent,
    triggerGlobalToast,
  } = useApp();

  const [sectionTab, setSectionTab] = useState('activities'); // 'activities' | 'ranking' | 'vouchers'
  const [selectedReward, setSelectedReward] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [generatedVoucher, setGeneratedVoucher] = useState(null);

  const [isCreateActivityOpen, setIsCreateActivityOpen] = useState(false);
  const [newActivityForm, setNewActivityForm] = useState({
    title: '',
    date: '19/12/2026 (07:30 - 11:00)',
    location: 'Khu phố 5 - Phường Tam Hiệp',
    pointsValue: 20,
  });

  const [participantsModalAct, setParticipantsModalAct] = useState(null);
  const [proofModalAct, setProofModalAct] = useState(null);
  const [proofNote, setProofNote] = useState('Đã hoàn thành nhiệm vụ cùng tổ thanh niên xung kích.');
  const [proofImage, setProofImage] = useState(SOCIAL_EVENT_PRESETS[0].imageUrl);

  const handleSelectReward = (item) => {
    if (typeof item.available === 'number' && item.available <= 0) {
      triggerGlobalToast('Quà tặng này hiện đã hết suất!');
      return;
    }
    if (userPoints < item.points) {
      triggerGlobalToast(`Chưa đủ điểm rèn luyện! Cần thêm ${item.points - userPoints} điểm.`);
      return;
    }
    setSelectedReward(item);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmRedeem = () => {
    if (!selectedReward) return;
    const res = redeemReward(selectedReward);
    setIsConfirmModalOpen(false);
    if (!res.ok) {
      triggerGlobalToast(res.outOfStock ? 'Quà tặng đã hết suất!' : `Cần thêm ${res.missing} điểm.`);
      return;
    }

    setGeneratedVoucher(res.voucher);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.65 },
      });
    } catch {
      // Fallback
    }
  };

  const handleVolunteerToggle = (act) => {
    const res = toggleVolunteerRegistration(act.id);
    if (!res.ok) return;
    if (res.registered) {
      triggerGlobalToast(`Đã đăng ký tham gia "${act.title}" (${act.points})!`);
    } else {
      triggerGlobalToast(`Đã hủy đăng ký tham gia "${act.title}".`);
    }
  };

  const handleVolunteerQR = (act) => {
    const res = checkInVolunteerQR(act.id);
    if (!res.ok) {
      triggerGlobalToast('Bạn đã quét QR điểm danh hoạt động này rồi.');
      return;
    }
    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.65 } });
    } catch {
      // Fallback
    }
    triggerGlobalToast(`Điểm danh QR hoạt động "${act.title}" thành công (+${res.points}đ)!`);
  };

  const handleProofFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setProofImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProof = (e) => {
    e.preventDefault();
    if (!proofModalAct) return;
    submitVolunteerProof(proofModalAct.id, {
      mediaLabel: 'Ảnh minh chứng hoạt động',
      note: proofNote,
      imageUrl: proofImage,
    });
    triggerGlobalToast(`Đã gửi hình ảnh minh chứng cho "${proofModalAct.title}"!`);
    setProofModalAct(null);
  };

  const handleShareEventToSocial = (act, customImg) => {
    setPreselectedSocialEvent({
      eventTag: act.title,
      imageUrl: customImg || volunteerProofs[act.id]?.imageUrl || SOCIAL_EVENT_PRESETS[0].imageUrl,
      defaultContent: `Vừa tham gia hoạt động "${act.title}" tại ${act.location}. Rất vui được đồng hành cùng tuổi trẻ Chi đoàn Khu phố 5!`,
    });
    if (onNavigateSocial) onNavigateSocial();
  };

  const handleCreateActivitySubmit = (e) => {
    e.preventDefault();
    if (!newActivityForm.title.trim()) return;
    createVolunteerActivity(newActivityForm);
    setIsCreateActivityOpen(false);
    setNewActivityForm({
      title: '',
      date: '19/12/2026 (07:30 - 11:00)',
      location: 'Khu phố 5 - Phường Tam Hiệp',
      pointsValue: 20,
    });
    triggerGlobalToast('Đã tạo và phát động hoạt động phong trào mới tới toàn Chi đoàn!');
  };

  const renderRewardIcon = (iconName) => {
    if (iconName === 'fuel') return <Fuel className="w-5 h-5 text-[#161891]" />;
    if (iconName === 'film') return <Film className="w-5 h-5 text-[#161891]" />;
    if (iconName === 'shirt') return <Shirt className="w-5 h-5 text-[#161891]" />;
    return <Bus className="w-5 h-5 text-[#161891]" />;
  };

  const topActiveMembers = [...members].sort((a, b) => b.points - a.points).slice(0, 5);

  return (
    <div className="p-4 space-y-4 pb-8">
      {/* Thẻ Điểm Thi đua & Thành tích chuẩn #161891 */}
      <div className="hero-mesh text-white rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-semibold bg-white/15 px-2.5 py-0.5 rounded-full">
              Phong trào Thanh niên 2026
            </span>
            <h2 className="text-[17px] font-bold mt-1.5 leading-6">
              Tình nguyện & Điểm Thi đua
            </h2>
          </div>
          <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="pt-3 border-t border-white/15 flex items-center justify-between">
          <div>
            <div className="text-[12px] text-white/80">Điểm của {currentMember.name}</div>
            <div className="text-[22px] font-extrabold tabular-nums leading-7">{userPoints} điểm</div>
          </div>
          <span className="px-3 py-1.5 bg-white text-[#161891] text-[12px] font-bold rounded-xl">
            {userPoints >= 90 ? 'Hạng Xuất sắc' : userPoints >= 75 ? 'Hạng Khá' : 'Tiên tiến'}
          </span>
        </div>
      </div>

      {/* SegmentedButton 3 tab */}
      <div className="grid grid-cols-3 gap-1 bg-slate-200/70 p-1 rounded-xl">
        {[
          { id: 'activities', label: `Hoạt động (${volunteerActivities.length})` },
          { id: 'ranking', label: 'Xếp hạng' },
          { id: 'vouchers', label: `Quà (${vouchers.length})` },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setSectionTab(t.id)}
            className={`h-10 rounded-lg text-[12px] font-bold transition ${
              sectionTab === t.id ? 'bg-white text-[#161891] shadow-xs' : 'text-slate-600'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {sectionTab === 'activities' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-[14px] font-bold text-slate-900">Hoạt động Phong trào</span>
            <button
              onClick={() => setIsCreateActivityOpen(true)}
              className="h-9 px-3 bg-[#161891] hover:bg-[#0E1068] text-white text-[12px] font-bold rounded-xl flex items-center gap-1.5 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Tạo mới</span>
            </button>
          </div>

          {volunteerActivities.map((act) => {
            const isRegistered = registeredVolunteerIds.includes(act.id);
            const isUpcoming = act.status === 'upcoming';
            const isCheckedIn = volunteerCheckedInIds.includes(act.id);
            const proof = volunteerProofs[act.id];

            return (
              <div key={act.id} className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        isUpcoming ? 'bg-[#EEF0FB] text-[#161891]' : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {isUpcoming ? 'Sắp diễn ra' : 'Đã hoàn thành'}
                    </span>
                    <h4 className="text-[15px] font-bold text-slate-900 mt-1.5 leading-5">{act.title}</h4>
                  </div>
                  <span className="text-[12px] font-extrabold text-[#161891] bg-[#EEF0FB] px-2.5 py-1 rounded-full shrink-0">
                    {act.points}
                  </span>
                </div>

                <div className="text-[13px] text-slate-600 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#161891] shrink-0" />
                    <span>{act.date}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2 min-w-0">
                      <MapPin className="w-4 h-4 text-[#161891] shrink-0" />
                      <span className="truncate">{act.location}</span>
                    </span>
                    <button
                      onClick={() => setParticipantsModalAct(act)}
                      className="text-[12px] font-bold text-[#161891] flex items-center gap-1 shrink-0"
                    >
                      <Users className="w-3.5 h-3.5" /> {act.participantsCount}
                    </button>
                  </div>
                </div>

                {proof && (
                  <div className="p-2.5 bg-[#F5F7FB] rounded-xl flex items-center gap-2 text-[12px] text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span className="truncate">Đã gửi minh chứng: {proof.note}</span>
                  </div>
                )}

                <div className="pt-2.5 border-t border-slate-100 flex flex-wrap gap-2">
                  {isUpcoming && (
                    <button
                      onClick={() => handleVolunteerToggle(act)}
                      className={`h-9 px-3 rounded-xl font-bold text-[12px] flex items-center gap-1.5 transition ${
                        isRegistered
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#161891] hover:bg-[#0E1068] text-white'
                      }`}
                    >
                      {isRegistered ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Đã đăng ký</span>
                        </>
                      ) : (
                        <span>Đăng ký</span>
                      )}
                    </button>
                  )}

                  <button
                    onClick={() => handleVolunteerQR(act)}
                    disabled={isCheckedIn}
                    className={`h-9 px-3 rounded-xl font-bold text-[12px] flex items-center gap-1.5 transition ${
                      isCheckedIn
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-[#EEF0FB] text-[#161891]'
                    }`}
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>{isCheckedIn ? 'Đã quét QR' : 'Quét QR'}</span>
                  </button>

                  <button
                    onClick={() => setProofModalAct(act)}
                    className="h-9 px-3 bg-[#F5F7FB] text-slate-700 font-semibold text-[12px] rounded-xl flex items-center gap-1.5 transition"
                  >
                    <Camera className="w-3.5 h-3.5 text-[#161891]" />
                    <span>{proof ? 'Cập nhật ảnh' : 'Minh chứng'}</span>
                  </button>

                  <button
                    onClick={() => handleShareEventToSocial(act)}
                    className="h-9 px-3 bg-[#EEF0FB] text-[#161891] font-bold text-[12px] rounded-xl flex items-center gap-1.5 transition"
                  >
                    <Newspaper className="w-3.5 h-3.5" />
                    <span>Đăng Social</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {sectionTab === 'ranking' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#161891]" />
                <h3 className="text-[15px] font-bold text-slate-900">Top Đoàn viên tích cực</h3>
              </div>
              <span className="text-[12px] font-bold text-[#161891]">Chi đoàn KP5</span>
            </div>

            <div className="space-y-2">
              {topActiveMembers.map((m, idx) => (
                <div
                  key={m.id}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-2.5 ${
                    m.id === currentMember.id
                      ? 'bg-[#EEF0FB]/60 border-[#161891]/30'
                      : 'bg-[#F5F7FB] border-slate-200/70'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-extrabold shrink-0 ${
                        idx === 0 ? 'bg-[#161891] text-white' : 'bg-white text-slate-700 border border-slate-200'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <img src={m.avatar} alt={m.name} className="w-9 h-9 rounded-full object-cover shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[13px] font-bold text-slate-900 truncate">{m.name}</div>
                      <div className="text-[11px] text-slate-500 truncate">{m.workplace}</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[14px] font-extrabold text-[#161891] tabular-nums">{m.points} đ</div>
                    <button
                      onClick={() => {
                        awardBonusPoints(m.id, 5, null, 'Thưởng phong trào tích cực tháng 11');
                        triggerGlobalToast(`Đã thưởng +5 điểm cho Đ/c ${m.name}!`);
                      }}
                      className="text-[11px] font-bold text-[#161891]"
                    >
                      +5đ thưởng
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#161891]" />
                <h3 className="text-[15px] font-bold text-slate-900">Huy hiệu Điện tử</h3>
              </div>
              <span className="text-[12px] font-bold text-emerald-700">
                {digitalBadges.filter((b) => b.earned).length}/{digitalBadges.length} đạt
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {digitalBadges.map((bdg) => (
                <div
                  key={bdg.id}
                  className={`p-3.5 rounded-2xl border space-y-2 ${
                    bdg.earned ? 'bg-[#F4F5FC] border-[#161891]/25' : 'bg-[#F5F7FB] border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        bdg.earned ? 'bg-[#161891] text-white' : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {bdg.icon === 'zap' && <Zap className="w-4 h-4" />}
                      {bdg.icon === 'award' && <Award className="w-4 h-4" />}
                      {bdg.icon === 'heart' && <Heart className="w-4 h-4" />}
                      {bdg.icon === 'share' && <Share2 className="w-4 h-4" />}
                    </div>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        bdg.earned ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {bdg.earned ? 'Đã cấp' : 'Chưa đạt'}
                    </span>
                  </div>
                  <div className="font-bold text-slate-900 text-[13px] leading-4">{bdg.name}</div>
                  <p className="text-[11px] text-slate-500 leading-4">{bdg.desc}</p>
                  {!bdg.earned && (
                    <button
                      onClick={() => {
                        awardBonusPoints(currentMember.id, 5, bdg.id, `Cấp huy hiệu ${bdg.name}`);
                        triggerGlobalToast(`Đã cấp huy hiệu "${bdg.name}" và +5 điểm thưởng!`);
                      }}
                      className="w-full h-8 bg-[#161891] text-white text-[11px] font-bold rounded-lg"
                    >
                      Cấp huy hiệu
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {sectionTab === 'vouchers' && (
        <div className="space-y-4">
          {vouchers.length > 0 && (
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-[#161891]" />
                <h3 className="text-[15px] font-bold text-slate-900">Ví Voucher ({vouchers.length})</h3>
              </div>
              <div className="space-y-2">
                {vouchers.map((v) => (
                  <div
                    key={v.code}
                    className="p-3 bg-[#F5F7FB] rounded-xl flex items-center justify-between gap-2.5"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-bold text-slate-900 truncate">{v.title}</div>
                      <div className="font-mono text-[12px] text-[#161891] font-bold">{v.code}</div>
                    </div>
                    <button
                      onClick={() => setGeneratedVoucher(v)}
                      className="h-9 px-3 bg-[#161891] text-white text-[12px] font-bold rounded-xl shrink-0"
                    >
                      Mở QR
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-[#161891]" />
              <h3 className="text-[15px] font-bold text-slate-900">Đổi Quà Thanh niên</h3>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {rewardItems.map((item) => {
                const isOutOfStock = typeof item.available === 'number' && item.available <= 0;
                const canRedeem = userPoints >= item.points && !isOutOfStock;

                return (
                  <div
                    key={item.id}
                    className="p-3.5 bg-[#F5F7FB] rounded-2xl flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
                          {renderRewardIcon(item.icon)}
                        </div>
                        <span className="text-[11px] text-slate-500 font-semibold">Còn {item.available}</span>
                      </div>

                      <h4 className="text-[13px] font-bold text-slate-900 leading-4">{item.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{item.category}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between">
                      <span className="text-[13px] font-extrabold text-[#161891] tabular-nums">{item.points} đ</span>
                      <button
                        onClick={() => handleSelectReward(item)}
                        className={`h-8 px-2.5 text-[11px] font-bold rounded-lg transition ${
                          canRedeem
                            ? 'bg-[#161891] hover:bg-[#0E1068] text-white'
                            : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        Đổi quà
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Flutter ModalBottomSheet: Tạo hoạt động mới */}
      {isCreateActivityOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-[2px] flex items-end justify-center animate-fade-in">
          <form
            onSubmit={handleCreateActivitySubmit}
            className="bg-white rounded-t-[28px] p-5 pb-7 max-w-[390px] w-full shadow-2xl space-y-3.5 animate-sheet-up"
          >
            <div className="w-10 h-1 rounded-full bg-slate-300 mx-auto" />
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-bold text-slate-900">Tạo Hoạt động Tình nguyện</h3>
              <button type="button" onClick={() => setIsCreateActivityOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-slate-700 mb-1">Tên hoạt động *</label>
              <input
                type="text"
                required
                value={newActivityForm.title}
                onChange={(e) => setNewActivityForm({ ...newActivityForm, title: e.target.value })}
                placeholder="VD: Ngày Chủ Nhật Xanh dọn dẹp Khu phố 5"
                className="w-full h-11 px-3 bg-[#F5F7FB] border border-slate-200 rounded-xl text-[13px]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-slate-700 mb-1">Thời gian</label>
              <input
                type="text"
                required
                value={newActivityForm.date}
                onChange={(e) => setNewActivityForm({ ...newActivityForm, date: e.target.value })}
                className="w-full h-11 px-3 bg-[#F5F7FB] border border-slate-200 rounded-xl text-[13px]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-slate-700 mb-1">Địa điểm</label>
              <input
                type="text"
                required
                value={newActivityForm.location}
                onChange={(e) => setNewActivityForm({ ...newActivityForm, location: e.target.value })}
                className="w-full h-11 px-3 bg-[#F5F7FB] border border-slate-200 rounded-xl text-[13px]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-slate-700 mb-1">Điểm thưởng</label>
              <input
                type="number"
                value={newActivityForm.pointsValue}
                onChange={(e) => setNewActivityForm({ ...newActivityForm, pointsValue: e.target.value })}
                className="w-full h-11 px-3 bg-[#F5F7FB] border border-slate-200 rounded-xl text-[13px]"
              />
            </div>
            <button
              type="submit"
              className="w-full h-12 bg-[#161891] text-white font-bold text-[14px] rounded-xl"
            >
              Đăng tải hoạt động
            </button>
          </form>
        </div>
      )}

      {/* Flutter ModalBottomSheet: Danh sách tham gia */}
      {participantsModalAct && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-[2px] flex items-end justify-center animate-fade-in">
          <div className="bg-white rounded-t-[28px] p-5 pb-7 max-w-[390px] w-full shadow-2xl space-y-3.5 animate-sheet-up">
            <div className="w-10 h-1 rounded-full bg-slate-300 mx-auto" />
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-[16px] font-bold text-slate-900">Danh sách Tham gia</h3>
                <p className="text-[12px] text-slate-500 truncate">{participantsModalAct.title}</p>
              </div>
              <button onClick={() => setParticipantsModalAct(null)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-[13px] font-bold text-[#161891]">
              {participantsModalAct.participantsCount} đoàn viên đã đăng ký
            </div>
            <div className="space-y-1.5 max-h-60 overflow-y-auto">
              {members.slice(0, 8).map((m) => (
                <div key={m.id} className="p-3 bg-[#F5F7FB] rounded-xl flex items-center justify-between text-[13px]">
                  <span className="font-semibold text-slate-900">{m.name}</span>
                  <span className="text-[11px] text-emerald-700 font-bold">Đã xác nhận</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setParticipantsModalAct(null)}
              className="w-full h-11 bg-slate-100 text-slate-700 font-bold text-[13px] rounded-xl"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Flutter ModalBottomSheet: Gửi ảnh minh chứng */}
      {proofModalAct && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-[2px] flex items-end justify-center animate-fade-in">
          <form
            onSubmit={handleSaveProof}
            className="bg-white rounded-t-[28px] p-5 pb-7 max-w-[390px] w-full shadow-2xl space-y-3.5 animate-sheet-up"
          >
            <div className="w-10 h-1 rounded-full bg-slate-300 mx-auto" />
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-bold text-slate-900">Gửi Ảnh / Video Minh chứng</h3>
              <button type="button" onClick={() => setProofModalAct(null)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-[13px] font-semibold text-slate-700">{proofModalAct.title}</div>
            {proofImage && (
              <img src={proofImage} alt="Minh chứng" className="w-full h-36 object-cover rounded-2xl border border-slate-200" />
            )}
            <label className="w-full h-11 px-3 bg-[#EEF0FB] rounded-xl flex items-center justify-center gap-2 cursor-pointer font-bold text-[13px] text-[#161891]">
              <Upload className="w-4 h-4" />
              <span>Chọn ảnh / video từ thiết bị</span>
              <input type="file" accept="image/*,video/*" onChange={handleProofFileChange} className="hidden" />
            </label>
            <textarea
              rows={2}
              value={proofNote}
              onChange={(e) => setProofNote(e.target.value)}
              className="w-full p-3 bg-[#F5F7FB] border border-slate-200 rounded-xl text-[13px]"
              placeholder="Ghi chú kết quả tham gia..."
            />
            <div className="grid grid-cols-2 gap-2.5">
              <button type="submit" className="h-11 bg-[#161891] text-white font-bold text-[13px] rounded-xl">
                Lưu minh chứng
              </button>
              <button
                type="button"
                onClick={() => {
                  const target = proofModalAct;
                  setProofModalAct(null);
                  handleShareEventToSocial(target, proofImage);
                }}
                className="h-11 bg-[#EEF0FB] text-[#161891] font-bold text-[13px] rounded-xl"
              >
                Đăng lên Social
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Flutter ModalBottomSheet: Xác nhận đổi quà */}
      {isConfirmModalOpen && selectedReward && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-[2px] flex items-end justify-center animate-fade-in">
          <div className="bg-white rounded-t-[28px] p-5 pb-7 max-w-[390px] w-full shadow-2xl text-center space-y-4 animate-sheet-up">
            <div className="w-10 h-1 rounded-full bg-slate-300 mx-auto" />
            <div className="w-12 h-12 bg-[#EEF0FB] text-[#161891] rounded-2xl flex items-center justify-center mx-auto">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-slate-900">{selectedReward.title}</h3>
              <p className="text-[12px] text-slate-500 mt-0.5">{selectedReward.category}</p>
            </div>
            <div className="bg-[#F5F7FB] p-3.5 rounded-2xl text-[13px] space-y-1.5 text-left">
              <div className="flex justify-between">
                <span className="text-slate-600">Điểm trừ</span>
                <strong className="text-rose-600 tabular-nums">-{selectedReward.points} điểm</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Còn lại</span>
                <strong className="text-[#161891] tabular-nums">{userPoints - selectedReward.points} điểm</strong>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={handleConfirmRedeem}
                className="h-11 bg-[#161891] text-white font-bold text-[13px] rounded-xl"
              >
                Xác nhận đổi
              </button>
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="h-11 bg-slate-100 text-slate-700 font-bold text-[13px] rounded-xl"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Flutter ModalBottomSheet: Voucher QR */}
      {generatedVoucher && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-[2px] flex items-end justify-center animate-fade-in">
          <div className="bg-white rounded-t-[28px] w-full max-w-[390px] shadow-2xl p-5 pb-7 space-y-4 animate-sheet-up text-center">
            <div className="w-10 h-1 rounded-full bg-slate-300 mx-auto" />
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold bg-[#EEF0FB] text-[#161891] px-2.5 py-0.5 rounded-full">
                Voucher điện tử
              </span>
              <button
                onClick={() => setGeneratedVoucher(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div>
              <h3 className="text-[16px] font-extrabold text-slate-900">{generatedVoucher.title}</h3>
              <p className="text-[12px] text-[#161891] font-semibold mt-0.5">{generatedVoucher.sponsor}</p>
            </div>
            <div className="bg-[#F5F7FB] p-4 rounded-2xl space-y-3">
              <div className="font-mono text-[15px] font-extrabold text-[#161891] bg-white py-1.5 px-3.5 rounded-xl border border-slate-200 inline-block">
                {generatedVoucher.code}
              </div>
              <div className="w-32 h-32 bg-white rounded-xl p-2 mx-auto border border-slate-200 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-28 h-28">
                  <rect x="5" y="5" width="26" height="26" rx="2" fill="#161891" />
                  <rect x="9" y="9" width="18" height="18" rx="1" fill="#fff" />
                  <rect x="13" y="13" width="10" height="10" rx="1" fill="#161891" />
                  <rect x="69" y="5" width="26" height="26" rx="2" fill="#161891" />
                  <rect x="73" y="9" width="18" height="18" rx="1" fill="#fff" />
                  <rect x="77" y="13" width="10" height="10" rx="1" fill="#161891" />
                  <rect x="5" y="69" width="26" height="26" rx="2" fill="#161891" />
                  <rect x="9" y="73" width="18" height="18" rx="1" fill="#fff" />
                  <rect x="13" y="77" width="10" height="10" rx="1" fill="#161891" />
                  <rect x="36" y="10" width="8" height="6" fill="#161891" />
                  <rect x="52" y="12" width="6" height="6" fill="#161891" />
                  <rect x="38" y="38" width="12" height="6" fill="#161891" />
                  <rect x="58" y="40" width="8" height="8" fill="#161891" />
                  <rect x="40" y="70" width="8" height="8" fill="#161891" />
                  <rect x="65" y="68" width="10" height="6" fill="#161891" />
                </svg>
              </div>
              <div className="text-[12px] text-slate-600 text-left space-y-1 bg-white p-3 rounded-xl">
                <div>Người nhận: <strong>{currentMember.name}</strong></div>
                <div>Hạn dùng: <strong>{generatedVoucher.expiresAt}</strong></div>
                <div>Địa điểm: {generatedVoucher.pickupLocation}</div>
              </div>
            </div>
            <button
              onClick={() => {
                triggerGlobalToast(`Đã lưu Voucher ${generatedVoucher.code} vào Ví Voucher!`);
                setGeneratedVoucher(null);
              }}
              className="w-full h-12 bg-[#161891] text-white font-bold text-[14px] rounded-xl flex items-center justify-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Lưu & Đóng</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
