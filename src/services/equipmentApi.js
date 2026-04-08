import axios from 'axios'

const BASE = 'http://localhost:8000/api'

function authHeaders() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// ── EQUIPMENT ──────────────────────────────────────────────
export const equipmentApi = {
  getAll() {
    return axios.get(`${BASE}/equipment`, { headers: authHeaders() })
  },
  getOne(id) {
    return axios.get(`${BASE}/equipment/${id}`, { headers: authHeaders() })
  },
  create(data) {
    return axios.post(`${BASE}/equipment`, data, { headers: authHeaders() })
  },
  update(id, data) {
    return axios.put(`${BASE}/equipment/${id}`, data, { headers: authHeaders() })
  },
  updateStatus(id, status) {
    return axios.patch(`${BASE}/equipment/${id}/status`, { status }, { headers: authHeaders() })
  },
  remove(id) {
    return axios.delete(`${BASE}/equipment/${id}`, { headers: authHeaders() })
  },
}

// ── MAINTENANCE ────────────────────────────────────────────
export const maintenanceApi = {
  getAll(params = {}) {
    return axios.get(`${BASE}/equipment-maintenance`, { params, headers: authHeaders() })
  },
  getOne(id) {
    return axios.get(`${BASE}/equipment-maintenance/${id}`, { headers: authHeaders() })
  },
  create(data) {
    return axios.post(`${BASE}/equipment-maintenance`, data, { headers: authHeaders() })
  },
  update(id, data) {
    return axios.put(`${BASE}/equipment-maintenance/${id}`, data, { headers: authHeaders() })
  },
  remove(id) {
    return axios.delete(`${BASE}/equipment-maintenance/${id}`, { headers: authHeaders() })
  },
  getDueSoon() {
    return axios.get(`${BASE}/equipment-maintenance/due-soon`, { headers: authHeaders() })
  },
}
