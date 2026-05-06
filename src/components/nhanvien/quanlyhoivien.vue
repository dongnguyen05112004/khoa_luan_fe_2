<template>
  <div class="qlhv-page">

    <!-- ===== Page Header ===== -->
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-title">Quản lý hội viên</h1>
        <div class="header-badges">
          <span class="badge-members">
            <i class="fas fa-users"></i> {{ (stats.total_active || 0).toLocaleString() }} Active Members
          </span>
          <span class="badge-ai" v-if="stats.retention_change !== null">
            <i class="fas fa-robot"></i>
            AI INSIGHT: Retention
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
        <span class="toolbar-label">QUICK LOOKUP</span>
        <div class="lookup-bar">
          <input
            v-model="searchQ"
            type="text"
            placeholder="Name, ID, or Phone..."
            class="lookup-input"
            @keyup.enter="doSearch"
          />
          <button class="btn-search" @click="doSearch">
            <i class="fas fa-search"></i> Search
          </button>
        </div>
      </div>

      <!-- Status Filter -->
      <div class="toolbar-block">
        <span class="toolbar-label">STATUS FILTER</span>
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
        <div class="new-today-label">NEW TODAY</div>
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
            <th class="th-member">MEMBER</th>
            <th>ID / PHONE</th>
            <th>PACKAGE</th>
            <th>EXPIRY</th>
            <th>LAST CHECK-IN</th>
            <th>STATUS</th>
            <th>ACTIONS</th>
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
                {{ m.expiry_label || (isExpired(m) ? 'Expired' : '—') }}
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
          Showing {{ pagination.from || 0 }} to {{ pagination.to || 0 }}
          of {{ (pagination.total || 0).toLocaleString() }} members
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

  <!-- ===== MODAL XEM CHI TIẾT ===== -->
  <transition name="modal-fade">
    <div v-if="viewModal.show" class="modal-overlay" @click.self="closeView">
      <div class="modal-box modal-view">
        <div class="modal-header">
          <h2 class="modal-title"><i class="fas fa-id-card"></i> Chi tiết hội viên</h2>
          <button class="modal-close" @click="closeView"><i class="fas fa-times"></i></button>
        </div>
        <div v-if="viewModal.loading" class="modal-loading"><div class="spinner"></div> Đang tải...</div>
        <div v-else-if="viewModal.data" class="modal-body">
          <div class="view-hero">
            <img :src="memberAvatar(viewModal.data)" class="view-avatar" />
            <div class="view-hero-info">
              <div class="view-name">{{ viewModal.data.full_name }}</div>
              <div class="view-email">{{ viewModal.data.email }}</div>
              <span class="status-badge" :class="statusClass(viewModal.data.status)">{{ statusLabel(viewModal.data.status) }}</span>
            </div>
          </div>
          <div class="view-grid">
            <div class="view-item"><span class="vl">Mã thẻ</span><span class="vv">#{{ viewModal.data.card_number || viewModal.data.id }}</span></div>
            <div class="view-item"><span class="vl">Điện thoại</span><span class="vv">{{ viewModal.data.phone || '—' }}</span></div>
            <div class="view-item"><span class="vl">Giới tính</span><span class="vv">{{ viewModal.data.gender || '—' }}</span></div>
            <div class="view-item"><span class="vl">Ngày sinh</span><span class="vv">{{ formatDate(viewModal.data.date_of_birth) }}</span></div>
            <div class="view-item"><span class="vl">Ngày tham gia</span><span class="vv">{{ formatDate(viewModal.data.join_date) }}</span></div>
            <div class="view-item"><span class="vl">Gói tập</span><span class="vv">{{ viewModal.data.package || 'Chưa có' }}</span></div>
            <div class="view-item"><span class="vl">Hết hạn</span><span class="vv">{{ formatDate(viewModal.data.end_date) }}</span></div>
            <div class="view-item"><span class="vl">Check-in cuối</span><span class="vv">{{ viewModal.data.last_check_in_label || 'Chưa check-in' }}</span></div>
            <div class="view-item"><span class="vl">Liên hệ khẩn cấp</span><span class="vv">{{ viewModal.data.emergency_contact || '—' }}</span></div>
            <div class="view-item"><span class="vl">Loại hội viên</span><span class="vv">{{ viewModal.data.membership_type || '—' }}</span></div>
          </div>
          <div v-if="viewModal.data.health_notes" class="view-notes">
            <span class="vl">Ghi chú sức khỏe</span>
            <p class="vv">{{ viewModal.data.health_notes }}</p>
          </div>
          <div v-if="viewModal.data.subscriptions && viewModal.data.subscriptions.length" class="view-section">
            <div class="view-section-title">Lịch sử gói tập</div>
            <div v-for="sub in viewModal.data.subscriptions" :key="sub.id" class="sub-item">
              <span class="sub-plan">{{ sub.plan?.plan_name || '—' }}</span>
              <span class="sub-dates">{{ formatDate(sub.start_date) }} → {{ formatDate(sub.end_date) }}</span>
              <span class="status-badge" :class="sub.status === 'active' ? 'st-active' : 'st-expired'">{{ sub.status }}</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="closeView">Đóng</button>
          <button class="btn-primary" @click="openEditFromView"><i class="fas fa-pen"></i> Chỉnh sửa</button>
        </div>
      </div>
    </div>
  </transition>

  <!-- ===== MODAL CHỈNH SỬA ===== -->
  <transition name="modal-fade">
    <div v-if="editModal.show" class="modal-overlay" @click.self="closeEdit">
      <div class="modal-box modal-edit">
        <div class="modal-header">
          <h2 class="modal-title"><i class="fas fa-pen"></i> Chỉnh sửa hội viên</h2>
          <button class="modal-close" @click="closeEdit"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
          <div class="edit-grid">
            <div class="form-group">
              <label>Họ tên đầy đủ</label>
              <input v-model="editForm.full_name" type="text" class="form-input" />
            </div>
            <div class="form-group">
              <label>Email</label>
              <input v-model="editForm.email" type="email" class="form-input" />
            </div>
            <div class="form-group">
              <label>Số điện thoại</label>
              <input v-model="editForm.phone" type="text" class="form-input" />
            </div>
            <div class="form-group">
              <label>Giới tính</label>
              <select v-model="editForm.gender" class="form-input">
                <option value="">— Chọn —</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>
            <div class="form-group">
              <label>Ngày sinh</label>
              <input v-model="editForm.date_of_birth" type="date" class="form-input" />
            </div>
            <div class="form-group">
              <label>Mã thẻ</label>
              <input v-model="editForm.card_number" type="text" class="form-input" />
            </div>
            <div class="form-group">
              <label>Liên hệ khẩn cấp</label>
              <input v-model="editForm.emergency_contact" type="text" class="form-input" />
            </div>
            <div class="form-group">
              <label>Loại hội viên</label>
              <input v-model="editForm.membership_type" type="text" class="form-input" />
            </div>
          </div>
          <div class="form-group full-width">
            <label>Ghi chú sức khỏe</label>
            <textarea v-model="editForm.health_notes" class="form-input" rows="3"></textarea>
          </div>
          <p v-if="editModal.error" class="edit-error"><i class="fas fa-exclamation-circle"></i> {{ editModal.error }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="closeEdit">Hủy</button>
          <button class="btn-primary" @click="saveEdit" :disabled="editModal.saving">
            <i :class="editModal.saving ? 'fas fa-spinner fa-spin' : 'fas fa-save'"></i>
            {{ editModal.saving ? 'Đang lưu...' : 'Lưu thay đổi' }}
          </button>
        </div>
      </div>
    </div>
  </transition>

</template>

<script>
import { memberApi } from '@/services/memberApi'

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

      // ---- Modals ----
      viewModal: { show: false, loading: false, data: null },
      editModal: { show: false, saving: false, error: null, memberId: null },
      editForm: {
        full_name: '', email: '', phone: '', gender: '',
        date_of_birth: '', card_number: '',
        emergency_contact: '', membership_type: '', health_notes: '',
      },

      // ---- Filters ----
      searchQ: '',
      activeStatus: 'all',
      currentPage: 1,
      perPage: 10,

      statusFilters: [
        { key: 'all',     label: 'All',     cls: 'sf-all'     },
        { key: 'active',  label: 'Active',  cls: 'sf-active'  },
        { key: 'expired', label: 'Expired', cls: 'sf-expired' },
        { key: 'on_hold', label: 'On-hold', cls: 'sf-onhold'  },
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
    async viewMember(m) {
      this.viewModal = { show: true, loading: true, data: null }
      try {
        const res = await memberApi.getOne(m.id)
        this.viewModal.data = res.data
        this.viewModal.loading = false
      } catch (err) {
        this.viewModal.show = false
        this.showToast(err?.response?.data?.message || 'Không thể tải chi tiết hội viên.', 'error')
      }
    },
    closeView() {
      this.viewModal = { show: false, loading: false, data: null }
    },
    openEditFromView() {
      const member = this.viewModal.data
      this.closeView()
      if (member) this.editMember(member)
    },
    editMember(m) {
      this.editForm = {
        full_name:         m.full_name || '',
        email:             m.email || '',
        phone:             m.phone || '',
        gender:            m.gender || '',
        date_of_birth:     m.date_of_birth || '',
        card_number:       m.card_number || '',
        emergency_contact: m.emergency_contact || '',
        membership_type:   m.membership_type || '',
        health_notes:      m.health_notes || '',
      }
      this.editModal = { show: true, saving: false, error: null, memberId: m.id }
    },
    closeEdit() {
      this.editModal = { show: false, saving: false, error: null, memberId: null }
    },
    async saveEdit() {
      this.editModal.saving = true
      this.editModal.error = null
      try {
        await memberApi.update(this.editModal.memberId, this.editForm)
        this.closeEdit()
        this.showToast('Cập nhật hội viên thành công!', 'success')
        await this.loadAll()
      } catch (err) {
        const msg = err?.response?.data?.message
          || Object.values(err?.response?.data?.errors || {})[0]?.[0]
          || 'Lưu thất bại. Vui lòng kiểm tra lại.'
        this.editModal.error = msg
        this.editModal.saving = false
      }
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
      return {
        active:  'st-active',
        expired: 'st-expired',
        on_hold: 'st-onhold',
        banned:  'st-banned',
      }[status] || 'st-expired'
    },

    statusLabel(status) {
      return {
        active:  'ACTIVE',
        expired: 'EXPIRED',
        on_hold: 'ON-HOLD',
        banned:  'BANNED',
      }[status] || status?.toUpperCase() || '—'
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

/* ===== MODAL ===== */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(15,23,42,0.55);
  backdrop-filter: blur(3px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.modal-box {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  width: 100%;
  overflow: hidden;
}
.modal-view { max-width: 620px; }
.modal-edit { max-width: 700px; }
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 1px solid #f1f5f9;
}
.modal-title { font-size: 1.1rem; font-weight: 700; color: #0f172a; margin: 0; display: flex; align-items: center; gap: 8px; }
.modal-title i { color: #2d7a3a; }
.modal-close {
  width: 32px; height: 32px;
  border: none; border-radius: 8px;
  background: #f1f5f9; color: #64748b;
  cursor: pointer; font-size: 0.9rem;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.15s;
}
.modal-close:hover { background: #fee2e2; color: #dc2626; }
.modal-loading {
  display: flex; align-items: center; gap: 12px;
  padding: 48px 24px; justify-content: center; color: #64748b;
}
.modal-body {
  padding: 20px 24px;
  overflow-y: auto;
  flex: 1;
}
.modal-footer {
  display: flex; justify-content: flex-end; gap: 10px;
  padding: 16px 24px;
  border-top: 1px solid #f1f5f9;
}
/* View modal */
.view-hero {
  display: flex; align-items: center; gap: 16px;
  margin-bottom: 20px;
  padding: 16px;
  background: linear-gradient(135deg,#f0fdf4,#dcfce7);
  border-radius: 12px;
  border: 1px solid #bbf7d0;
}
.view-avatar { width: 64px; height: 64px; border-radius: 50%; object-fit: cover; box-shadow: 0 2px 10px rgba(0,0,0,0.12); }
.view-name { font-size: 1.1rem; font-weight: 700; color: #0f172a; margin-bottom: 2px; }
.view-email { font-size: 0.8rem; color: #64748b; margin-bottom: 6px; }
.view-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 16px;
}
.view-item {
  background: #f8fafc;
  border-radius: 8px;
  padding: 10px 12px;
  display: flex; flex-direction: column; gap: 2px;
}
.vl { font-size: 0.65rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.8px; }
.vv { font-size: 0.85rem; font-weight: 600; color: #1e293b; }
.view-notes { background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 12px 14px; margin-bottom: 14px; }
.view-section { margin-top: 16px; }
.view-section-title { font-size: 0.72rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
.sub-item {
  display: flex; align-items: center; gap: 10px; justify-content: space-between;
  padding: 9px 12px;
  background: #f8fafc;
  border-radius: 8px;
  margin-bottom: 6px;
  flex-wrap: wrap;
}
.sub-plan { font-weight: 600; font-size: 0.84rem; color: #1e293b; }
.sub-dates { font-size: 0.75rem; color: #64748b; }
/* Edit modal */
.edit-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 14px;
}
.form-group { display: flex; flex-direction: column; gap: 5px; }
.form-group.full-width { grid-column: 1/-1; }
.form-group label { font-size: 0.75rem; font-weight: 600; color: #475569; }
.form-input {
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 0.85rem;
  color: #1e293b;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
  background: #f8fafc;
  width: 100%;
  box-sizing: border-box;
}
.form-input:focus { border-color: #2d7a3a; background: #fff; box-shadow: 0 0 0 3px rgba(45,122,58,0.08); }
textarea.form-input { resize: vertical; min-height: 80px; }
.edit-error { color: #dc2626; font-size: 0.83rem; margin-top: 6px; display: flex; align-items: center; gap: 6px; }
/* Buttons */
.btn-primary {
  background: #1a4d24; color: #fff;
  border: none; border-radius: 9px;
  padding: 10px 22px;
  font-size: 0.86rem; font-weight: 600;
  cursor: pointer; font-family: inherit;
  display: flex; align-items: center; gap: 6px;
  transition: all 0.2s;
}
.btn-primary:hover:not(:disabled) { background: #133a1b; }
.btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }
.btn-secondary {
  background: #f1f5f9; color: #475569;
  border: 1.5px solid #e2e8f0; border-radius: 9px;
  padding: 10px 20px;
  font-size: 0.86rem; font-weight: 600;
  cursor: pointer; font-family: inherit;
  transition: all 0.2s;
}
.btn-secondary:hover { background: #e2e8f0; }
/* Modal transition */
.modal-fade-enter-active, .modal-fade-leave-active { transition: all 0.25s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-from .modal-box, .modal-fade-leave-to .modal-box { transform: scale(0.95) translateY(10px); }

</style>
