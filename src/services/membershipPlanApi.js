import axios from 'axios'

const BASE = 'http://localhost:8000/api'

function authHeaders() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// ── MEMBERSHIP PLAN API ────────────────────────────────────────────────
export const membershipPlanApi = {
  /**
   * GET /api/membership-plans
   * Danh sách tất cả gói tập
   */
  getAll(params = {}) {
    return axios.get(`${BASE}/membership-plans`, {
      params,
      headers: authHeaders(),
    })
  },

  /**
   * GET /api/membership-plans/active
   * Danh sách gói tập đang active
   */
  getActive() {
    return axios.get(`${BASE}/membership-plans/active`, {
      headers: authHeaders(),
    })
  },

  /**
   * GET /api/membership-plans/{id}
   * Chi tiết một gói tập
   */
  getOne(id) {
    return axios.get(`${BASE}/membership-plans/${id}`, {
      headers: authHeaders(),
    })
  },

  /**
   * POST /api/membership-plans
   * Tạo gói tập mới
   * @param {Object} data - { plan_name, price, duration_days, value?, description?, status }
   */
  create(data) {
    return axios.post(`${BASE}/membership-plans`, data, {
      headers: authHeaders(),
    })
  },

  /**
   * PUT /api/membership-plans/{id}
   * Cập nhật gói tập
   */
  update(id, data) {
    return axios.put(`${BASE}/membership-plans/${id}`, data, {
      headers: authHeaders(),
    })
  },

  /**
   * DELETE /api/membership-plans/{id}
   * Xóa gói tập
   */
  remove(id) {
    return axios.delete(`${BASE}/membership-plans/${id}`, {
      headers: authHeaders(),
    })
  },

  /**
   * PUT /api/membership-plans/{id}
   * Bật/Tắt trạng thái gói tập (dùng update endpoint chuẩn)
   * @param {string} currentStatus - trạng thái hiện tại ('active' | 'inactive')
   */
  toggleStatus(id, currentStatus) {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    return axios.put(
      `${BASE}/membership-plans/${id}`,
      { status: newStatus },
      { headers: authHeaders() }
    )
  },
}
