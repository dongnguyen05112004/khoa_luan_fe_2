/**
 * i18n.js — Bộ chuyển đổi ngôn ngữ Tiếng Việt (Frontend only)
 * Giữ nguyên giá trị DB (tiếng Anh), chỉ chuyển đổi ở giao diện.
 *
 * Sử dụng:
 *   import { statusLabel, statusClass, roleLabel, ... } from '@/utils/i18n'
 */

// ─────────────────────────────────────────────────────────────
// TRẠNG THÁI TÀI KHOẢN (users.state)
//   active | inactive | banned
// ─────────────────────────────────────────────────────────────
export const USER_STATE_LABEL = {
  active:   'Hoạt động',
  inactive: 'Không hoạt động',
  banned:   'Bị khoá',
}

export const USER_STATE_CLASS = {
  active:   'st-active',
  inactive: 'st-inactive',
  banned:   'st-banned',
}

export function userStateLabel(state) {
  return USER_STATE_LABEL[state] ?? (state ? String(state) : '—')
}

export function userStateClass(state) {
  return USER_STATE_CLASS[state] ?? 'st-inactive'
}

// ─────────────────────────────────────────────────────────────
// VAI TRÒ (roles.role_name)
//   admin | manager | staff | trainer | member
// ─────────────────────────────────────────────────────────────
export const ROLE_LABEL = {
  admin:   'Quản trị viên',
  manager: 'Quản lý',
  staff:   'Nhân viên',
  trainer: 'Huấn luyện viên',
  member:  'Hội viên',
}

export function roleLabel(role) {
  return ROLE_LABEL[role] ?? (role ? String(role) : '—')
}

// ─────────────────────────────────────────────────────────────
// TRẠNG THÁI GÓI TẬP (membership_plans.status)
//   active | inactive
// ─────────────────────────────────────────────────────────────
export const PLAN_STATUS_LABEL = {
  active:   'Đang áp dụng',
  inactive: 'Ngừng áp dụng',
}

export function planStatusLabel(status) {
  return PLAN_STATUS_LABEL[status] ?? (status ? String(status) : '—')
}

// ─────────────────────────────────────────────────────────────
// TRẠNG THÁI ĐĂNG KÝ HỘI VIÊN (member_subscriptions.status)
//   active | expired | cancelled | pending
// ─────────────────────────────────────────────────────────────
export const SUBSCRIPTION_STATUS_LABEL = {
  active:    'Đang hoạt động',
  expired:   'Đã hết hạn',
  cancelled: 'Đã huỷ',
  pending:   'Chờ xác nhận',
}

export const SUBSCRIPTION_STATUS_CLASS = {
  active:    'st-active',
  expired:   'st-expired',
  cancelled: 'st-cancelled',
  pending:   'st-pending',
}

export function subscriptionStatusLabel(status) {
  return SUBSCRIPTION_STATUS_LABEL[status] ?? (status ? String(status) : '—')
}

export function subscriptionStatusClass(status) {
  return SUBSCRIPTION_STATUS_CLASS[status] ?? 'st-pending'
}

// ─────────────────────────────────────────────────────────────
// TRẠNG THÁI HỢP ĐỒNG PT (pt_contracts.status)
//   active | completed | cancelled | pending
// ─────────────────────────────────────────────────────────────
export const CONTRACT_STATUS_LABEL = {
  active:    'Đang hiệu lực',
  completed: 'Đã hoàn thành',
  cancelled: 'Đã huỷ',
  pending:   'Chờ xác nhận',
  expired:   'Đã hết hạn',
}

export const CONTRACT_STATUS_CLASS = {
  active:    'st-active',
  completed: 'st-completed',
  cancelled: 'st-cancelled',
  pending:   'st-pending',
  expired:   'st-expired',
}

export function contractStatusLabel(status) {
  return CONTRACT_STATUS_LABEL[status] ?? (status ? String(status) : '—')
}

export function contractStatusClass(status) {
  return CONTRACT_STATUS_CLASS[status] ?? 'st-pending'
}

// ─────────────────────────────────────────────────────────────
// TRẠNG THÁI ĐẶT LỊCH PT (pt_bookings.status)
//   pending | confirmed | done | cancelled
// ─────────────────────────────────────────────────────────────
export const BOOKING_STATUS_LABEL = {
  pending:   'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  done:      'Đã hoàn thành',
  cancelled: 'Đã huỷ',
}

export const BOOKING_STATUS_CLASS = {
  pending:   'st-pending',
  confirmed: 'st-confirmed',
  done:      'st-completed',
  cancelled: 'st-cancelled',
}

export function bookingStatusLabel(status) {
  return BOOKING_STATUS_LABEL[status] ?? (status ? String(status) : '—')
}

export function bookingStatusClass(status) {
  return BOOKING_STATUS_CLASS[status] ?? 'st-pending'
}

// ─────────────────────────────────────────────────────────────
// TRẠNG THÁI THANH TOÁN (payments.status)
//   pending | paid | refunded
// ─────────────────────────────────────────────────────────────
export const PAYMENT_STATUS_LABEL = {
  pending:  'Chờ thanh toán',
  paid:     'Đã thanh toán',
  refunded: 'Đã hoàn tiền',
}

export const PAYMENT_STATUS_CLASS = {
  pending:  'st-pending',
  paid:     'st-active',
  refunded: 'st-refunded',
}

export function paymentStatusLabel(status) {
  return PAYMENT_STATUS_LABEL[status] ?? (status ? String(status) : '—')
}

export function paymentStatusClass(status) {
  return PAYMENT_STATUS_CLASS[status] ?? 'st-pending'
}

// ─────────────────────────────────────────────────────────────
// TRẠNG THÁI THIẾT BỊ (equipment.status)
//   active | maintenance | broken
// ─────────────────────────────────────────────────────────────
export const EQUIPMENT_STATUS_LABEL = {
  active:      'Đang sử dụng',
  maintenance: 'Đang bảo trì',
  broken:      'Hỏng / Ngừng dùng',
}

export const EQUIPMENT_STATUS_CLASS = {
  active:      'st-active',
  maintenance: 'st-maintenance',
  broken:      'st-broken',
}

export function equipmentStatusLabel(status) {
  return EQUIPMENT_STATUS_LABEL[status] ?? (status ? String(status) : '—')
}

export function equipmentStatusClass(status) {
  return EQUIPMENT_STATUS_CLASS[status] ?? 'st-maintenance'
}

// ─────────────────────────────────────────────────────────────
// PHƯƠNG THỨC CHECK-IN (checkins.method)
//   qr | face | manual
// ─────────────────────────────────────────────────────────────
export const CHECKIN_METHOD_LABEL = {
  qr:     'Quét mã QR',
  face:   'Nhận diện khuôn mặt',
  manual: 'Thủ công',
}

export function checkinMethodLabel(method) {
  return CHECKIN_METHOD_LABEL[method] ?? (method ? String(method) : '—')
}

// ─────────────────────────────────────────────────────────────
// TRẠNG THÁI ĐĂNG KÝ LỚP HỌC (class_registrations.status)
//   registered | cancelled | completed
// ─────────────────────────────────────────────────────────────
export const CLASS_REG_STATUS_LABEL = {
  registered: 'Đã đăng ký',
  cancelled:  'Đã huỷ',
  completed:  'Đã hoàn thành',
}

export function classRegStatusLabel(status) {
  return CLASS_REG_STATUS_LABEL[status] ?? (status ? String(status) : '—')
}

// ─────────────────────────────────────────────────────────────
// HỌ TẮT GIỚI TÍNH (users.gender)
//   male | female | other
// ─────────────────────────────────────────────────────────────
export const GENDER_LABEL = {
  male:   'Nam',
  female: 'Nữ',
  other:  'Khác',
}

export function genderLabel(gender) {
  return GENDER_LABEL[gender] ?? (gender ? String(gender) : '—')
}

// ─────────────────────────────────────────────────────────────
// TRẠNG THÁI CHUNG (hội viên - member_subscriptions / quanlyhoivien)
//   active | expired | on_hold | banned
// ─────────────────────────────────────────────────────────────
export const MEMBER_STATUS_LABEL = {
  active:    'Đang hoạt động',
  expired:   'Đã hết hạn',
  on_hold:   'Tạm dừng',
  banned:    'Bị khoá',
  cancelled: 'Đã huỷ',
}

export const MEMBER_STATUS_CLASS = {
  active:    'st-active',
  expired:   'st-expired',
  on_hold:   'st-onhold',
  banned:    'st-banned',
  cancelled: 'st-cancelled',
}

export function memberStatusLabel(status) {
  return MEMBER_STATUS_LABEL[status] ?? (status ? String(status) : '—')
}

export function memberStatusClass(status) {
  return MEMBER_STATUS_CLASS[status] ?? 'st-expired'
}

// ─────────────────────────────────────────────────────────────
// HELPER: Định dạng ngày dd/mm/yyyy tiếng Việt
// ─────────────────────────────────────────────────────────────
export function formatDateVN(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

// ─────────────────────────────────────────────────────────────
// HELPER: Định dạng tiền tệ VNĐ
// ─────────────────────────────────────────────────────────────
export function formatCurrencyVN(amount) {
  if (amount === null || amount === undefined) return '—'
  return Number(amount).toLocaleString('vi-VN') + ' đ'
}
