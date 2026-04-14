import axios from 'axios'

const BASE = '/api'

// NOTE: main.js interceptor tự động thêm Bearer token cho mọi request

// ── PROMOTIONS ─────────────────────────────────────────────
export const promotionApi = {
  getAll() {
    return axios.get(`${BASE}/promotions`)
  },
  getOne(id) {
    return axios.get(`${BASE}/promotions/${id}`)
  },
  create(data) {
    return axios.post(`${BASE}/promotions`, data)
  },
  update(id, data) {
    return axios.put(`${BASE}/promotions/${id}`, data)
  },
  remove(id) {
    return axios.delete(`${BASE}/promotions/${id}`)
  },
}
