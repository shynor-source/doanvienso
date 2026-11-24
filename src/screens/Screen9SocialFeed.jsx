import React, { useState, useEffect } from 'react';
import {
  Heart, MessageCircle, Share2, Image as ImageIcon, Send,
  CheckCircle2, Sparkles, Calendar, Camera, X, Upload,
  MapPin, Clock, CalendarCheck, PlusCircle, Users
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SOCIAL_EVENT_PRESETS, INITIAL_BRANCH_DATA, SCHEDULE_WEEK_DAYS } from '../data/mockData';

export default function Screen9SocialFeed({ currentRole, onNavigate }) {
  const {
    currentMember,
    socialPosts,
    volunteerActivities,
    activeSession,
    mySchedule,
    preselectedSocialEvent,
    setPreselectedSocialEvent,
    createSocialPost,
    toggleLikeSocialPost,
    addSocialComment,
    registerEventFromSocialPost,
    triggerGlobalToast,
  } = useApp();

  const isOfficer = currentRole === 'secretary' || currentRole === 'ward_officer';

  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [selectedEventTag, setSelectedEventTag] = useState(
    'Chiến dịch Mùa Đông Ấm & Hỗ trợ Thanh niên'
  );
  const [selectedImageUrl, setSelectedImageUrl] = useState(SOCIAL_EVENT_PRESETS[0].imageUrl);
  const [showImagePicker, setShowImagePicker] = useState(false);

  // Tùy chọn đăng kèm Thẻ Sự kiện để đoàn viên bấm đăng ký đẩy vào Lịch cá nhân
  const [attachEventCard, setAttachEventCard] = useState(isOfficer);
  const [eventScheduleForm, setEventScheduleForm] = useState({
    title: 'Ngày hội Thanh niên Chuyển đổi số Tam Hiệp',
    dateStr: '29/11/2026',
    timeSlot: '08:00 - 11:00',
    room: 'Nhà văn hóa Khu phố 5',
    points: '+20 điểm',
  });

  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'events_only' | 'mine'
  const [openCommentPostId, setOpenCommentPostId] = useState('post-event-1');
  const [commentInputs, setCommentInputs] = useState({});

  const authorProfile =
    currentRole === 'secretary'
      ? {
          name: INITIAL_BRANCH_DATA.secretary.name,
          role: 'Bí thư Chi đoàn Khu phố 5',
          avatar: INITIAL_BRANCH_DATA.secretary.avatar,
        }
      : currentRole === 'ward_officer'
      ? {
          name: 'Phan Thị Bích Thảo',
          role: 'Bí thư Đoàn Phường Tam Hiệp',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
        }
      : {
          name: currentMember.name,
          role: `Đoàn viên • ${currentMember.branchName}`,
          avatar: currentMember.avatar,
        };

  useEffect(() => {
    setAttachEventCard(isOfficer);
  }, [isOfficer]);

  useEffect(() => {
    if (preselectedSocialEvent) {
      setSelectedEventTag(preselectedSocialEvent.eventTag || activeSession.title);
      if (preselectedSocialEvent.imageUrl) {
        setSelectedImageUrl(preselectedSocialEvent.imageUrl);
      }
      if (preselectedSocialEvent.defaultContent) {
        setPostContent(preselectedSocialEvent.defaultContent);
      }
      setIsComposerOpen(true);
      setPreselectedSocialEvent(null);
    }
  }, [preselectedSocialEvent, activeSession.title, setPreselectedSocialEvent]);

  const eventOptions = [
    activeSession.title,
    ...volunteerActivities.map((a) => a.title),
    ...SOCIAL_EVENT_PRESETS.map((p) => p.eventTag),
  ].filter((v, idx, arr) => arr.indexOf(v) === idx);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setSelectedImageUrl(reader.result);
        setShowImagePicker(false);
        triggerGlobalToast(`Đã tải ảnh "${file.name}" sẵn sàng đăng lên Bảng tin!`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePublish = (e) => {
    e.preventDefault();
    if (!postContent.trim()) {
      triggerGlobalToast('Vui lòng nhập nội dung bài viết!');
      return;
    }

    const dayEntry = SCHEDULE_WEEK_DAYS.find((d) => d.key === eventScheduleForm.dateStr);

    createSocialPost({
      content: postContent.trim(),
      eventTag: attachEventCard ? eventScheduleForm.title : selectedEventTag,
      imageUrl: selectedImageUrl,
      authorName: authorProfile.name,
      authorRole: authorProfile.role,
      authorAvatar: authorProfile.avatar,
      category: 'event',
      isEventPost: attachEventCard,
      verifiedOfficer: isOfficer,
      eventSchedule: attachEventCard
        ? {
            ...eventScheduleForm,
            dayOfWeek: dayEntry ? dayEntry.label : 'CN',
          }
        : null,
    });

    setPostContent('');
    setIsComposerOpen(false);
    triggerGlobalToast(
      attachEventCard
        ? 'Đã đăng bài phát động sự kiện kèm nút Đăng ký tham dự!'
        : 'Đã đăng bài viết lên Bảng tin (+5đ)!'
    );
  };

  const handleSendComment = (postId) => {
    const text = commentInputs[postId] || '';
    if (!text.trim()) return;
    addSocialComment(postId, authorProfile.name, text);
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  const handleRegisterFromPost = (post) => {
    const res = registerEventFromSocialPost(post);
    if (!res.ok) {
      if (onNavigate) onNavigate('makeup');
      return;
    }
    triggerGlobalToast(`Đã đăng ký "${post.eventSchedule.title}" & tự động thêm vào Lịch cá nhân!`);
  };

  const filteredPosts = socialPosts.filter((p) => {
    if (filterMode === 'events_only') return Boolean(p.isEventPost);
    if (filterMode === 'mine') return p.authorName === authorProfile.name;
    return true;
  });

  return (
    <div className="p-4 space-y-4 pb-8">
      {/* Compact Composer Trigger Bar */}
      {!isComposerOpen ? (
        <div
          onClick={() => setIsComposerOpen(true)}
          className="app-card p-3.5 flex items-center gap-3 cursor-pointer active:scale-[0.99] transition"
        >
          <img
            src={authorProfile.avatar}
            alt={authorProfile.name}
            className="w-10 h-10 rounded-full border border-slate-200 object-cover shrink-0"
          />
          <div className="flex-1 text-[13px] text-slate-500 truncate">
            {isOfficer
              ? 'Đăng phát động sự kiện hoặc chia sẻ hoạt động...'
              : 'Chia sẻ khoảnh khắc sự kiện vừa tham gia...'}
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#EEF0FB] text-[#161891] flex items-center justify-center shrink-0">
            <Camera className="w-5 h-5" />
          </div>
        </div>
      ) : (
        <form onSubmit={handlePublish} className="app-card p-4 border-[#161891]/30 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={authorProfile.avatar}
                alt={authorProfile.name}
                className="w-10 h-10 rounded-full border border-slate-200 object-cover shrink-0"
              />
              <div className="min-w-0">
                <div className="text-[14px] font-bold text-slate-900 truncate">{authorProfile.name}</div>
                <div className="text-[12px] text-[#161891] font-semibold truncate">{authorProfile.role}</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsComposerOpen(false)}
              className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0"
              aria-label="Thu gọn"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <textarea
            rows={3}
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder={
              attachEventCard
                ? 'Nhập lời mời gọi, thông tin sự kiện để đoàn viên bấm đăng ký trực tiếp...'
                : 'Chia sẻ cảm nhận và hình ảnh về hoạt động đã tham gia...'
            }
            className="w-full p-3 bg-[#F5F7FB] border border-slate-200 rounded-xl text-[13px] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#161891]"
          />

          {/* Bật / Tắt Kèm Thẻ Đăng ký Sự kiện (tự đẩy về Lịch) */}
          <div className="flex items-center justify-between p-3 bg-[#F5F7FB] rounded-xl">
            <div className="flex items-center gap-2 min-w-0">
              <CalendarCheck className="w-4 h-4 text-[#161891] shrink-0" />
              <div className="text-[12px] font-bold text-slate-800 truncate">
                Kèm nút &ldquo;Đăng ký tham dự&rdquo; (Đẩy về Lịch)
              </div>
            </div>
            <input
              type="checkbox"
              checked={attachEventCard}
              onChange={(e) => setAttachEventCard(e.target.checked)}
              className="w-4 h-4 accent-[#161891] shrink-0"
            />
          </div>

          {attachEventCard ? (
            <div className="p-3 bg-[#F4F5FC] border border-[#161891]/20 rounded-xl space-y-2.5">
              <div>
                <label className="block text-[11px] font-bold text-[#161891] mb-1">Tên sự kiện mở đăng ký</label>
                <input
                  type="text"
                  required
                  value={eventScheduleForm.title}
                  onChange={(e) => setEventScheduleForm({ ...eventScheduleForm, title: e.target.value })}
                  className="w-full h-9 px-2.5 bg-white border border-slate-200 rounded-lg text-[12px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Ngày tổ chức</label>
                  <select
                    value={eventScheduleForm.dateStr}
                    onChange={(e) => setEventScheduleForm({ ...eventScheduleForm, dateStr: e.target.value })}
                    className="w-full h-9 px-2 bg-white border border-slate-200 rounded-lg text-[12px]"
                  >
                    {SCHEDULE_WEEK_DAYS.filter((d) => d.key !== 'all').map((d) => (
                      <option key={d.key} value={d.key}>
                        {d.label} — {d.key}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Khung giờ</label>
                  <input
                    type="text"
                    value={eventScheduleForm.timeSlot}
                    onChange={(e) => setEventScheduleForm({ ...eventScheduleForm, timeSlot: e.target.value })}
                    className="w-full h-9 px-2.5 bg-white border border-slate-200 rounded-lg text-[12px]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Địa điểm</label>
                <input
                  type="text"
                  value={eventScheduleForm.room}
                  onChange={(e) => setEventScheduleForm({ ...eventScheduleForm, room: e.target.value })}
                  className="w-full h-9 px-2.5 bg-white border border-slate-200 rounded-lg text-[12px]"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-[12px] font-semibold text-slate-700 mb-1">
                Gắn thẻ hoạt động đã tham gia
              </label>
              <select
                value={selectedEventTag}
                onChange={(e) => setSelectedEventTag(e.target.value)}
                className="w-full h-10 px-3 bg-[#F5F7FB] border border-slate-200 rounded-xl text-[13px] font-medium text-slate-800"
              >
                {eventOptions.map((ev) => (
                  <option key={ev} value={ev}>
                    {ev}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedImageUrl && (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
              <img
                src={selectedImageUrl}
                alt="Ảnh sự kiện đính kèm"
                className="w-full h-40 object-cover"
              />
              <button
                type="button"
                onClick={() => setSelectedImageUrl(null)}
                className="absolute top-2.5 right-2.5 w-8 h-8 bg-black/60 text-white rounded-full flex items-center justify-center"
                title="Gỡ ảnh"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {showImagePicker && (
            <div className="p-3 bg-[#F5F7FB] rounded-xl space-y-2">
              <div className="text-[12px] font-bold text-slate-700">Thư viện ảnh sự kiện mẫu:</div>
              <div className="grid grid-cols-2 gap-2">
                {SOCIAL_EVENT_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setSelectedImageUrl(preset.imageUrl);
                      setSelectedEventTag(preset.eventTag);
                      setShowImagePicker(false);
                    }}
                    className="text-left rounded-xl overflow-hidden border border-slate-200 hover:border-[#161891] bg-white transition"
                  >
                    <img src={preset.imageUrl} alt={preset.label} className="w-full h-16 object-cover" />
                    <div className="p-1.5 text-[11px] font-semibold text-slate-800 truncate">{preset.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1.5">
              <label className="h-9 px-3 bg-[#F5F7FB] hover:bg-slate-200/70 text-slate-700 text-[12px] font-semibold rounded-xl cursor-pointer flex items-center gap-1.5 transition">
                <Upload className="w-4 h-4 text-[#161891]" />
                <span>Chọn ảnh</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>

              <button
                type="button"
                onClick={() => setShowImagePicker(!showImagePicker)}
                className="h-9 px-3 bg-[#EEF0FB] text-[#161891] text-[12px] font-semibold rounded-xl flex items-center gap-1.5 transition"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Thư viện</span>
              </button>
            </div>

            <button
              type="submit"
              className="h-10 px-4 bg-[#161891] hover:bg-[#0E1068] text-white font-bold text-[13px] rounded-xl flex items-center gap-1.5 transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Đăng bài</span>
            </button>
          </div>
        </form>
      )}

      {/* Filter Chips */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5">
        {[
          { id: 'all', label: `Tất cả (${socialPosts.length})` },
          { id: 'events_only', label: 'Sự kiện mở đăng ký' },
          { id: 'mine', label: 'Bài của tôi' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterMode(tab.id)}
            className={`h-9 px-3.5 rounded-full text-[12px] font-bold transition whitespace-nowrap shrink-0 ${
              filterMode === tab.id
                ? 'bg-[#161891] text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Feed Cards */}
      <div className="space-y-4">
        {filteredPosts.map((post) => {
          const isCommentsOpen = openCommentPostId === post.id;
          const ev = post.eventSchedule;
          const isInMySchedule = Boolean(
            ev && mySchedule.some((s) => s.id === ev.id || s.title === ev.title)
          );

          return (
            <article key={post.id} className="app-card overflow-hidden">
              <div className="p-4 pb-2.5 flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <img
                    src={post.authorAvatar}
                    alt={post.authorName}
                    className="w-10 h-10 rounded-full border border-slate-200 object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-[14px] font-bold text-slate-900 truncate">{post.authorName}</h3>
                      {post.verifiedOfficer && (
                        <span className="text-[11px] font-bold bg-[#EEF0FB] text-[#161891] px-2 py-0.5 rounded-md shrink-0">
                          Cán bộ Đoàn
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] text-slate-500 truncate">
                      {post.authorRole} • {post.createdAt}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-4 pb-3 text-[13px] text-slate-800 leading-relaxed whitespace-pre-line">
                {post.content}
              </div>

              {post.imageUrl && (
                <div className="bg-slate-100 border-y border-slate-100">
                  <img
                    src={post.imageUrl}
                    alt={post.eventTag || 'Ảnh sự kiện Đoàn'}
                    className="w-full h-52 object-cover"
                  />
                </div>
              )}

              {/* THẺ ĐĂNG KÝ SỰ KIỆN TRỰC TIẾP -> TỰ ĐỘNG ĐẨY VÀO LỊCH CÁ NHÂN */}
              {post.isEventPost && ev && (
                <div className="mx-3.5 my-3 p-3.5 bg-[#F4F5FC] border border-[#161891]/20 rounded-2xl space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white border border-[#161891]/20 flex flex-col items-center justify-center shrink-0">
                      <span className="text-[11px] font-bold text-[#161891]">{ev.dayOfWeek}</span>
                      <span className="text-[14px] font-extrabold text-slate-900 tabular-nums leading-none">
                        {ev.dateStr.slice(0, 5)}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] font-bold text-emerald-700">{ev.points}</span>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Users className="w-3 h-3" /> {post.registeredCount || 1} đã đăng ký
                        </span>
                      </div>
                      <h4 className="text-[14px] font-bold text-slate-900 leading-5 mt-0.5">
                        {ev.title}
                      </h4>
                      <div className="text-[12px] text-slate-600 mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#161891]" /> {ev.timeSlot}
                        </span>
                        <span className="flex items-center gap-1 truncate">
                          <MapPin className="w-3.5 h-3.5 text-[#161891]" /> {ev.room}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRegisterFromPost(post)}
                    className={`w-full h-10 rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 transition ${
                      isInMySchedule
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                        : 'bg-[#161891] hover:bg-[#0E1068] text-white'
                    }`}
                  >
                    {isInMySchedule ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Đã có trong Lịch • Xem Lịch cá nhân</span>
                      </>
                    ) : (
                      <>
                        <PlusCircle className="w-4 h-4" />
                        <span>Đăng ký tham dự (Thêm vào Lịch)</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Tag nếu bài thường */}
              {!post.isEventPost && post.eventTag && (
                <div className="px-4 pt-3 pb-1">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#EEF0FB] text-[#161891] text-[12px] font-semibold max-w-full">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{post.eventTag}</span>
                  </span>
                </div>
              )}

              <div className="px-3 py-2 flex items-center justify-between text-[13px] border-t border-slate-100">
                <button
                  onClick={() => toggleLikeSocialPost(post.id)}
                  className={`h-9 px-3 rounded-xl font-bold flex items-center gap-1.5 transition active:scale-95 ${
                    post.likedByMe
                      ? 'bg-rose-50 text-rose-600'
                      : 'text-slate-600 hover:bg-[#F5F7FB]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${post.likedByMe ? 'fill-rose-600 text-rose-600' : ''}`} />
                  <span className="tabular-nums">{post.likesCount}</span>
                </button>

                <button
                  onClick={() => setOpenCommentPostId(isCommentsOpen ? null : post.id)}
                  className="h-9 px-3 rounded-xl font-bold text-slate-600 hover:bg-[#F5F7FB] flex items-center gap-1.5 transition"
                >
                  <MessageCircle className="w-4 h-4 text-[#161891]" />
                  <span>{post.comments.length} bình luận</span>
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href).catch(() => {});
                    triggerGlobalToast(`Đã sao chép liên kết bài viết của ${post.authorName}!`);
                  }}
                  className="h-9 px-3 rounded-xl font-bold text-slate-600 hover:bg-[#F5F7FB] flex items-center gap-1.5 transition"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Chia sẻ</span>
                </button>
              </div>

              {isCommentsOpen && (
                <div className="bg-[#F5F7FB] px-4 py-3 border-t border-slate-200/70 space-y-2.5">
                  {post.comments.length > 0 ? (
                    <div className="space-y-2">
                      {post.comments.map((cmt) => (
                        <div key={cmt.id} className="bg-white p-3 rounded-xl border border-slate-200/70">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-[#161891] text-[12px]">{cmt.authorName}</span>
                            <span className="text-[11px] text-slate-400 shrink-0">{cmt.time}</span>
                          </div>
                          <p className="text-[13px] text-slate-700 mt-0.5 leading-snug">{cmt.text}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[12px] text-slate-500 text-center py-1">
                      Hãy là người đầu tiên gửi bình luận!
                    </p>
                  )}

                  <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                    {['Đăng ký ngay!', 'Hoạt động rất thiết thực!', 'Hẹn gặp tại sự kiện!'].map((quick) => (
                      <button
                        key={quick}
                        type="button"
                        onClick={() => addSocialComment(post.id, authorProfile.name, quick)}
                        className="h-8 px-3 bg-white border border-slate-200 hover:border-[#161891] text-[12px] font-medium text-slate-700 rounded-full whitespace-nowrap transition shrink-0"
                      >
                        + {quick}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={commentInputs[post.id] || ''}
                      onChange={(e) =>
                        setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSendComment(post.id);
                        }
                      }}
                      placeholder="Viết bình luận..."
                      className="flex-1 h-10 px-3 bg-white border border-slate-200 rounded-xl text-[13px] focus:outline-none focus:border-[#161891]"
                    />
                    <button
                      type="button"
                      onClick={() => handleSendComment(post.id)}
                      className="w-10 h-10 bg-[#161891] hover:bg-[#0E1068] text-white rounded-xl flex items-center justify-center transition shrink-0"
                      aria-label="Gửi bình luận"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </article>
          );
        })}

        {filteredPosts.length === 0 && (
          <div className="app-card p-8 text-center space-y-2 text-slate-400">
            <Sparkles className="w-8 h-8 mx-auto text-[#161891]/40" />
            <p className="text-[14px] font-bold text-slate-700">Chưa có bài viết nào</p>
            <p className="text-[12px]">Chạm khung đăng bài phía trên để chia sẻ sự kiện mới!</p>
          </div>
        )}
      </div>
    </div>
  );
}
