import axios from 'axios'

const BASE = '/api'

// NOTE: Không cần authHeaders() riêng vì main.js đã cấu hình
// axios.interceptors.request để tự động thêm Bearer token cho mọi request.

// ── USERS ──────────────────────────────────────────────────
export const userApi = {
  getAll(params = {}) {
    return axios.get(`${BASE}/users`, { params })
  },
  getOne(id) {
    return axios.get(`${BASE}/users/${id}`)
  },
  create(data) {
    return axios.post(`${BASE}/users`, data)
  },
  update(id, data) {
    return axios.put(`${BASE}/users/${id}`, data)
  },
  remove(id) {
    return axios.delete(`${BASE}/users/${id}`)
  },
  getSubscriptions(id) {
    return axios.get(`${BASE}/users/${id}/subscriptions`)
  },
}

// ── EMPLOYEE PROFILES ──────────────────────────────────────
export const employeeProfileApi = {
  getAll() {
    return axios.get(`${BASE}/employee-profiles`)
  },
  getOne(id) {
    return axios.get(`${BASE}/employee-profiles/${id}`)
  },
  create(data) {
    return axios.post(`${BASE}/employee-profiles`, data)
  },
  update(id, data) {
    return axios.put(`${BASE}/employee-profiles/${id}`, data)
  },
  remove(id) {
    return axios.delete(`${BASE}/employee-profiles/${id}`)
  },
}

// ── MEMBER PROFILES ────────────────────────────────────────
export const memberProfileApi = {
  getAll() {
    return axios.get(`${BASE}/member-profiles`)
  },
  getOne(id) {
    return axios.get(`${BASE}/member-profiles/${id}`)
  },
  create(data) {
    return axios.post(`${BASE}/member-profiles`, data)
  },
  update(id, data) {
    return axios.put(`${BASE}/member-profiles/${id}`, data)
  },
  remove(id) {
    return axios.delete(`${BASE}/member-profiles/${id}`)
  },
}
