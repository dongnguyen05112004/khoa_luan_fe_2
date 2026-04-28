import axios from 'axios'

// Vite proxy chuyển /api/* → http://127.0.0.1:8000/api
const BASE = '/api'

// ── AUTH HEADER ─────────────────────────────────────────────────────
function authHeaders() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}
function cfg(extra = {}) {
  return { headers: authHeaders(), ...extra }
}

// ── PAYMENT API ──────────────────────────────────────────────────────
/**
 * paymentApi.js
 * ─────────────────────────────────────────────────────────────────────
 * Tất cả API cho trang Thu Tiền & Xử Lý Thanh Toán:
 *
 *  getStats()           → GET  /api/payments/stats
 *  getSummary()         → GET  /api/payments/summary
 *  getAll()             → GET  /api/payments
 *  getOne()             → GET  /api/payments/{id}
 *  create()             → POST /api/payments
 *  update()             → PUT  /api/payments/{id}
 *  confirm()            → PATCH /api/payments/{id}/confirm
 *  refund()             → PATCH /api/payments/{id}/refund
 *  remove()             → DELETE /api/payments/{id}
 *  validatePromo()      → POST /api/payments/validate-promo
 *  getInvoice()         → GET  /api/payments/invoice/{id}
 *  searchMembers()      → GET  /api/members/search
 *  getActivePromos()    → GET  /api/promotions/active
 *  getActivePlans()     → GET  /api/membership-plans/active
 * ─────────────────────────────────────────────────────────────────────
 */
export const paymentApi = {

  // ─── 1. THỐNG KÊ TỔNG HỢP (cho thu_tien.vue – stats cards) ──────────
  /**
   * GET /api/payments/stats
   *
   * Response:
   *   today_revenue         – doanh thu hôm nay (chỉ paid)
   *   today_revenue_change  – % thay đổi so với hôm qua
   *   completed_count       – số giao dịch hoàn thành hôm nay
   *   avg_ticket            – giá trị TB mỗi giao dịch
   *   refunded_count        – số giao dịch hoàn tiền hôm nay
   *   pending_count         – số giao dịch đang chờ
   *   month_revenue         – doanh thu tháng này
   *   payment_methods       – [{ key, label, count, total, pct, color }]
   */
  getStats() {
    return axios.get(`${BASE}/payments/stats`, cfg())
  },

  // ─── 2. TÓM TẮT DOANH THU (chart dữ liệu) ────────────────────────
  /**
   * GET /api/payments/summary?period=day|month&date=YYYY-MM-DD
   *
   * Response:
   *   period – 'day' | 'month'
   *   data[] – [{ label, total, count }]
   */
  getSummary(period = 'day', date = null) {
    const params = { period }
    if (date) params.date = date
    return axios.get(`${BASE}/payments/summary`, cfg({ params }))
  },

  // ─── 3. DANH SÁCH GIAO DỊCH (bảng thu_tien.vue) ──────────────────
  /**
   * GET /api/payments
   *
   * @param {Object} params - {
   *   status:    'all' | 'paid' | 'pending' | 'refunded'
   *   method:    'cash' | 'card' | 'bank_transfer'
   *   user_id:   number
   *   date_from: 'YYYY-MM-DD'
   *   date_to:   'YYYY-MM-DD'
   *   search:    string  (tên / email / số hóa đơn)
   *   per_page:  number  (default 20)
   *   page:      number
   * }
   *
   * Response (paginated):
   *   data[] – mỗi item gồm:
   *     id, txId, invoice_number, date, payment_date,
   *     user_id, memberName, memberEmail, memberPhone, avatarBg,
   *     subscription_id, package, pkgClass,
   *     amount, method, methodIcon, payment_method,
   *     status, statusClass, status_raw,
   *     promotion_id, promotion_code, note, payment_confirmed
   */
  getAll(params = {}) {
    return axios.get(`${BASE}/payments`, cfg({ params }))
  },

  // ─── 4. CHI TIẾT GIAO DỊCH ───────────────────────────────────────
  /**
   * GET /api/payments/{id}
   */
  getOne(id) {
    return axios.get(`${BASE}/payments/${id}`, cfg())
  },

  // ─── 5. TẠO GIAO DỊCH MỚI (xuly_thanh_toan.vue → Xác nhận) ──────
  /**
   * POST /api/payments
   *
   * @param {Object} data - {
   *   user_id*          – ID hội viên
   *   subscription_id   – ID đăng ký gói tập (nếu có)
   *   amount*           – Số tiền
   *   payment_method*   – 'cash' | 'card' | 'bank_transfer'
   *   payment_date      – 'YYYY-MM-DD' (default: hôm nay)
   *   status            – 'pending' | 'paid' | 'refunded' (default: 'paid')
   *   promotion_id      – ID khuyến mãi
   *   note              – Ghi chú
   * }
   */
  create(data) {
    return axios.post(`${BASE}/payments`, data, cfg())
  },

  // ─── 6. CẬP NHẬT GIAO DỊCH ───────────────────────────────────────
  /**
   * PUT /api/payments/{id}
   *
   * @param {Object} data - { status?, payment_method?, payment_date?, note? }
   */
  update(id, data) {
    return axios.put(`${BASE}/payments/${id}`, data, cfg())
  },

  // ─── 7. XÁC NHẬN THANH TOÁN (pending → paid) ─────────────────────
  /**
   * PATCH /api/payments/{id}/confirm
   *
   * @param {Object} data - { payment_method?, note? }
   * Response: { message, payment }
   */
  confirm(id, data = {}) {
    return axios.patch(`${BASE}/payments/${id}/confirm`, data, cfg())
  },

  // ─── 8. HOÀN TIỀN (paid → refunded) ─────────────────────────────
  /**
   * PATCH /api/payments/{id}/refund
   *
   * @param {string} reason – Lý do hoàn tiền (bắt buộc, min 5 ký tự)
   * Response: { message, payment }
   */
  refund(id, reason) {
    return axios.patch(`${BASE}/payments/${id}/refund`, { reason }, cfg())
  },

  // ─── 9. XÓA GIAO DỊCH ────────────────────────────────────────────
  /**
   * DELETE /api/payments/{id}
   */
  remove(id) {
    return axios.delete(`${BASE}/payments/${id}`, cfg())
  },

  // ─── 10. KIỂM TRA MÃ KHUYẾN MÃI (xuly_thanh_toan.vue) ───────────
  /**
   * POST /api/payments/validate-promo
   *
   * @param {string} code   – Mã khuyến mãi
   * @param {number} amount – Số tiền gốc (để tính số tiền giảm)
   *
   * Response:
   *   valid          – true | false
   *   promo_id       – ID khuyến mãi
   *   code           – Mã code
   *   title          – Tên chương trình
   *   discount       – % giảm giá
   *   discount_amount– Số tiền được giảm
   *   final_amount   – Số tiền sau giảm
   *   message        – Thông báo
   */
  validatePromo(code, amount = 0) {
    return axios.post(`${BASE}/payments/validate-promo`, { code, amount }, cfg())
  },

  // ─── 11. DỮ LIỆU HÓA ĐƠN (in PDF) ───────────────────────────────
  /**
   * GET /api/payments/invoice/{id}
   *
   * Response:
   *   invoice_number, payment_date, status,
   *   member: { id, name, email, phone, address },
   *   service: { name, start_date, end_date, duration },
   *   subtotal, discount, discount_pct, promo_code, total,
   *   payment_method, note,
   *   gym: { name, address, phone, bank, account }
   */
  getInvoice(id) {
    return axios.get(`${BASE}/payments/invoice/${id}`, cfg())
  },

  // ─── FORM SUPPORT ────────────────────────────────────────────────

  /**
   * GET /api/members/search?q=keyword
   * Tìm kiếm nhanh hội viên (dropdown)
   * @param {string} q     – từ khoá (tên / email / SĐT)
   * @param {number} limit – số kết quả (default 10)
   */
  searchMembers(q, limit = 10) {
    return axios.get(`${BASE}/members/search`, cfg({ params: { q, limit } }))
  },

  /**
   * GET /api/promotions/active
   * Danh sách khuyến mãi còn hiệu lực
   * @returns [{ id, title, code, discount, end_date }]
   */
  getActivePromos() {
    return axios.get(`${BASE}/promotions/active`, cfg())
  },

  /**
   * GET /api/membership-plans/active
   * Danh sách gói tập đang active (cho dropdown)
   * @returns [{ id, plan_name, duration_days, price }]
   */
  getActivePlans() {
    return axios.get(`${BASE}/membership-plans/active`, cfg())
  },
}

// ─── TRANSFORM HELPERS ───────────────────────────────────────────────

/**
 * Format số tiền VND
 * @param {number} amount
 * @returns {string} '1.250.000'
 */
export function formatVND(amount) {
  return Number(amount).toLocaleString('vi-VN')
}

/**
 * Tạo nội dung chuyển khoản Techcombank duy nhất
 * Dựa theo mã hóa đơn và user_id
 * @param {string} invoiceNumber
 * @returns {string}
 */
export function generateTransferContent(invoiceNumber) {
  return invoiceNumber
    ? invoiceNumber.replace(/[^A-Z0-9]/gi, '').toUpperCase()
    : 'KPFITNESS' + Date.now().toString().slice(-6)
}

/**
 * Tạo URL QR Techcombank VietQR (tài khoản 19039637328012)
 * @param {number} amount     – Số tiền (VND)
 * @param {string} content    – Nội dung chuyển khoản
 * @param {number} [size=150] – Kích thước ảnh QR (px)
 * @returns {string} URL ảnh QR
 */
export function getTechcombankQR(amount = 0, content = '', size = 150) {
  // VietQR standard: bank=970407 (Techcombank), account=19039637328012
  const bankId   = '970407'       // Mã ngân hàng Techcombank theo VietQR
  const account  = '19039637328012'
  const template = 'compact'

  // Dùng API VietQR (miễn phí, không cần key)
  const base = 'https://img.vietqr.io/image'
  const params = new URLSearchParams({
    amount:        amount > 0 ? amount : '',
    addInfo:       content,
    accountName:   'KP FITNESS GYM',
  })
  return `${base}/${bankId}-${account}-${template}.png?${params}`
}
