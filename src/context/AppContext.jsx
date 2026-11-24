import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  INITIAL_BRANCH_DATA,
  MOCK_MEMBERS,
  MONTHLY_WARD_DATA,
  MAKEUP_SESSIONS,
  PENDING_MAKEUP_REQUESTS,
  REWARD_ITEMS,
  VOLUNTEER_ACTIVITIES,
  INITIAL_NOTIFICATIONS,
  INITIAL_MEMBER_ATTENDANCE_HISTORY,
  INITIAL_SCANNED_MEMBER_IDS,
  INITIAL_SOCIAL_POSTS,
  INITIAL_TRANSFER_REQUESTS,
  DIGITAL_BADGES,
  PAST_SESSION_ARCHIVE,
  INITIAL_AUDIT_LOGS,
  INITIAL_MY_SCHEDULE,
  SCHEDULE_CATALOG,
} from '../data/mockData';

const STORAGE_KEY = 'doan_vien_so_dong_nai_state_v5';

const DEFAULT_CURRENT_MEMBER_ID = 'dv-01'; // Trần Minh Quân

function buildInitialState() {
  return {
    members: MOCK_MEMBERS,
    activeSession: INITIAL_BRANCH_DATA.upcomingSession,
    scannedMemberIds: INITIAL_SCANNED_MEMBER_IDS,
    attendanceHistory: INITIAL_MEMBER_ATTENDANCE_HISTORY,
    makeupSessions: MAKEUP_SESSIONS,
    registeredMakeupIds: [],
    makeupRequests: PENDING_MAKEUP_REQUESTS,
    completedQuizSessions: [],
    notifications: INITIAL_NOTIFICATIONS,
    vouchers: [],
    rewardItems: REWARD_ITEMS,
    volunteerActivities: VOLUNTEER_ACTIVITIES,
    registeredVolunteerIds: [],
    volunteerCheckedInIds: [],
    volunteerProofs: {},
    wardDataByMonth: MONTHLY_WARD_DATA,
    kp5ReportSubmitted: false,
    offlineQueue: [],
    socialPosts: INITIAL_SOCIAL_POSTS,
    transferRequests: INITIAL_TRANSFER_REQUESTS,
    digitalBadges: DIGITAL_BADGES,
    sessionArchive: PAST_SESSION_ARCHIVE,
    auditLogs: INITIAL_AUDIT_LOGS,
    mySchedule: INITIAL_MY_SCHEDULE,
    scheduleCatalog: SCHEDULE_CATALOG,
    securitySettings: {
      maskPhone: false,
      twoFactorAuth: true,
      encryptOffline: true,
    },
    registeredAccount: null,
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return buildInitialState();
    const parsed = JSON.parse(raw);
    const fallback = buildInitialState();
    return {
      ...fallback,
      ...parsed,
      notifications: {
        ...fallback.notifications,
        ...(parsed.notifications || {}),
      },
      wardDataByMonth: {
        ...fallback.wardDataByMonth,
        ...(parsed.wardDataByMonth || {}),
      },
      securitySettings: {
        ...fallback.securitySettings,
        ...(parsed.securitySettings || {}),
      },
    };
  } catch {
    return buildInitialState();
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, setState] = useState(loadState);
  const [isOffline, setIsOffline] = useState(
    typeof navigator !== 'undefined' ? !navigator.onLine : false
  );
  const [globalToast, setGlobalToast] = useState(null);
  const [preselectedSocialEvent, setPreselectedSocialEvent] = useState(null);

  const triggerGlobalToast = useCallback((msg) => {
    setGlobalToast(msg);
  }, []);

  useEffect(() => {
    if (!globalToast) return;
    const t = setTimeout(() => setGlobalToast(null), 4000);
    return () => clearTimeout(t);
  }, [globalToast]);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  }, [state]);

  // Listen to browser online/offline events
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const currentMember =
    state.members.find((m) => m.id === DEFAULT_CURRENT_MEMBER_ID) || state.members[0];
  const userPoints = currentMember ? currentMember.points : 95;

  // Helper to increment and recalculate KP5 attendance rate in wardDataByMonth['11']
  const incrementKP5InWard = (wardDataByMonth, delta) => {
    if (!delta || delta <= 0) return wardDataByMonth;
    const month11 = wardDataByMonth['11'];
    if (!month11) return wardDataByMonth;

    const updatedBranches = month11.branchesRank
      .map((b) => {
        if (b.id !== 'kp5') return b;
        const nextAttended = Math.min(b.attended + delta, b.total);
        const rate = Math.round((nextAttended / b.total) * 1000) / 10;
        return { ...b, attended: nextAttended, rate };
      })
      .sort((a, b) => b.rate - a.rate);

    const totalAttended = updatedBranches.reduce((sum, b) => sum + b.attended, 0);
    const totalMembers = updatedBranches.reduce((sum, b) => sum + b.total, 0);
    const avgRate = `${((totalAttended / totalMembers) * 100).toFixed(1)}%`;

    return {
      ...wardDataByMonth,
      '11': {
        ...month11,
        averageAttendanceRate: avgRate,
        branchesRank: updatedBranches,
      },
    };
  };

  // Sync offline queue when online
  const syncOfflineQueue = useCallback(() => {
    setState((prev) => {
      if (!prev.offlineQueue || prev.offlineQueue.length === 0) return prev;

      let nextMembers = [...prev.members];
      let nextScannedIds = [...prev.scannedMemberIds];
      let nextHistory = [...prev.attendanceHistory];
      let nextWardData = prev.wardDataByMonth;
      let syncedCount = 0;

      prev.offlineQueue.forEach((item) => {
        const targetId = item.memberId || DEFAULT_CURRENT_MEMBER_ID;
        const alreadyScanned =
          item.sessionId === prev.activeSession.id && nextScannedIds.includes(targetId);

        if (!alreadyScanned && item.sessionId === prev.activeSession.id) {
          nextScannedIds.push(targetId);
          syncedCount += 1;

          nextMembers = nextMembers.map((m) => {
            if (m.id !== targetId) return m;
            return {
              ...m,
              points: m.points + (item.points || 10),
              lastAttended: '28/11/2026',
              status: 'active',
            };
          });

          if (targetId === DEFAULT_CURRENT_MEMBER_ID) {
            nextHistory = [
              {
                id: `att-${item.sessionId}`,
                sessionName: item.sessionTitle || prev.activeSession.title,
                date: item.timestamp || '28/11/2026',
                status: 'attended',
                badge: 'Đã đồng bộ',
                pointsEarned: `+${item.points || 10} điểm`,
                type: item.typeLabel || 'QR Động + GPS (Đồng bộ từ ngoại tuyến)',
              },
              ...nextHistory.filter((h) => h.id !== `att-${item.sessionId}`),
            ];
          }
        }
      });

      nextWardData = incrementKP5InWard(nextWardData, syncedCount);

      const newSecNoti =
        syncedCount > 0
          ? [
              {
                id: `noti-sync-${Date.now()}`,
                title: `Đồng bộ ${syncedCount} lượt điểm danh ngoại tuyến`,
                content: `Dữ liệu lưu cục bộ khi mất sóng đã được đồng bộ lên danh sách Chi đoàn KP5.`,
                time: 'Vừa xong',
                type: 'event',
                unread: true,
              },
              ...prev.notifications.secretary,
            ]
          : prev.notifications.secretary;

      const newMemNoti = [
        {
          id: `noti-mem-sync-${Date.now()}`,
          title: 'Đã đồng bộ điểm danh ngoại tuyến',
          content: 'Lượt điểm danh lưu trên máy đã đồng bộ thành công và cộng +10 điểm rèn luyện.',
          time: 'Vừa xong',
          type: 'event',
          unread: true,
        },
        ...prev.notifications.member,
      ];

      return {
        ...prev,
        members: nextMembers,
        scannedMemberIds: nextScannedIds,
        attendanceHistory: nextHistory,
        wardDataByMonth: nextWardData,
        offlineQueue: [],
        notifications: {
          ...prev.notifications,
          secretary: newSecNoti,
          member: newMemNoti,
        },
      };
    });
  }, []);

  // Automatically sync offline queue when network comes back online
  useEffect(() => {
    if (!isOffline && state.offlineQueue.length > 0) {
      const count = state.offlineQueue.length;
      syncOfflineQueue();
      triggerGlobalToast(
        `Đã kết nối mạng 5G & tự động đồng bộ ${count} lượt điểm danh ngoại tuyến!`
      );
    }
  }, [isOffline, state.offlineQueue.length, syncOfflineQueue, triggerGlobalToast]);

  // Actions
  const updateActiveSession = (updates, isNewSession = false) => {
    setState((prev) => {
      const nextSession = {
        ...prev.activeSession,
        ...updates,
        id: isNewSession ? `ses-${Date.now()}` : prev.activeSession.id,
        qrToken: `KP5-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        qrSeed: (prev.activeSession.qrSeed || 1) + 1,
      };
      const nextNotifications = isNewSession
        ? {
            ...prev.notifications,
            member: [
              {
                id: `noti-ses-${Date.now()}`,
                title: `Lịch sinh hoạt mới: ${nextSession.title}`,
                content: `${nextSession.date} tại ${nextSession.location}. Đã mở mã QR điểm danh.`,
                time: 'Vừa xong',
                type: 'event',
                unread: true,
              },
              ...prev.notifications.member,
            ],
          }
        : prev.notifications;

      return {
        ...prev,
        activeSession: nextSession,
        scannedMemberIds: isNewSession ? [] : prev.scannedMemberIds,
        notifications: nextNotifications,
      };
    });
  };

  const rotateQRToken = () => {
    setState((prev) => ({
      ...prev,
      activeSession: {
        ...prev.activeSession,
        qrToken: `KP5-${String(Math.floor(1000 + Math.random() * 9000))}-${Math.random()
          .toString(36)
          .substring(2, 6)
          .toUpperCase()}`,
        qrSeed: (prev.activeSession.qrSeed || 1) + 1,
      },
    }));
  };

  // Member QR check-in (supports online and offline queue, blocks duplicate)
  const recordMemberQRCheckIn = ({ distanceMeters = 35 } = {}) => {
    const sessionId = state.activeSession.id;
    const alreadyScanned = state.scannedMemberIds.includes(DEFAULT_CURRENT_MEMBER_ID);
    const alreadyQueued = state.offlineQueue.some(
      (q) => q.memberId === DEFAULT_CURRENT_MEMBER_ID && q.sessionId === sessionId
    );

    if (alreadyScanned || alreadyQueued) {
      return { ok: false, reason: 'already_checked_in' };
    }

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')} - 28/11/2026`;

    if (isOffline) {
      setState((prev) => ({
        ...prev,
        offlineQueue: [
          ...prev.offlineQueue,
          {
            id: `off-${Date.now()}`,
            type: 'qr_scan',
            memberId: DEFAULT_CURRENT_MEMBER_ID,
            memberName: currentMember.name,
            sessionId,
            sessionTitle: prev.activeSession.title,
            timestamp: timeStr,
            gpsCoord: '10.9574°N, 106.8427°E',
            distanceMeters,
            points: 10,
            typeLabel: `QR Động + GPS (${distanceMeters}m) - Lưu ngoại tuyến`,
          },
        ],
      }));
      return { ok: true, offline: true, timestamp: timeStr };
    }

    setState((prev) => {
      const nextScanned = [...prev.scannedMemberIds, DEFAULT_CURRENT_MEMBER_ID];
      const nextMembers = prev.members.map((m) =>
        m.id === DEFAULT_CURRENT_MEMBER_ID
          ? { ...m, points: m.points + 10, lastAttended: '28/11/2026', status: 'active' }
          : m
      );
      const nextHistory = [
        {
          id: `att-${sessionId}`,
          sessionName: prev.activeSession.title,
          date: timeStr,
          status: 'attended',
          badge: 'Vừa hoàn thành',
          pointsEarned: '+10 điểm',
          type: `Xác thực 2 lớp: QR Động ${prev.activeSession.refreshSeconds}s + GPS Geofencing (${distanceMeters}m)`,
        },
        ...prev.attendanceHistory,
      ];

      return {
        ...prev,
        members: nextMembers,
        scannedMemberIds: nextScanned,
        attendanceHistory: nextHistory,
        wardDataByMonth: incrementKP5InWard(prev.wardDataByMonth, 1),
        notifications: {
          ...prev.notifications,
          secretary: [
            {
              id: `noti-qr-${Date.now()}`,
              title: `${currentMember.name} đã điểm danh QR`,
              content: `Vừa quét mã QR động hợp lệ (GPS cách ${distanceMeters}m) cho buổi "${prev.activeSession.title}".`,
              time: 'Vừa xong',
              type: 'event',
              unread: true,
            },
            ...prev.notifications.secretary,
          ],
        },
      };
    });

    return { ok: true, offline: false, timestamp: timeStr };
  };

  // Secretary manual fallback check-in (with exception reason)
  const markManualAttendance = (memberId, exceptionReason = 'Xác nhận ngoại lệ trực tiếp tại NVH') => {
    const member = state.members.find((m) => m.id === memberId);
    if (!member) return { ok: false };
    const sessionId = state.activeSession.id;
    if (
      state.scannedMemberIds.includes(memberId) ||
      state.offlineQueue.some((q) => q.memberId === memberId && q.sessionId === sessionId)
    ) {
      return { ok: false, reason: 'already_checked_in' };
    }

    if (isOffline) {
      setState((prev) => ({
        ...prev,
        offlineQueue: [
          ...prev.offlineQueue,
          {
            id: `off-man-${Date.now()}`,
            type: 'manual_attendance',
            memberId,
            memberName: member.name,
            sessionId,
            sessionTitle: prev.activeSession.title,
            timestamp: '28/11/2026',
            points: 10,
            typeLabel: `Bí thư xác nhận ngoại lệ (${exceptionReason}) - Ngoại tuyến`,
          },
        ],
      }));
      return { ok: true, offline: true, memberName: member.name };
    }

    setState((prev) => {
      const nextScanned = [...prev.scannedMemberIds, memberId];
      const nextMembers = prev.members.map((m) =>
        m.id === memberId
          ? { ...m, points: m.points + 10, lastAttended: '28/11/2026', status: 'active' }
          : m
      );
      const nextHistory =
        memberId === DEFAULT_CURRENT_MEMBER_ID
          ? [
              {
                id: `att-${sessionId}`,
                sessionName: prev.activeSession.title,
                date: '28/11/2026',
                status: 'attended',
                badge: 'Bí thư xác nhận',
                pointsEarned: '+10 điểm',
                type: `Xác nhận ngoại lệ bởi Bí thư KP5: ${exceptionReason}`,
              },
              ...prev.attendanceHistory,
            ]
          : prev.attendanceHistory;

      return {
        ...prev,
        members: nextMembers,
        scannedMemberIds: nextScanned,
        attendanceHistory: nextHistory,
        wardDataByMonth: incrementKP5InWard(prev.wardDataByMonth, 1),
        auditLogs: [
          {
            id: `log-man-${Date.now()}`,
            actor: 'Nguyễn Văn An (Bí thư KP5)',
            action: `Xác nhận điểm danh ngoại lệ cho ${member.name} (${exceptionReason})`,
            time: 'Vừa xong',
          },
          ...prev.auditLogs,
        ],
      };
    });

    return { ok: true, offline: false, memberName: member.name };
  };

  // Member registers for a makeup session (mk-01 or mk-02)
  const registerMakeupSession = (session) => {
    if (state.registeredMakeupIds.includes(session.id)) {
      return { ok: false, reason: 'already_registered' };
    }

    setState((prev) => {
      const nextSessions = prev.makeupSessions.map((s) =>
        s.id === session.id && s.seatsLeft < 999
          ? { ...s, seatsLeft: Math.max(0, s.seatsLeft - 1) }
          : s
      );

      const newReq = {
        id: `req-${Date.now()}`,
        memberId: DEFAULT_CURRENT_MEMBER_ID,
        memberName: currentMember.name,
        workplace: currentMember.workplace,
        shift: currentMember.shift,
        sessionName: prev.activeSession.title,
        registeredMakeup: `${session.branchName} (${session.time})`,
        reason: `Đăng ký sinh hoạt bù ca kíp (${currentMember.shift}) trên ứng dụng Đoàn Viên Số.`,
        proof: 'Xác nhận ca làm việc KCN Thạnh Phú',
        status: 'pending',
        autoPointsAwarded: false,
      };

      return {
        ...prev,
        makeupSessions: nextSessions,
        registeredMakeupIds: [...prev.registeredMakeupIds, session.id],
        makeupRequests: [newReq, ...prev.makeupRequests],
        notifications: {
          ...prev.notifications,
          secretary: [
            {
              id: `noti-mk-${Date.now()}`,
              title: `Đơn đăng ký ca bù mới: ${currentMember.name}`,
              content: `Đã đăng ký "${session.title}" tại ${session.branchName}.`,
              time: 'Vừa xong',
              type: 'makeup',
              unread: true,
            },
            ...prev.notifications.secretary,
          ],
        },
      };
    });

    return { ok: true };
  };

  // Member completes E-Learning quiz (score >= 2 required)
  const completeELearningQuiz = (score, total) => {
    if (score < 2) {
      return { passed: false };
    }
    const alreadyCompleted = state.registeredMakeupIds.includes('mk-03');

    setState((prev) => {
      const nextMembers = alreadyCompleted
        ? prev.members
        : prev.members.map((m) =>
            m.id === DEFAULT_CURRENT_MEMBER_ID
              ? { ...m, points: m.points + 10, makeupCount: m.makeupCount + 1, status: 'active' }
              : m
          );

      const nextHistory = alreadyCompleted
        ? prev.attendanceHistory
        : [
            {
              id: `el-${Date.now()}`,
              sessionName: 'E-Learning: Kỹ năng số & Chuyển đổi số Đồng Nai',
              date: '28/11/2026',
              status: 'makeup',
              badge: 'E-Learning Đạt',
              pointsEarned: '+10 điểm',
              type: `Hoàn thành trắc nghiệm (${score}/${total} câu đúng) • Mã DN-EL-2026-8831`,
            },
            ...prev.attendanceHistory,
          ];

      const hasExistingReq = prev.makeupRequests.some(
        (r) => r.memberId === DEFAULT_CURRENT_MEMBER_ID && r.registeredMakeup.includes('E-Learning')
      );

      const nextRequests = hasExistingReq
        ? prev.makeupRequests
        : [
            {
              id: `req-el-${Date.now()}`,
              memberId: DEFAULT_CURRENT_MEMBER_ID,
              memberName: currentMember.name,
              workplace: currentMember.workplace,
              shift: currentMember.shift,
              sessionName: prev.activeSession.title,
              registeredMakeup: `E-Learning Kỹ năng số Đồng Nai (Đạt ${score}/${total} câu)`,
              reason: 'Công nhân làm ca đêm, hoàn thành bài kiểm tra E-Learning trực tuyến.',
              proof: 'Chứng chỉ điện tử DN-EL-2026-8831',
              status: 'pending',
              autoPointsAwarded: true,
            },
            ...prev.makeupRequests,
          ];

      return {
        ...prev,
        members: nextMembers,
        attendanceHistory: nextHistory,
        registeredMakeupIds: alreadyCompleted
          ? prev.registeredMakeupIds
          : [...prev.registeredMakeupIds, 'mk-03'],
        makeupRequests: nextRequests,
        notifications: {
          ...prev.notifications,
          secretary: [
            {
              id: `noti-el-${Date.now()}`,
              title: `${currentMember.name} đạt chứng chỉ E-Learning`,
              content: `Hoàn thành ${score}/${total} câu trắc nghiệm Chuyển đổi số Đồng Nai (Mã DN-EL-2026-8831).`,
              time: 'Vừa xong',
              type: 'makeup',
              unread: true,
            },
            ...prev.notifications.secretary,
          ],
        },
      };
    });

    return { passed: true, pointsAwarded: !alreadyCompleted };
  };

  // Secretary approves or requests clarification on a makeup request
  const handleMakeupRequestAction = (reqId, action /* 'approve' | 'clarify' */) => {
    const req = state.makeupRequests.find((r) => r.id === reqId);
    if (!req || req.status === 'approved') return;

    setState((prev) => {
      const nextRequests = prev.makeupRequests.map((r) =>
        r.id === reqId
          ? { ...r, status: action === 'approve' ? 'approved' : 'clarify_requested' }
          : r
      );

      if (action !== 'approve') {
        return {
          ...prev,
          makeupRequests: nextRequests,
          notifications:
            req.memberId === DEFAULT_CURRENT_MEMBER_ID
              ? {
                  ...prev.notifications,
                  member: [
                    {
                      id: `noti-cl-${Date.now()}`,
                      title: 'Bí thư KP5 yêu cầu bổ sung minh chứng',
                      content: `Đề nghị đồng chí bổ sung xác nhận lịch ca làm việc cho "${req.registeredMakeup}".`,
                      time: 'Vừa xong',
                      type: 'makeup',
                      unread: true,
                    },
                    ...prev.notifications.member,
                  ],
                }
              : prev.notifications,
        };
      }

      // Approve: update member in Screen5, boost KP5 in Screen6, notify member (without adding to Month 12 activeSession scannedMemberIds)
      const nextMembers = prev.members.map((m) => {
        if (m.id !== req.memberId) return m;
        const pointsAdd = req.autoPointsAwarded ? 0 : 10;
        const updatedHistory = (m.attendanceHistory || []).map((rec, idx) =>
          idx === (m.attendanceHistory?.length || 1) - 1 && rec.status === 'absent'
            ? { ...rec, status: 'makeup', label: 'Đã duyệt SH bù' }
            : rec
        );
        return {
          ...m,
          status: 'active',
          makeupCount: req.autoPointsAwarded ? m.makeupCount : m.makeupCount + 1,
          lastAttended: '28/11/2026',
          points: m.points + pointsAdd,
          attendanceHistory: updatedHistory,
        };
      });

      const nextMemberNotis =
        req.memberId === DEFAULT_CURRENT_MEMBER_ID
          ? [
              {
                id: `noti-app-${Date.now()}`,
                title: 'Bí thư KP5 đã duyệt đơn sinh hoạt bù!',
                content: `Đơn "${req.registeredMakeup}" của đồng chí đã được phê duyệt và ghi nhận chuyên cần.`,
                time: 'Vừa xong',
                type: 'makeup',
                unread: true,
              },
              ...prev.notifications.member,
            ]
          : prev.notifications.member;

      return {
        ...prev,
        makeupRequests: nextRequests,
        members: nextMembers,
        wardDataByMonth: incrementKP5InWard(prev.wardDataByMonth, 1),
        notifications: {
          ...prev.notifications,
          member: nextMemberNotis,
        },
      };
    });
  };

  // Ward Officer sends Zalo reminder to a branch (e.g., pending or low-rate branch)
  const remindBranchReport = (monthKey, branchId) => {
    const branch = state.wardDataByMonth[monthKey]?.branchesRank.find((b) => b.id === branchId);
    if (!branch) return;

    setState((prev) => {
      const monthData = prev.wardDataByMonth[monthKey];
      const updatedBranches = monthData.branchesRank.map((b) =>
        b.id === branchId ? { ...b, reminded: true } : b
      );

      return {
        ...prev,
        wardDataByMonth: {
          ...prev.wardDataByMonth,
          [monthKey]: {
            ...monthData,
            branchesRank: updatedBranches,
          },
        },
        notifications: {
          ...prev.notifications,
          secretary: [
            {
              id: `noti-rem-${Date.now()}`,
              title: `Đoàn Phường nhắc báo cáo ${monthData.monthLabel}`,
              content: `BCH Đoàn Phường Tam Hiệp đề nghị ${branch.name} hoàn tất gửi số liệu sinh hoạt tháng.`,
              time: 'Vừa xong',
              type: 'report',
              unread: true,
            },
            ...prev.notifications.secretary,
          ],
        },
      };
    });
  };

  // Ward Officer broadcasts AI Zalo message to 12 secretaries
  const broadcastZaloToSecretaries = (title, content) => {
    setState((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        secretary: [
          {
            id: `noti-broad-${Date.now()}`,
            title: `Chỉ đạo Đoàn Phường: ${title}`,
            content: content.slice(0, 140) + '...',
            time: 'Vừa xong',
            type: 'report',
            unread: true,
          },
          ...prev.notifications.secretary,
        ],
      },
    }));
  };

  // Redeem reward voucher
  const redeemReward = (reward) => {
    const targetReward = state.rewardItems.find((r) => r.id === reward.id) || reward;
    if (typeof targetReward.available === 'number' && targetReward.available <= 0) {
      return { ok: false, outOfStock: true };
    }
    if (userPoints < targetReward.points) {
      return { ok: false, missing: targetReward.points - userPoints };
    }

    const voucherCode = `DN-KCN-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newVoucher = {
      ...targetReward,
      code: voucherCode,
      createdAt: '28/11/2026',
      expiresAt: '31/12/2026',
      pickupLocation: 'Văn phòng Công đoàn Các KCN Đồng Nai (Đường 3A, KCN Biên Hòa 2)',
    };

    setState((prev) => ({
      ...prev,
      members: prev.members.map((m) =>
        m.id === DEFAULT_CURRENT_MEMBER_ID
          ? { ...m, points: Math.max(0, m.points - targetReward.points) }
          : m
      ),
      rewardItems: prev.rewardItems.map((r) =>
        r.id === targetReward.id && typeof r.available === 'number'
          ? { ...r, available: Math.max(0, r.available - 1) }
          : r
      ),
      vouchers: [newVoucher, ...prev.vouchers],
      notifications: {
        ...prev.notifications,
        member: [
          {
            id: `noti-vch-${Date.now()}`,
            title: `Đổi Voucher thành công: ${targetReward.title}`,
            content: `Mã nhận quà: ${voucherCode}. Đã lưu vào Ví Voucher của bạn.`,
            time: 'Vừa xong',
            type: 'reward',
            unread: true,
          },
          ...prev.notifications.member,
        ],
      },
    }));

    return { ok: true, voucher: newVoucher };
  };

  // Toggle volunteer activity registration
  const toggleVolunteerRegistration = (activityId) => {
    const act = state.volunteerActivities.find((a) => a.id === activityId);
    if (!act || act.status !== 'upcoming') return { ok: false };

    const isRegistered = state.registeredVolunteerIds.includes(activityId);

    setState((prev) => {
      const nextRegistered = isRegistered
        ? prev.registeredVolunteerIds.filter((id) => id !== activityId)
        : [...prev.registeredVolunteerIds, activityId];

      const nextActivities = prev.volunteerActivities.map((a) =>
        a.id === activityId
          ? { ...a, participantsCount: a.participantsCount + (isRegistered ? -1 : 1) }
          : a
      );

      const nextNotis = !isRegistered
        ? [
            {
              id: `noti-vol-${Date.now()}`,
              title: `Đã đăng ký: ${act.title}`,
              content: `Thời gian: ${act.date} tại ${act.location}. Hệ thống sẽ nhắc lịch trước 24h (${act.points} dự kiến).`,
              time: 'Vừa xong',
              type: 'event',
              unread: true,
            },
            ...prev.notifications.member,
          ]
        : prev.notifications.member;

      return {
        ...prev,
        registeredVolunteerIds: nextRegistered,
        volunteerActivities: nextActivities,
        notifications: {
          ...prev.notifications,
          member: nextNotis,
        },
      };
    });

    return { ok: true, registered: !isRegistered, activity: act };
  };

  // Secretary submits KP5 report to Ward
  const submitBranchReportToWard = () => {
    setState((prev) => {
      const month11 = prev.wardDataByMonth['11'];
      if (!month11) return { ...prev, kp5ReportSubmitted: true };
      const updatedBranches = month11.branchesRank.map((b) =>
        b.id === 'kp5' ? { ...b, status: 'submitted', lastSubmittedAt: 'Vừa gửi' } : b
      );
      return {
        ...prev,
        kp5ReportSubmitted: true,
        wardDataByMonth: {
          ...prev.wardDataByMonth,
          '11': {
            ...month11,
            branchesRank: updatedBranches,
          },
        },
        notifications: {
          ...prev.notifications,
          ward_officer: [
            {
              id: `noti-sub-${Date.now()}`,
              title: 'Chi đoàn KP5 đã gửi báo cáo số hóa',
              content: `Bí thư Nguyễn Văn An đã chốt số liệu sinh hoạt KP5 (46 ĐV) gửi Đoàn Phường Tam Hiệp.`,
              time: 'Vừa xong',
              type: 'report',
              unread: true,
            },
            ...prev.notifications.ward_officer,
          ],
        },
      };
    });
  };

  // Secretary sends makeup reminder notification to member
  const sendMemberMakeupReminder = (member) => {
    setState((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        member: [
          {
            id: `noti-mrem-${Date.now()}`,
            title: `Nhắc hẹn Đăng ký Sinh hoạt Bù KCN`,
            content: `Bí thư Chi đoàn KP5 gửi lời mời Đ/c ${member.name} (${member.workplace}) đăng ký lớp Sinh hoạt bù hoặc học E-Learning trực tuyến.`,
            time: 'Vừa xong',
            type: 'makeup',
            unread: true,
          },
          ...prev.notifications.member,
        ],
      },
    }));
  };

  // Reset all persisted data back to default
  const resetAppData = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage error
    }
    setState(buildInitialState());
    setIsOffline(typeof navigator !== 'undefined' ? !navigator.onLine : false);
  };

  // Mark notification(s) as read
  const markNotificationRead = (role, notificationId) => {
    setState((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [role]: (prev.notifications[role] || []).map((n) =>
          n.id === notificationId ? { ...n, unread: false } : n
        ),
      },
    }));
  };

  const markAllNotificationsRead = (role) => {
    setState((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [role]: (prev.notifications[role] || []).map((n) => ({ ...n, unread: false })),
      },
    }));
  };

  // --- MỞ RỘNG 12 CHỨC NĂNG & SOCIAL FEED ---
  const makeAuditEntry = (actor, action) => ({
    id: `log-${Date.now()}-${Math.floor(Math.random() * 100)}`,
    actor,
    action,
    time: 'Vừa xong',
  });

  // 1. Đăng ký tài khoản mới
  const registerNewAccount = (accountData) => {
    setState((prev) => {
      const nextNum = prev.members.length + 1;
      const newMember = {
        id: `dv-reg-${Date.now()}`,
        memberCode: accountData.memberCode || `ĐV-DN-${String(nextNum).padStart(3, '0')}`,
        name: accountData.name,
        phone: accountData.phone,
        type: accountData.type || 'local',
        workplace: accountData.workplace || 'Phường Tam Hiệp, TP. Biên Hòa',
        occupation: accountData.occupation || 'Đoàn viên Thanh niên',
        shift: accountData.shift || 'Hành chính',
        joinDate: accountData.joinDate || '26/03/2024',
        branchName: accountData.branchName || 'Chi đoàn Khu phố 5',
        lastAttended: '24/11/2026',
        points: 80,
        makeupCount: 0,
        status: 'active',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
        attendanceHistory: [{ month: 'Tháng 11', status: 'present', label: 'Mới đăng ký' }],
      };
      return {
        ...prev,
        members: [newMember, ...prev.members],
        registeredAccount: accountData,
        auditLogs: [
          makeAuditEntry(accountData.name, `Đăng ký tài khoản Đoàn viên mới (${newMember.memberCode})`),
          ...prev.auditLogs,
        ],
      };
    });
  };

  // 2. Tạo mới, cập nhật & nhập hàng loạt Excel hồ sơ đoàn viên
  const createMemberProfile = (input) => {
    setState((prev) => {
      const nextNum = prev.members.length + 1;
      const newMember = {
        id: `dv-new-${Date.now()}`,
        memberCode: input.memberCode || `ĐV-DN-${String(nextNum).padStart(3, '0')}`,
        name: input.name,
        phone: input.phone,
        type: input.type || 'local',
        workplace: input.workplace || 'Khu phố 5, Tam Hiệp',
        occupation: input.occupation || 'Lao động trẻ',
        shift: input.shift || 'Hành chính',
        joinDate: input.joinDate || '26/03/2023',
        branchName: 'Chi đoàn Khu phố 5',
        lastAttended: 'Chưa tham gia',
        points: Number(input.points) || 75,
        makeupCount: 0,
        status: 'active',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        attendanceHistory: [{ month: 'Tháng 11', status: 'present', label: 'Hồ sơ mới' }],
      };
      return {
        ...prev,
        members: [newMember, ...prev.members],
        auditLogs: [
          makeAuditEntry('Nguyễn Văn An (Bí thư KP5)', `Tạo mới hồ sơ ĐV ${newMember.name} (${newMember.memberCode})`),
          ...prev.auditLogs,
        ],
      };
    });
  };

  const updateMemberProfile = (memberId, updates) => {
    setState((prev) => {
      const target = prev.members.find((m) => m.id === memberId);
      return {
        ...prev,
        members: prev.members.map((m) => (m.id === memberId ? { ...m, ...updates } : m)),
        auditLogs: [
          makeAuditEntry('Nguyễn Văn An (Bí thư KP5)', `Cập nhật hồ sơ đoàn viên ${target?.name || memberId}`),
          ...prev.auditLogs,
        ],
      };
    });
  };

  const importMembersBatch = (batchList) => {
    setState((prev) => {
      const baseIndex = prev.members.length + 1;
      const added = batchList.map((item, idx) => ({
        id: `dv-imp-${Date.now()}-${idx}`,
        memberCode: `ĐV-DN-${String(baseIndex + idx).padStart(3, '0')}`,
        name: item.name,
        phone: item.phone,
        type: item.type || 'working_far',
        workplace: item.workplace || 'KCN Biên Hòa',
        occupation: item.occupation || 'Công nhân sản xuất KCN',
        shift: item.shift || 'Ca 2 (14h - 22h)',
        joinDate: item.joinDate || '26/03/2023',
        branchName: 'Chi đoàn Khu phố 5',
        lastAttended: '15/11/2026',
        points: item.points || 80,
        makeupCount: 0,
        status: 'active',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
        attendanceHistory: [{ month: 'Tháng 11', status: 'present', label: 'Nhập từ Excel' }],
      }));
      return {
        ...prev,
        members: [...added, ...prev.members],
        auditLogs: [
          makeAuditEntry('Nguyễn Văn An (Bí thư KP5)', `Nhập hàng loạt ${added.length} hồ sơ đoàn viên từ tệp Excel`),
          ...prev.auditLogs,
        ],
      };
    });
  };

  // 5. Đoàn viên cập nhật trạng thái đi làm xa / ca kíp & gửi đơn xin vắng mặt trực tuyến
  const updateMemberWorkShift = ({ type, workplace, shift }) => {
    setState((prev) => ({
      ...prev,
      members: prev.members.map((m) =>
        m.id === DEFAULT_CURRENT_MEMBER_ID ? { ...m, type, workplace, shift } : m
      ),
      auditLogs: [
        makeAuditEntry(currentMember.name, `Cập nhật trạng thái "${type === 'working_far' ? 'Đi làm xa KCN' : 'Tại địa phương'}" - ${shift}`),
        ...prev.auditLogs,
      ],
    }));
  };

  const submitAbsenceRequest = ({ sessionTitle, reason, proof, preferredMakeup }) => {
    setState((prev) => {
      const newReq = {
        id: `req-abs-${Date.now()}`,
        memberId: DEFAULT_CURRENT_MEMBER_ID,
        memberName: currentMember.name,
        workplace: currentMember.workplace,
        shift: currentMember.shift,
        sessionName: sessionTitle || prev.activeSession.title,
        registeredMakeup: preferredMakeup || 'Xin phép vắng & đăng ký sinh hoạt bù',
        reason,
        proof: proof || 'Lịch phân ca từ tổ trưởng KCN',
        status: 'pending',
        autoPointsAwarded: false,
      };
      return {
        ...prev,
        makeupRequests: [newReq, ...prev.makeupRequests],
        notifications: {
          ...prev.notifications,
          secretary: [
            {
              id: `noti-abs-${Date.now()}`,
              title: `Đơn xin vắng & ca bù: ${currentMember.name}`,
              content: `Lý do: ${reason} (${currentMember.shift}).`,
              time: 'Vừa xong',
              type: 'makeup',
              unread: true,
            },
            ...prev.notifications.secretary,
          ],
        },
        auditLogs: [
          makeAuditEntry(currentMember.name, `Gửi đơn xin vắng mặt trực tuyến (${newReq.sessionName})`),
          ...prev.auditLogs,
        ],
      };
    });
  };

  // 6 & 7. Tạo hoạt động mới, Điểm danh QR hoạt động, Gửi minh chứng & Thưởng điểm/Huy hiệu
  const createVolunteerActivity = ({ title, date, location, pointsValue }) => {
    const newAct = {
      id: `act-${Date.now()}`,
      title,
      date,
      location,
      points: `+${pointsValue} điểm`,
      pointsValue: Number(pointsValue),
      participantsCount: 1,
      status: 'upcoming',
    };
    setState((prev) => ({
      ...prev,
      volunteerActivities: [newAct, ...prev.volunteerActivities],
      notifications: {
        ...prev.notifications,
        member: [
          {
            id: `noti-nact-${Date.now()}`,
            title: `Hoạt động phong trào mới: ${title}`,
            content: `${date} tại ${location} (${newAct.points}). Đăng ký tham gia ngay!`,
            time: 'Vừa xong',
            type: 'event',
            unread: true,
          },
          ...prev.notifications.member,
        ],
      },
      auditLogs: [
        makeAuditEntry('Nguyễn Văn An (Bí thư KP5)', `Đăng tải hoạt động mới "${title}"`),
        ...prev.auditLogs,
      ],
    }));
  };

  const checkInVolunteerQR = (activityId) => {
    if (state.volunteerCheckedInIds.includes(activityId)) {
      return { ok: false };
    }
    const act = state.volunteerActivities.find((a) => a.id === activityId);
    const pts = act?.pointsValue || 20;
    setState((prev) => ({
      ...prev,
      volunteerCheckedInIds: [...prev.volunteerCheckedInIds, activityId],
      members: prev.members.map((m) =>
        m.id === DEFAULT_CURRENT_MEMBER_ID ? { ...m, points: m.points + pts } : m
      ),
      auditLogs: [
        makeAuditEntry(currentMember.name, `Quét QR điểm danh hoạt động "${act?.title || activityId}" (+${pts}đ)`),
        ...prev.auditLogs,
      ],
    }));
    return { ok: true, points: pts, activity: act };
  };

  const submitVolunteerProof = (activityId, { mediaLabel, note, imageUrl }) => {
    setState((prev) => ({
      ...prev,
      volunteerProofs: {
        ...prev.volunteerProofs,
        [activityId]: { mediaLabel, note, imageUrl, submittedAt: 'Vừa xong' },
      },
      auditLogs: [
        makeAuditEntry(currentMember.name, `Gửi ảnh/video minh chứng hoạt động (${mediaLabel})`),
        ...prev.auditLogs,
      ],
    }));
  };

  const awardBonusPoints = (memberId, points, badgeId, reason) => {
    const target = state.members.find((m) => m.id === memberId);
    setState((prev) => ({
      ...prev,
      members: prev.members.map((m) =>
        m.id === memberId ? { ...m, points: m.points + Number(points) } : m
      ),
      digitalBadges: badgeId
        ? prev.digitalBadges.map((b) =>
            b.id === badgeId ? { ...b, earned: true, earnedAt: '28/11/2026' } : b
          )
        : prev.digitalBadges,
      notifications:
        memberId === DEFAULT_CURRENT_MEMBER_ID
          ? {
              ...prev.notifications,
              member: [
                {
                  id: `noti-aw-${Date.now()}`,
                  title: `Được thưởng +${points} điểm thành tích`,
                  content: reason || 'Bí thư Chi đoàn KP5 đã xác nhận cộng điểm thưởng phong trào.',
                  time: 'Vừa xong',
                  type: 'reward',
                  unread: true,
                },
                ...prev.notifications.member,
              ],
            }
          : prev.notifications,
      auditLogs: [
        makeAuditEntry('Cán bộ Đoàn', `Xác nhận cộng +${points}đ cho ${target?.name || memberId} (${reason})`),
        ...prev.auditLogs,
      ],
    }));
  };

  // 8. Gửi thông báo theo Chi đoàn / nhóm đối tượng / đổi lịch
  const sendTargetedNotification = ({ title, content, targetGroup, targetRole = 'member' }) => {
    const newNoti = {
      id: `noti-tgt-${Date.now()}`,
      title: `[${targetGroup}] ${title}`,
      content,
      time: 'Vừa xong',
      type: 'event',
      unread: true,
      targetGroup,
    };
    setState((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [targetRole]: [newNoti, ...(prev.notifications[targetRole] || [])],
      },
      auditLogs: [
        makeAuditEntry('Cán bộ Đoàn', `Gửi thông báo tới nhóm "${targetGroup}": ${title}`),
        ...prev.auditLogs,
      ],
    }));
  };

  // 9. Quản lý chuyển sinh hoạt Đoàn
  const submitTransferRequest = ({ memberId, memberName, memberCode, direction, fromBranch, toBranch, reason }) => {
    const newReq = {
      id: `tr-${Date.now()}`,
      memberId: memberId || DEFAULT_CURRENT_MEMBER_ID,
      memberName: memberName || currentMember.name,
      memberCode: memberCode || currentMember.memberCode,
      direction: direction || 'outgoing',
      fromBranch: fromBranch || 'Chi đoàn Khu phố 5 - P. Tam Hiệp',
      toBranch,
      reason,
      submittedAt: '24/11/2026',
      status: 'pending',
      step: 1,
    };
    setState((prev) => ({
      ...prev,
      transferRequests: [newReq, ...prev.transferRequests],
      notifications: {
        ...prev.notifications,
        secretary: [
          {
            id: `noti-tr-${Date.now()}`,
            title: `Hồ sơ chuyển sinh hoạt mới: ${newReq.memberName}`,
            content: `${newReq.fromBranch} → ${newReq.toBranch}. Lý do: ${reason}`,
            time: 'Vừa xong',
            type: 'report',
            unread: true,
          },
          ...prev.notifications.secretary,
        ],
      },
      auditLogs: [
        makeAuditEntry(newReq.memberName, `Gửi yêu cầu chuyển sinh hoạt tới ${toBranch}`),
        ...prev.auditLogs,
      ],
    }));
  };

  const processTransferRequest = (reqId, action /* 'approve' | 'reject' */) => {
    const target = state.transferRequests.find((t) => t.id === reqId);
    if (!target) return;
    setState((prev) => {
      const nextTransfers = prev.transferRequests.map((t) =>
        t.id === reqId
          ? {
              ...t,
              status: action === 'approve' ? 'completed' : 'rejected',
              step: action === 'approve' ? 4 : t.step,
            }
          : t
      );

      let nextMembers = prev.members;
      if (action === 'approve') {
        if (target.direction === 'outgoing') {
          nextMembers = prev.members.map((m) =>
            m.id === target.memberId
              ? { ...m, type: 'transferred', status: 'pending_transfer', note: `Đã chuyển sang ${target.toBranch}` }
              : m
          );
        } else {
          const exists = prev.members.some((m) => m.id === target.memberId);
          if (!exists) {
            nextMembers = [
              {
                id: target.memberId,
                memberCode: target.memberCode,
                name: target.memberName,
                phone: '0933.778.901',
                type: 'local',
                workplace: 'Khu phố 5, Tam Hiệp (Chuyển đến)',
                occupation: 'Công nhân KCN Amata',
                shift: 'Ca 1 (06h - 14h)',
                joinDate: '26/03/2022',
                branchName: 'Chi đoàn Khu phố 5',
                lastAttended: '24/11/2026',
                points: 85,
                makeupCount: 0,
                status: 'active',
                avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
                attendanceHistory: [{ month: 'Tháng 11', status: 'present', label: 'Tiếp nhận chuyển đến' }],
              },
              ...prev.members,
            ];
          }
        }
      }

      return {
        ...prev,
        transferRequests: nextTransfers,
        members: nextMembers,
        auditLogs: [
          makeAuditEntry('Cán bộ Đoàn', `${action === 'approve' ? 'Phê duyệt & đồng bộ' : 'Từ chối'} hồ sơ chuyển SH của ${target.memberName}`),
          ...prev.auditLogs,
        ],
      };
    });
  };

  // Personal Schedule & Social Event Registration Actions
  const enrollScheduleItem = (item) => {
    if (!item || !item.id) return { ok: false };
    const exists = state.mySchedule.some((s) => s.id === item.id || s.title === item.title);
    if (exists) return { ok: false, reason: 'already_enrolled' };

    setState((prev) => {
      const nextScheduleItem = {
        ...item,
        mandatory: false,
      };
      const nextCatalog = prev.scheduleCatalog.map((c) =>
        c.id === item.id && typeof c.seatsLeft === 'number' && c.seatsLeft < 999
          ? { ...c, seatsLeft: Math.max(0, c.seatsLeft - 1) }
          : c
      );
      return {
        ...prev,
        mySchedule: [nextScheduleItem, ...prev.mySchedule],
        scheduleCatalog: nextCatalog,
        registeredMakeupIds: prev.registeredMakeupIds.includes(item.id)
          ? prev.registeredMakeupIds
          : [...prev.registeredMakeupIds, item.id],
        auditLogs: [
          makeAuditEntry(currentMember.name, `Đăng ký "${item.title}" vào Lịch cá nhân (${item.dateStr})`),
          ...prev.auditLogs,
        ],
      };
    });
    return { ok: true };
  };

  const unenrollScheduleItem = (itemId) => {
    setState((prev) => ({
      ...prev,
      mySchedule: prev.mySchedule.filter((s) => s.id !== itemId),
      registeredMakeupIds: prev.registeredMakeupIds.filter((id) => id !== itemId),
      socialPosts: prev.socialPosts.map((p) =>
        p.eventSchedule?.id === itemId
          ? {
              ...p,
              registeredByMe: false,
              registeredCount: Math.max(0, (p.registeredCount || 1) - 1),
            }
          : p
      ),
    }));
  };

  const createScheduleCatalogItem = (form) => {
    const newItem = {
      id: `cat-${Date.now()}`,
      title: form.title,
      category: form.category || 'Sinh hoạt',
      dateStr: form.dateStr || '29/11/2026',
      dayOfWeek: form.dayOfWeek || 'CN',
      timeSlot: form.timeSlot || '08:00 - 10:30',
      room: form.room || 'Nhà văn hóa Khu phố 5',
      organizer: form.organizer || 'BCH Chi đoàn KP5',
      format: form.format || 'Trực tiếp • Điểm danh QR',
      points: `+${form.pointsValue || 15} điểm`,
      seatsLeft: Number(form.seatsLeft) || 40,
      isELearning: Boolean(form.isELearning),
    };
    setState((prev) => ({
      ...prev,
      scheduleCatalog: [newItem, ...prev.scheduleCatalog],
      mySchedule: form.autoEnroll ? [newItem, ...prev.mySchedule] : prev.mySchedule,
      auditLogs: [
        makeAuditEntry('Cán bộ Đoàn', `Thêm lịch hoạt động mới "${newItem.title}" (${newItem.dateStr})`),
        ...prev.auditLogs,
      ],
    }));
    return newItem;
  };

  const registerEventFromSocialPost = (post) => {
    if (!post?.eventSchedule) return { ok: false };
    const ev = post.eventSchedule;
    const exists = state.mySchedule.some((s) => s.id === ev.id || s.title === ev.title);

    if (exists) {
      return { ok: false, reason: 'already_registered' };
    }

    setState((prev) => ({
      ...prev,
      mySchedule: [
        {
          ...ev,
          mandatory: false,
        },
        ...prev.mySchedule,
      ],
      socialPosts: prev.socialPosts.map((p) =>
        p.id === post.id
          ? {
              ...p,
              registeredByMe: true,
              registeredCount: (p.registeredCount || 0) + 1,
            }
          : p
      ),
      notifications: {
        ...prev.notifications,
        member: [
          {
            id: `noti-evreg-${Date.now()}`,
            title: `Đã thêm vào Lịch: ${ev.title}`,
            content: `${ev.dateStr} (${ev.timeSlot}) tại ${ev.room}. Hệ thống sẽ nhắc trước giờ diễn ra.`,
            time: 'Vừa xong',
            type: 'event',
            unread: true,
          },
          ...prev.notifications.member,
        ],
      },
      auditLogs: [
        makeAuditEntry(currentMember.name, `Đăng ký tham dự sự kiện "${ev.title}" từ Bảng tin (Đã thêm vào Lịch)`),
        ...prev.auditLogs,
      ],
    }));
    return { ok: true };
  };

  // Social Feed Actions
  const createSocialPost = ({
    content,
    eventTag,
    imageUrl,
    authorName,
    authorRole,
    authorAvatar,
    category = 'event',
    isEventPost = false,
    eventSchedule = null,
    verifiedOfficer = false,
  }) => {
    const builtSchedule =
      isEventPost && eventSchedule
        ? {
            id: `ev-soc-${Date.now()}`,
            title: eventSchedule.title || eventTag,
            category: 'Sự kiện Đoàn',
            dateStr: eventSchedule.dateStr || '29/11/2026',
            dayOfWeek: eventSchedule.dayOfWeek || 'CN',
            timeSlot: eventSchedule.timeSlot || '08:00 - 11:00',
            room: eventSchedule.room || 'Nhà văn hóa Khu phố 5',
            organizer: authorName || 'Cán bộ Đoàn',
            format: 'Trực tiếp • Điểm danh QR',
            points: eventSchedule.points || '+20 điểm',
            isELearning: false,
          }
        : null;

    const newPost = {
      id: `post-${Date.now()}`,
      authorId: DEFAULT_CURRENT_MEMBER_ID,
      authorName: authorName || currentMember.name,
      authorRole: authorRole || `Đoàn viên • ${currentMember.workplace}`,
      authorAvatar: authorAvatar || currentMember.avatar,
      branchName: 'Chi đoàn Khu phố 5',
      category,
      eventTag: (builtSchedule && builtSchedule.title) || eventTag || 'Hoạt động Thanh niên Đồng Nai',
      isEventPost: Boolean(isEventPost && builtSchedule),
      verifiedOfficer,
      verifiedParticipant: true,
      registeredCount: builtSchedule ? 1 : 0,
      registeredByMe: false,
      eventSchedule: builtSchedule,
      createdAt: 'Vừa xong',
      content,
      imageUrl: imageUrl || null,
      likesCount: 1,
      likedByMe: true,
      comments: [],
    };
    setState((prev) => ({
      ...prev,
      socialPosts: [newPost, ...prev.socialPosts],
      scheduleCatalog: builtSchedule
        ? [{ ...builtSchedule, seatsLeft: 50 }, ...prev.scheduleCatalog]
        : prev.scheduleCatalog,
      members: prev.members.map((m) =>
        m.id === DEFAULT_CURRENT_MEMBER_ID ? { ...m, points: m.points + 5 } : m
      ),
      digitalBadges: prev.digitalBadges.map((b) =>
        b.id === 'bdg-4' ? { ...b, earned: true, earnedAt: '24/11/2026' } : b
      ),
      auditLogs: [
        makeAuditEntry(newPost.authorName, `Đăng ${builtSchedule ? 'bài phát động sự kiện' : 'bài viết'} "${newPost.eventTag}" lên Bảng tin (+5đ)`),
        ...prev.auditLogs,
      ],
    }));
    return newPost;
  };

  const toggleLikeSocialPost = (postId) => {
    setState((prev) => ({
      ...prev,
      socialPosts: prev.socialPosts.map((p) =>
        p.id === postId
          ? {
              ...p,
              likedByMe: !p.likedByMe,
              likesCount: p.likedByMe ? Math.max(0, p.likesCount - 1) : p.likesCount + 1,
            }
          : p
      ),
    }));
  };

  const addSocialComment = (postId, authorName, text) => {
    if (!text.trim()) return;
    setState((prev) => ({
      ...prev,
      socialPosts: prev.socialPosts.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: [
                ...p.comments,
                {
                  id: `cmt-${Date.now()}`,
                  authorName,
                  text: text.trim(),
                  time: 'Vừa xong',
                },
              ],
            }
          : p
      ),
    }));
  };

  // 12. Quản trị & Bảo mật hệ thống
  const updateSecuritySettings = (partial) => {
    setState((prev) => ({
      ...prev,
      securitySettings: { ...prev.securitySettings, ...partial },
      auditLogs: [
        makeAuditEntry('Quản trị viên Hệ thống', `Cập nhật cấu hình bảo mật hệ thống`),
        ...prev.auditLogs,
      ],
    }));
  };

  const exportBackupJSON = () => {
    return JSON.stringify({ exportedAt: new Date().toISOString(), app: 'DoanVienSoDongNai', state }, null, 2);
  };

  const restoreBackupJSON = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && parsed.state && Array.isArray(parsed.state.members)) {
        setState(parsed.state);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const value = {
    ...state,
    currentMember,
    userPoints,
    scannedCount: state.scannedMemberIds.length,
    isOffline,
    setIsOffline,
    globalToast,
    triggerGlobalToast,
    preselectedSocialEvent,
    setPreselectedSocialEvent,
    syncOfflineQueue,
    updateActiveSession,
    rotateQRToken,
    recordMemberQRCheckIn,
    markManualAttendance,
    registerMakeupSession,
    completeELearningQuiz,
    handleMakeupRequestAction,
    remindBranchReport,
    broadcastZaloToSecretaries,
    redeemReward,
    toggleVolunteerRegistration,
    submitBranchReportToWard,
    sendMemberMakeupReminder,
    resetAppData,
    markNotificationRead,
    markAllNotificationsRead,
    registerNewAccount,
    createMemberProfile,
    updateMemberProfile,
    importMembersBatch,
    updateMemberWorkShift,
    submitAbsenceRequest,
    createVolunteerActivity,
    checkInVolunteerQR,
    submitVolunteerProof,
    awardBonusPoints,
    sendTargetedNotification,
    submitTransferRequest,
    processTransferRequest,
    createSocialPost,
    toggleLikeSocialPost,
    addSocialComment,
    enrollScheduleItem,
    unenrollScheduleItem,
    createScheduleCatalogItem,
    registerEventFromSocialPost,
    updateSecuritySettings,
    exportBackupJSON,
    restoreBackupJSON,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within AppProvider');
  }
  return ctx;
}
