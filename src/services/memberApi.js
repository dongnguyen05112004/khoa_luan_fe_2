import axios from 'axios'

const BASE = 'http://localhost:8000/api'

function authHeaders() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// ── MEMBER API ────────────────────────────────────────────────
export const memberApi = {
  /**
   * GET /api/members
   * Danh sách hội viên với phân trang, tìm kiếm, lọc
   * @param {Object} params - { search, status, branch_id, per_page, page }
   */
  getAll(params = {}) {
    return axios.get(`${BASE}/members`, {
      params,
      headers: authHeaders(),
    })
  },

  /**
   * GET /api/members/stats
   * Thống kê tổng quan (total_active, new_today, expiring_soon...)
   */
  getStats(params = {}) {
    return axios.get(`${BASE}/members/stats`, {
      params,
      headers: authHeaders(),
    })
  },

  /**
   * GET /api/members/search?q=keyword&limit=10
   * Tìm kiếm nhanh hội viên cho dropdown (tên / email / SĐT / mã thẻ)
   * @returns [{ id, full_name, email, phone, card_number, avatar, status }]
   */
  search(q, limit = 10) {
    return axios.get(`${BASE}/members/search`, {
      params: { q, limit },
      headers: authHeaders(),
    })
  },

  /**
   * GET /api/members/{id}
   * Chi tiết hội viên (kèm profile, subscription, last check-in)
   */
  getOne(id) {
    return axios.get(`${BASE}/members/${id}`, { headers: authHeaders() })
  },

  /**
   * POST /api/members
   * Thêm hội viên mới
   * @param {Object} data - { name*, email*, password*, full_name, phone, gender,
   *   avatar, card_number, branch_id, date_of_birth, join_date,
   *   emergency_contact, health_notes, membership_type,
   *   plan_id?, start_date?, end_date?, price?, promotion_id? }
   */
  create(data) {
    return axios.post(`${BASE}/members`, data, { headers: authHeaders() })
  },

  /**
   * PUT /api/members/{id}
   * Cập nhật thông tin hội viên
   */
  update(id, data) {
    return axios.put(`${BASE}/members/${id}`, data, { headers: authHeaders() })
  },

  /**
   * DELETE /api/members/{id}
   * Xóa hội viên (soft delete)
   */
  remove(id) {
    return axios.delete(`${BASE}/members/${id}`, { headers: authHeaders() })
  },

  /**
   * PATCH /api/members/{id}/status
   * Cập nhật trạng thái hội viên
   * @param {string} status - 'active' | 'on_hold' | 'banned'
   */
  updateStatus(id, status) {
    return axios.patch(
      `${BASE}/members/${id}/status`,
      { status },
      { headers: authHeaders() }
    )
  },

  /**
   * GET /api/members/{id}/checkins
   * Lịch sử check-in của hội viên
   * @param {Object} params - { per_page, date }
   */
  getCheckins(id, params = {}) {
    return axios.get(`${BASE}/members/${id}/checkins`, {
      params,
      headers: authHeaders(),
    })
  },

  /**
   * GET /api/members/{id}/subscriptions
   * Lịch sử gói tập của hội viên
   * @param {Object} params - { status }
   */
  getSubscriptions(id, params = {}) {
    return axios.get(`${BASE}/members/${id}/subscriptions`, {
      params,
      headers: authHeaders(),
    })
  },

  // ── FORM SUPPORT ────────────────────────────────────────────

  /**
   * GET /api/membership-plans/active
   * Danh sách gói tập đang active (cho dropdown form thêm hội viên)
   * @returns [{ id, plan_name, duration_days, price, description }]
   */
  getActivePlans() {
    return axios.get(`${BASE}/membership-plans/active`, { headers: authHeaders() })
  },

  /**
   * GET /api/promotions/active
   * Danh sách khuyến mãi còn hiệu lực (cho dropdown form thêm hội viên)
   * @returns [{ id, title, code, discount, end_date }]
   */
  getActivePromotions() {
    return axios.get(`${BASE}/promotions/active`, { headers: authHeaders() })
  },

  /**
   * GET /api/branches
   * Danh sách chi nhánh (cho dropdown)
   * @returns [{ id, branch_name, address }]
   */
  getBranches() {
    return axios.get(`${BASE}/branches`, { headers: authHeaders() })
  },
}
