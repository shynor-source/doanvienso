import React, { useState, useCallback, useEffect, useRef } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import RoleSwitcherModal from './components/RoleSwitcherModal';
import NotificationModal from './components/NotificationModal';
import SecretaryReportView from './components/SecretaryReportView';
import SystemAdminModal from './components/SystemAdminModal';

// Screens
import Screen1RoleLogin from './screens/Screen1RoleLogin';
import Screen2SecretaryHome from './screens/Screen2SecretaryHome';
import Screen3CreateSessionQR from './screens/Screen3CreateSessionQR';
import Screen4MemberScanQR from './screens/Screen4MemberScanQR';
import Screen5MemberListFilter from './screens/Screen5MemberListFilter';
import Screen6WardDashboard from './screens/Screen6WardDashboard';
import Screen7MakeupSession from './screens/Screen7MakeupSession';
import Screen8RewardsVolunteer from './screens/Screen8RewardsVolunteer';
import Screen9SocialFeed from './screens/Screen9SocialFeed';
import Screen10UtilitiesMenu from './screens/Screen10UtilitiesMenu';
import MemberHomeView from './screens/MemberHomeView';

import { useApp } from './context/AppContext';
import { Layers, CheckCircle2, X } from 'lucide-react';

export default function App() {
  const { globalToast, triggerGlobalToast, activeSession } = useApp();

  // Vai trò người dùng: 'secretary' | 'member' | 'ward_officer'
  const [currentRole, setCurrentRole] = useState('secretary');

  // Màn hình hiện tại: Mặc định vào Màn hình 1 (Đăng nhập theo vai trò)
  const [activeScreen, setActiveScreen] = useState('login');

  // Sub-tab cho Screen4: 'scan' | 'history'
  const [memberSubTab, setMemberSubTab] = useState('scan');

  // Trigger mở modal Xem trước xuất báo cáo ở Screen6
  const [exportModalTrigger, setExportModalTrigger] = useState(0);
  const handleConsumeExportTrigger = useCallback(() => setExportModalTrigger(0), []);

  // Modal states
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSystemAdminOpen, setIsSystemAdminOpen] = useState(false);

  // Reset vị trí cuộn về đầu trang mỗi khi chuyển màn hình hoặc đổi vai trò
  const mainRef = useRef(null);
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [activeScreen, currentRole, memberSubTab]);

  const handleSelectRoleFromLogin = (roleId) => {
    setCurrentRole(roleId);
    if (roleId === 'secretary') {
      setActiveScreen('home');
    } else if (roleId === 'member') {
      setMemberSubTab('scan');
      setActiveScreen('home');
    } else if (roleId === 'ward_officer') {
      setActiveScreen('ward_dash');
    }
  };

  // Điều hướng từ Menu Tiện ích (mở mọi màn hình trong hệ thống)
  const handleNavigateFromUtilities = (target) => {
    if (target === 'history') {
      setMemberSubTab('history');
      setActiveScreen('scan_qr');
      return;
    }
    if (target === 'scan_qr') {
      setMemberSubTab('scan');
      setActiveScreen('scan_qr');
      return;
    }
    if (target === 'ward_branches' || target === 'ward_reports' || target === 'ward_rewards') {
      setActiveScreen(target);
      return;
    }
    setActiveScreen(target);
  };

  // Điều hướng từ BottomNav theo từng vai trò
  const handleBottomNavChange = (tabId) => {
    if (tabId === 'social') {
      setActiveScreen('social');
      return;
    }
    if (tabId === 'menu') {
      setActiveScreen('menu');
      return;
    }
    if (tabId === 'makeup') {
      setActiveScreen('makeup');
      return;
    }

    if (currentRole === 'member') {
      if (tabId === 'home') {
        setActiveScreen('home');
      } else if (tabId === 'qr_action') {
        setMemberSubTab('scan');
        setActiveScreen('scan_qr');
      } else if (tabId === 'history') {
        setMemberSubTab('history');
        setActiveScreen('scan_qr');
      } else if (tabId === 'rewards') {
        setActiveScreen('rewards');
      }
      return;
    }

    if (currentRole === 'ward_officer') {
      if (tabId === 'home') {
        setActiveScreen('ward_dash');
      } else if (tabId === 'branches') {
        setActiveScreen('ward_branches');
      } else if (tabId === 'export_action') {
        const wardScreens = ['ward_dash', 'ward_branches', 'ward_reports', 'ward_rewards'];
        if (!wardScreens.includes(activeScreen)) {
          setActiveScreen('ward_dash');
        }
        setExportModalTrigger((c) => c + 1);
      } else if (tabId === 'reports') {
        setActiveScreen('ward_reports');
      } else if (tabId === 'rewards') {
        setActiveScreen('ward_rewards');
      }
      return;
    }

    // Vai trò Bí thư Chi đoàn ('secretary')
    if (tabId === 'home') {
      setActiveScreen('home');
    } else if (tabId === 'members') {
      setActiveScreen('members');
    } else if (tabId === 'qr_action') {
      setActiveScreen('create_qr');
    } else if (tabId === 'reports') {
      setActiveScreen('reports');
    }
  };

  // Xác định tab đang active trên BottomNav
  const getActiveNavTab = () => {
    if (activeScreen === 'social') return 'social';
    if (activeScreen === 'menu') return 'menu';
    if (activeScreen === 'makeup') return 'makeup';

    if (currentRole === 'member') {
      if (activeScreen === 'home') return 'home';
      if (activeScreen === 'scan_qr') {
        return memberSubTab === 'scan' ? 'qr_action' : 'menu';
      }
      return 'menu';
    }

    if (currentRole === 'ward_officer') {
      if (activeScreen === 'ward_dash') return 'home';
      if (activeScreen === 'ward_branches') return 'branches';
      return 'menu';
    }

    if (activeScreen === 'home') return 'home';
    if (activeScreen === 'create_qr') return 'qr_action';
    return 'menu';
  };

  // Xác định tiêu đề Flutter AppBar & nút Back (Ngôn ngữ chuẩn quy mô lớn)
  const getHeaderInfo = () => {
    switch (activeScreen) {
      case 'home':
        if (currentRole === 'member') {
          return {
            title: 'Trang chủ Đoàn viên',
            subtitle: 'Chi đoàn Khu phố 5 • Tỉnh Đồng Nai',
            showBack: false,
          };
        }
        return {
          title: 'Chi đoàn Khu phố 5',
          subtitle: 'Quản lý Đoàn vụ • Phường Tam Hiệp',
          showBack: false,
        };
      case 'create_qr':
        return {
          title: 'Sinh hoạt & Mã QR',
          subtitle: activeSession.title,
          showBack: true,
        };
      case 'scan_qr':
        return {
          title: memberSubTab === 'history' ? 'Lịch sử tham gia' : 'Quét QR Điểm danh',
          subtitle: 'Xác thực 2 lớp & Định vị GPS',
          showBack: true,
        };
      case 'members':
        return {
          title: 'Danh bạ & Hồ sơ ĐV',
          subtitle: 'Quản lý thành viên & Chuyển sinh hoạt',
          showBack: true,
        };
      case 'reports':
        return {
          title: 'Báo cáo Chi đoàn KP5',
          subtitle: 'Tổng hợp số liệu định kỳ',
          showBack: true,
        };
      case 'ward_dash':
        return {
          title: 'Đoàn Phường Tam Hiệp',
          subtitle: '12 chi đoàn • 485 đoàn viên',
          showBack: false,
        };
      case 'ward_branches':
        return {
          title: 'Quản lý 12 Chi đoàn',
          subtitle: 'Đoàn Phường Tam Hiệp',
          showBack: true,
        };
      case 'ward_reports':
        return {
          title: 'Báo cáo Đoàn vụ',
          subtitle: 'Thống kê & Xuất văn bản tự động',
          showBack: true,
        };
      case 'ward_rewards':
        return {
          title: 'Thi đua & Xếp hạng',
          subtitle: '12 Chi đoàn trực thuộc',
          showBack: true,
        };
      case 'makeup':
        return {
          title: 'Lịch hoạt động cá nhân',
          subtitle: 'Theo dõi lịch sinh hoạt & sự kiện đã đăng ký',
          showBack: true,
        };
      case 'rewards':
        return {
          title: 'Thi đua & Đổi quà',
          subtitle: 'Phong trào thanh niên & Ví Voucher',
          showBack: true,
        };
      case 'social':
        return {
          title: 'Bảng tin Đoàn viên',
          subtitle: 'Sự kiện phát động & Hoạt động cộng đồng',
          showBack: true,
        };
      case 'menu':
        return {
          title: 'Menu Tiện ích',
          subtitle: 'Toàn bộ tính năng & dịch vụ số',
          showBack: false,
        };
      default:
        return { title: 'Đoàn Viên Số', subtitle: 'Tỉnh Đồng Nai', showBack: false };
    }
  };

  const headerInfo = getHeaderInfo();

  return (
    <div className="min-h-screen bg-[#0B0F19] flex flex-col items-center justify-center p-0 sm:py-5 text-slate-900 font-sans">
      {/* Studio Header Bar */}
      <div className="hidden sm:flex items-center justify-between w-[390px] mb-2.5 px-1 text-xs text-slate-300">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
          <span className="font-semibold text-white truncate">Đoàn Viên Số</span>
          <span className="text-[11px] text-slate-400 font-mono shrink-0">390×844 dp</span>
        </div>

        <button
          onClick={() => setIsRoleModalOpen(true)}
          className="h-8 px-3 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-[11px] rounded-full border border-slate-700 flex items-center gap-1.5 transition shrink-0"
          title="Chuyển đổi góc nhìn 3 vai trò trong ứng dụng"
        >
          <Layers className="w-3.5 h-3.5 text-blue-300" />
          <span>Đổi vai trò</span>
        </button>
      </div>

      {/* Flutter Mobile Artboard Container (390 × 844 dp cố định) */}
      <div className="relative w-full sm:w-[390px] h-[100dvh] sm:h-[844px] bg-[#F5F7FB] sm:rounded-[44px] shadow-2xl overflow-hidden flex flex-col sm:ring-[10px] sm:ring-[#1E2433] mx-auto shrink-0 [transform:translateZ(0)]">
        {/* Global Sync Toast */}
        {globalToast && (
          <div className="absolute top-14 left-4 right-4 z-[60] bg-slate-900/95 text-white px-3.5 py-2.5 rounded-2xl shadow-lg flex items-center gap-2.5 border border-slate-700/80 backdrop-blur-md animate-fade-in text-[12px] font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="flex-1 leading-snug">{globalToast}</span>
            <button
              onClick={() => triggerGlobalToast(null)}
              className="p-1 text-slate-400 hover:text-white rounded-full"
              aria-label="Đóng thông báo"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Nội dung Màn hình */}
        {activeScreen === 'login' ? (
          <div className="flex-1 overflow-y-auto bg-white">
            <Screen1RoleLogin onSelectRole={handleSelectRoleFromLogin} />
          </div>
        ) : (
          <>
            <Header
              title={headerInfo.title}
              subtitle={headerInfo.subtitle}
              showBack={headerInfo.showBack}
              onBack={() => {
                if (currentRole === 'ward_officer') setActiveScreen('ward_dash');
                else setActiveScreen('home');
              }}
              currentRole={currentRole}
              onOpenNotification={() => setIsNotificationOpen(true)}
              onOpenAdmin={() => setIsSystemAdminOpen(true)}
              onLogout={() => setActiveScreen('login')}
            />

            <main ref={mainRef} className="flex-1 overflow-y-auto bg-[#F5F7FB] relative">
              {activeScreen === 'home' && currentRole === 'secretary' && (
                <Screen2SecretaryHome onNavigate={(target) => setActiveScreen(target)} />
              )}

              {activeScreen === 'home' && currentRole === 'member' && (
                <MemberHomeView
                  onNavigate={(target) => {
                    if (target === 'scan_qr') setMemberSubTab('scan');
                    setActiveScreen(target);
                  }}
                  onOpenHistory={() => {
                    setMemberSubTab('history');
                    setActiveScreen('scan_qr');
                  }}
                />
              )}

              {activeScreen === 'home' && currentRole === 'ward_officer' && (
                <Screen6WardDashboard
                  viewMode="overview"
                  exportModalTrigger={exportModalTrigger}
                  onConsumeExportTrigger={handleConsumeExportTrigger}
                />
              )}

              {activeScreen === 'create_qr' && (
                <Screen3CreateSessionQR onBack={() => setActiveScreen('home')} />
              )}

              {activeScreen === 'scan_qr' && (
                <Screen4MemberScanQR
                  activeTab={memberSubTab}
                  onTabChange={setMemberSubTab}
                  onNavigate={(target) => setActiveScreen(target)}
                  onNavigateSocial={() => setActiveScreen('social')}
                />
              )}

              {activeScreen === 'members' && <Screen5MemberListFilter />}

              {activeScreen === 'reports' && (
                <SecretaryReportView onBack={() => setActiveScreen('home')} />
              )}

              {activeScreen === 'ward_dash' && (
                <Screen6WardDashboard
                  viewMode="overview"
                  exportModalTrigger={exportModalTrigger}
                  onConsumeExportTrigger={handleConsumeExportTrigger}
                />
              )}

              {activeScreen === 'ward_branches' && (
                <Screen6WardDashboard
                  viewMode="branches"
                  exportModalTrigger={exportModalTrigger}
                  onConsumeExportTrigger={handleConsumeExportTrigger}
                />
              )}

              {activeScreen === 'ward_reports' && (
                <Screen6WardDashboard
                  viewMode="reports"
                  exportModalTrigger={exportModalTrigger}
                  onConsumeExportTrigger={handleConsumeExportTrigger}
                />
              )}

              {activeScreen === 'ward_rewards' && (
                <Screen6WardDashboard
                  viewMode="rewards"
                  exportModalTrigger={exportModalTrigger}
                  onConsumeExportTrigger={handleConsumeExportTrigger}
                />
              )}

              {activeScreen === 'makeup' && (
                <Screen7MakeupSession
                  currentRole={currentRole}
                  onNavigate={(target) => {
                    if (target === 'scan_qr') setMemberSubTab('scan');
                    setActiveScreen(target);
                  }}
                />
              )}

              {activeScreen === 'rewards' && (
                <Screen8RewardsVolunteer
                  onNavigateSocial={() => setActiveScreen('social')}
                />
              )}

              {activeScreen === 'social' && (
                <Screen9SocialFeed
                  currentRole={currentRole}
                  onNavigate={(target) => setActiveScreen(target)}
                />
              )}

              {activeScreen === 'menu' && (
                <Screen10UtilitiesMenu
                  currentRole={currentRole}
                  onNavigateScreen={handleNavigateFromUtilities}
                  onOpenRoleModal={() => setIsRoleModalOpen(true)}
                  onOpenNotification={() => setIsNotificationOpen(true)}
                  onOpenAdmin={() => setIsSystemAdminOpen(true)}
                  onLogout={() => setActiveScreen('login')}
                />
              )}
            </main>

            <BottomNav
              activeTab={getActiveNavTab()}
              onTabChange={handleBottomNavChange}
              currentRole={currentRole}
            />
          </>
        )}

        {/* Modals chuẩn Flutter ModalBottomSheet */}
        <RoleSwitcherModal
          isOpen={isRoleModalOpen}
          onClose={() => setIsRoleModalOpen(false)}
          currentRole={currentRole}
          onSelectRole={(newRole) => handleSelectRoleFromLogin(newRole)}
          activeScreen={activeScreen}
          onJumpToScreen={(screenId) => {
            if (screenId === 'ward_dash') {
              setCurrentRole('ward_officer');
              setActiveScreen('ward_dash');
            } else if (screenId === 'scan_qr') {
              setCurrentRole('member');
              setMemberSubTab('scan');
              setActiveScreen('scan_qr');
            } else if (screenId === 'makeup' || screenId === 'rewards' || screenId === 'menu') {
              setActiveScreen(screenId);
            } else if (screenId === 'social') {
              setActiveScreen('social');
            } else if (screenId === 'home' || screenId === 'create_qr' || screenId === 'members') {
              setCurrentRole('secretary');
              setActiveScreen(screenId);
            } else {
              setActiveScreen(screenId);
            }
          }}
        />

        <NotificationModal
          isOpen={isNotificationOpen}
          onClose={() => setIsNotificationOpen(false)}
          currentRole={currentRole}
        />

        <SystemAdminModal
          isOpen={isSystemAdminOpen}
          onClose={() => setIsSystemAdminOpen(false)}
          currentRole={currentRole}
        />
      </div>
    </div>
  );
}
