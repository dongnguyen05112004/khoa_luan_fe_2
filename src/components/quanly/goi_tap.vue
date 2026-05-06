<template>
  <div class="goitap-page">

    <!-- TOAST NOTIFICATION -->
    <transition name="toast-fade">
      <div v-if="toast.show" :class="['toast-msg', toast.type]">
        <i :class="toast.type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'"></i>
        {{ toast.text }}
      </div>
    </transition>

    <!-- ===== HEADER ===== -->
    <div class="page-header">
      <div class="page-title-block">
        <div class="page-breadcrumb">
          <span class="bc-root">Admin</span>
          <i class="fas fa-chevron-right bc-sep"></i>
          <span class="bc-cur">Gói tập</span>
        </div>
        <h1 class="page-title">Quản lý gói tập hội viên</h1>
      </div>
    </div>

    <!-- ===== AI ANALYSIS BANNER + STATS ROW ===== -->
    <div class="top-row">
      <!-- AI Panel Card -->
      <div class="ai-panel-card">
        <div class="ai-panel-header">
          <div class="ai-panel-icon-wrap">
            <i class="fas fa-robot"></i>
          </div>
          <div>
            <div class="ai-panel-title">Phân tích hiệu quả</div>
          </div>
          <div class="ai-badge-active"><i class="fas fa-circle"></i> AI INSIGHTS ACTIVE</div>
        </div>

        <div class="ai-panel-body">
          <!-- Revenue by plan bar chart -->
          <div class="revenue-by-plan">
            <div class="rbp-title">DOANH THU THEO TỪNG GÓI</div>
            <div v-for="pkg in planStats" :key="pkg.name" class="rbp-item">
              <div class="rbp-label">{{ pkg.name }}</div>
              <div class="rbp-bar-wrap">
                <div class="rbp-bar" :style="{ width: pkg.pct + '%', background: pkg.color }"></div>
              </div>
              <div class="rbp-pct">{{ pkg.pct }}%</div>
            </div>
          </div>

          <!-- Placeholder chart area -->
          <div class="chart-placeholder">
            <div class="chart-placeholder-inner">
              <i class="fas fa-chart-bar chart-ph-icon"></i>
              <div class="chart-ph-text">Biểu đồ hiệu suất gói tập</div>
              <div class="chart-ph-sub">Dữ liệu được cập nhật theo thời gian thực</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats column -->
      <div class="stats-col">
        <!-- Member Growth Card -->
        <div class="stat-card">
          <div class="stat-card-inner">
            <div class="stat-icon-wrap green">
              <i class="fas fa-chart-line"></i>
            </div>
            <div class="stat-data">
              <div class="stat-label">Tăng trưởng hội viên</div>
              <div class="stat-value green-text">+12.5%</div>
              <div class="stat-sub">So với tháng trước</div>
            </div>
          </div>
        </div>
        <!-- Churn Rate Card -->
        <div class="stat-card">
          <div class="stat-card-inner">
            <div class="stat-icon-wrap purple">
              <i class="fas fa-user-minus"></i>
            </div>
            <div class="stat-data">
              <div class="stat-label">Tỷ lệ rời bỏ (Churn)</div>
              <div class="stat-value purple-text">2.4%</div>
              <div class="stat-sub">Thấp hơn mục tiêu 1%</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== PLAN LIST SECTION ===== -->
    <div class="list-section">
      <div class="list-header">
        <div class="list-header-left">
          <div class="list-title">Danh sách gói hội viên</div>
          <div class="list-sub">Quản lý và cập nhật các chính sách gói tập tại hệ thống</div>
        </div>
        <div class="list-header-right">
          <div class="search-box">
            <i class="fas fa-search search-ic"></i>
            <input v-model="searchQuery" type="text" placeholder="Tìm kiếm gói tập..." class="search-input" />
          </div>
          <select v-model="filterStatus" class="status-filter">
            <option value="">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Đã ngừng</option>
          </select>
          <button class="btn-add-plan" @click="openAddModal">
            <i class="fas fa-plus"></i> Tạo mới
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="loading-wrap">
        <div class="spinner"></div>
        <span>Đang tải dữ liệu...</span>
      </div>

      <!-- Table -->
      <div v-else class="table-wrap">
        <table class="plan-table">
          <thead>
            <tr>
              <th>TÊN GÓI HỘI VIÊN</th>
              <th>GIÁ (VNĐ)</th>
              <th>THỜI HẠN (THÁNG)</th>
              <th>TRẠNG THÁI</th>
              <th>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredPlans.length === 0">
              <td colspan="5" class="empty-row">
                <div class="empty-state">
                  <i class="fas fa-box-open"></i>
                  <p>Không tìm thấy gói tập nào</p>
                </div>
              </td>
            </tr>
            <tr v-for="plan in paginatedPlans" :key="plan.id" class="plan-row">
              <td>
                <div class="plan-name-cell">
                  <div class="plan-icon-wrap" :style="{ background: planIconBg(plan) }">
                    <i :class="planIcon(plan)"></i>
                  </div>
                  <div>
                    <div class="plan-name">{{ plan.plan_name }}</div>
                    <div class="plan-desc" v-if="plan.description">{{ plan.description }}</div>
                  </div>
                </div>
              </td>
              <td class="plan-price">{{ formatPrice(plan.price) }}</td>
              <td class="plan-duration">{{ daysToMonths(plan.duration_days) }}</td>
              <td>
                <span :class="['status-badge', plan.status === 'active' ? 'active' : 'inactive']">
                  {{ plan.status === 'active' ? 'ĐANG HOẠT ĐỘNG' : 'ĐÃ NGỪNG' }}
                </span>
              </td>
              <td>
                <div class="action-btns">
                  <button class="btn-action edit" @click="openEditModal(plan)" title="Chỉnh sửa">
                    <i class="fas fa-pencil-alt"></i>
                  </button>
                  <button class="btn-action toggle" @click="toggleStatus(plan)" title="Bật/Tắt trạng thái"
                    :class="plan.status === 'active' ? 'toggle-on' : 'toggle-off'">
                    <i class="fas fa-power-off"></i>
                  </button>
                  <button class="btn-action delete" @click="confirmDelete(plan)" title="Xóa">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div class="pagination-row">
          <div class="pagination-info">
            Hiển thị {{ paginationTo }} trên {{ filteredPlans.length }} gói hội viên
          </div>
          <div class="pagination-btns">
            <button class="page-btn" @click="currentPage--" :disabled="currentPage <= 1">
              <i class="fas fa-chevron-left"></i>
            </button>
            <button class="page-btn" @click="currentPage++" :disabled="currentPage >= totalPages">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== MODAL: ADD / EDIT PLAN ===== -->
    <transition name="modal-fade">
      <div class="modal-overlay" v-if="showPlanModal" @click.self="showPlanModal = false">
        <div class="modal-box">
          <div class="modal-header">
            <span class="modal-title">
              <i :class="editingPlan ? 'fas fa-edit' : 'fas fa-plus-circle'"></i>
              {{ editingPlan ? 'Chỉnh sửa gói tập' : 'Tạo gói tập mới' }}
            </span>
            <button class="modal-close" @click="showPlanModal = false"><i class="fas fa-times"></i></button>
          </div>
          <div class="modal-body">
            <div class="form-row">
              <div class="form-group full">
                <label>Tên gói <span class="req">*</span></label>
                <input v-model="planForm.plan_name" type="text" placeholder="VD: Platinum Membership"
                  class="form-input" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Giá (VNĐ) <span class="req">*</span></label>
                <input v-model="planForm.price" type="number" placeholder="VD: 12500000" class="form-input"
                  min="0" />
              </div>
              <div class="form-group">
                <label>Thời hạn (ngày) <span class="req">*</span></label>
                <input v-model="planForm.duration_days" type="number" placeholder="VD: 365" class="form-input"
                  min="1" />
                <div class="form-hint" v-if="planForm.duration_days">
                  ≈ {{ daysToMonths(planForm.duration_days) }} tháng
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Giá trị quy đổi</label>
                <input v-model="planForm.value" type="number" placeholder="VD: 15000000" class="form-input"
                  min="0" />
              </div>
              <div class="form-group">
                <label>Trạng thái</label>
                <select v-model="planForm.status" class="form-input">
                  <option value="active">Đang hoạt động</option>
                  <option value="inactive">Ngừng bán</option>
                </select>
              </div>
            </div>
            <div class="form-group full">
              <label>Mô tả</label>
              <textarea v-model="planForm.description" rows="3"
                placeholder="Mô tả chi tiết về các quyền lợi của gói tập..." class="form-input form-textarea"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-cancel" @click="showPlanModal = false">Huỷ</button>
            <button class="btn-save" @click="savePlan" :disabled="savingPlan">
              <i class="fas fa-save"></i>
              {{ savingPlan ? 'Đang lưu...' : (editingPlan ? 'Cập nhật' : 'Tạo gói tập') }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- ===== MODAL: DELETE CONFIRM ===== -->
    <transition name="modal-fade">
      <div class="modal-overlay" v-if="showDeleteModal" @click.self="showDeleteModal = false">
        <div class="modal-box delete-modal-box">
          <div class="delete-modal-icon-wrap">
            <div class="delete-modal-icon"><i class="fas fa-trash-alt"></i></div>
          </div>
          <div class="delete-modal-content">
            <h3 class="delete-modal-title">Xác nhận xóa gói tập?</h3>
            <p class="delete-modal-desc">
              Bạn đang xóa gói <strong>{{ planToDelete && planToDelete.plan_name }}</strong>.
              Hành động này không thể hoàn tác.
            </p>
          </div>
          <div class="delete-modal-footer">
            <button class="btn-cancel" @click="showDeleteModal = false">Huỷ</button>
            <button class="btn-confirm-delete" @click="deletePlan" :disabled="savingPlan">
              <i class="fas fa-trash-alt"></i>
              {{ savingPlan ? 'Đang xóa...' : 'Xóa gói tập' }}
            </button>
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script>
import { membershipPlanApi } from '../../services/membershipPlanApi.js'

export default {
  name: 'GoiTap',
  data() {
    return {
      loading: false,
      savingPlan: false,
      searchQuery: '',
      filterStatus: '',
      plans: [],

      currentPage: 1,
      pageSize: 5,

      showPlanModal: false,
      editingPlan: null,
      planForm: {
        plan_name: '',
        price: '',
        duration_days: '',
        value: '',
        description: '',
        status: 'active',
      },

      showDeleteModal: false,
      planToDelete: null,

      toast: { show: false, text: '', type: 'success' },
      toastTimer: null,

      // For AI analysis panel - computed from real data or static
      planStats: [
        { name: 'Gói Platinum (12 tháng)', pct: 45, color: '#6366f1' },
        { name: 'Gói Gold (6 tháng)',      pct: 30, color: '#2d7a3a' },
        { name: 'Gói Basic (1 tháng)',     pct: 25, color: '#0ea5e9' },
      ],
    }
  },

  computed: {
    filteredPlans() {
      const q = this.searchQuery.toLowerCase()
      return this.plans.filter(p => {
        const matchQ = !q || (p.plan_name || '').toLowerCase().includes(q)
        const matchStatus = !this.filterStatus || p.status === this.filterStatus
        return matchQ && matchStatus
      })
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.filteredPlans.length / this.pageSize))
    },
    paginatedPlans() {
      const start = (this.currentPage - 1) * this.pageSize
      return this.filteredPlans.slice(start, start + this.pageSize)
    },
    paginationFrom() {
      if (this.filteredPlans.length === 0) return 0
      return (this.currentPage - 1) * this.pageSize + 1
    },
    paginationTo() {
      return Math.min(this.currentPage * this.pageSize, this.filteredPlans.length)
    },
  },

  watch: {
    filteredPlans() {
      this.currentPage = 1
    },
  },

  mounted() {
    this.fetchPlans()
  },

  methods: {
    // ── HELPERS ──────────────────────────────────────────────
    showToast(text, type = 'success') {
      clearTimeout(this.toastTimer)
      this.toast = { show: true, text, type }
      this.toastTimer = setTimeout(() => { this.toast.show = false }, 3500)
    },

    formatPrice(price) {
      if (!price && price !== 0) return '—'
      return Number(price).toLocaleString('vi-VN')
    },

    daysToMonths(days) {
      if (!days) return '—'
      const months = Math.round(days / 30)
      return months
    },

    planIcon(plan) {
      const name = (plan.plan_name || '').toLowerCase()
      if (name.includes('platinum') || name.includes('vip')) return 'fas fa-gem'
      if (name.includes('gold') || name.includes('vàng')) return 'fas fa-star'
      if (name.includes('silver') || name.includes('bạc')) return 'fas fa-medal'
      return 'fas fa-user-circle'
    },

    planIconBg(plan) {
      const name = (plan.plan_name || '').toLowerCase()
      if (name.includes('platinum') || name.includes('vip')) return 'linear-gradient(135deg,#e0e7ff,#c7d2fe)'
      if (name.includes('gold') || name.includes('vàng')) return 'linear-gradient(135deg,#fef9c3,#fde68a)'
      if (name.includes('silver') || name.includes('bạc')) return 'linear-gradient(135deg,#f1f5f9,#e2e8f0)'
      return 'linear-gradient(135deg,#dcfce7,#bbf7d0)'
    },

    // ── FETCH ────────────────────────────────────────────────
    async fetchPlans() {
      this.loading = true
      try {
        const res = await membershipPlanApi.getAll()
        this.plans = Array.isArray(res.data) ? res.data : (res.data.data || [])
        this.updatePlanStats()
      } catch (e) {
        this.showToast('Không thể tải danh sách gói tập', 'error')
      } finally {
        this.loading = false
      }
    },

    updatePlanStats() {
      if (this.plans.length === 0) return
      const total = this.plans.reduce((sum, p) => sum + (Number(p.subscriptions_count) || 0), 0)
      if (total === 0) return
      const colors = ['#6366f1', '#2d7a3a', '#0ea5e9', '#f59e0b', '#ec4899']
      this.planStats = this.plans.slice(0, 5).map((p, i) => ({
        name: p.plan_name,
        pct: Math.round(((Number(p.subscriptions_count) || 0) / total) * 100),
        color: colors[i % colors.length],
      }))
    },

    // ── ADD / EDIT ───────────────────────────────────────────
    openAddModal() {
      this.editingPlan = null
      this.planForm = { plan_name: '', price: '', duration_days: '', value: '', description: '', status: 'active' }
      this.showPlanModal = true
    },

    openEditModal(plan) {
      this.editingPlan = plan
      this.planForm = {
        plan_name: plan.plan_name || '',
        price: plan.price || '',
        duration_days: plan.duration_days || '',
        value: plan.value || '',
        description: plan.description || '',
        status: plan.status || 'active',
      }
      this.showPlanModal = true
    },

    async savePlan() {
      if (!this.planForm.plan_name || !this.planForm.price || !this.planForm.duration_days) {
        this.showToast('Vui lòng điền đầy đủ thông tin bắt buộc', 'error')
        return
      }
      this.savingPlan = true
      try {
        const payload = {
          plan_name:     this.planForm.plan_name,
          price:         Number(this.planForm.price),
          duration_days: Number(this.planForm.duration_days),
          value:         this.planForm.value ? Number(this.planForm.value) : null,
          description:   this.planForm.description || null,
          status:        this.planForm.status,
        }
        if (this.editingPlan) {
          await membershipPlanApi.update(this.editingPlan.id, payload)
          this.showToast('Cập nhật gói tập thành công!')
        } else {
          await membershipPlanApi.create(payload)
          this.showToast('Tạo gói tập thành công!')
        }
        this.showPlanModal = false
        await this.fetchPlans()
      } catch (e) {
        const msg = e.response?.data?.message
          || (e.response?.data?.errors ? Object.values(e.response.data.errors).flat().join(', ') : null)
          || 'Có lỗi xảy ra khi lưu'
        this.showToast(msg, 'error')
      } finally {
        this.savingPlan = false
      }
    },

    // ── TOGGLE STATUS ────────────────────────────────────────
    async toggleStatus(plan) {
      try {
        await membershipPlanApi.toggleStatus(plan.id, plan.status)
        plan.status = plan.status === 'active' ? 'inactive' : 'active'
        this.showToast(`Đã ${plan.status === 'active' ? 'kích hoạt' : 'ngừng'} gói "${plan.plan_name}"`)
      } catch (e) {
        this.showToast('Không thể cập nhật trạng thái', 'error')
      }
    },

    // ── DELETE ───────────────────────────────────────────────
    confirmDelete(plan) {
      this.planToDelete = plan
      this.showDeleteModal = true
    },

    async deletePlan() {
      if (!this.planToDelete) return
      this.savingPlan = true
      try {
        await membershipPlanApi.remove(this.planToDelete.id)
        this.showToast(`Đã xóa gói "${this.planToDelete.plan_name}"`)
        this.showDeleteModal = false
        await this.fetchPlans()
      } catch (e) {
        const msg = e.response?.data?.message || 'Không thể xóa gói tập'
        this.showToast(msg, 'error')
      } finally {
        this.savingPlan = false
        this.planToDelete = null
      }
    },
  },
}
</script>

<style scoped>
/* =========================================
   ROOT
   ========================================= */
.goitap-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-family: 'Segoe UI', sans-serif;
  color: #1e293b;
  position: relative;
}

/* =========================================
   TOAST
   ========================================= */
.toast-msg {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 9999;
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 0.88rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 9px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.15);
}
.toast-msg.success { background: #16a34a; color: #fff; }
.toast-msg.error   { background: #dc2626; color: #fff; }
.toast-fade-enter-active, .toast-fade-leave-active { transition: all 0.3s ease; }
.toast-fade-enter-from, .toast-fade-leave-to { opacity: 0; transform: translateY(-12px); }

/* =========================================
   PAGE HEADER
   ========================================= */
.page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}
.page-breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  margin-bottom: 4px;
}
.bc-root { color: #94a3b8; }
.bc-sep  { font-size: 0.55rem; color: #cbd5e1; }
.bc-cur  { color: #2d7a3a; font-weight: 600; }
.page-title {
  font-size: 1.45rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  letter-spacing: -0.4px;
}

/* =========================================
   TOP ROW (AI Panel + Stats)
   ========================================= */
.top-row {
  display: grid;
  grid-template-columns: 1fr 260px;
  gap: 16px;
  align-items: stretch;
}

/* AI Panel Card */
.ai-panel-card {
  background: linear-gradient(135deg, #1a7de2 0%, #0ea5e9 60%, #22c55e 100%);
  border-radius: 18px;
  padding: 22px 26px;
  color: #fff;
  box-shadow: 0 6px 28px rgba(14,165,233,0.25);
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.ai-panel-header {
  display: flex;
  align-items: center;
  gap: 12px;
}
.ai-panel-icon-wrap {
  width: 36px; height: 36px;
  background: rgba(255,255,255,0.2);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
}
.ai-panel-title {
  font-size: 1.05rem;
  font-weight: 700;
  flex: 1;
}
.ai-badge-active {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(255,255,255,0.2);
  border: 1px solid rgba(255,255,255,0.4);
  border-radius: 20px;
  padding: 4px 12px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.6px;
  white-space: nowrap;
}
.ai-badge-active .fa-circle { font-size: 0.5rem; color: #4ade80; }

.ai-panel-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

/* Revenue by plan */
.revenue-by-plan { display: flex; flex-direction: column; gap: 12px; }
.rbp-title {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  opacity: 0.8;
}
.rbp-item {
  display: flex;
  align-items: center;
  gap: 10px;
}
.rbp-label { font-size: 0.78rem; font-weight: 500; min-width: 140px; opacity: 0.95; }
.rbp-bar-wrap {
  flex: 1;
  height: 7px;
  background: rgba(255,255,255,0.25);
  border-radius: 20px;
  overflow: hidden;
}
.rbp-bar { height: 100%; border-radius: 20px; background: rgba(255,255,255,0.85); transition: width 0.5s ease; }
.rbp-pct { font-size: 0.78rem; font-weight: 700; min-width: 34px; text-align: right; }

/* Placeholder chart */
.chart-placeholder {
  background: rgba(255,255,255,0.12);
  border: 1.5px dashed rgba(255,255,255,0.35);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 120px;
}
.chart-placeholder-inner {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.chart-ph-icon { font-size: 2rem; opacity: 0.6; }
.chart-ph-text { font-size: 0.82rem; font-weight: 600; opacity: 0.85; }
.chart-ph-sub  { font-size: 0.7rem; opacity: 0.65; }

/* Stats Column */
.stats-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.stat-card {
  background: #fff;
  border-radius: 14px;
  padding: 18px 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
  flex: 1;
}
.stat-card-inner {
  display: flex;
  align-items: center;
  gap: 16px;
}
.stat-icon-wrap {
  width: 46px; height: 46px;
  border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}
.stat-icon-wrap.green  { background: #dcfce7; color: #16a34a; }
.stat-icon-wrap.purple { background: #ede9fe; color: #7c3aed; }

.stat-label { font-size: 0.76rem; color: #94a3b8; font-weight: 500; }
.stat-value { font-size: 1.55rem; font-weight: 800; line-height: 1.1; }
.stat-value.green-text  { color: #16a34a; }
.stat-value.purple-text { color: #7c3aed; }
.stat-sub { font-size: 0.72rem; color: #94a3b8; margin-top: 2px; }

/* =========================================
   LIST SECTION
   ========================================= */
.list-section {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 14px rgba(0,0,0,0.07);
  overflow: hidden;
}
.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 26px 16px;
  gap: 16px;
  flex-wrap: wrap;
  border-bottom: 1px solid #f1f5f9;
}
.list-header-left {}
.list-title {
  font-size: 1.05rem;
  font-weight: 800;
  color: #0f172a;
}
.list-sub {
  font-size: 0.76rem;
  color: #94a3b8;
  margin-top: 2px;
}
.list-header-right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.search-box {
  display: flex;
  align-items: center;
  gap: 7px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 9px;
  padding: 7px 13px;
}
.search-ic { font-size: 0.78rem; color: #94a3b8; }
.search-input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 0.82rem;
  color: #475569;
  width: 160px;
}
.search-input::placeholder { color: #94a3b8; }
.status-filter {
  border: 1px solid #e2e8f0;
  border-radius: 9px;
  padding: 7px 12px;
  font-size: 0.82rem;
  color: #475569;
  background: #f8fafc;
  outline: none;
  cursor: pointer;
}
.btn-add-plan {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: linear-gradient(135deg, #2d7a3a, #1a5c28);
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 9px 18px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.18s, transform 0.15s;
  white-space: nowrap;
}
.btn-add-plan:hover { opacity: 0.88; transform: translateY(-1px); }

/* Loading */
.loading-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 60px;
  color: #94a3b8;
  font-size: 0.9rem;
}
.spinner {
  width: 24px; height: 24px;
  border: 3px solid #e2e8f0;
  border-top-color: #2d7a3a;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Table */
.table-wrap { overflow-x: auto; }
.plan-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.87rem;
}
.plan-table thead tr {
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}
.plan-table th {
  padding: 12px 20px;
  text-align: left;
  font-size: 0.72rem;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 0.5px;
  white-space: nowrap;
}
.plan-table th:last-child { text-align: right; }
.plan-row {
  border-bottom: 1px solid #f1f5f9;
  transition: background 0.15s;
}
.plan-row:hover { background: #f8fafc; }
.plan-table td { padding: 16px 20px; vertical-align: middle; }
.plan-table td:last-child { text-align: right; }

/* Empty row */
.empty-row { text-align: center !important; }
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 40px;
  color: #94a3b8;
}
.empty-state i { font-size: 2.5rem; opacity: 0.4; }
.empty-state p { font-size: 0.9rem; margin: 0; }

/* Plan name cell */
.plan-name-cell {
  display: flex;
  align-items: center;
  gap: 13px;
}
.plan-icon-wrap {
  width: 40px; height: 40px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
}
.plan-icon-wrap .fas { color: #475569; }
.plan-name  { font-weight: 700; color: #1e293b; font-size: 0.92rem; }
.plan-desc  { font-size: 0.72rem; color: #94a3b8; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px; }

.plan-price { font-weight: 700; color: #1e293b; white-space: nowrap; }
.plan-duration { font-weight: 600; color: #475569; }

/* Status badge */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.71rem;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 20px;
  letter-spacing: 0.3px;
  white-space: nowrap;
}
.status-badge.active   { background: #dcfce7; color: #16a34a; }
.status-badge.inactive { background: #f1f5f9; color: #64748b; }

/* Action buttons */
.action-btns {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.btn-action {
  width: 32px; height: 32px;
  border: none;
  border-radius: 8px;
  display: inline-flex; align-items: center; justify-content: center;
  font-size: 0.82rem;
  cursor: pointer;
  transition: all 0.18s;
}
.btn-action.edit   { background: #eff6ff; color: #3b82f6; }
.btn-action.edit:hover   { background: #dbeafe; transform: scale(1.08); }
.btn-action.toggle { background: #f0fdf4; }
.btn-action.toggle.toggle-on  { color: #16a34a; }
.btn-action.toggle.toggle-off { color: #94a3b8; }
.btn-action.toggle:hover { background: #dcfce7; transform: scale(1.08); }
.btn-action.delete { background: #fff5f5; color: #ef4444; }
.btn-action.delete:hover { background: #fee2e2; transform: scale(1.08); }

/* Pagination */
.pagination-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 24px;
  border-top: 1px solid #f1f5f9;
  font-size: 0.8rem;
  color: #94a3b8;
}
.pagination-btns { display: flex; gap: 6px; }
.page-btn {
  width: 30px; height: 30px;
  border: 1px solid #e2e8f0;
  border-radius: 7px;
  background: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.75rem;
  color: #475569;
  cursor: pointer;
  transition: all 0.15s;
}
.page-btn:hover:not(:disabled) { background: #f1f5f9; border-color: #cbd5e1; }
.page-btn:disabled { opacity: 0.38; cursor: not-allowed; }

/* =========================================
   MODAL
   ========================================= */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15,23,42,0.55);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.modal-box {
  background: #fff;
  border-radius: 18px;
  width: 540px;
  max-width: 100%;
  box-shadow: 0 30px 70px rgba(0,0,0,0.22);
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 1px solid #f1f5f9;
}
.modal-title {
  font-size: 1rem;
  font-weight: 800;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 9px;
}
.modal-title .fas { color: #2d7a3a; }
.modal-close {
  width: 30px; height: 30px;
  border: none;
  background: #f1f5f9;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.82rem;
  color: #64748b;
  cursor: pointer;
  transition: background 0.15s;
}
.modal-close:hover { background: #e2e8f0; }

.modal-body {
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
.form-group { display: flex; flex-direction: column; gap: 5px; }
.form-group.full { grid-column: 1 / -1; }
.form-group label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #475569;
}
.req { color: #ef4444; }
.form-input {
  border: 1.5px solid #e2e8f0;
  border-radius: 9px;
  padding: 9px 13px;
  font-size: 0.87rem;
  color: #1e293b;
  outline: none;
  transition: border-color 0.18s;
  background: #f8fafc;
}
.form-input:focus { border-color: #2d7a3a; background: #fff; }
.form-textarea { resize: vertical; min-height: 80px; font-family: inherit; }
.form-hint { font-size: 0.72rem; color: #2d7a3a; font-weight: 600; }

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 24px 20px;
  border-top: 1px solid #f1f5f9;
}
.btn-cancel {
  padding: 9px 20px;
  border: 1.5px solid #e2e8f0;
  border-radius: 9px;
  background: #fff;
  color: #64748b;
  font-size: 0.87rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-cancel:hover { background: #f1f5f9; }
.btn-save {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: linear-gradient(135deg, #2d7a3a, #1a5c28);
  color: #fff;
  border: none;
  border-radius: 9px;
  padding: 9px 20px;
  font-size: 0.87rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.18s;
}
.btn-save:hover:not(:disabled) { opacity: 0.88; }
.btn-save:disabled { opacity: 0.5; cursor: not-allowed; }

/* Delete modal */
.delete-modal-box {
  width: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}
.delete-modal-icon-wrap {
  padding: 28px 24px 12px;
  display: flex;
  justify-content: center;
}
.delete-modal-icon {
  width: 60px; height: 60px;
  background: #fff5f5;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.4rem;
  color: #ef4444;
  box-shadow: 0 0 0 10px #fee2e2;
}
.delete-modal-content { text-align: center; padding: 10px 30px 0; }
.delete-modal-title { font-size: 1.05rem; font-weight: 800; color: #0f172a; margin: 0 0 8px; }
.delete-modal-desc { font-size: 0.86rem; color: #64748b; margin: 0; line-height: 1.6; }
.delete-modal-footer {
  display: flex;
  gap: 10px;
  padding: 22px 24px 24px;
  width: 100%;
  justify-content: center;
}
.btn-confirm-delete {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: #fff;
  border: none;
  border-radius: 9px;
  padding: 9px 20px;
  font-size: 0.87rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.18s;
}
.btn-confirm-delete:hover:not(:disabled) { opacity: 0.88; }
.btn-confirm-delete:disabled { opacity: 0.5; cursor: not-allowed; }

/* Modal transition */
.modal-fade-enter-active, .modal-fade-leave-active { transition: all 0.25s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; transform: scale(0.95); }
</style>
