<template>
  <div class="nhatky-wrapper">

    <!-- PAGE HEADER -->
    <div class="d-flex align-items-start justify-content-between mb-4 flex-wrap gap-2">
      <div>
        <h4 class="page-title mb-1">
          <i class="fas fa-shield-alt me-2 text-success"></i>
          Trung tâm Tra cứu Nhật ký Hệ thống
        </h4>
        <p class="page-desc mb-0">Theo dõi và giám sát mọi biến động dữ liệu thời gian thực</p>
      </div>
      <button class="btn btn-export" @click="exportCSV">
        <i class="fas fa-download"></i> Xuất báo cáo (CSV/PDF)
      </button>
    </div>

    <!-- STAT CARDS -->
    <div class="row g-3 mb-4">
      <!-- Total Logs Today -->
      <div class="col-12 col-sm-4">
        <div class="stat-card stat-card--blue">
          <div class="stat-card__label">TOTAL LOGS TODAY</div>
          <div class="stat-card__value">
            <span v-if="loading"><i class="fas fa-spinner fa-spin" style="font-size:1.2rem"></i></span>
            <span v-else>{{ totalToday.toLocaleString() }}</span>
            <span class="stat-badge stat-badge--up">Hôm nay<i class="fas fa-calendar-day ms-1"></i></span>
          </div>
        </div>
      </div>

      <!-- High Severity Changes -->
      <div class="col-12 col-sm-4">
        <div class="stat-card stat-card--red">
          <div class="stat-card__label">HIGH SEVERITY CHANGES</div>
          <div class="stat-card__value">
            <span v-if="loading"><i class="fas fa-spinner fa-spin" style="font-size:1.2rem"></i></span>
            <span v-else>{{ highSeverity }}</span>
            <span class="stat-badge stat-badge--warn">Attention !</span>
          </div>
        </div>
      </div>

      <!-- Last Admin Action -->
      <div class="col-12 col-sm-4">
        <div class="stat-card stat-card--plain">
          <div class="stat-card__label">LAST ADMIN ACTION</div>
          <div class="d-flex align-items-center gap-2 mt-1">
            <div class="last-action-avatar">
              <i class="fas fa-user-shield"></i>
            </div>
            <div>
              <div class="last-action-name">{{ lastAction.action }}</div>
              <div class="last-action-time">{{ lastAction.time }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- FILTER BAR -->
    <div class="filter-bar mb-3">
      <!-- Date Range -->
      <div class="filter-item filter-item--date">
        <i class="fas fa-calendar-alt text-secondary me-1"></i>
        <input type="date" v-model="dateFrom" class="date-input" />
        <span class="mx-1 text-secondary">-</span>
        <input type="date" v-model="dateTo" class="date-input" />
      </div>

      <!-- Search Admin -->
      <div class="filter-item filter-item--search">
        <i class="fas fa-user-tie text-secondary me-1"></i>
        <input
          type="text"
          v-model="search"
          placeholder="Tìm tên quản trị viên..."
          class="filter-text-input"
        />
      </div>

      <!-- Category -->
      <div class="filter-item">
        <select v-model="filterCategory" class="filter-select">
          <option value="">Tất cả danh mục</option>
          <option value="USER_LOGIN">Đăng nhập hệ thống</option>
          <option value="VIEW_PROFILE">Xem hồ sơ hiển thị</option>
          <option value="CHECKIN_MANUAL">Điểm danh thủ công</option>
          <option value="UPDATE_PROFILE">Cập nhật hồ sơ</option>
          <option value="BOOK_PT">Đặt lịch PT</option>
          <option value="CANCEL_CLASS">Hủy lớp học</option>
          <option value="REGISTER_CLASS">Đăng ký lớp học</option>
          <option value="UPDATE_MEMBER">Cập nhật thành viên</option>
          <option value="CREATE_PLAN">Tạo gói tập mới</option>
          <option value="DELETE_CAMPAIGN">Xóa chiến dịch</option>
          <option value="CONFIG_SYSTEM">Cấu hình hệ thống</option>
          <option value="AUTO_BACKUP">Sao lưu tự động</option>
        </select>
      </div>

      <!-- Filter Button -->
      <button class="btn btn-filter" @click="applyFilter">
        <i class="fas fa-filter me-1"></i> Lọc dữ liệu
      </button>
    </div>

    <!-- DATA TABLE -->
    <div class="table-card">
      <div class="table-responsive">
        <table class="table nk-table mb-0">
          <thead>
            <tr>
              <th>TIMESTAMP</th>
              <th>ACTOR</th>
              <th>ACTION</th>
              <th>TARGET OBJECT</th>
              <th>IP ADDRESS</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <!-- Loading state -->
            <tr v-if="loading">
              <td colspan="6" class="text-center py-5 text-muted">
                <i class="fas fa-spinner fa-spin fa-2x mb-2 d-block text-success"></i>
                Đang tải dữ liệu nhật ký...
              </td>
            </tr>
            <!-- Error state -->
            <tr v-else-if="error">
              <td colspan="6" class="text-center py-5">
                <i class="fas fa-exclamation-triangle fa-2x mb-2 d-block text-danger"></i>
                <span class="text-danger">{{ error }}</span>
                <div class="mt-2">
                  <button class="btn btn-sm btn-outline-success" @click="fetchLogs">Thử lại</button>
                </div>
              </td>
            </tr>
            <!-- Empty state -->
            <tr v-else-if="paginatedLogs.length === 0">
              <td colspan="6" class="text-center py-4 text-muted">
                <i class="fas fa-search me-2"></i>Không tìm thấy kết quả phù hợp.
              </td>
            </tr>
            <tr v-else v-for="log in paginatedLogs" :key="log.id" class="log-row">
              <!-- Timestamp -->
              <td class="time-cell">{{ formatDateTime(log.created_at) }}</td>

              <!-- Actor -->
              <td>
                <div class="actor-cell">
                  <div class="actor-avatar" :style="{ background: avatarColor(actorName(log)) }">
                    {{ initials(actorName(log)) }}
                  </div>
                  <span class="actor-name">{{ actorName(log) }}</span>
                </div>
              </td>

              <!-- Action -->
              <td>
                <span class="action-badge" :class="actionClass(log.action)">
                  <i class="fas fa-circle me-1" style="font-size:7px; vertical-align:middle;"></i>
                  {{ log.action }}
                </span>
              </td>

              <!-- Old → New Values (Target Object column) -->
              <td class="target-cell" :title="log.new_values || ''">
                {{ truncate(log.new_values || log.old_values || '—') }}
              </td>

              <!-- IP Address -->
              <td class="ip-cell">{{ log.ip_address || '—' }}</td>

              <!-- Actions -->
              <td class="text-end">
                <button class="btn btn-sm btn-arrow me-1" @click="viewDetail(log)" title="Xem chi tiết">
                  <i class="fas fa-chevron-right"></i>
                </button>
                <button class="btn btn-sm btn-delete-log" @click="deleteLog(log)" title="Xóa nhật ký">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- PAGINATION -->
      <div class="pagination-bar d-flex align-items-center justify-content-between px-3 py-2">
        <span class="pagination-info">
          Hiện thị {{ meta.from || 0 }}-{{ meta.to || 0 }} trên {{ meta.total || 0 }} kết quả
        </span>
        <nav>
          <ul class="pagination mb-0">
            <li class="page-item" :class="{ disabled: currentPage === 1 || loading }">
              <button class="page-link" @click="goPage(currentPage - 1)">
                <i class="fas fa-chevron-left"></i>
              </button>
            </li>
            <li
              class="page-item"
              v-for="p in visiblePages"
              :key="p"
              :class="{ active: currentPage === p, disabled: p === '...' }"
            >
              <button class="page-link" @click="p !== '...' && goPage(p)">{{ p }}</button>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === lastPage || loading }">
              <button class="page-link" @click="goPage(currentPage + 1)">
                <i class="fas fa-chevron-right"></i>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- DETAIL MODAL -->
    <div class="modal fade" id="logDetailModal" tabindex="-1" ref="detailModal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content nk-modal">
          <div class="modal-header nk-modal__header">
            <h5 class="modal-title">
              <i class="fas fa-file-alt me-2"></i>Chi tiết Nhật ký
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body" v-if="selectedLog">
            <table class="table table-sm detail-table">
              <tbody>
                <tr><th>Timestamp</th><td>{{ formatDateTime(selectedLog.created_at) }}</td></tr>
                <tr><th>Actor</th><td>{{ actorName(selectedLog) }}</td></tr>
                <tr><th>User ID</th><td>{{ selectedLog.user_id || '—' }}</td></tr>
                <tr><th>Action</th><td>
                  <span class="action-badge" :class="actionClass(selectedLog.action)">
                    {{ selectedLog.action }}
                  </span>
                </td></tr>
                <tr><th>Giá trị cũ</th><td><pre class="detail-pre">{{ selectedLog.old_values || '—' }}</pre></td></tr>
                <tr><th>Giá trị mới</th><td><pre class="detail-pre">{{ selectedLog.new_values || '—' }}</pre></td></tr>
                <tr><th>IP Address</th><td>{{ selectedLog.ip_address || '—' }}</td></tr>
              </tbody>
            </table>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Đóng</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'NhatKy',

  data() {
    const today = new Date()
    const weekAgo = new Date(today)
    weekAgo.setDate(today.getDate() - 7)
    return {
      // Filter state được gửi lên API
      search: '',
      filterCategory: '',
      dateFrom: weekAgo.toISOString().slice(0, 10),
      dateTo: today.toISOString().slice(0, 10),

      // API data
      logs: [],
      loading: false,
      error: null,

      // Server-side pagination meta (thông qua kết quả từ Laravel)
      meta: { total: 0, from: 0, to: 0, last_page: 1 },
      currentPage: 1,
      perPage: 10,

      // Stats
      totalToday: 0,
      highSeverity: 0,
      lastAction: { action: '—', time: '—' },

      // Modal
      selectedLog: null,

      // Toast
      toast: { show: false, message: '', icon: '' },
    }
  },

  mounted() {
    this.fetchLogs()
  },

  computed: {
    // Vì Backend đã xử lý lọc & phân trang, nên ta dùng trực tiếp mảng logs
    paginatedLogs() {
      return this.logs
    },

    lastPage() {
      return this.meta.last_page || 1
    },

    visiblePages() {
      const pages = []
      const total = this.lastPage
      const cur = this.currentPage
      if (total <= 6) {
        for (let i = 1; i <= total; i++) pages.push(i)
      } else {
        pages.push(1)
        if (cur > 3) pages.push('...')
        for (let i = Math.max(2, cur - 1); i <= Math.min(total - 1, cur + 1); i++) pages.push(i)
        if (cur < total - 2) pages.push('...')
        pages.push(total)
      }
      return pages
    }
  },

  methods: {
    /* ── API Server-Side Filtering & Pagination ──── */
    async fetchLogs(resetPage = false) {
      if (resetPage) this.currentPage = 1

      this.loading = true
      this.error = null
      try {
        const token = localStorage.getItem('auth_token')
        
        // Cấu hình các params chuẩn gửi xuống Query String API
        const params = {
          page: this.currentPage,
          per_page: this.perPage,
          with_stats: 1 // Yêu cầu API đính kèm stats Today và High Severity
        }

        if (this.search) params.search = this.search.trim()
        if (this.filterCategory) params.action = this.filterCategory
        if (this.dateFrom) params.date_from = this.dateFrom
        if (this.dateTo) params.date_to = this.dateTo

        const { data } = await axios.get('/api/activity-logs', {
          params,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })

        // Cập nhật cấu trúc phân trang Laravel: { data: [], total, from, to, last_page }
        this.logs = Array.isArray(data.data) ? data.data : []
        
        this.meta = {
          total: data.total || 0,
          from: data.from || 0,
          to: data.to || 0,
          last_page: data.last_page || 1
        }

        // Cập nhật hệ thống stats
        if (data.stats) {
          this.totalToday = data.stats.total_today || 0
          this.highSeverity = data.stats.high_severity || 0
        }
        
        // Lưu giữ Action Server gần nhất dựa vào record đầu tiên
        if (this.logs.length && this.currentPage === 1 && !this.search && !this.filterCategory) {
          const first = this.logs[0]
          this.lastAction = {
            action: first.action || '—',
            time: this.timeAgo(first.created_at),
          }
        }
      } catch (err) {
        console.error('Lỗi tải nhật ký:', err)
        this.error = err.response?.data?.message || 'Không thể tải dữ liệu. Vui lòng thử lại.'
      } finally {
        this.loading = false
      }
    },

    async deleteLog(log) {
      if (!confirm(`Bạn có chắc muốn xóa nhật ký ID #${log.id} không?`)) return
      try {
        const token = localStorage.getItem('auth_token')
        await axios.delete(`/api/activity-logs/${log.id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        this.showToast('fas fa-trash', `Đã xóa nhật ký #${log.id}`)
        this.fetchLogs() // Re-fetch lại dữ liệu vì có thể cấu trúc pagination bị thay đổi
      } catch (err) {
        this.showToast('fas fa-times-circle', 'Xóa thất bại!')
      }
    },

    goPage(p) {
      if (p < 1 || p > this.lastPage || p === this.currentPage) return
      this.currentPage = p
      this.fetchLogs() // Click qua trang nào thì load trang đó từ BE
    },

    applyFilter() {
      // Khi nhấn "Lọc Dữ Liệu" -> Set lại page thành 1 và fetch
      this.fetchLogs(true)
    },

    /* ── Helpers ─────────────────────────────────── */
    actorName(log) {
      if (log.user && log.user.full_name) return log.user.full_name
      if (log.user && log.user.name) return log.user.name
      if (log.user_id) return `User #${log.user_id}`
      return 'Hệ thống'
    },

    formatDateTime(val) {
      if (!val) return '—'
      return new Date(val).toLocaleString('vi-VN', { hour12: false })
    },

    timeAgo(val) {
      if (!val) return '—'
      const diff = Math.floor((Date.now() - new Date(val)) / 1000)
      if (diff < 60)  return `${diff} giây trước`
      if (diff < 3600) return `${Math.floor(diff/60)} phút trước`
      if (diff < 86400) return `${Math.floor(diff/3600)} giờ trước`
      return `${Math.floor(diff/86400)} ngày trước`
    },

    truncate(str, len = 30) {
      if (!str) return '—'
      return str.length > len ? str.slice(0, len) + '…' : str
    },

    initials(name) {
      if (!name) return '?'
      return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    },

    avatarColor(name) {
      const colors = ['#3b82f6','#22c55e','#f97316','#8b5cf6','#ec4899','#14b8a6','#f59e0b']
      let hash = 0
      for (const c of (name || '')) hash = c.charCodeAt(0) + ((hash << 5) - hash)
      return colors[Math.abs(hash) % colors.length]
    },

    actionClass(action) {
      if (!action) return 'action--default'
      const a = action.toUpperCase()
      if (a.includes('UPDATE') || a.includes('EDIT'))   return 'action--update'
      if (a.includes('CREATE') || a.includes('INSERT')) return 'action--create'
      if (a.includes('BACKUP') || a.includes('EXPORT')) return 'action--backup'
      if (a.includes('DELETE') || a.includes('DESTROY'))return 'action--delete'
      if (a.includes('CONFIG') || a.includes('SETTING'))return 'action--config'
      return 'action--default'
    },

    viewDetail(log) {
      this.selectedLog = log
      const el = document.getElementById('logDetailModal')
      if (el && window.bootstrap) {
        const modal = window.bootstrap.Modal.getOrCreateInstance(el)
        modal.show()
      }
    },

    async exportCSV() {
      try {
        const token = localStorage.getItem('auth_token')
        
        // Cấu hình các params chuẩn nhưng với per_page lớn để lấy TẤT CẢ logs
        const params = {
          page: 1,
          per_page: 10000, 
        }

        if (this.search) params.search = this.search.trim()
        if (this.filterCategory) params.action = this.filterCategory
        if (this.dateFrom) params.date_from = this.dateFrom
        if (this.dateTo) params.date_to = this.dateTo

        // Hiện thông báo đang xuất
        this.toast = { show: true, icon: 'fas fa-spinner fa-spin', message: 'Đang tải toàn bộ dữ liệu...' }

        const { data } = await axios.get('/api/activity-logs', {
          params,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })

        const allLogs = Array.isArray(data.data) ? data.data : []

        if (!allLogs.length) {
          this.showToast('fas fa-info-circle', 'Không có dữ liệu để xuất!')
          return
        }
        
        const headers = ['ID', 'Timestamp', 'Actor', 'Action', 'Old Values', 'New Values', 'IP Address']
        
        const rows = allLogs.map(l => {
          // Khắc phục lỗi [object Object]: Ép dữ liệu JSON về lại dạng chuỗi
          const oldVal = (typeof l.old_values === 'object' && l.old_values !== null) 
                         ? JSON.stringify(l.old_values) : (l.old_values || '')
                         
          const newVal = (typeof l.new_values === 'object' && l.new_values !== null) 
                         ? JSON.stringify(l.new_values) : (l.new_values || '')
                         
          return [
            l.id,
            this.formatDateTime(l.created_at),
            this.actorName(l),
            l.action,
            oldVal,
            newVal,
            l.ip_address || '',
          ]
        })
        
        // Nối các cột bằng dấu chấm phẩy (;) để Excel không bị dồn một cột A như máy bạn
        const csvContent = [headers, ...rows]
          .map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(';'))
          .join('\n')
        
        // Thêm ký tự BOM (\uFEFF) ở đầu file để ép Excel phải đọc theo font UTF-8
        const BOM = '\uFEFF'
        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
        
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `nhat-ky-${new Date().toISOString().slice(0,10)}.csv`
        a.click()
        URL.revokeObjectURL(url)
        
        this.showToast('fas fa-check-circle', 'Đã xuất dữ liệu thành công!')
      } catch (err) {
        console.error('Lỗi xuất dữ liệu:', err)
        this.showToast('fas fa-times-circle', 'Lỗi tải dữ liệu. Không thể xuất!')
      }
    },

    showToast(icon, message) {
      this.toast = { show: true, icon, message }
      setTimeout(() => { this.toast.show = false }, 3000)
    },
  },
}
</script>

<style scoped>
/* ─── Layout ────────────────────────────────────────── */
.nhatky-wrapper {
  padding: 28px 24px;
  background: #f4f6fb;
  min-height: 100vh;
  font-family: 'Inter', 'Segoe UI', sans-serif;
}

/* ─── Header ─────────────────────────────────────────── */
.page-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}
.page-desc {
  font-size: 0.82rem;
  color: #64748b;
}

.btn-export {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #22c55e;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 9px 18px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
  white-space: nowrap;
  box-shadow: 0 2px 10px rgba(34,197,94,0.3);
}
.btn-export:hover {
  background: #16a34a;
  box-shadow: 0 4px 16px rgba(34,197,94,0.4);
}

/* ─── Stat cards ─────────────────────────────────────── */
.stat-card {
  background: #fff;
  border-radius: 14px;
  padding: 20px 22px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  border: 1.5px solid transparent;
  transition: box-shadow 0.2s;
}
.stat-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.10); }

.stat-card--blue  { border-color: #bfdbfe; }
.stat-card--red   { border-color: #fecaca; }
.stat-card--plain { border-color: #e2e8f0; }

.stat-card__label {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  color: #94a3b8;
  text-transform: uppercase;
  margin-bottom: 8px;
}
.stat-card__value {
  font-size: 2rem;
  font-weight: 800;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 10px;
  line-height: 1;
}

.stat-badge {
  font-size: 0.72rem;
  font-weight: 600;
  border-radius: 20px;
  padding: 3px 9px;
}
.stat-badge--up   { background: #f0fdf4; color: #16a34a; }
.stat-badge--warn { background: #fff7ed; color: #c2410c; }

/* Last action avatar */
.last-action-avatar {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.9rem;
  flex-shrink: 0;
}
.last-action-name { font-size: 0.9rem; font-weight: 600; color: #1e293b; }
.last-action-time { font-size: 0.72rem; color: #94a3b8; }

/* ─── Filter bar ─────────────────────────────────────── */
.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  background: #fff;
  border-radius: 12px;
  padding: 12px 16px;
  box-shadow: 0 1px 6px rgba(0,0,0,0.05);
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 6px;
}
.filter-item--date  { flex: 0 0 auto; }
.filter-item--search {
  flex: 1;
  min-width: 180px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 6px 12px;
  background: #f8fafc;
}

.date-input {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 0.82rem;
  color: #475569;
  outline: none;
  background: #f8fafc;
}
.date-input:focus { border-color: #22c55e; }

.filter-text-input {
  border: none;
  outline: none;
  background: transparent;
  font-size: 0.85rem;
  color: #1e293b;
  width: 100%;
}

.filter-select {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 7px 12px;
  font-size: 0.85rem;
  color: #475569;
  outline: none;
  background: #f8fafc;
  cursor: pointer;
}
.filter-select:focus { border-color: #22c55e; }

.btn-filter {
  background: #22c55e;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 18px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
}
.btn-filter:hover { background: #16a34a; }

/* ─── Table ──────────────────────────────────────────── */
.table-card {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  overflow: hidden;
}

.nk-table thead th {
  font-size: 0.72rem;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border-bottom: 1.5px solid #f1f5f9;
  background: #fafbfc;
  padding: 12px 14px;
}

.nk-table tbody td {
  padding: 13px 14px;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
  font-size: 0.875rem;
  color: #334155;
}
.nk-table tbody tr:last-child td { border-bottom: none; }
.log-row:hover { background: #f8fffe; }

/* Timestamp */
.time-cell { font-size: 0.85rem; color: #475569; font-family: 'Courier New', monospace; }

/* Actor */
.actor-cell { display: flex; align-items: center; gap: 10px; }
.actor-avatar {
  width: 30px; height: 30px; border-radius: 50%;
  color: #fff; font-size: 0.65rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.actor-name { font-weight: 600; color: #1e293b; }

/* Target */
.target-cell { font-family: monospace; color: #475569; font-size: 0.82rem; }

/* IP */
.ip-cell { color: #64748b; font-size: 0.82rem; }

/* Action badges */
.action-badge {
  display: inline-flex;
  align-items: center;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 6px;
  letter-spacing: 0.02em;
}
.action--update  { color: #7c3aed; background: #f5f3ff; }
.action--create  { color: #0369a1; background: #f0f9ff; }
.action--backup  { color: #0f766e; background: #f0fdfa; }
.action--delete  { color: #b91c1c; background: #fff1f2; }
.action--config  { color: #b45309; background: #fffbeb; }
.action--default { color: #475569; background: #f1f5f9; }

/* Arrow button */
.btn-arrow {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 0.8rem;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background 0.15s, color 0.15s;
}
.btn-arrow:hover { background: #f1f5f9; color: #22c55e; }

/* ─── Pagination ─────────────────────────────────────── */
.pagination-bar {
  border-top: 1px solid #f1f5f9;
}
.pagination-info {
  font-size: 0.8rem;
  color: #94a3b8;
}
.pagination .page-link {
  border-radius: 8px !important;
  border-color: #e2e8f0;
  color: #475569;
  font-size: 0.82rem;
  padding: 5px 11px;
  margin: 0 2px;
  transition: background 0.15s, color 0.15s;
}
.pagination .page-item.active .page-link {
  background: #22c55e;
  border-color: #22c55e;
  color: #fff;
}
.pagination .page-link:hover:not(.active) {
  background: #f0fdf4;
  color: #16a34a;
}

/* ─── Modal ──────────────────────────────────────────── */
.nk-modal .modal-header {
  background: linear-gradient(135deg, #1e293b, #334155);
  color: #fff;
  border-radius: 12px 12px 0 0;
}
.nk-modal { border-radius: 12px; overflow: hidden; }

.detail-table th {
  width: 38%;
  color: #64748b;
  font-size: 0.82rem;
  font-weight: 600;
  vertical-align: top;
  border: none;
  padding: 8px 12px;
}
.detail-table td {
  color: #1e293b;
  font-size: 0.85rem;
  border: none;
  padding: 8px 12px;
}
.detail-table tr { border-bottom: 1px solid #f1f5f9; }

/* pre inside modal */
.detail-pre {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 0.78rem;
  color: #334155;
  white-space: pre-wrap;
  word-break: break-all;
  margin: 0;
  max-height: 120px;
  overflow-y: auto;
}

/* Delete log button */
.btn-delete-log {
  background: transparent;
  border: none;
  color: #fca5a5;
  font-size: 0.75rem;
  padding: 4px 7px;
  border-radius: 6px;
  transition: background 0.15s, color 0.15s;
}
.btn-delete-log:hover { background: #fff1f2; color: #dc2626; }

/* Toast */
.toast-msg {
  position: fixed;
  bottom: 28px;
  right: 28px;
  background: #1e293b;
  color: #fff;
  padding: 12px 20px;
  border-radius: 10px;
  font-size: 0.88rem;
  font-weight: 500;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 6px 24px rgba(0,0,0,0.18);
  animation: slideUp 0.25s ease;
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
