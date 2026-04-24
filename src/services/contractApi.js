import axios from 'axios'

// Vite proxy chuyển /api/* → http://127.0.0.1:8000/api
const BASE = '/api'

// Token helper
function authHeaders() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

function cfg(extra = {}) {
  return { headers: authHeaders(), ...extra }
}

// ── CONTRACT API ───────────────────────────────────────────────
// Tương ứng toàn bộ ContractController.php - BE_DATN
export const contractApi = {

  /**
   * GET /api/contracts
   * Danh sách hợp đồng với phân trang, tìm kiếm, lọc
   * @param {Object} params - { search, status, plan_id, per_page, page }
   */
  getAll(params = {}) {
    return axios.get(`${BASE}/contracts`, cfg({ params }))
  },

  /**
   * GET /api/contracts/stats
   * Thống kê tổng quan hợp đồng
   * @returns { total, total_active, total_expired, total_cancelled, expiring_soon, new_this_month, revenue_total }
   */
  getStats() {
    return axios.get(`${BASE}/contracts/stats`, cfg())
  },

  /**
   * GET /api/contracts/{id}
   * Chi tiết 1 hợp đồng
   */
  getOne(id) {
    return axios.get(`${BASE}/contracts/${id}`, cfg())
  },

  /**
   * POST /api/contracts
   * Tạo hợp đồng mới (đồng thời tạo Payment record)
   * @param {Object} data - {
   *   user_id*, plan_id*, start_date*, end_date*,
   *   price?, promotion_id?,
   *   payment_method?: 'cash'|'card'|'bank_transfer',
   *   create_payment?: boolean  (default true)
   * }
   */
  create(data) {
    return axios.post(`${BASE}/contracts`, data, cfg())
  },

  /**
   * PUT /api/contracts/{id}
   * Cập nhật hợp đồng
   * @param {Object} data - { plan_id?, start_date?, end_date?, price?, promotion_id?, status? }
   */
  update(id, data) {
    return axios.put(`${BASE}/contracts/${id}`, data, cfg())
  },

  /**
   * DELETE /api/contracts/{id}
   * Xóa hợp đồng
   */
  remove(id) {
    return axios.delete(`${BASE}/contracts/${id}`, cfg())
  },

  /**
   * POST /api/contracts/{id}/renew
   * Gia hạn hợp đồng (tạo hợp đồng mới, đánh dấu cũ là expired, tạo Payment)
   * @param {Object} data - {
   *   plan_id*, new_start_date*,
   *   price?, promotion_id?,
   *   payment_method?: 'cash'|'card'|'bank_transfer'
   * }
   */
  renew(id, data) {
    return axios.post(`${BASE}/contracts/${id}/renew`, data, cfg())
  },

  /**
   * POST /api/contracts/{id}/cancel
   * Hủy hợp đồng (lưu lý do vào DB)
   * @param {string} reason - Lý do hủy (bắt buộc, min 5 ký tự)
   */
  cancel(id, reason) {
    return axios.post(`${BASE}/contracts/${id}/cancel`, { reason }, cfg())
  },

  /**
   * GET /api/contracts/member/{userId}
   * Hợp đồng hiện tại + lịch sử của 1 hội viên
   * @returns { member, current_contract, history[] }
   */
  getMemberContracts(userId) {
    return axios.get(`${BASE}/contracts/member/${userId}`, cfg())
  },

  // ── FORM SUPPORT APIS ─────────────────────────────────────────

  /**
   * GET /api/membership-plans/active
   * Danh sách gói tập đang hoạt động (cho dropdown form tạo hợp đồng)
   * @returns [{ id, plan_name, duration_days, price, description }]
   */
  getActivePlans() {
    return axios.get(`${BASE}/membership-plans/active`, cfg())
  },

  /**
   * GET /api/promotions/active
   * Danh sách khuyến mãi còn hiệu lực (cho dropdown form tạo hợp đồng)
   * @returns [{ id, title, code, discount, end_date }]
   */
  getActivePromotions() {
    return axios.get(`${BASE}/promotions/active`, cfg())
  },

  /**
   * GET /api/members/search?q={keyword}
   * Tìm kiếm nhanh hội viên để chọn khi tạo hợp đồng mới
   * @param {string} q - từ khoá (tên / email / SĐT / mã thẻ)
   * @returns [{ id, full_name, email, phone, card_number, avatar, status }]
   */
  searchMembers(q) {
    return axios.get(`${BASE}/members/search`, cfg({ params: { q, limit: 10 } }))
  },
}
