import axios from 'axios'

const BASE = 'http://localhost:8000/api'

function authHeaders() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const healthMetricApi = {
  /**
   * GET /api/health-metrics
   * @param {Object} params - { user_id }
   */
  getAll(params = {}) {
    return axios.get(`${BASE}/health-metrics`, {
      params,
      headers: authHeaders(),
    })
  },

  /**
   * GET /api/health-metrics/{id}
   */
  getOne(id) {
    return axios.get(`${BASE}/health-metrics/${id}`, {
      headers: authHeaders(),
    })
  },

  /**
   * POST /api/health-metrics
   * @param {Object} data - { user_id, record_date, weight, height, body_fat_percentage, muscle_mass_kg, bmi }
   */
  create(data) {
    return axios.post(`${BASE}/health-metrics`, data, {
      headers: authHeaders(),
    })
  },

  /**
   * PUT /api/health-metrics/{id}
   */
  update(id, data) {
    return axios.put(`${BASE}/health-metrics/${id}`, data, {
      headers: authHeaders(),
    })
  },

  /**
   * DELETE /api/health-metrics/{id}
   */
  remove(id) {
    return axios.delete(`${BASE}/health-metrics/${id}`, {
      headers: authHeaders(),
    })
  }
}
