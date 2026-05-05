<template>
  <div class="qlhv-page">

    <!-- ===== Page Header ===== -->
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-title">Quản lý hội viên</h1>
        <div class="header-badges">
          <span class="badge-members">
            <i class="fas fa-users"></i> {{ (stats.total_active || 0).toLocaleString() }} Hội viên đang hoạt động
          </span>
          <span class="badge-ai" v-if="stats.retention_change !== null">
            <i class="fas fa-robot"></i>
            AI: Tỉ lệ giữ chân
            {{ stats.retention_change >= 0 ? '+' : '' }}{{ stats.retention_change }}%
          </span>
        </div>
      </div>
      <router-link to="/nhanvien/hoi_vien_moi" class="btn-add-member">
        <i class="fas fa-plus-circle"></i> Thêm hội viên mới
      </router-link>
    </div>

    <!-- ===== Toolbar ===== -->
    <div class="toolbar">

      <!-- Quick Lookup -->
      <div class="toolbar-block">
        <span class="toolbar-label">TÌM KIẾM NHANH</span>
        <div class="lookup-bar">
          <input
            v-model="searchQ"
            type="text"
            placeholder="Tên, ID, hoặc SĐT..."
            class="lookup-input"
            @keyup.enter="doSearch"
          />
          <button class="btn-search" @click="doSearch">
            <i class="fas fa-search"></i> Tìm kiếm
          </button>
        </div>
      </div>

      <!-- Status Filter -->
      <div class="toolbar-block">
        <span class="toolbar-label">LỌC TRẠNG THÁI</span>
        <div class="status-filter">
          <button
            v-for="f in statusFilters"
            :key="f.key"
            class="status-btn"
            :class="{ active: activeStatus === f.key, [f.cls]: true }"
            @click="setStatus(f.key)"
          >{{ f.label }}</button>
        </div>
      </div>

      <!-- New Today -->
      <div class="new-today-card">
        <div class="new-today-label">MỚI HÔM NAY</div>
        <div class="new-today-val">+{{ stats.new_today }}</div>
        <div class="new-today-sub">
          <i class="fas fa-users"></i>
          {{ stats.expiring_soon }} sắp hết hạn (7 ngày)
        </div>
      </div>

    </div>

    <!-- ===== Loading / Error ===== -->
    <div v-if="loading" class="feedback-row">
      <div class="spinner"></div>
      <span>Đang tải dữ liệu...</span>
    </div>

    <div v-else-if="fetchError" class="feedback-row error-row">
      <i class="fas fa-exclamation-triangle"></i>
      <span>{{ fetchError }}</span>
      <button class="btn-retry" @click="loadAll">Thử lại</button>
    </div>

    <!-- ===== Table ===== -->
    <div v-else class="table-card">
      <table class="hv-table">
        <thead>
          <tr>
            <th class="th-member">HỘI VIÊN</th>
            <th>ID / SĐT</th>
            <th>GÓI TẬP</th>
            <th>HẾT HẠN</th>
            <th>CHECK-IN GẦN NHẤT</th>
            <th>TRẠNG THÁI</th>
            <th>THAO TÁC</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="m in members" :key="m.id">
            <td>
              <div class="member-cell">
                <img
                  :src="memberAvatar(m)"
                  class="member-avatar"
                  :alt="m.full_name"
                />
                <div class="member-info">
                  <div class="member-name">{{ m.full_name }}</div>
                  <div class="member-email">{{ m.email }}</div>
                </div>
              </div>
            </td>
            <td>
              <div class="member-id">#{{ m.card_number || m.e_number || m.id }}</div>
              <div class="member-phone">{{ m.phone || '—' }}</div>
            </td>
            <td>
              <span class="pkg-badge" :class="pkgClass(m.package)">
                {{ m.package || 'Chưa có gói' }}
              </span>
            </td>
            <td>
              <div class="expiry-date" :class="{ 'expiry-red': isExpired(m) }">
                {{ formatDate(m.end_date) }}
              </div>
              <div class="expiry-sub" :class="expirySubClass(m)">
                {{ m.expiry_label || (isExpired(m) ? 'Đã hết hạn' : '—') }}
              </div>
            </td>
            <td>
              <div class="checkin-time">{{ m.last_check_in_label || 'Chưa check-in' }}</div>
            </td>
            <td>
              <span class="status-badge" :class="statusClass(m.status)">
                {{ statusLabel(m.status) }}
              </span>
            </td>
            <td>
              <div class="action-btns">
                <button class="action-btn" title="Xem hồ sơ" @click="viewMember(m)">
                  <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn" title="Chỉnh sửa" @click="editMember(m)">
                  <i class="fas fa-pen"></i>
                </button>
                <button
                  class="action-btn danger"
                  :title="m.status === 'on_hold' ? 'Kích hoạt lại' : 'Khoá tài khoản'"
                  @click="toggleHold(m)"
                  :disabled="actionLoading === m.id"
                >
                  <i :class="m.status === 'on_hold' ? 'fas fa-check-circle' : 'fas fa-ban'"></i>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="members.length === 0">
            <td colspan="7" class="empty-row">
              <i class="fas fa-search"></i> Không tìm thấy hội viên phù hợp.
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination inside card -->
      <div class="pagination-bar">
        <span class="pagination-info">
          Hiển thị {{ pagination.from || 0 }} đến {{ pagination.to || 0 }}
          trong tổng {{ (pagination.total || 0).toLocaleString() }} hội viên
        </span>
        <div class="pagination-controls">
          <button class="page-btn" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
            <i class="fas fa-chevron-left"></i>
          </button>
          <button
            v-for="p in visiblePages"
            :key="p"
            class="page-btn"
            :class="{ active: currentPage === p }"
            @click="changePage(p)"
          >{{ p }}</button>
          <button class="page-btn" :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- ===== Toast ===== -->
    <transition name="toast-fade">
      <div v-if="toast.show" class="toast" :class="toast.type">
        <i :class="toast.type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'"></i>
        {{ toast.message }}
      </div>
    </transition>

  </div>
</template>

<script>
import { memberApi } from '@/services/memberApi'
import { memberStatusLabel, memberStatusClass } from '@/utils/i18n'

const AVATAR_COLORS = ['e67e22','6366f1','ec4899','14b8a6','8b5cf6','0ea5e9','d97706','16a34a','f43f5e','a855f7','0284c7','db2777']

export default {
  name: 'QuanLyHoiVien',
  data() {
    return {
      // ---- Data từ API ----
      members: [],
      stats: {
        total_active: 0,
        new_today: 0,
        expiring_soon: 0,
        total_members: 0,
        retention_change: null,
      },
      pagination: {
        total: 0,
        from: 0,
        to: 0,
        last_page: 1,
      },

      // ---- UI State ----
      loading: false,
      fetchError: null,
      actionLoading: null,

      // ---- Filters ----
      searchQ: '',
      activeStatus: 'all',
      currentPage: 1,
      perPage: 10,

      statusFilters: [
        { key: 'all',     label: 'Tất cả',       cls: 'sf-all'     },
        { key: 'active',  label: 'Hoạt động',    cls: 'sf-active'  },
        { key: 'expired', label: 'Hết hạn',      cls: 'sf-expired' },
        { key: 'on_hold', label: 'Tạm dừng',     cls: 'sf-onhold'  },
      ],

      // ---- Toast ----
      toast: { show: false, message: '', type: 'success' },
    }
  },

  computed: {
    totalPages() {
      return this.pagination.last_page || 1
    },
    visiblePages() {
      const pages = []
      const start = Math.max(1, this.currentPage - 2)
      const end   = Math.min(this.totalPages, start + 4)
      for (let i = start; i <= end; i++) pages.push(i)
      return pages
    },
  },

  mounted() {
    this.loadAll()
  },

  methods: {
    /* ──────── DATA LOADING ──────── */
    async loadAll() {
      this.loading = true
      this.fetchError = null
      try {
        const [listRes, statsRes] = await Promise.all([
          memberApi.getAll({
            search:   this.searchQ.trim() || undefined,
            status:   this.activeStatus !== 'all' ? this.activeStatus : undefined,
            per_page: this.perPage,
            page:     this.currentPage,
          }),
          memberApi.getStats(),
        ])

        // Danh sách (Laravel paginator format)
        const pg = listRes.data
        this.members = pg.data ?? []
        this.pagination = {
          total:     pg.total     ?? 0,
          from:      pg.from      ?? 0,
          to:        pg.to        ?? 0,
          last_page: pg.last_page ?? 1,
        }

        // Stats
        const s = statsRes.data
        this.stats = {
          total_active:     s.total_active     ?? 0,
          new_today:        s.new_today        ?? 0,
          expiring_soon:    s.expiring_soon    ?? 0,
          total_members:    s.total_members    ?? 0,
          retention_change: s.retention_change ?? null,
        }
      } catch (err) {
        console.error(err)
        this.fetchError = err?.response?.data?.message || 'Không thể kết nối đến server. Vui lòng kiểm tra backend.'
      } finally {
        this.loading = false
      }
    },

    /* ──────── SEARCH / FILTER ──────── */
    doSearch() {
      this.currentPage = 1
      this.loadAll()
    },
    setStatus(key) {
      this.activeStatus = key
      this.currentPage = 1
      this.loadAll()
    },
    changePage(page) {
      if (page < 1 || page > this.totalPages) return
      this.currentPage = page
      this.loadAll()
    },

    /* ──────── ACTIONS ──────── */
    viewMember(m) {
      // TODO: thêm route /nhanvien/hoivien/:id vào router khi có trang chi tiết
      this.showToast(`Chi tiết hội viên: ${m.full_name} (ID: ${m.id})`, 'success')
    },
    editMember(m) {
      // TODO: thêm route /nhanvien/hoivien/:id/edit vào router khi có trang chỉnh sửa
      this.showToast(`Chỉnh sửa: ${m.full_name} — chức năng đang phát triển.`, 'success')
    },
    async toggleHold(m) {
      const newStatus = m.status === 'on_hold' ? 'active' : 'on_hold'
      const label     = newStatus === 'on_hold' ? 'khoá' : 'kích hoạt lại'
      if (!confirm(`Bạn có muốn ${label} tài khoản của ${m.full_name}?`)) return

      this.actionLoading = m.id
      try {
        await memberApi.updateStatus(m.id, newStatus)
        this.showToast(`Đã ${label} tài khoản thành công.`, 'success')
        await this.loadAll()
      } catch (err) {
        this.showToast(err?.response?.data?.message || 'Có lỗi xảy ra.', 'error')
      } finally {
        this.actionLoading = null
      }
    },

    /* ──────── UI HELPERS ──────── */
    memberAvatar(m) {
      if (m.profile_picture) return m.profile_picture
      if (m.avatar)          return m.avatar
      const name = encodeURIComponent(m.full_name || m.name || '?')
      const colorIdx = (m.id || 0) % AVATAR_COLORS.length
      const bg = AVATAR_COLORS[colorIdx]
      return `https://ui-avatars.com/api/?name=${name}&background=${bg}&color=fff&bold=true&size=80`
    },

    pkgClass(pkg) {
      if (!pkg) return 'pkg-standard'
      const lower = pkg.toLowerCase()
      if (lower.includes('elite') || lower.includes('platinum')) return 'pkg-elite'
      if (lower.includes('personal') || lower.includes('vip'))    return 'pkg-personal'
      return 'pkg-standard'
    },

    isExpired(m) {
      return m.status === 'expired' || (m.end_date && new Date(m.end_date) < new Date())
    },

    expirySubClass(m) {
      const label = (m.expiry_label || '').toLowerCase()
      if (m.status === 'expired' || label.includes('ago')) return 'sub-expired'
      if (label.includes('day'))    return 'sub-warn'
      if (m.status === 'on_hold')   return 'sub-frozen'
      return 'sub-ok'
    },

    formatDate(dateStr) {
      if (!dateStr) return '—'
      const d = new Date(dateStr)
      return d.toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' })
    },

    statusClass(status) {
      return memberStatusClass(status)
    },

    statusLabel(status) {
      return memberStatusLabel(status)
    },

    showToast(message, type = 'success') {
      this.toast = { show: true, message, type }
      setTimeout(() => { this.toast.show = false }, 3000)
    },
  },

  watch: {
    searchQ(val) {
      if (val === '') {
        this.currentPage = 1
        this.loadAll()
      }
    },
  },
}
</script>

<style scoped>

/* ===== BASE ===== */
.qlhv-page {
  font-family: 'Inter', 'Segoe UI', sans-serif;
  padding: 28px 28px 40px;
}

/* ===== PAGE HEADER ===== */
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 22px;
  flex-wrap: wrap;
  gap: 14px;
}
.page-title {
  font-size: 1.7rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 10px;
  letter-spacing: -0.3px;
}
.header-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.badge-members {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #2d7a3a;
  color: #fff;
  font-size: 0.76rem;
  font-weight: 600;
  padding: 5px 13px;
  border-radius: 20px;
}
.badge-ai {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  color: #2d7a3a;
  border: 1.5px solid #2d7a3a;
  font-size: 0.76rem;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
}
.btn-add-member {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #1a4d24;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 12px 22px;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s;
  white-space: nowrap;
}
.btn-add-member:hover {
  background: #133a1b;
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(26, 77, 36, 0.35);
}

/* ===== TOOLBAR ===== */
.toolbar {
  display: flex;
  align-items: flex-end;
  gap: 24px;
  background: #fff;
  border-radius: 14px;
  padding: 16px 20px;
  margin-bottom: 14px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);
  flex-wrap: wrap;
}
.toolbar-block {
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.toolbar-label {
  font-size: 0.62rem;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 1.2px;
  text-transform: uppercase;
}

/* Lookup */
.lookup-bar {
  display: flex;
  border: 1.5px solid #e2e8f0;
  border-radius: 9px;
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.lookup-bar:focus-within {
  border-color: #2d7a3a;
  box-shadow: 0 0 0 3px rgba(45, 122, 58, 0.08);
}
.lookup-input {
  border: none;
  outline: none;
  padding: 8px 13px;
  font-size: 0.84rem;
  color: #334155;
  width: 210px;
  background: #f8fafc;
  font-family: inherit;
}
.lookup-input::placeholder { color: #94a3b8; }
.btn-search {
  background: #2d7a3a;
  color: #fff;
  border: none;
  padding: 8px 16px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 5px;
}
.btn-search:hover { background: #245f2e; }

/* Status filter */
.status-filter {
  display: flex;
  gap: 5px;
}
.status-btn {
  padding: 6px 15px;
  border-radius: 20px;
  border: 1.5px solid #e2e8f0;
  background: #fff;
  color: #64748b;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.18s;
}
.status-btn:hover { border-color: #cbd5e1; background: #f8fafc; }
.status-btn.sf-all.active     { background: #2d7a3a; border-color: #2d7a3a; color: #fff; }
.status-btn.sf-active.active  { background: #dcfce7; border-color: #16a34a; color: #16a34a; }
.status-btn.sf-expired.active { background: #fee2e2; border-color: #ef4444; color: #dc2626; }
.status-btn.sf-onhold.active  { background: #fef3c7; border-color: #f59e0b; color: #b45309; }

/* New today */
.new-today-card {
  margin-left: auto;
  background: linear-gradient(135deg, #f0fdf4, #dcfce7);
  border: 1.5px solid #bbf7d0;
  border-radius: 12px;
  padding: 13px 20px;
  min-width: 155px;
}
.new-today-label {
  font-size: 0.62rem;
  font-weight: 700;
  color: #16a34a;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  margin-bottom: 3px;
}
.new-today-val {
  font-size: 1.9rem;
  font-weight: 800;
  color: #0f172a;
  line-height: 1;
  margin-bottom: 4px;
}
.new-today-sub {
  font-size: 0.72rem;
  color: #64748b;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* ===== LOADING / ERROR ===== */
.feedback-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 60px 24px;
  color: #64748b;
  font-size: 0.92rem;
}
.error-row { color: #dc2626; }
.btn-retry {
  background: #fee2e2;
  color: #dc2626;
  border: 1px solid #fca5a5;
  border-radius: 6px;
  padding: 5px 14px;
  font-size: 0.82rem;
  cursor: pointer;
  font-family: inherit;
}
.btn-retry:hover { background: #fecaca; }

/* Spinner */
.spinner {
  width: 22px;
  height: 22px;
  border: 3px solid #e2e8f0;
  border-top-color: #2d7a3a;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ===== TABLE CARD ===== */
.table-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.hv-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.845rem;
}
.hv-table th {
  padding: 12px 16px;
  text-align: left;
  font-size: 0.69rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  background: #fff;
  border-bottom: 1px solid #f1f5f9;
  white-space: nowrap;
}
.hv-table td {
  padding: 16px;
  border-bottom: 1px solid #f8fafc;
  vertical-align: middle;
}
.hv-table tr:last-child td { border-bottom: none; }
.hv-table tbody tr:hover td { background: #fafbfc; }

/* Member cell */
.member-cell {
  display: flex;
  align-items: center;
  gap: 11px;
}
.member-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.member-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 2px;
}
.member-email {
  font-size: 0.72rem;
  color: #94a3b8;
}

/* ID / Phone */
.member-id {
  font-size: 0.8rem;
  font-family: 'Courier New', monospace;
  color: #334155;
  font-weight: 700;
  margin-bottom: 2px;
}
.member-phone {
  font-size: 0.73rem;
  color: #94a3b8;
}

/* Package badge */
.pkg-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 700;
  white-space: nowrap;
  text-align: center;
}
.pkg-elite    { background: #0f172a; color: #fbbf24; }
.pkg-personal { background: #ede9fe; color: #6d28d9; }
.pkg-standard { background: #dbeafe; color: #1d4ed8; }

/* Expiry */
.expiry-date    { font-size: 0.83rem; color: #334155; font-weight: 500; margin-bottom: 2px; }
.expiry-red     { color: #dc2626; }
.expiry-sub     { font-size: 0.72rem; }
.sub-ok         { color: #16a34a; }
.sub-expired    { color: #dc2626; font-weight: 600; }
.sub-warn       { color: #d97706; font-weight: 600; }
.sub-frozen     { color: #64748b; }

/* Check-in */
.checkin-time   { font-size: 0.83rem; color: #334155; font-weight: 500; margin-bottom: 2px; }

/* Status badge */
.status-badge {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}
.st-active  { background: #dcfce7; color: #16a34a; }
.st-expired { background: #fee2e2; color: #dc2626; }
.st-onhold  { background: #fef3c7; color: #b45309; }
.st-banned  { background: #f1f5f9; color: #475569; }

/* Actions */
.action-btns { display: flex; gap: 6px; }
.action-btn {
  width: 30px;
  height: 30px;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  color: #475569;
  font-size: 0.72rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}
.action-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.action-btn:hover:not(:disabled)        { background: #f0fdf4; border-color: #2d7a3a; color: #2d7a3a; }
.action-btn.danger:hover:not(:disabled) { background: #fee2e2; border-color: #fca5a5; color: #dc2626; }

/* Empty */
.empty-row {
  text-align: center;
  padding: 48px !important;
  color: #94a3b8;
  font-size: 0.875rem;
}
.empty-row i { margin-right: 8px; }

/* ===== PAGINATION ===== */
.pagination-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-top: 1px solid #f1f5f9;
  flex-wrap: wrap;
  gap: 10px;
}
.pagination-info {
  font-size: 0.8rem;
  color: #64748b;
}
.pagination-controls {
  display: flex;
  gap: 4px;
}
.page-btn {
  min-width: 34px;
  height: 34px;
  padding: 0 6px;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  color: #475569;
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  transition: all 0.18s;
}
.page-btn:hover:not(:disabled) {
  border-color: #2d7a3a;
  color: #2d7a3a;
  background: #f0fdf4;
}
.page-btn.active {
  background: #2d7a3a;
  border-color: #2d7a3a;
  color: #fff;
  font-weight: 700;
}
.page-btn:disabled { opacity: 0.35; cursor: not-allowed; }

/* ===== TOAST ===== */
.toast {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 22px;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  box-shadow: 0 6px 24px rgba(0,0,0,0.15);
}
.toast.success { background: #dcfce7; color: #16a34a; border: 1px solid #bbf7d0; }
.toast.error   { background: #fee2e2; color: #dc2626; border: 1px solid #fca5a5; }

.toast-fade-enter-active,
.toast-fade-leave-active { transition: all 0.3s ease; }
.toast-fade-enter-from,
.toast-fade-leave-to    { opacity: 0; transform: translateY(12px); }

/* ===== RESPONSIVE ===== */
@media (max-width: 900px) {
  .qlhv-page      { padding: 16px; }
  .toolbar        { flex-direction: column; align-items: stretch; }
  .new-today-card { margin-left: 0; }
  .hv-table       { font-size: 0.78rem; }
}

</style>
