import axios from 'axios'

// Vite proxy: /api/* → http://localhost:8000/api
const BASE = '/api'

/**
 * dashboardApi.js
 * ─────────────────────────────────────────────────────────────
 * Tất cả API cần thiết cho trang Dashboard (nhanvien.vue):
 *
 *  1. getStats()              – Thống kê hội viên (stat cards)
 *  2. getContractStats()      – Thống kê hợp đồng (expiringSoon, bookingsToday)
 *  3. getRecentCheckins()     – Check-in gần đây (bảng)
 *  4. getCheckinTraffic()     – Lưu lượng check-in theo giờ (chart)
 *  5. getTodayClasses()       – Lịch lớp học hôm nay (right panel)
 *  6. getPendingContracts()   – Hợp đồng sắp hết hạn (right panel)
 * ─────────────────────────────────────────────────────────────
 */
export const dashboardApi = {

  // ─── 1. THỐNG KÊ HỘI VIÊN ────────────────────────────────────
  /**
   * GET /api/members/stats
   *
   * Response:
   *   total_members    – tổng số hội viên
   *   total_active     – đang active (có gói tập còn hiệu lực)
   *   new_today        – hội viên đăng ký mới hôm nay
   *   expiring_soon    – sắp hết hạn trong 7 ngày
   *   on_hold          – đang tạm đình chỉ
   *   expired          – đã hết hạn
   *   retention_change – % thay đổi so với tuần trước
   *
   * Dùng cho stat card: "TỔNG HỘI VIÊN"
   */
  getStats(params = {}) {
    return axios.get(`${BASE}/members/stats`, { params })
  },

  // ─── 2. THỐNG KÊ HỢP ĐỒNG ────────────────────────────────────
  /**
   * GET /api/contracts/stats
   *
   * Response:
   *   total           – tổng số hợp đồng
   *   total_active    – đang active
   *   total_expired   – đã hết hạn
   *   total_cancelled – đã hủy
   *   expiring_soon   – sắp hết hạn trong 30 ngày
   *   new_this_month  – hợp đồng mới trong tháng này
   *   new_last_month  – hợp đồng mới tháng trước
   *   monthly_change  – % thay đổi so với tháng trước (vd: +12.5 hoặc -8.0)
   *   revenue_total   – tổng doanh thu
   *
   * Dùng cho stat card: "HỢP ĐỒNG ĐÃ ĐẶT TRONG THÁNG" và "HĐ SẮP HẾT HẠN"
   */
  getContractStats() {
    return axios.get(`${BASE}/contracts/stats`)
  },

  // ─── 3. CHECK-IN GẦN ĐÂY ────────────────────────────────────
  /**
   * GET /api/checkins
   * @param {number} limit  – số bản ghi muốn lấy (mặc định 10)
   * @param {string} date   – lọc theo ngày YYYY-MM-DD (mặc định: hôm nay)
   *
   * Response (paginated):
   *   data[]:
   *     id, user_id, branch_id, check_in_at, check_out_at,
   *     duration, method (qr|face|manual), notes, schedule_done,
   *     user: { id, full_name, name, email, phone, avatar, card_number }
   *     branch: { id, branch_name }
   *
   * Dùng cho bảng "Check-in gần đây"
   */
  getRecentCheckins(limit = 10, date = null) {
    const today = date ?? new Date().toISOString().split('T')[0]
    return axios.get(`${BASE}/checkins`, {
      params: {
        per_page: limit,
        date: today,
      },
    })
  },

  /**
   * GET /api/checkins (không lọc ngày)
   * Lấy toàn bộ check-in gần nhất không giới hạn ngày
   * @param {number} limit – số lượng (mặc định 10)
   *
   * Tiện dụng khi muốn hiển thị lịch sử checkin gần nhất bất kể ngày
   */
  getLatestCheckins(limit = 10) {
    return axios.get(`${BASE}/checkins`, {
      params: { per_page: limit },
    })
  },

  // ─── 4. THỐNG KÊ CHECK-IN THEO GIỜ (Traffic Chart) ────────────
  /**
   * GET /api/checkins
   * Lấy tất cả check-in hôm nay rồi nhóm theo giờ (trên FE)
   *
   * Response gốc: danh sách checkin có check_in_at
   * FE tự nhóm theo giờ để vẽ chart bars
   *
   * Dùng cho biểu đồ "Lưu lượng truy cập"
   */
  getCheckinTraffic(date = null) {
    const today = date ?? new Date().toISOString().split('T')[0]
    return axios.get(`${BASE}/checkins`, {
      params: {
        date: today,
        per_page: 500, // lấy nhiều để đủ nhóm theo giờ
      },
    })
  },

  // ─── 5. LỊCH LỚP HỌC HÔM NAY ────────────────────────────────
  /**
   * GET /api/classes?date=YYYY-MM-DD
   * BE filter whereDate('schedule_date', date) + orderBy schedule_date
   *
   * @param {string} date      – ngày cần lấy lịch (mặc định: hôm nay)
   * @param {Object} extraParams – { branch_id?, trainer_id? }
   *
   * Response (array):
   *   id, class_name, trainer_id, branch_id, max_members, class_cost,
   *   description, schedule_date,
   *   registrations_count,
   *   trainer: { id, user: { full_name, avatar } }
   *   branch: { id, branch_name }
   *
   * Dùng cho panel "Lịch hôm nay"
   */
  getTodayClasses(date = null, extraParams = {}) {
    const d = date ?? new Date().toISOString().split('T')[0]
    return axios.get(`${BASE}/classes`, {
      params: { date: d, ...extraParams },
    })
  },

  // ─── 6. HỢP ĐỒNG SẮP HẾT HẠN (Pending / Expiring) ─────────────
  /**
   * GET /api/contracts?status=active&expiring_within=30&per_page=20
   * Lấy các hợp đồng active sắp hết hạn trong 30 ngày tới
   * BE sort theo end_date ASC → hợp đồng gần hết hạn nhất lên đầu
   *
   * @param {number} limit        – số bản ghi tối đa (mặc định 20)
   * @param {number} withinDays   – lọc hợp đồng hết hạn trong N ngày (mặc định 30)
   *
   * Response (paginated):
   *   data[]:
   *     id, contract_number, user_id, member_name, member_email,
   *     member_phone, member_avatar, member_card,
   *     plan_id, package, package_label,
   *     start_date, end_date, price, status,
   *     lifecycle (0–100%), days_left, days_overdue,
   *     expiry_warning
   *
   * Dùng cho panel "Hợp đồng chờ ký" (những hợp đồng sắp hết hạn)
   */
  getExpiringContracts(limit = 20, withinDays = 30) {
    return axios.get(`${BASE}/contracts`, {
      params: {
        status:           'active',
        expiring_within:  withinDays,  // BE filter end_date trong N ngày tới
        per_page:         limit,
      },
    })
  },

  // ─── 7. ĐẶT LỊCH HÔM NAY (bookingsToday) ────────────────────
  /**
   * GET /api/pt-bookings
   * Lấy số lịch đặt PT hôm nay
   *
   * Response (paginated):
   *   data[]:
   *     id, user_id, trainer_id, contract_id,
   *     session_date, start_time, end_time, status, notes
   *
   * FE đếm số item trong data để hiển thị stat card "ĐÃ ĐẶT HÔM NAY"
   */
  getTodayBookings() {
    const today = new Date().toISOString().split('T')[0]
    return axios.get(`${BASE}/pt-bookings`, {
      params: {
        per_page: 100,
        // Backend PtBookingController hỗ trợ lọc theo session_date nếu cần
      },
    })
  },

  // ─── 8. THÔNG TIN NHÂN VIÊN ĐANG ĐĂNG NHẬP ─────────────────
  /**
   * GET /api/me
   * Lấy thông tin user hiện tại (nhân viên đang đăng nhập)
   *
   * Response:
   *   id, name, full_name, email, phone, avatar, gender,
   *   role: { id, role_name }
   *   branch: { id, branch_name }
   *   employeeProfile: { ... }
   *
   * Dùng để hiển thị tên nhân viên trong lời chào "Chào buổi sáng, {full_name}"
   */
  getMe() {
    return axios.get(`${BASE}/me`)
  },

  // ─── HELPERS (dùng chung với các trang khác) ──────────────────

  /**
   * GET /api/members/search?q=keyword
   * Tìm kiếm nhanh hội viên cho gợi ý / dropdown
   * @param {string} q     – từ khoá
   * @param {number} limit – số kết quả (mặc định 10, tối đa 30)
   */
  searchMembers(q, limit = 10) {
    return axios.get(`${BASE}/members/search`, {
      params: { q, limit },
    })
  },
}

// ─── TRANSFORM HELPERS (dùng trong nhanvien.vue) ─────────────────

/**
 * Chuyển 1 record checkin từ API → format hiển thị cho bảng
 *
 * @param {Object} item – record checkin từ GET /api/checkins
 * @returns {Object}    – { id, name, memberId, initials, color, code, time, status, statusType, type }
 */
export function formatCheckin(item) {
  const user    = item.user ?? {}
  const fullName = user.full_name ?? user.name ?? 'Không rõ'
  const words   = fullName.trim().split(/\s+/)
  const initials = words.length >= 2
    ? (words[0][0] + words[words.length - 1][0]).toUpperCase()
    : fullName.slice(0, 2).toUpperCase()

  // Avatar color dựa trên id
  const colors = ['#2d7a3a', '#1565c0', '#c62828', '#7b1fa2', '#e65100', '#00838f']
  const color  = colors[item.id % colors.length]

  // Format thời gian
  const date    = new Date(item.check_in_at)
  const time    = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false })

  // Status mapping: dùng method làm "type" hiển thị, payment_status giả định là paid
  const methodLabel = { qr: 'QR', face: 'Face ID', manual: 'Thủ công' }[item.method] ?? item.method ?? '—'

  return {
    id:         item.id,
    name:       fullName,
    memberId:   user.card_number ?? `#${String(user.id).padStart(3, '0')}`,
    initials,
    color,
    code:       `PA-${date.getFullYear()}-${String(item.id).padStart(4, '0')}`,
    time,
    status:     'CHECKED IN',
    statusType: 'paid',
    type:       methodLabel,
  }
}

/**
 * Nhóm danh sách checkin theo giờ → mảng bar chart
 *
 * @param {Array}  checkins  – danh sách records có check_in_at
 * @param {number} startHour – giờ bắt đầu (mặc định 6)
 * @param {number} endHour   – giờ kết thúc (mặc định 21)
 * @returns {Array} [{ label: '06:00', value: 0-100, peak: boolean }]
 */
export function buildTrafficChart(checkins, startHour = 6, endHour = 21) {
  const hourCounts = {}

  for (let h = startHour; h <= endHour; h++) {
    const label = `${String(h).padStart(2, '0')}:00`
    hourCounts[label] = 0
  }

  checkins.forEach(item => {
    const d = new Date(item.check_in_at)
    const h = d.getHours()
    if (h >= startHour && h <= endHour) {
      const label = `${String(h).padStart(2, '0')}:00`
      hourCounts[label] = (hourCounts[label] ?? 0) + 1
    }
  })

  const counts = Object.values(hourCounts)
  const maxCount = Math.max(...counts, 1)

  return Object.entries(hourCounts).map(([label, count]) => ({
    label,
    value: Math.round((count / maxCount) * 100),
    peak:  count >= maxCount * 0.7,
  }))
}

/**
 * Format danh sách lớp học → hiển thị panel "Lịch hôm nay"
 * BE đã filter theo date và sort theo schedule_date nên không cần filter lại.
 *
 * @param {Array} classes – array từ GET /api/classes?date=YYYY-MM-DD
 * @returns {Array} [{ id, name, detail, time, type }]
 */
export function formatTodayEvents(classes) {
  return classes.map((c, i) => {
    const types = ['green', 'blue', 'gray', 'teal', 'orange']
    const trainerName = c.trainer?.user?.full_name ?? c.trainer?.user?.name ?? 'Chưa có HLV'
    const timePart = c.schedule_date
      ? new Date(c.schedule_date).toLocaleTimeString('vi-VN', {
          hour: '2-digit', minute: '2-digit', hour12: false,
        })
      : '—'

    return {
      id:     c.id,
      name:   c.class_name,
      detail: trainerName,
      time:   timePart,
      type:   types[i % types.length],
    }
  })
}

/**
 * Format hợp đồng sắp hết hạn → hiển thị panel "Hợp đồng chờ ký"
 *
 * BE đã filter expiring_within=30 và sort end_date ASC nên không cần filter lại.
 * Chỉ giới hạn tối đa 5 item hiển thị trên panel.
 *
 * @param {Array} contracts – data[] từ GET /api/contracts?expiring_within=30
 * @returns {Array} [{ id, name, package, contractNumber, planId, daysLeft }]
 */
export function formatPendingContracts(contracts) {
  return contracts
    .slice(0, 5)
    .map(c => ({
      id:             c.id,
      name:           c.member_name,
      package:        c.package_label ?? c.package ?? 'Không rõ gói',
      contractNumber: c.contract_number ?? `#CN-${String(c.id).padStart(4, '0')}`,
      planId:         c.plan_id,
      daysLeft:       c.days_left ?? 0,
    }))
}
