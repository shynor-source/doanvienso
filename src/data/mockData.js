// Dữ liệu nền tảng Đoàn Viên Số - Tỉnh Đồng Nai

export const INITIAL_BRANCH_DATA = {
  id: 'kp5',
  name: 'Chi đoàn Khu phố 5',
  ward: 'Phường Tam Hiệp, TP. Biên Hòa, Tỉnh Đồng Nai',
  secretary: {
    name: 'Nguyễn Văn An',
    age: 27,
    phone: '0912.345.678',
    role: 'Bí thư Chi đoàn kiêm nhiệm',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
  },
  stats: {
    total: 46,
    local: 31,           // 31 ở địa phương
    workingFar: 12,      // 12 đi làm xa / công nhân làm ca KCN
    transferred: 3,      // 3 chuyển sinh hoạt
  },
  recentSessions: [
    {
      id: 'ses-1',
      date: '15/09/2026',
      title: 'Sinh hoạt tháng 9: Kỹ năng số cho thanh niên',
      attendees: 28,
      total: 46,
      rate: '60.9%',
      location: 'Nhà văn hóa Khu phố 5',
    },
    {
      id: 'ses-2',
      date: '15/10/2026',
      title: 'Sinh hoạt tháng 10: Tuyên truyền ATGT & PCCC KCN',
      attendees: 19,
      total: 46,
      rate: '41.3%',
      location: 'Nhà văn hóa Khu phố 5',
      note: 'Nhiều công nhân tăng ca đêm tại KCN Amata'
    },
    {
      id: 'ses-3',
      date: '15/11/2026',
      title: 'Sinh hoạt tháng 11: Ngày hội Thanh niên Đồng Nai',
      attendees: 33,
      total: 46,
      rate: '71.7%',
      location: 'Nhà văn hóa Khu phố 5',
      note: 'Đã triển khai thử nghiệm đăng ký sinh hoạt bù'
    }
  ],
  upcomingSession: {
    id: 'ses-next',
    title: 'Sinh hoạt Chi đoàn tháng 12: Thanh niên công nhân tiên phong Số hóa',
    date: '20:00 - Thứ Bảy, 28/11/2026',
    rawDate: '2026-11-28T20:00:00',
    location: 'Nhà văn hóa Khu phố 5 (kết hợp trực tuyến)',
    format: 'hybrid',
    refreshSeconds: 60,
    geofenceRequired: true,
    allowShiftCatchup: true,
    expectedCount: 38,
    status: 'upcoming',
    qrValidMinutes: 60,
    qrToken: 'KP5-202612-A7F9',
    qrSeed: 1,
  }
};

// Danh sách đủ 46 đoàn viên:
// - 12 đoàn viên đi làm xa / công nhân KCN
// - 3 đoàn viên chuyển sinh hoạt
// - 31 đoàn viên tại địa phương
const RAW_MOCK_MEMBERS = [
  // 12 ĐOÀN VIÊN ĐI LÀM XA / CÔNG NHÂN KCN
  {
    id: 'dv-01',
    name: 'Trần Minh Quân',
    phone: '0981.112.233',
    type: 'working_far',
    workplace: 'Cty Changshin - KCN Thạnh Phú',
    shift: 'Ca đêm (22h - 06h)',
    lastAttended: '15/11/2026',
    points: 95,
    makeupCount: 2,
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
    attendanceHistory: [
      { month: 'Tháng 9/2026', status: 'present', label: 'Có mặt trực tiếp' },
      { month: 'Tháng 10/2026', status: 'makeup', label: 'Sinh hoạt bù (Làm ca 2)' },
      { month: 'Tháng 11/2026', status: 'present', label: 'Có mặt trực tiếp' }
    ]
  },
  {
    id: 'dv-02',
    name: 'Lê Thị Thu Thảo',
    phone: '0972.223.344',
    type: 'working_far',
    workplace: 'Cty Taekwang Vina - KCN BH2',
    shift: 'Ca 2 (14h - 22h)',
    lastAttended: '15/11/2026',
    points: 88,
    makeupCount: 1,
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    attendanceHistory: [
      { month: 'Tháng 9/2026', status: 'present', label: 'Có mặt trực tiếp' },
      { month: 'Tháng 10/2026', status: 'absent', label: 'Vắng (Tăng ca đột xuất)' },
      { month: 'Tháng 11/2026', status: 'makeup', label: 'Sinh hoạt bù E-Learning' }
    ]
  },
  {
    id: 'dv-03',
    name: 'Nguyễn Quốc Bảo',
    phone: '0903.334.455',
    type: 'working_far',
    workplace: 'KCN Amata Biên Hòa',
    shift: 'Ca 3 luân phiên',
    lastAttended: '15/10/2026',
    points: 72,
    makeupCount: 0,
    status: 'warning',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    attendanceHistory: [
      { month: 'Tháng 9/2026', status: 'absent', label: 'Vắng không phép' },
      { month: 'Tháng 10/2026', status: 'present', label: 'Có mặt trực tiếp' },
      { month: 'Tháng 11/2026', status: 'absent', label: 'Vắng (Ca 3 KCN Amata)' }
    ]
  },
  {
    id: 'dv-04',
    name: 'Phạm Thị Mỹ Linh',
    phone: '0914.445.566',
    type: 'working_far',
    workplace: 'KCN Long Đức, Long Thành',
    shift: 'Ca 1 (06h - 14h)',
    lastAttended: '15/11/2026',
    points: 90,
    makeupCount: 2,
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80',
    attendanceHistory: [
      { month: 'Tháng 9/2026', status: 'present', label: 'Có mặt trực tiếp' },
      { month: 'Tháng 10/2026', status: 'makeup', label: 'Sinh hoạt bù trực tuyến' },
      { month: 'Tháng 11/2026', status: 'present', label: 'Có mặt trực tiếp' }
    ]
  },
  {
    id: 'dv-05',
    name: 'Hoàng Văn Dũng',
    phone: '0985.556.677',
    type: 'working_far',
    workplace: 'KCN Nhơn Trạch 1',
    shift: 'Tăng ca kíp',
    lastAttended: '15/09/2026',
    points: 65,
    makeupCount: 1,
    status: 'warning',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    attendanceHistory: [
      { month: 'Tháng 9/2026', status: 'present', label: 'Có mặt trực tiếp' },
      { month: 'Tháng 10/2026', status: 'absent', label: 'Vắng (Làm ca KCN Nhơn Trạch)' },
      { month: 'Tháng 11/2026', status: 'absent', label: 'Đang chờ duyệt SH bù' }
    ]
  },
  {
    id: 'dv-06',
    name: 'Vũ Thị Ánh Tuyết',
    phone: '0966.667.788',
    type: 'working_far',
    workplace: 'KCN Hố Nai, Trảng Bom',
    shift: 'Ca ngày',
    lastAttended: '15/11/2026',
    points: 85,
    makeupCount: 1,
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    attendanceHistory: [
      { month: 'Tháng 9/2026', status: 'present', label: 'Có mặt trực tiếp' },
      { month: 'Tháng 10/2026', status: 'makeup', label: 'Sinh hoạt bù KP2' },
      { month: 'Tháng 11/2026', status: 'present', label: 'Có mặt trực tiếp' }
    ]
  },
  {
    id: 'dv-07',
    name: 'Đặng Tuấn Khang',
    phone: '0977.778.899',
    type: 'working_far',
    workplace: 'KCN Giang Điền',
    shift: 'Ca 2 (14h - 22h)',
    lastAttended: '15/11/2026',
    points: 82,
    makeupCount: 1,
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
    attendanceHistory: [
      { month: 'Tháng 9/2026', status: 'absent', label: 'Vắng (Ca 2)' },
      { month: 'Tháng 10/2026', status: 'present', label: 'Có mặt trực tiếp' },
      { month: 'Tháng 11/2026', status: 'makeup', label: 'Sinh hoạt bù E-Learning' }
    ]
  },
  {
    id: 'dv-08',
    name: 'Bùi Diễm Hương',
    phone: '0918.889.900',
    type: 'working_far',
    workplace: 'Cty Fujitsu - KCN BH2',
    shift: 'Ca kíp 12h',
    lastAttended: '15/11/2026',
    points: 91,
    makeupCount: 2,
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    attendanceHistory: [
      { month: 'Tháng 9/2026', status: 'present', label: 'Có mặt trực tiếp' },
      { month: 'Tháng 10/2026', status: 'makeup', label: 'Sinh hoạt bù trực tuyến' },
      { month: 'Tháng 11/2026', status: 'present', label: 'Có mặt trực tiếp' }
    ]
  },
  {
    id: 'dv-09',
    name: 'Đỗ Hữu Tài',
    phone: '0929.990.011',
    type: 'working_far',
    workplace: 'KCN Sông Mây, Trảng Bom',
    shift: 'Ca đêm',
    lastAttended: '15/10/2026',
    points: 74,
    makeupCount: 1,
    status: 'warning',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80',
    attendanceHistory: [
      { month: 'Tháng 9/2026', status: 'absent', label: 'Vắng (Ca đêm)' },
      { month: 'Tháng 10/2026', status: 'present', label: 'Có mặt trực tiếp' },
      { month: 'Tháng 11/2026', status: 'absent', label: 'Chờ duyệt SH bù' }
    ]
  },
  {
    id: 'dv-10',
    name: 'Ngô Thanh Tú',
    phone: '0930.001.122',
    type: 'working_far',
    workplace: 'KCN Loteco Long Bình',
    shift: 'Ca ngày hành chính',
    lastAttended: '15/11/2026',
    points: 86,
    makeupCount: 0,
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    attendanceHistory: [
      { month: 'Tháng 9/2026', status: 'present', label: 'Có mặt trực tiếp' },
      { month: 'Tháng 10/2026', status: 'present', label: 'Có mặt trực tiếp' },
      { month: 'Tháng 11/2026', status: 'present', label: 'Có mặt trực tiếp' }
    ]
  },
  {
    id: 'dv-11',
    name: 'Lý Quốc Huy',
    phone: '0941.112.233',
    type: 'working_far',
    workplace: 'KCN An Phước, Long Thành',
    shift: 'Ca 3 luân phiên',
    lastAttended: '15/09/2026',
    points: 68,
    makeupCount: 0,
    status: 'warning',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
    attendanceHistory: [
      { month: 'Tháng 9/2026', status: 'present', label: 'Có mặt trực tiếp' },
      { month: 'Tháng 10/2026', status: 'absent', label: 'Vắng (Ca 3)' },
      { month: 'Tháng 11/2026', status: 'absent', label: 'Vắng không phép' }
    ]
  },
  {
    id: 'dv-12',
    name: 'Dương Thúy Vi',
    phone: '0952.223.344',
    type: 'working_far',
    workplace: 'Cty Hyosung - Nhơn Trạch',
    shift: 'Ca 2 (14h - 22h)',
    lastAttended: '15/11/2026',
    points: 89,
    makeupCount: 1,
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=80',
    attendanceHistory: [
      { month: 'Tháng 9/2026', status: 'present', label: 'Có mặt trực tiếp' },
      { month: 'Tháng 10/2026', status: 'makeup', label: 'Sinh hoạt bù KCN' },
      { month: 'Tháng 11/2026', status: 'present', label: 'Có mặt trực tiếp' }
    ]
  },

  // 3 ĐOÀN VIÊN CHUYỂN SINH HOẠT
  {
    id: 'dv-13',
    name: 'Nguyễn Tấn Đạt',
    phone: '0963.334.455',
    type: 'transferred',
    workplace: 'Đại học Đồng Nai (Chuyển đi)',
    shift: 'Sinh viên',
    lastAttended: '15/08/2026',
    points: 60,
    makeupCount: 0,
    status: 'pending_transfer',
    note: 'Chờ tiếp nhận tại ĐH Đồng Nai',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop&q=80',
    attendanceHistory: [
      { month: 'Tháng 9/2026', status: 'transferred', label: 'Chờ tiếp nhận' },
      { month: 'Tháng 10/2026', status: 'transferred', label: 'Chờ tiếp nhận' },
      { month: 'Tháng 11/2026', status: 'transferred', label: 'Chờ tiếp nhận' }
    ]
  },
  {
    id: 'dv-14',
    name: 'Trương Ngọc Hân',
    phone: '0974.445.566',
    type: 'transferred',
    workplace: 'Chuyển về P. Quyết Thắng',
    shift: 'Kinh doanh tự do',
    lastAttended: '15/08/2026',
    points: 55,
    makeupCount: 0,
    status: 'pending_transfer',
    note: 'Chuyển hộ khẩu về P. Quyết Thắng',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    attendanceHistory: [
      { month: 'Tháng 9/2026', status: 'transferred', label: 'Chuyển địa bàn' },
      { month: 'Tháng 10/2026', status: 'transferred', label: 'Chuyển địa bàn' },
      { month: 'Tháng 11/2026', status: 'transferred', label: 'Chuyển địa bàn' }
    ]
  },
  {
    id: 'dv-15',
    name: 'Võ Đình Trọng',
    phone: '0985.556.677',
    type: 'transferred',
    workplace: 'Nghĩa vụ Quân sự Đồng Nai',
    shift: 'Chiến sĩ',
    lastAttended: '15/02/2026',
    points: 100,
    makeupCount: 0,
    status: 'military',
    note: 'Nhập ngũ đợt 1/2026',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
    attendanceHistory: [
      { month: 'Tháng 9/2026', status: 'military', label: 'Nghĩa vụ quân sự' },
      { month: 'Tháng 10/2026', status: 'military', label: 'Nghĩa vụ quân sự' },
      { month: 'Tháng 11/2026', status: 'military', label: 'Nghĩa vụ quân sự' }
    ]
  },

  // 31 ĐOÀN VIÊN SINH HOẠT TẠI ĐỊA PHƯƠNG
  { id: 'dv-16', name: 'Nguyễn Văn An (Bí thư)', phone: '0912.345.678', type: 'local', workplace: 'Hộ kinh doanh KP5', shift: 'Tự do', lastAttended: '15/11/2026', points: 98, makeupCount: 0, status: 'active', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80', attendanceHistory: [{ month: 'Tháng 9', status: 'present', label: 'Có mặt' }, { month: 'Tháng 10', status: 'present', label: 'Có mặt' }, { month: 'Tháng 11', status: 'present', label: 'Có mặt' }] },
  { id: 'dv-17', name: 'Trần Thị Mai', phone: '0901.123.456', type: 'local', workplace: 'Giáo viên Mầm non KP5', shift: 'Hành chính', lastAttended: '15/11/2026', points: 96, makeupCount: 0, status: 'active', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80', attendanceHistory: [{ month: 'Tháng 9', status: 'present', label: 'Có mặt' }, { month: 'Tháng 10', status: 'present', label: 'Có mặt' }, { month: 'Tháng 11', status: 'present', label: 'Có mặt' }] },
  { id: 'dv-18', name: 'Lê Hoàng Nam', phone: '0902.234.567', type: 'local', workplace: 'UBND Phường Tam Hiệp', shift: 'Hành chính', lastAttended: '15/11/2026', points: 94, makeupCount: 0, status: 'active', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', attendanceHistory: [{ month: 'Tháng 9', status: 'present', label: 'Có mặt' }, { month: 'Tháng 10', status: 'present', label: 'Có mặt' }, { month: 'Tháng 11', status: 'present', label: 'Có mặt' }] },
  { id: 'dv-19', name: 'Phạm Hồng Nhung', phone: '0903.345.678', type: 'local', workplace: 'Tiệm thuốc Tam Hiệp', shift: 'Tại chỗ', lastAttended: '15/11/2026', points: 92, makeupCount: 0, status: 'active', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', attendanceHistory: [{ month: 'Tháng 9', status: 'present', label: 'Có mặt' }, { month: 'Tháng 10', status: 'present', label: 'Có mặt' }, { month: 'Tháng 11', status: 'present', label: 'Có mặt' }] },
  { id: 'dv-20', name: 'Đoàn Thanh Tùng', phone: '0904.456.789', type: 'local', workplace: 'Kỹ sư IT tự do', shift: 'Remote', lastAttended: '15/11/2026', points: 95, makeupCount: 0, status: 'active', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', attendanceHistory: [{ month: 'Tháng 9', status: 'present', label: 'Có mặt' }, { month: 'Tháng 10', status: 'present', label: 'Có mặt' }, { month: 'Tháng 11', status: 'present', label: 'Có mặt' }] },
  { id: 'dv-21', name: 'Vũ Minh Hằng', phone: '0905.567.890', type: 'local', workplace: 'CĐ Y tế Đồng Nai', shift: 'Học tập', lastAttended: '15/11/2026', points: 88, makeupCount: 0, status: 'active', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80', attendanceHistory: [{ month: 'Tháng 9', status: 'present', label: 'Có mặt' }, { month: 'Tháng 10', status: 'present', label: 'Có mặt' }, { month: 'Tháng 11', status: 'present', label: 'Có mặt' }] },
  { id: 'dv-22', name: 'Nguyễn Đăng Khoa', phone: '0906.678.901', type: 'local', workplace: 'Cửa hàng xe máy KP5', shift: 'Tại chỗ', lastAttended: '15/11/2026', points: 87, makeupCount: 0, status: 'active', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80', attendanceHistory: [{ month: 'Tháng 9', status: 'present', label: 'Có mặt' }, { month: 'Tháng 10', status: 'present', label: 'Có mặt' }, { month: 'Tháng 11', status: 'present', label: 'Có mặt' }] },
  { id: 'dv-23', name: 'Bùi Kim Oanh', phone: '0907.789.012', type: 'local', workplace: 'Kế toán tư nhân', shift: 'Hành chính', lastAttended: '15/11/2026', points: 91, makeupCount: 0, status: 'active', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=80', attendanceHistory: [{ month: 'Tháng 9', status: 'present', label: 'Có mặt' }, { month: 'Tháng 10', status: 'present', label: 'Có mặt' }, { month: 'Tháng 11', status: 'present', label: 'Có mặt' }] },
  { id: 'dv-24', name: 'Đặng Quốc Anh', phone: '0908.890.123', type: 'local', workplace: 'Điện lực Biên Hòa', shift: 'Kỹ thuật', lastAttended: '15/11/2026', points: 93, makeupCount: 0, status: 'active', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80', attendanceHistory: [{ month: 'Tháng 9', status: 'present', label: 'Có mặt' }, { month: 'Tháng 10', status: 'present', label: 'Có mặt' }, { month: 'Tháng 11', status: 'present', label: 'Có mặt' }] },
  { id: 'dv-25', name: 'Trịnh Thị Lan', phone: '0909.901.234', type: 'local', workplace: 'Trường Tiểu học Tam Hiệp', shift: 'Giáo viên', lastAttended: '15/11/2026', points: 95, makeupCount: 0, status: 'active', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80', attendanceHistory: [{ month: 'Tháng 9', status: 'present', label: 'Có mặt' }, { month: 'Tháng 10', status: 'present', label: 'Có mặt' }, { month: 'Tháng 11', status: 'present', label: 'Có mặt' }] },
  { id: 'dv-26', name: 'Phan Minh Trí', phone: '0910.012.345', type: 'local', workplace: 'Bưu điện Tam Hiệp', shift: 'Bưu tá', lastAttended: '15/11/2026', points: 86, makeupCount: 0, status: 'active', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80', attendanceHistory: [{ month: 'Tháng 9', status: 'present', label: 'Có mặt' }, { month: 'Tháng 10', status: 'present', label: 'Có mặt' }, { month: 'Tháng 11', status: 'present', label: 'Có mặt' }] },
  { id: 'dv-27', name: 'Lê Thùy Dung', phone: '0911.123.456', type: 'local', workplace: 'Ngân hàng Agribank P. Tam Hiệp', shift: 'Giao dịch viên', lastAttended: '15/11/2026', points: 97, makeupCount: 0, status: 'active', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80', attendanceHistory: [{ month: 'Tháng 9', status: 'present', label: 'Có mặt' }, { month: 'Tháng 10', status: 'present', label: 'Có mặt' }, { month: 'Tháng 11', status: 'present', label: 'Có mặt' }] },
  { id: 'dv-28', name: 'Tạ Văn Bình', phone: '0912.234.567', type: 'local', workplace: 'Xưởng mộc gia đình KP5', shift: 'Tại chỗ', lastAttended: '15/11/2026', points: 84, makeupCount: 0, status: 'active', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80', attendanceHistory: [{ month: 'Tháng 9', status: 'present', label: 'Có mặt' }, { month: 'Tháng 10', status: 'present', label: 'Có mặt' }, { month: 'Tháng 11', status: 'present', label: 'Có mặt' }] },
  { id: 'dv-29', name: 'Cao Thị Yến', phone: '0913.345.678', type: 'local', workplace: 'Cửa hàng tạp hóa KP5', shift: 'Tại chỗ', lastAttended: '15/11/2026', points: 89, makeupCount: 0, status: 'active', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', attendanceHistory: [{ month: 'Tháng 9', status: 'present', label: 'Có mặt' }, { month: 'Tháng 10', status: 'present', label: 'Có mặt' }, { month: 'Tháng 11', status: 'present', label: 'Có mặt' }] },
  { id: 'dv-30', name: 'Ngô Đức Thắng', phone: '0914.456.789', type: 'local', workplace: 'Công ty vận tải Biên Hòa', shift: 'Tài xế', lastAttended: '15/11/2026', points: 82, makeupCount: 0, status: 'active', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', attendanceHistory: [{ month: 'Tháng 9', status: 'present', label: 'Có mặt' }, { month: 'Tháng 10', status: 'present', label: 'Có mặt' }, { month: 'Tháng 11', status: 'present', label: 'Có mặt' }] },
  { id: 'dv-31', name: 'Mai Phương Uyên', phone: '0915.567.890', type: 'local', workplace: 'Trung tâm Ngoại ngữ KP5', shift: 'Trợ giảng', lastAttended: '15/11/2026', points: 94, makeupCount: 0, status: 'active', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80', attendanceHistory: [{ month: 'Tháng 9', status: 'present', label: 'Có mặt' }, { month: 'Tháng 10', status: 'present', label: 'Có mặt' }, { month: 'Tháng 11', status: 'present', label: 'Có mặt' }] },
  { id: 'dv-32', name: 'Lâm Hoàng Phúc', phone: '0916.678.901', type: 'local', workplace: 'Siêu thị Co.opmart Tam Hiệp', shift: 'Thu ngân', lastAttended: '15/11/2026', points: 88, makeupCount: 0, status: 'active', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80', attendanceHistory: [{ month: 'Tháng 9', status: 'present', label: 'Có mặt' }, { month: 'Tháng 10', status: 'present', label: 'Có mặt' }, { month: 'Tháng 11', status: 'present', label: 'Có mặt' }] },
  { id: 'dv-33', name: 'Đoàn Thúy Nga', phone: '0917.789.012', type: 'local', workplace: 'Văn phòng Công chứng Đồng Nai', shift: 'Nhân viên', lastAttended: '15/11/2026', points: 92, makeupCount: 0, status: 'active', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=80', attendanceHistory: [{ month: 'Tháng 9', status: 'present', label: 'Có mặt' }, { month: 'Tháng 10', status: 'present', label: 'Có mặt' }, { month: 'Tháng 11', status: 'present', label: 'Có mặt' }] },
  { id: 'dv-34', name: 'Phùng Văn Khôi', phone: '0918.890.123', type: 'local', workplace: 'Cửa hàng Viettel Tam Hiệp', shift: 'Tư vấn', lastAttended: '15/11/2026', points: 87, makeupCount: 0, status: 'active', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', attendanceHistory: [{ month: 'Tháng 9', status: 'present', label: 'Có mặt' }, { month: 'Tháng 10', status: 'present', label: 'Có mặt' }, { month: 'Tháng 11', status: 'present', label: 'Có mặt' }] },
  { id: 'dv-35', name: 'Hồ Quỳnh Chi', phone: '0919.901.234', type: 'local', workplace: 'Nha khoa Nụ Cười Xinh KP5', shift: 'Y tá', lastAttended: '15/11/2026', points: 90, makeupCount: 0, status: 'active', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80', attendanceHistory: [{ month: 'Tháng 9', status: 'present', label: 'Có mặt' }, { month: 'Tháng 10', status: 'present', label: 'Có mặt' }, { month: 'Tháng 11', status: 'present', label: 'Có mặt' }] },
  { id: 'dv-36', name: 'Thái Bá Đạt', phone: '0920.012.345', type: 'local', workplace: 'Đại lý phân phối Bia KP5', shift: 'Kinh doanh', lastAttended: '15/11/2026', points: 83, makeupCount: 0, status: 'active', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80', attendanceHistory: [{ month: 'Tháng 9', status: 'present', label: 'Có mặt' }, { month: 'Tháng 10', status: 'present', label: 'Có mặt' }, { month: 'Tháng 11', status: 'present', label: 'Có mặt' }] },
  { id: 'dv-37', name: 'Vương Bảo Trâm', phone: '0921.123.456', type: 'local', workplace: 'Phòng Gym Fitness Tam Hiệp', shift: 'Huấn luyện viên', lastAttended: '15/11/2026', points: 91, makeupCount: 0, status: 'active', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80', attendanceHistory: [{ month: 'Tháng 9', status: 'present', label: 'Có mặt' }, { month: 'Tháng 10', status: 'present', label: 'Có mặt' }, { month: 'Tháng 11', status: 'present', label: 'Có mặt' }] },
  { id: 'dv-38', name: 'Lương Thế Vinh', phone: '0922.234.567', type: 'local', workplace: 'Đồ họa freelance KP5', shift: 'Tự do', lastAttended: '15/11/2026', points: 86, makeupCount: 0, status: 'active', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80', attendanceHistory: [{ month: 'Tháng 9', status: 'present', label: 'Có mặt' }, { month: 'Tháng 10', status: 'present', label: 'Có mặt' }, { month: 'Tháng 11', status: 'present', label: 'Có mặt' }] },
  { id: 'dv-39', name: 'Đào Bích Ngọc', phone: '0923.345.678', type: 'local', workplace: 'Quán Cafe Thanh Niên KP5', shift: 'Quản lý', lastAttended: '15/11/2026', points: 95, makeupCount: 0, status: 'active', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', attendanceHistory: [{ month: 'Tháng 9', status: 'present', label: 'Có mặt' }, { month: 'Tháng 10', status: 'present', label: 'Có mặt' }, { month: 'Tháng 11', status: 'present', label: 'Có mặt' }] },
  { id: 'dv-40', name: 'Bùi Gia Huy', phone: '0924.456.789', type: 'local', workplace: 'Garage sửa xe Tam Hiệp', shift: 'Thợ máy', lastAttended: '15/11/2026', points: 81, makeupCount: 0, status: 'active', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', attendanceHistory: [{ month: 'Tháng 9', status: 'present', label: 'Có mặt' }, { month: 'Tháng 10', status: 'present', label: 'Có mặt' }, { month: 'Tháng 11', status: 'present', label: 'Có mặt' }] },
  { id: 'dv-41', name: 'Quách Ánh Dương', phone: '0925.567.890', type: 'local', workplace: 'Cửa hàng hoa tươi KP5', shift: 'Cắm hoa', lastAttended: '15/11/2026', points: 89, makeupCount: 0, status: 'active', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80', attendanceHistory: [{ month: 'Tháng 9', status: 'present', label: 'Có mặt' }, { month: 'Tháng 10', status: 'present', label: 'Có mặt' }, { month: 'Tháng 11', status: 'present', label: 'Có mặt' }] },
  { id: 'dv-42', name: 'Nghiêm Đình Long', phone: '0926.678.901', type: 'local', workplace: 'Khu thể thao Tam Hiệp', shift: 'Nhân viên', lastAttended: '15/11/2026', points: 85, makeupCount: 0, status: 'active', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80', attendanceHistory: [{ month: 'Tháng 9', status: 'present', label: 'Có mặt' }, { month: 'Tháng 10', status: 'present', label: 'Có mặt' }, { month: 'Tháng 11', status: 'present', label: 'Có mặt' }] },
  { id: 'dv-43', name: 'Hà Thị Kim Liên', phone: '0927.789.012', type: 'local', workplace: 'Xưởng may thời trang KP5', shift: 'Thiết kế', lastAttended: '15/11/2026', points: 92, makeupCount: 0, status: 'active', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=80', attendanceHistory: [{ month: 'Tháng 9', status: 'present', label: 'Có mặt' }, { month: 'Tháng 10', status: 'present', label: 'Có mặt' }, { month: 'Tháng 11', status: 'present', label: 'Có mặt' }] },
  { id: 'dv-44', name: 'Trần Văn Hoàng', phone: '0928.890.123', type: 'local', workplace: 'Cửa hàng nhôm kính KP5', shift: 'Thợ chính', lastAttended: '15/11/2026', points: 84, makeupCount: 0, status: 'active', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', attendanceHistory: [{ month: 'Tháng 9', status: 'present', label: 'Có mặt' }, { month: 'Tháng 10', status: 'present', label: 'Có mặt' }, { month: 'Tháng 11', status: 'present', label: 'Có mặt' }] },
  { id: 'dv-45', name: 'Chu Mỹ Duyên', phone: '0929.901.234', type: 'local', workplace: 'Shop mỹ phẩm Tam Hiệp', shift: 'Bán hàng', lastAttended: '15/11/2026', points: 88, makeupCount: 0, status: 'active', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80', attendanceHistory: [{ month: 'Tháng 9', status: 'present', label: 'Có mặt' }, { month: 'Tháng 10', status: 'present', label: 'Có mặt' }, { month: 'Tháng 11', status: 'present', label: 'Có mặt' }] },
  { id: 'dv-46', name: 'Tạ Minh Khôi', phone: '0930.012.345', type: 'local', workplace: 'Công ty thiết bị điện KP5', shift: 'Giao nhận', lastAttended: '15/11/2026', points: 87, makeupCount: 0, status: 'active', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80', attendanceHistory: [{ month: 'Tháng 9', status: 'present', label: 'Có mặt' }, { month: 'Tháng 10', status: 'present', label: 'Có mặt' }, { month: 'Tháng 11', status: 'present', label: 'Có mặt' }] },
];

const JOIN_DATES = ['26/03/2018', '15/05/2019', '26/03/2020', '19/05/2021', '26/03/2022', '15/10/2023'];

export const MOCK_MEMBERS = RAW_MOCK_MEMBERS.map((m, idx) => ({
  ...m,
  memberCode: `ĐV-DN-${String(idx + 1).padStart(3, '0')}`,
  joinDate: JOIN_DATES[idx % JOIN_DATES.length],
  occupation:
    m.type === 'working_far'
      ? 'Công nhân sản xuất KCN'
      : m.type === 'transferred'
      ? m.shift
      : m.shift === 'Hành chính' || m.shift === 'Giáo viên'
      ? 'Cán bộ / Viên chức'
      : 'Lao động địa phương',
  branchName: 'Chi đoàn Khu phố 5',
}));

// Lịch sử tham dự ban đầu của Đ/c Trần Minh Quân (dv-01) — chưa có buổi sắp tới cho đến khi quét/đăng ký thực tế
export const INITIAL_MEMBER_ATTENDANCE_HISTORY = [
  {
    id: 'h-1',
    sessionName: 'Sinh hoạt tháng 11: Ngày hội Thanh niên Đồng Nai',
    date: '15/11/2026',
    status: 'attended',
    badge: 'Đã tham gia',
    pointsEarned: '+10 điểm',
    type: 'Trực tiếp tại Nhà văn hóa KP5'
  },
  {
    id: 'h-2',
    sessionName: 'Sinh hoạt tháng 10: Tuyên truyền ATGT & PCCC KCN',
    date: '15/10/2026',
    status: 'makeup',
    badge: 'Sinh hoạt bù',
    pointsEarned: '+10 điểm',
    type: 'Làm ca 2 Changshin - Học chuyên đề online 18/10'
  },
  {
    id: 'h-3',
    sessionName: 'Sinh hoạt tháng 9: Kỹ năng số cho thanh niên',
    date: '15/09/2026',
    status: 'attended',
    badge: 'Đã tham gia',
    pointsEarned: '+10 điểm',
    type: 'Trực tiếp tại Nhà văn hóa KP5'
  }
];

// Danh sách ID 18 đoàn viên đã điểm danh cho buổi tháng 12 (16 địa phương + 2 công nhân ca)
export const INITIAL_SCANNED_MEMBER_IDS = [
  'dv-16', 'dv-17', 'dv-18', 'dv-19', 'dv-20', 'dv-21', 'dv-22', 'dv-23',
  'dv-24', 'dv-25', 'dv-26', 'dv-27', 'dv-28', 'dv-29', 'dv-30', 'dv-31',
  'dv-02', 'dv-04'
];

// Dữ liệu Tổng hợp theo Tháng dành cho Cán bộ Đoàn Xã/Phường (ĐỦ 12 CHI ĐOÀN KHỚP 485 ĐOÀN VIÊN)
export const MONTHLY_WARD_DATA = {
  '11': {
    monthLabel: 'Tháng 11/2026',
    reportDateText: 'Tam Hiệp, ngày 28 tháng 11 năm 2026',
    reportNumber: 'Số: 18-BC/ĐTN',
    totalBranches: 12,
    totalMembers: 485,
    averageAttendanceRate: '73.4%',
    completedReports: '11/12 Chi đoàn',
    branchesRank: [
      { id: 'kp1', name: 'Chi đoàn Khu phố 1', secretary: 'Đ/c Lê Hoàng Minh', total: 42, attended: 36, rate: 85.7, status: 'submitted', type: 'Khu dân cư' },
      { id: 'thcs', name: 'Chi đoàn Trường THCS Tam Hiệp', secretary: 'Đ/c Nguyễn Ngọc Ánh', total: 28, attended: 24, rate: 85.7, status: 'submitted', type: 'Trường học' },
      { id: 'kp7', name: 'Chi đoàn Khu phố 7', secretary: 'Đ/c Phạm Văn Hùng', total: 36, attended: 30, rate: 83.3, status: 'submitted', type: 'Khu dân cư' },
      { id: 'kp4', name: 'Chi đoàn Khu phố 4', secretary: 'Đ/c Trần Quốc Tuấn', total: 35, attended: 29, rate: 82.9, status: 'submitted', type: 'Khu dân cư' },
      { id: 'yte', name: 'Chi đoàn Trạm Y tế & Dân quân', secretary: 'Đ/c Võ Minh Đức', total: 24, attended: 19, rate: 79.2, status: 'submitted', type: 'Hành chính sự nghiệp' },
      { id: 'kp2', name: 'Chi đoàn Khu phố 2', secretary: 'Đ/c Đỗ Thị Thanh Hà', total: 38, attended: 30, rate: 78.9, status: 'submitted', type: 'Khu dân cư' },
      { id: 'kp8', name: 'Chi đoàn Khu phố 8', secretary: 'Đ/c Bùi Tiến Dũng', total: 34, attended: 26, rate: 76.5, status: 'submitted', type: 'Khu dân cư' },
      { id: 'kp5', name: 'Chi đoàn Khu phố 5 (Bí thư An)', secretary: 'Đ/c Nguyễn Văn An', total: 46, attended: 33, rate: 71.7, status: 'submitted', highlight: true, type: 'Khu dân cư & CN KCN' },
      { id: 'tm', name: 'Chi đoàn Khu Nhà trọ Công nhân', secretary: 'Đ/c Hoàng Thị Thu', total: 52, attended: 36, rate: 69.2, status: 'submitted', type: 'Thanh niên công nhân' },
      { id: 'kp3', name: 'Chi đoàn Khu phố 3', secretary: 'Đ/c Vũ Đình Khoa', total: 50, attended: 34, rate: 68.0, status: 'submitted', type: 'Khu dân cư' },
      { id: 'kcn', name: 'Chi đoàn DN KCN Tam Hiệp', secretary: 'Đ/c Lý Gia Bảo', total: 60, attended: 37, rate: 61.7, status: 'submitted', type: 'Doanh nghiệp KCN' },
      { id: 'kp6', name: 'Chi đoàn Khu phố 6', secretary: 'Đ/c Mai Văn Hải', total: 40, attended: 22, rate: 55.0, status: 'pending', type: 'Khu dân cư' },
    ]
  },
  '10': {
    monthLabel: 'Tháng 10/2026',
    reportDateText: 'Tam Hiệp, ngày 31 tháng 10 năm 2026',
    reportNumber: 'Số: 15-BC/ĐTN',
    totalBranches: 12,
    totalMembers: 485,
    averageAttendanceRate: '58.1%',
    completedReports: '10/12 Chi đoàn',
    branchesRank: [
      { id: 'kp1', name: 'Chi đoàn Khu phố 1', secretary: 'Đ/c Lê Hoàng Minh', total: 42, attended: 31, rate: 73.8, status: 'submitted', type: 'Khu dân cư' },
      { id: 'kp4', name: 'Chi đoàn Khu phố 4', secretary: 'Đ/c Trần Quốc Tuấn', total: 35, attended: 25, rate: 71.4, status: 'submitted', type: 'Khu dân cư' },
      { id: 'thcs', name: 'Chi đoàn Trường THCS Tam Hiệp', secretary: 'Đ/c Nguyễn Ngọc Ánh', total: 28, attended: 20, rate: 71.4, status: 'submitted', type: 'Trường học' },
      { id: 'yte', name: 'Chi đoàn Trạm Y tế & Dân quân', secretary: 'Đ/c Võ Minh Đức', total: 24, attended: 16, rate: 66.7, status: 'submitted', type: 'Hành chính sự nghiệp' },
      { id: 'kp7', name: 'Chi đoàn Khu phố 7', secretary: 'Đ/c Phạm Văn Hùng', total: 36, attended: 23, rate: 63.9, status: 'submitted', type: 'Khu dân cư' },
      { id: 'kp2', name: 'Chi đoàn Khu phố 2', secretary: 'Đ/c Đỗ Thị Thanh Hà', total: 38, attended: 24, rate: 63.2, status: 'submitted', type: 'Khu dân cư' },
      { id: 'kp8', name: 'Chi đoàn Khu phố 8', secretary: 'Đ/c Bùi Tiến Dũng', total: 34, attended: 21, rate: 61.8, status: 'submitted', type: 'Khu dân cư' },
      { id: 'kp3', name: 'Chi đoàn Khu phố 3', secretary: 'Đ/c Vũ Đình Khoa', total: 50, attended: 28, rate: 56.0, status: 'submitted', type: 'Khu dân cư' },
      { id: 'tm', name: 'Chi đoàn Khu Nhà trọ Công nhân', secretary: 'Đ/c Hoàng Thị Thu', total: 52, attended: 29, rate: 55.8, status: 'pending', type: 'Thanh niên công nhân' },
      { id: 'kcn', name: 'Chi đoàn DN KCN Tam Hiệp', secretary: 'Đ/c Lý Gia Bảo', total: 60, attended: 30, rate: 50.0, status: 'submitted', type: 'Doanh nghiệp KCN' },
      { id: 'kp5', name: 'Chi đoàn Khu phố 5 (Bí thư An)', secretary: 'Đ/c Nguyễn Văn An', total: 46, attended: 19, rate: 41.3, status: 'submitted', highlight: true, type: 'Khu dân cư & CN KCN' },
      { id: 'kp6', name: 'Chi đoàn Khu phố 6', secretary: 'Đ/c Mai Văn Hải', total: 40, attended: 16, rate: 40.0, status: 'pending', type: 'Khu dân cư' },
    ]
  },
  '09': {
    monthLabel: 'Tháng 09/2026',
    reportDateText: 'Tam Hiệp, ngày 30 tháng 09 năm 2026',
    reportNumber: 'Số: 12-BC/ĐTN',
    totalBranches: 12,
    totalMembers: 485,
    averageAttendanceRate: '67.0%',
    completedReports: '12/12 Chi đoàn',
    branchesRank: [
      { id: 'kp1', name: 'Chi đoàn Khu phố 1', secretary: 'Đ/c Lê Hoàng Minh', total: 42, attended: 35, rate: 83.3, status: 'submitted', type: 'Khu dân cư' },
      { id: 'thcs', name: 'Chi đoàn Trường THCS Tam Hiệp', secretary: 'Đ/c Nguyễn Ngọc Ánh', total: 28, attended: 22, rate: 78.6, status: 'submitted', type: 'Trường học' },
      { id: 'kp4', name: 'Chi đoàn Khu phố 4', secretary: 'Đ/c Trần Quốc Tuấn', total: 35, attended: 27, rate: 77.1, status: 'submitted', type: 'Khu dân cư' },
      { id: 'yte', name: 'Chi đoàn Trạm Y tế & Dân quân', secretary: 'Đ/c Võ Minh Đức', total: 24, attended: 18, rate: 75.0, status: 'submitted', type: 'Hành chính sự nghiệp' },
      { id: 'kp7', name: 'Chi đoàn Khu phố 7', secretary: 'Đ/c Phạm Văn Hùng', total: 36, attended: 26, rate: 72.2, status: 'submitted', type: 'Khu dân cư' },
      { id: 'kp2', name: 'Chi đoàn Khu phố 2', secretary: 'Đ/c Đỗ Thị Thanh Hà', total: 38, attended: 27, rate: 71.1, status: 'submitted', type: 'Khu dân cư' },
      { id: 'kp8', name: 'Chi đoàn Khu phố 8', secretary: 'Đ/c Bùi Tiến Dũng', total: 34, attended: 24, rate: 70.6, status: 'submitted', type: 'Khu dân cư' },
      { id: 'tm', name: 'Chi đoàn Khu Nhà trọ Công nhân', secretary: 'Đ/c Hoàng Thị Thu', total: 52, attended: 35, rate: 67.3, status: 'submitted', type: 'Thanh niên công nhân' },
      { id: 'kp5', name: 'Chi đoàn Khu phố 5 (Bí thư An)', secretary: 'Đ/c Nguyễn Văn An', total: 46, attended: 28, rate: 60.9, status: 'submitted', highlight: true, type: 'Khu dân cư & CN KCN' },
      { id: 'kp3', name: 'Chi đoàn Khu phố 3', secretary: 'Đ/c Vũ Đình Khoa', total: 50, attended: 30, rate: 60.0, status: 'submitted', type: 'Khu dân cư' },
      { id: 'kcn', name: 'Chi đoàn DN KCN Tam Hiệp', secretary: 'Đ/c Lý Gia Bảo', total: 60, attended: 33, rate: 55.0, status: 'submitted', type: 'Doanh nghiệp KCN' },
      { id: 'kp6', name: 'Chi đoàn Khu phố 6', secretary: 'Đ/c Mai Văn Hải', total: 40, attended: 20, rate: 50.0, status: 'submitted', type: 'Khu dân cư' },
    ]
  }
};

export const WARD_DATA = {
  name: 'Đoàn Thanh niên Phường Tam Hiệp',
  city: 'TP. Biên Hòa, Tỉnh Đồng Nai',
  officer: {
    name: 'Đồng chí Phan Thị Bích Thảo',
    role: 'Bí thư Đoàn Phường Tam Hiệp',
    phone: '0908.123.999'
  },
  stats: MONTHLY_WARD_DATA['11']
};

// Danh sách các buổi sinh hoạt bù liên chi đoàn
export const MAKEUP_SESSIONS = [
  {
    id: 'mk-01',
    branchName: 'Chi đoàn Khối Doanh nghiệp KCN Amata',
    title: 'Sinh hoạt bù Chuyên đề: Kỹ năng an toàn lao động & Quyền lợi công đoàn',
    time: '09:00 - Chủ Nhật, 29/11/2026',
    format: 'Trực tiếp tại Nhà sinh hoạt Công nhân KCN Amata',
    seatsLeft: 8,
    suitableFor: 'Công nhân làm ca 2, ca đêm'
  },
  {
    id: 'mk-02',
    branchName: 'Chi đoàn Khu phố 2 (Liên kết)',
    title: 'Sinh hoạt ghép: Chuyển đổi số trong sinh hoạt Đoàn thanh niên',
    time: '19:30 - Thứ Hai, 30/11/2026',
    format: 'Trực tiếp tại Nhà văn hóa KP2',
    seatsLeft: 12,
    suitableFor: 'Công nhân làm ca 1'
  },
  {
    id: 'mk-03',
    branchName: 'Tỉnh Đoàn Đồng Nai (Trực tuyến)',
    title: 'E-Learning: Học tập Chuyên đề Kỹ năng số & Chuyển đổi số Đồng Nai',
    time: 'Linh hoạt (Hoàn thành bài trắc nghiệm 3 câu)',
    format: 'Trực tuyến 100% trên App (Tự động cấp chứng nhận)',
    seatsLeft: 999,
    suitableFor: 'Tất cả đoàn viên làm ca kíp khó sắp xếp thời gian'
  }
];

// Danh sách yêu cầu xin sinh hoạt bù (gồm đơn chờ duyệt và đơn đã duyệt mẫu)
export const PENDING_MAKEUP_REQUESTS = [
  {
    id: 'req-00',
    memberId: 'dv-02',
    memberName: 'Lê Thị Thu Thảo',
    workplace: 'Cty Taekwang Vina - KCN BH2',
    shift: 'Ca 2 (14h - 22h)',
    sessionName: 'Sinh hoạt tháng 11: Ngày hội Thanh niên',
    registeredMakeup: 'E-Learning Kỹ năng số Đồng Nai (Đã đạt 3/3 câu)',
    reason: 'Làm ca 2 tại KCN Biên Hòa 2, hoàn thành học trực tuyến chuyên đề số hóa.',
    proof: 'Chứng chỉ E-Learning mã số DN-EL-8790',
    status: 'approved'
  },
  {
    id: 'req-01',
    memberId: 'dv-05',
    memberName: 'Hoàng Văn Dũng',
    workplace: 'KCN Nhơn Trạch 1',
    shift: 'Tăng ca đêm kíp 12h',
    sessionName: 'Sinh hoạt tháng 11: Ngày hội Thanh niên',
    registeredMakeup: 'Sinh hoạt bù KP2 (Thứ Hai 30/11)',
    reason: 'Do công ty chạy đơn hàng xuất khẩu cuối năm, phải tăng ca đêm từ 18h đến 06h sáng.',
    proof: 'Có xác nhận tăng ca của Quản đốc xưởng',
    status: 'pending'
  },
  {
    id: 'req-02',
    memberId: 'dv-09',
    memberName: 'Đỗ Hữu Tài',
    workplace: 'KCN Sông Mây, Trảng Bom',
    shift: 'Ca đêm',
    sessionName: 'Sinh hoạt tháng 11: Ngày hội Thanh niên',
    registeredMakeup: 'E-Learning Kỹ năng số Đồng Nai (Đã đạt 3/3 câu)',
    reason: 'Làm ca đêm tại KCN Sông Mây, đã tự học và hoàn thành bài kiểm tra E-Learning.',
    proof: 'Chứng chỉ E-Learning mã số DN-EL-8831',
    status: 'pending'
  }
];

// Bộ câu hỏi Mini Quiz E-Learning
export const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'Nghị quyết Chuyển đổi số tỉnh Đồng Nai xác định lực lượng nào giữ vai trò tiên phong nòng cốt trong các Tổ công nghệ số cộng đồng?',
    options: [
      'A. Lực lượng Đoàn viên, Thanh niên Đồng Nai',
      'B. Các doanh nghiệp cung cấp viễn thông',
      'C. Hội Phụ nữ và Hội Nông dân cơ sở',
      'D. Bộ phận Tiếp nhận và Trả kết quả một cửa'
    ],
    correctAnswer: 0
  },
  {
    id: 2,
    question: 'Theo hướng dẫn đổi mới sinh hoạt Đoàn cho công nhân làm ca tại các KCN Đồng Nai, giải pháp nào được áp dụng khi đoàn viên trùng ca sản xuất?',
    options: [
      'A. Xóa tên khỏi danh sách Đoàn viên sau 2 kỳ',
      'B. Đăng ký sinh hoạt bù liên chi đoàn hoặc học chuyên đề E-Learning',
      'C. Buộc phải xin nghỉ việc không lương để đi họp',
      'D. Nhờ người khác đi họp và điểm danh hộ'
    ],
    correctAnswer: 1
  },
  {
    id: 3,
    question: 'Ứng dụng "Đoàn Viên Số Đồng Nai" sử dụng cơ chế bảo mật nào để chống gian lận điểm danh?',
    options: [
      'A. Chụp ảnh thẻ đoàn viên giấy gửi vào nhóm chat',
      'B. Ký tên thủ công trên sổ tay bí thư',
      'C. Mã QR động thay đổi theo thời gian thực kết hợp định vị GPS Geofencing',
      'D. Điểm danh qua danh sách gọi tên miệng'
    ],
    correctAnswer: 2
  }
];

// Danh mục quà tặng thi đua & Voucher hợp nhất
export const REWARD_ITEMS = [
  {
    id: 'rw-1',
    title: 'Voucher Xăng Petrolimex 50.000đ',
    points: 30,
    category: 'Hỗ trợ đi lại công nhân KCN',
    sponsor: 'Công đoàn Các KCN Đồng Nai',
    icon: 'fuel',
    badge: 'Phổ biến',
    available: 45
  },
  {
    id: 'rw-2',
    title: 'Vé xem phim Lotte Cinema Vincom Biên Hòa',
    points: 40,
    category: 'Văn hóa giải trí thanh niên',
    sponsor: 'Tỉnh Đoàn Đồng Nai',
    icon: 'film',
    available: 20
  },
  {
    id: 'rw-3',
    title: 'Áo thun Thanh niên Đồng Nai 2026',
    points: 50,
    category: 'Đồng phục thanh niên số',
    sponsor: 'Thành Đoàn Biên Hòa',
    icon: 'shirt',
    available: 15
  },
  {
    id: 'rw-4',
    title: 'Vé Xe Tết Sum Vầy Về Quê Đón Tết',
    points: 80,
    category: 'Chương trình Tết công nhân KCN',
    sponsor: 'Liên đoàn Lao động Tỉnh Đồng Nai',
    icon: 'bus',
    badge: 'Ý nghĩa Tết',
    available: 10
  }
];

// Dữ liệu Hoạt động tình nguyện & Tích điểm rèn luyện
export const VOLUNTEER_ACTIVITIES = [
  {
    id: 'act-1',
    title: 'Ngày Thứ Bảy Tình Nguyện - Dọn dẹp vệ sinh đường nội bộ KCN Biên Hòa 2',
    date: '21/11/2026',
    location: 'Đường 2A, KCN Biên Hòa 2',
    points: '+20 điểm',
    pointsValue: 20,
    participantsCount: 42,
    status: 'completed'
  },
  {
    id: 'act-2',
    title: 'Hiến máu tình nguyện "Giọt hồng Đất Bưởi - Đồng Nai"',
    date: '08/11/2026',
    location: 'Trung tâm Văn hóa Thanh thiếu nhi Đồng Nai',
    points: '+30 điểm',
    pointsValue: 30,
    participantsCount: 68,
    status: 'completed'
  },
  {
    id: 'act-3',
    title: 'Hỗ trợ người dân cài đặt chữ ký số và VNeID tại UBND Phường',
    date: '15/10/2026',
    location: 'UBND Phường Tam Hiệp, Biên Hòa',
    points: '+15 điểm',
    pointsValue: 15,
    participantsCount: 25,
    status: 'completed'
  },
  {
    id: 'act-4',
    title: 'Chiến dịch Mùa Đông Ấm thanh niên công nhân xa quê',
    date: '05/12/2026 (08:00 - 11:30)',
    location: 'Khu nhà trọ công nhân KP5 & KCN Amata',
    points: '+25 điểm',
    pointsValue: 25,
    participantsCount: 19,
    status: 'upcoming'
  },
  {
    id: 'act-5',
    title: 'Đội hình Thanh niên Tình nguyện hỗ trợ dịch vụ công trực tuyến',
    date: '12/12/2026 (07:30 - 11:00)',
    location: 'Bộ phận Một cửa Phường Tam Hiệp',
    points: '+20 điểm',
    pointsValue: 20,
    participantsCount: 14,
    status: 'upcoming'
  }
];

// Thông báo ban đầu phân tách theo 3 vai trò
export const INITIAL_NOTIFICATIONS = {
  secretary: [
    {
      id: 'noti-sec-1',
      title: 'Có 2 đơn xin sinh hoạt bù cần phê duyệt',
      content: 'Đ/c Hoàng Văn Dũng (KCN Nhơn Trạch 1) và Đ/c Đỗ Hữu Tài (KCN Sông Mây) đã gửi minh chứng làm ca đêm.',
      time: '10 phút trước',
      type: 'makeup',
      unread: true
    },
    {
      id: 'noti-sec-2',
      title: 'Nhắc lịch mở mã QR sinh hoạt tháng 12',
      content: 'Buổi sinh hoạt chuyên đề "Thanh niên công nhân tiên phong Số hóa" diễn ra lúc 20:00 ngày 28/11 tại NVH KP5.',
      time: '1 giờ trước',
      type: 'event',
      unread: true
    },
    {
      id: 'noti-sec-3',
      title: 'Đoàn Phường Tam Hiệp ghi nhận báo cáo T11',
      content: 'Chi đoàn KP5 đạt tỷ lệ 71.7% (+30.4% so với tháng 10) nhờ triển khai cơ chế ca bù.',
      time: 'Hôm qua',
      type: 'report',
      unread: false
    }
  ],
  member: [
    {
      id: 'noti-mem-1',
      title: 'Nhắc lịch sinh hoạt Chi đoàn tháng 12/2026',
      content: 'Chủ đề: "Thanh niên công nhân tiên phong Số hóa". 20:00 Thứ Bảy 28/11 tại Nhà văn hóa KP5.',
      time: '15 phút trước',
      type: 'event',
      unread: true
    },
    {
      id: 'noti-mem-2',
      title: 'Mở đăng ký ca sinh hoạt bù KCN',
      content: 'Đoàn viên làm ca đêm có thể đăng ký sinh hoạt ghép với Chi đoàn KCN Amata hoặc học E-Learning trực tuyến.',
      time: '2 giờ trước',
      type: 'makeup',
      unread: true
    },
    {
      id: 'noti-mem-3',
      title: 'Cập nhật điểm rèn luyện thi đua',
      content: 'Bạn đã được cộng +20 điểm từ hoạt động "Ngày Thứ Bảy Tình Nguyện dọn dẹp KCN Biên Hòa 2".',
      time: 'Hôm qua',
      type: 'reward',
      unread: false
    }
  ],
  ward_officer: [
    {
      id: 'noti-ward-1',
      title: 'Còn 1 chi đoàn chưa nộp báo cáo tháng 11',
      content: 'Chi đoàn Khu phố 6 (tỷ lệ 55.0%) chưa hoàn tất xác nhận số liệu. Vui lòng gửi nhắc nhở qua Zalo.',
      time: '20 phút trước',
      type: 'report',
      unread: true
    },
    {
      id: 'noti-ward-2',
      title: 'Điểm sáng mô hình ca bù tại KP5',
      content: 'Chi đoàn KP5 nâng tỷ lệ tham dự từ 41.3% (T10) lên 71.7% (T11) nhờ E-Learning & sinh hoạt ghép.',
      time: '3 giờ trước',
      type: 'event',
      unread: false
    }
  ]
};

// Kịch bản Trợ lý AI Đoàn vụ (đã làm sạch định dạng & bổ sung đầy đủ năng lực công tác Đoàn)
export const AI_PRESETS = {
  analysis_oct: {
    title: 'Phân tích tỷ lệ sinh hoạt & Biến động theo kỳ',
    content: `BÁO CÁO PHÂN TÍCH ĐOÀN VỤ:
- Thực trạng: Tỷ lệ tham dự tháng 10 của toàn phường chỉ đạt 58.1% (riêng Chi đoàn KP5 giảm xuống 41.3%, chỉ 19/46 ĐV tham gia).
- Nguyên nhân chính: Trùng đợt cao điểm tăng ca quý 4 tại KCN Amata và KCN Biên Hòa 2. Có 10/12 đoàn viên làm ca kíp không thể tham gia vào khung giờ 19h30 tối thứ Bảy.
- Tác động tháng 11: Sau khi kích hoạt cơ chế Sinh hoạt bù liên chi đoàn & E-Learning, tỷ lệ của KP5 tăng lên 71.7% (+30.4%) và toàn phường đạt 73.4%.`
  },
  solution_boost: {
    title: 'Đề xuất giải pháp & Khung giờ tổ chức phù hợp ca kíp',
    content: `ĐỀ XUẤT THỜI GIAN & GIẢI PHÁP TỔ CHỨC:
1. Khung giờ vàng cho công nhân KCN: Sáng Chủ Nhật (09h00 - 10h15) hoặc Tối Thứ Hai (19h30) giúp tránh cao điểm giao ca 14h và 22h tại KCN Amata, Changshin.
2. Sinh hoạt ghép & E-Learning: Mở lớp E-Learning 5 ngày sau buổi họp định kỳ để công nhân làm ca 3 chủ động hoàn thành chuyên đề.
3. Liên chi đoàn kết nghĩa: Phối hợp giữa Chi đoàn KP5 và Chi đoàn Doanh nghiệp KCN tổ chức sinh hoạt ngay gần khu nhà trọ công nhân.`
  },
  suggest_content: {
    title: 'Gợi ý nội dung sinh hoạt Chi đoàn định kỳ Tháng 12/2026',
    content: `GỢI Ý CHƯƠNG TRÌNH SINH HOẠT CHI ĐOÀN THÁNG 12:
1. Phần 1 (15 phút): Thông tin nhanh tình hình KTXH tỉnh Đồng Nai, chính sách bảo hiểm xã hội và thưởng Tết cho công nhân KCN.
2. Phần 2 (20 phút): Tọa đàm "Thanh niên công nhân tiên phong Số hóa & An toàn trên không gian mạng".
3. Phần 3 (15 phút): Phát động Chiến dịch Mùa Đông Ấm cho thanh niên công nhân xa quê, bình xét đoàn viên tích cực quý IV và chụp ảnh đăng Bảng tin Social.`
  },
  write_plan: {
    title: 'Soạn Kế hoạch, Thông báo & Nội dung truyền thông',
    content: `KẾ HOẠCH TỔ CHỨC NGÀY HỘI THANH NIÊN TÌNH NGUYỆN THÁNG 12
1. Mục đích: Hỗ trợ 100 phần quà ấm và tư vấn pháp luật lao động cho công nhân tại khu nhà trọ KP5.
2. Thời gian: 08h00 ngày 05/12/2026.
3. Bài truyền thông ngắn (đăng Social/Zalo):
"Cùng tuổi trẻ Phường Tam Hiệp lan tỏa yêu thương trong Chiến dịch Mùa Đông Ấm! Đăng ký tham gia ngay trên ứng dụng Đoàn Viên Số để nhận +25 điểm rèn luyện và chung tay chia sẻ khoảnh khắc đẹp lên Bảng tin Social."`
  },
  zalo_message: {
    title: 'Soạn tin nhắn Zalo gửi đồng loạt 12 Bí thư Chi đoàn',
    content: `THÔNG BÁO TỪ BAN CHẤP HÀNH ĐOÀN PHƯỜNG TAM HIỆP
Kính gửi: Các đồng chí Bí thư Chi đoàn trực thuộc,

Đoàn Phường biểu dương Chi đoàn KP1 (85.7%) và Chi đoàn THCS Tam Hiệp (85.7%) đã dẫn đầu tỷ lệ sinh hoạt tháng 11.
Đề nghị các Chi đoàn có tỷ lệ dưới 65% hoặc chưa nộp báo cáo (KCN Tam Hiệp, KP6) khẩn trương:
1. Triển khai ngay tính năng Đăng ký Sinh hoạt Bù trên ứng dụng Đoàn Viên Số cho đoàn viên làm ca kíp KCN.
2. Hoàn tất gửi báo cáo số hóa tháng 11 trước 17h00 ngày 30/11/2026.

Chúc các đồng chí hoàn thành tốt nhiệm vụ!
Bí thư Đoàn phường - Phan Thị Bích Thảo`
  }
};

// Mạng xã hội Đoàn viên & Sự kiện (Social Feed)
export const SOCIAL_EVENT_PRESETS = [
  {
    id: 'ev-img-1',
    label: 'Chiến dịch Tình nguyện Xanh',
    eventTag: 'Chiến dịch Mùa Đông Ấm & Hỗ trợ Thanh niên',
    imageUrl: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'ev-img-2',
    label: 'Hiến máu Giọt hồng Đồng Nai',
    eventTag: 'Hiến máu tình nguyện "Giọt hồng Đất Bưởi - Đồng Nai"',
    imageUrl: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'ev-img-3',
    label: 'Sinh hoạt Chi đoàn định kỳ',
    eventTag: 'Sinh hoạt Chi đoàn Khu phố 5 - Tháng 12/2026',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'ev-img-4',
    label: 'Hỗ trợ Dịch vụ công trực tuyến',
    eventTag: 'Đội hình Thanh niên Tình nguyện hỗ trợ VNeID',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80'
  }
];

export const SCHEDULE_WEEK_DAYS = [
  { key: 'all', label: 'Tất cả', dayNum: 'Tuần' },
  { key: '25/11/2026', label: 'T4', dayNum: '25' },
  { key: '26/11/2026', label: 'T5', dayNum: '26' },
  { key: '27/11/2026', label: 'T6', dayNum: '27' },
  { key: '28/11/2026', label: 'T7', dayNum: '28' },
  { key: '29/11/2026', label: 'CN', dayNum: '29' },
  { key: '30/11/2026', label: 'T2', dayNum: '30' },
];

export const INITIAL_MY_SCHEDULE = [
  {
    id: 'sch-01',
    title: 'Sinh hoạt Chi đoàn tháng 12: Thanh niên tiên phong Số hóa',
    category: 'Sinh hoạt',
    dateStr: '28/11/2026',
    dayOfWeek: 'T7',
    timeSlot: '19:30 - 21:00',
    room: 'Nhà văn hóa Khu phố 5',
    organizer: 'BCH Chi đoàn Khu phố 5',
    format: 'Trực tiếp • Điểm danh QR',
    points: '+10 điểm',
    mandatory: true,
    isELearning: false,
  },
  {
    id: 'sch-02',
    title: 'Chuyên đề: Kỹ năng số & An toàn không gian mạng',
    category: 'Chuyên đề',
    dateStr: '26/11/2026',
    dayOfWeek: 'T5',
    timeSlot: '20:00 - 21:00',
    room: 'Trực tuyến trên ứng dụng',
    organizer: 'Tỉnh Đoàn Đồng Nai',
    format: 'Trực tuyến E-Learning',
    points: '+10 điểm',
    mandatory: false,
    isELearning: true,
  }
];

export const SCHEDULE_CATALOG = [
  {
    id: 'cat-01',
    title: 'Tọa đàm Thanh niên với Chuyển đổi số & Dịch vụ công',
    category: 'Chuyên đề',
    dateStr: '27/11/2026',
    dayOfWeek: 'T6',
    timeSlot: '19:00 - 20:30',
    room: 'Hội trường UBND Phường Tam Hiệp',
    organizer: 'Đoàn Phường Tam Hiệp',
    format: 'Trực tiếp • Kết hợp Livestream',
    points: '+15 điểm',
    seatsLeft: 18,
    isELearning: false,
  },
  {
    id: 'cat-02',
    title: 'Đội hình Xung kích Hỗ trợ cài đặt VNeID & Chữ ký số',
    category: 'Tình nguyện',
    dateStr: '25/11/2026',
    dayOfWeek: 'T4',
    timeSlot: '08:00 - 11:00',
    room: 'Bộ phận Một cửa P. Tam Hiệp',
    organizer: 'Đoàn Phường Tam Hiệp',
    format: 'Trực tiếp',
    points: '+20 điểm',
    seatsLeft: 12,
    isELearning: false,
  },
  {
    id: 'cat-03',
    title: 'Tập huấn: Nghiệp vụ Đoàn viên & Quản lý Hồ sơ số',
    category: 'Chuyên đề',
    dateStr: '30/11/2026',
    dayOfWeek: 'T2',
    timeSlot: '19:30 - 20:45',
    room: 'Trực tuyến trên ứng dụng',
    organizer: 'Ban Tuyên giáo Tỉnh Đoàn',
    format: 'Trực tuyến • Có trắc nghiệm',
    points: '+15 điểm',
    seatsLeft: 999,
    isELearning: true,
  },
  {
    id: 'cat-04',
    title: 'Sinh hoạt Liên Chi đoàn Quý IV & Giao lưu Thanh niên',
    category: 'Sinh hoạt',
    dateStr: '30/11/2026',
    dayOfWeek: 'T2',
    timeSlot: '18:00 - 19:30',
    room: 'Trung tâm Văn hóa Thanh thiếu nhi',
    organizer: 'Thành Đoàn Biên Hòa',
    format: 'Trực tiếp',
    points: '+10 điểm',
    seatsLeft: 25,
    isELearning: false,
  }
];

export const INITIAL_SOCIAL_POSTS = [
  {
    id: 'post-event-1',
    authorId: 'ward-01',
    authorName: 'Phan Thị Bích Thảo',
    authorRole: 'Bí thư Đoàn Phường Tam Hiệp • Cán bộ phát động',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    branchName: 'Đoàn Phường Tam Hiệp',
    category: 'event',
    eventTag: 'Chiến dịch Mùa Đông Ấm & Hỗ trợ Thanh niên',
    isEventPost: true,
    verifiedOfficer: true,
    verifiedParticipant: true,
    registeredCount: 34,
    registeredByMe: false,
    eventSchedule: {
      id: 'ev-soc-1',
      title: 'Chiến dịch Mùa Đông Ấm & Hỗ trợ Thanh niên',
      category: 'Sự kiện Đoàn',
      dateStr: '29/11/2026',
      dayOfWeek: 'CN',
      timeSlot: '07:30 - 11:00',
      room: 'Nhà văn hóa KP5 & Khu vực Tam Hiệp',
      organizer: 'BCH Đoàn Phường Tam Hiệp',
      format: 'Trực tiếp • Điểm danh QR',
      points: '+25 điểm',
      isELearning: false,
    },
    createdAt: '30 phút trước',
    content: 'Phát động Chiến dịch Mùa Đông Ấm tháng 11/2026! Kính mời các đồng chí đoàn viên đăng ký tham dự trực tiếp ngay bên dưới để hệ thống tự động đồng bộ vào Lịch cá nhân.',
    imageUrl: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&auto=format&fit=crop&q=80',
    likesCount: 42,
    likedByMe: false,
    comments: [
      {
        id: 'cmt-ev-1',
        authorName: 'Nguyễn Văn An (Bí thư KP5)',
        text: 'Chi đoàn Khu phố 5 đã sẵn sàng lực lượng nòng cốt tham gia!',
        time: '15 phút trước'
      }
    ]
  },
  {
    id: 'post-1',
    authorId: 'dv-02',
    authorName: 'Lê Thị Thu Thảo',
    authorRole: 'Đoàn viên Chi đoàn KP5',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    branchName: 'Chi đoàn Khu phố 5',
    category: 'event',
    eventTag: 'Ngày Thứ Bảy Tình Nguyện — Dọn dẹp Tuyến đường KCN',
    isEventPost: true,
    verifiedParticipant: true,
    registeredCount: 22,
    registeredByMe: false,
    eventSchedule: {
      id: 'ev-soc-2',
      title: 'Ngày Thứ Bảy Tình Nguyện — Tuyến đường Xanh',
      category: 'Tình nguyện',
      dateStr: '28/11/2026',
      dayOfWeek: 'T7',
      timeSlot: '07:30 - 10:00',
      room: 'Tuyến đường nội bộ KCN Biên Hòa 2',
      organizer: 'Chi đoàn Khu phố 5',
      format: 'Trực tiếp • Điểm danh QR',
      points: '+20 điểm',
      isELearning: false,
    },
    createdAt: '2 giờ trước',
    content: 'Cùng anh chị em Chi đoàn KP5 ra quân dọn vệ sinh tuyến đường xanh - sạch - đẹp sáng cuối tuần. Các bạn có thể bấm đăng ký đợt tiếp theo ngay dưới bài viết nhé!',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80',
    likesCount: 28,
    likedByMe: false,
    comments: [
      {
        id: 'cmt-1',
        authorName: 'Trần Minh Quân',
        text: 'Hoạt động rất ý nghĩa, hẹn mọi người vào cuối tuần này nhé!',
        time: '45 phút trước'
      }
    ]
  },
  {
    id: 'post-3',
    authorId: 'dv-04',
    authorName: 'Phạm Thị Mỹ Linh',
    authorRole: 'Đoàn viên • Phường Tam Hiệp',
    authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&auto=format&fit=crop&q=80',
    branchName: 'Chi đoàn Khu phố 5',
    category: 'event',
    eventTag: 'Hiến máu tình nguyện "Giọt hồng Đất Bưởi - Đồng Nai"',
    isEventPost: false,
    verifiedParticipant: true,
    createdAt: '3 ngày trước',
    content: 'Lần thứ 4 tham gia hiến máu tình nguyện tại Trung tâm Văn hóa Thanh thiếu nhi Đồng Nai. Một giọt máu cho đi, một cuộc đời ở lại!',
    imageUrl: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800&auto=format&fit=crop&q=80',
    likesCount: 53,
    likedByMe: false,
    comments: []
  }
];

// Dữ liệu Chuyển sinh hoạt Đoàn (Chức năng 9)
export const INITIAL_TRANSFER_REQUESTS = [
  {
    id: 'tr-1',
    memberId: 'dv-13',
    memberName: 'Nguyễn Tấn Đạt',
    memberCode: 'ĐV-DN-013',
    direction: 'outgoing',
    fromBranch: 'Chi đoàn Khu phố 5 - P. Tam Hiệp',
    toBranch: 'Đoàn trường Đại học Đồng Nai',
    reason: 'Nhập học hệ Đại học chính quy năm học 2026 - 2030',
    submittedAt: '18/11/2026',
    status: 'approved_source',
    step: 3
  },
  {
    id: 'tr-2',
    memberId: 'dv-14',
    memberName: 'Trương Ngọc Hân',
    memberCode: 'ĐV-DN-014',
    direction: 'outgoing',
    fromBranch: 'Chi đoàn Khu phố 5 - P. Tam Hiệp',
    toBranch: 'Chi đoàn Khu phố 2 - P. Quyết Thắng',
    reason: 'Chuyển hộ khẩu thường trú sang Phường Quyết Thắng',
    submittedAt: '22/11/2026',
    status: 'pending',
    step: 2
  },
  {
    id: 'tr-3',
    memberId: 'dv-in-1',
    memberName: 'Ngô Minh Khải',
    memberCode: 'ĐV-LD-108',
    direction: 'incoming',
    fromBranch: 'Chi đoàn Ấp 3 - Xã An Phước, Long Thành',
    toBranch: 'Chi đoàn Khu phố 5 - P. Tam Hiệp',
    reason: 'Chuyển trọ đến Khu phố 5 để làm việc tại KCN Amata',
    submittedAt: '23/11/2026',
    status: 'pending',
    step: 2
  }
];

// Huy hiệu điện tử cho thành tích nổi bật (Chức năng 7)
export const DIGITAL_BADGES = [
  {
    id: 'bdg-1',
    name: 'Thanh niên Tiên phong Số',
    desc: 'Điểm danh QR 3 kỳ liên tiếp & hoàn thành E-Learning số hóa',
    icon: 'zap',
    earned: true,
    earnedAt: '18/11/2026'
  },
  {
    id: 'bdg-2',
    name: 'Công nhân Gương mẫu KCN',
    desc: 'Duy trì 100% chuyên cần dù làm việc theo ca kíp tại KCN',
    icon: 'award',
    earned: true,
    earnedAt: '15/11/2026'
  },
  {
    id: 'bdg-3',
    name: 'Chiến sĩ Giọt hồng Đồng Nai',
    desc: 'Tham gia hiến máu tình nguyện & hoạt động Thứ Bảy Xanh',
    icon: 'heart',
    earned: true,
    earnedAt: '08/11/2026'
  },
  {
    id: 'bdg-4',
    name: 'Đại sứ Truyền thông Social',
    desc: 'Đăng bài & hình ảnh lan tỏa sự kiện Đoàn trên Bảng tin',
    icon: 'share',
    earned: false,
    earnedAt: null
  }
];

// Lưu trữ lịch sử sinh hoạt theo Tháng / Quý / Năm 2026 (Chức năng 3)
export const PAST_SESSION_ARCHIVE = [
  { id: 'arc-11', period: 'Tháng 11/2026', quarter: 'Quý IV/2026', year: '2026', title: 'Ngày hội Thanh niên Đồng Nai', attended: 33, total: 46, rate: '71.7%', location: 'NVH Khu phố 5' },
  { id: 'arc-10', period: 'Tháng 10/2026', quarter: 'Quý IV/2026', year: '2026', title: 'Tuyên truyền ATGT & PCCC KCN', attended: 19, total: 46, rate: '41.3%', location: 'NVH Khu phố 5' },
  { id: 'arc-09', period: 'Tháng 09/2026', quarter: 'Quý III/2026', year: '2026', title: 'Kỹ năng số cho thanh niên', attended: 28, total: 46, rate: '60.9%', location: 'NVH Khu phố 5' },
  { id: 'arc-08', period: 'Tháng 08/2026', quarter: 'Quý III/2026', year: '2026', title: 'Tiếp sức mùa thi & Hành trình Đỏ', attended: 35, total: 46, rate: '76.1%', location: 'NVH Khu phố 5' },
  { id: 'arc-06', period: 'Tháng 06/2026', quarter: 'Quý II/2026', year: '2026', title: 'Chiến dịch Thanh niên Tình nguyện Hè', attended: 37, total: 45, rate: '82.2%', location: 'P. Tam Hiệp' },
  { id: 'arc-03', period: 'Tháng 03/2026', quarter: 'Quý I/2026', year: '2026', title: 'Tháng Thanh niên 26/03 - Kết nạp ĐV mới', attended: 41, total: 44, rate: '93.2%', location: 'NVH Khu phố 5' },
];

// Lô dữ liệu mẫu nhập hàng loạt từ Excel (Chức năng 2)
export const EXCEL_IMPORT_BATCH = [
  {
    name: 'Nguyễn Hữu Phước',
    phone: '0938.445.112',
    type: 'working_far',
    workplace: 'Cty Pouchen - KCN Biên Hòa 1',
    shift: 'Ca 2 (14h - 22h)',
    occupation: 'Công nhân sản xuất KCN',
    joinDate: '26/03/2023',
    points: 80
  },
  {
    name: 'Lê Ngọc Ánh',
    phone: '0977.882.910',
    type: 'local',
    workplace: 'Trường Mầm non Tam Hiệp',
    shift: 'Hành chính',
    occupation: 'Cán bộ / Viên chức',
    joinDate: '19/05/2022',
    points: 85
  }
];

// Nhật ký chỉnh sửa & bảo mật hệ thống (Chức năng 12)
export const INITIAL_AUDIT_LOGS = [
  { id: 'log-1', actor: 'Nguyễn Văn An (Bí thư KP5)', action: 'Khởi tạo mã QR Động 2 lớp cho buổi sinh hoạt tháng 12', time: '09:15 - 24/11/2026' },
  { id: 'log-2', actor: 'Phan Thị Bích Thảo (Đoàn Phường)', action: 'Tổng hợp báo cáo tháng 11 cho 12 Chi đoàn trực thuộc', time: '08:40 - 24/11/2026' },
  { id: 'log-3', actor: 'Trần Minh Quân (ĐV KP5)', action: 'Cập nhật lịch làm việc Ca đêm - KCN Thạnh Phú', time: '22:10 - 23/11/2026' },
];

// Ma trận phân quyền theo 3 vai trò (Chức năng 1 & 12)
export const ROLE_PERMISSIONS = [
  { feature: 'Quét QR Điểm danh & Gửi đơn ca bù', member: true, secretary: true, ward_officer: false },
  { feature: 'Đăng bài, ảnh sự kiện lên Bảng tin Social', member: true, secretary: true, ward_officer: true },
  { feature: 'Quản lý 46 hồ sơ ĐV, Nhập Excel & Duyệt ca bù', member: false, secretary: true, ward_officer: true },
  { feature: 'Tạo buổi sinh hoạt, phát QR & Điểm danh ngoại lệ', member: false, secretary: true, ward_officer: false },
  { feature: 'Xét duyệt Chuyển sinh hoạt Đoàn liên đơn vị', member: false, secretary: true, ward_officer: true },
  { feature: 'Thống kê 12 Chi đoàn, Nhắc nộp & Xuất Báo cáo Xã', member: false, secretary: false, ward_officer: true },
  { feature: 'Quản trị bảo mật, Sao lưu & Nhật ký hệ thống', member: false, secretary: true, ward_officer: true },
];
