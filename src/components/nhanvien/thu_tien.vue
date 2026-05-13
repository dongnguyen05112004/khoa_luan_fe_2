<template>
  <div class="tt-page">

    <!-- ===== Page Header ===== -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Quản Lý Thanh Toán</h1>
        <p class="page-subtitle">Quản lý và theo dõi giao dịch hội viên theo thời gian thực.</p>
      </div>
    </div>

    <!-- ===== Top Stats Row ===== -->
    <div class="stats-row">

      <!-- Revenue card (dark green) -->
      <div class="revenue-card">
        <div class="live-badge">
          <span class="live-dot"></span> SỐ LIỆU THEO GIỜ
        </div>
        <div class="revenue-label">Doanh Thu Hôm Nay</div>
        <div class="revenue-amount">
          <span v-if="statsLoading" class="skeleton-text">--</span>
          <template v-else>
            {{ todayRevenue !== null ? formatVND(todayRevenue) : '--' }}
            <span class="revenue-unit">VND</span>
            <span v-if="todayRevenue !== null" class="revenue-change" :class="revenueChange >= 0 ? 'positive' : 'negative'">
              {{ revenueChange >= 0 ? '↑' : '↓' }} {{ Math.abs(revenueChange) }}%
            </span>
          </template>
        </div>
        <div class="revenue-stats">
          <div class="rev-stat">
            <div class="rev-stat-label">HOÀN THÀNH</div>
            <div class="rev-stat-val">
              <span v-if="statsLoading" class="skeleton-text">-</span>
              <template v-else>{{ completedCount !== null ? completedCount : '--' }} <span class="rev-stat-sub">gd</span></template>
            </div>
          </div>
          <div class="rev-divider"></div>
          <div class="rev-stat">
            <div class="rev-stat-label">TB/GIAO DỊCH</div>
            <div class="rev-stat-val">
              <span v-if="statsLoading" class="skeleton-text">-</span>
              <template v-else>{{ avgTicket !== null ? formatVNDShort(avgTicket) : '--' }} <span class="rev-stat-sub">đ</span></template>
            </div>
          </div>
          <div class="rev-divider"></div>
          <div class="rev-stat">
            <div class="rev-stat-label">HOÀN TIỀN</div>
            <div class="rev-stat-val">
              <span v-if="statsLoading" class="skeleton-text">-</span>
              <template v-else>{{ refundedCount !== null ? refundedCount : '--' }} <span class="rev-stat-sub">gd</span></template>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment method breakdown -->
      <div class="breakdown-card">
        <div class="breakdown-title">Phương Thức Thanh Toán</div>
        <div class="breakdown-list">
          <template v-if="statsLoading">
            <div class="breakdown-skeleton" v-for="n in 3" :key="n"></div>
          </template>
          <template v-else>
            <div class="breakdown-item" v-for="m in paymentMethods" :key="m.key">
              <div class="breakdown-top">
                <span class="breakdown-dot" :style="{ background: m.color }"></span>
                <span class="breakdown-label">{{ m.label }}</span>
                <span class="breakdown-pct">{{ m.pct }}%</span>
              </div>
              <div class="breakdown-bar-bg">
                <div class="breakdown-bar-fill" :style="{ width: m.pct + '%', background: m.color }"></div>
              </div>
            </div>
          </template>
        </div>
        <button class="btn-detailed" @click="goToPayment">Thanh toán mới →</button>
      </div>

    </div>

    <!-- ===== Transactions Table ===== -->
    <div class="table-card">

      <!-- Table header -->
      <div class="table-head-row">
        <div class="table-tabs">
          <button
            v-for="t in tabs"
            :key="t.key"
            class="tab-btn"
            :class="{ active: activeTab === t.key }"
            @click="setTab(t.key)"
          >{{ t.label }}</button>
        </div>
        <div class="table-head-actions">
          <!-- Search -->
          <div class="search-wrap">
            <i class="fas fa-search search-ico"></i>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Tìm kiếm..."
              class="search-input"
              @input="onSearchInput"
            />
          </div>
          <button class="btn-export" @click="exportCSV"><i class="fas fa-download"></i> Export CSV</button>
          <button class="btn-pay" @click="goToPayment"><i class="fas fa-cash-register"></i> Thanh toán</button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="tableLoading" class="loading-overlay">
        <div class="loading-spinner"></div>
        <span>Đang tải dữ liệu...</span>
      </div>

      <!-- Table -->
      <div class="tt-table-wrap" v-show="!tableLoading">
        <table class="tt-table">
          <thead>
            <tr>
              <th>MÃ GIAO DỊCH</th>
              <th>NGÀY</th>
              <th>HỘI VIÊN</th>
              <th>GÓI TẬP</th>
              <th>SỐ TIỀN</th>
              <th>PHƯƠNG THỨC</th>
              <th>TRẠNG THÁI</th>
              <th>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tx in transactions" :key="tx.id">
              <td>
                <span class="tx-id">{{ tx.txId }}</span>
              </td>
              <td>
                <div class="tx-date">{{ tx.date }}</div>
              </td>
              <td>
                <div class="member-cell">
                  <img
                    :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(tx.memberName)}&background=${tx.avatarBg}&color=fff&bold=true&size=60`"
                    class="member-avatar"
                    :alt="tx.memberName"
                  />
                  <span class="member-name">{{ tx.memberName }}</span>
                </div>
              </td>
              <td>
                <span class="pkg-badge" :class="tx.pkgClass">{{ tx.package }}</span>
              </td>
              <td>
                <div class="tx-amount">{{ formatVND(tx.amount) }}</div>
                <div class="tx-amount-sub">VND</div>
              </td>
              <td>
                <div class="method-cell">
                  <i :class="tx.methodIcon" class="method-icon"></i>
                  <span class="method-label">{{ tx.method }}</span>
                </div>
              </td>
              <td>
                <span class="status-badge" :class="tx.statusClass">
                  <span class="status-dot"></span>{{ tx.status }}
                </span>
              </td>
              <td>
                <div class="action-btns">
                  <button class="action-btn" title="Xem chi tiết" @click="viewDetail(tx)">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button
                    v-if="tx.status_raw === 'pending'"
                    class="action-btn confirm"
                    title="Xác nhận thanh toán"
                    @click="confirmPayment(tx)"
                  >
                    <i class="fas fa-check"></i>
                  </button>
                  <button
                    v-if="tx.status_raw === 'paid'"
                    class="action-btn refund"
                    title="Hoàn tiền"
                    @click="openRefundModal(tx)"
                  >
                    <i class="fas fa-undo"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="transactions.length === 0 && !tableLoading">
              <td colspan="8" class="empty-row">
                <i class="fas fa-receipt"></i> Không tìm thấy giao dịch.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination-bar">
        <span class="pagination-info">
          Hiển thị {{ pageFrom }}-{{ pageTo }} trong {{ totalRecords }} giao dịch
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

    <!-- ===== Detail Modal ===== -->
    <div class="modal-overlay" v-if="showDetail" @click.self="showDetail = false">
      <div class="detail-modal">
        <div class="modal-header">
          <h3>Chi tiết giao dịch {{ selectedTx?.txId }}</h3>
          <button class="modal-close" @click="showDetail = false"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body" v-if="selectedTx">
          <div class="detail-row"><span class="dl">Hội viên</span><span class="dv">{{ selectedTx.memberName }}</span></div>
          <div class="detail-row"><span class="dl">Email</span><span class="dv">{{ selectedTx.memberEmail || '—' }}</span></div>
          <div class="detail-row"><span class="dl">Gói tập</span><span class="dv">{{ selectedTx.package }}</span></div>
          <div class="detail-row"><span class="dl">Số tiền</span><span class="dv">{{ formatVND(selectedTx.amount) }} đ</span></div>
          <div class="detail-row"><span class="dl">Phương thức</span><span class="dv">{{ selectedTx.method }}</span></div>
          <div class="detail-row"><span class="dl">Ngày</span><span class="dv">{{ selectedTx.date }}</span></div>
          <div class="detail-row"><span class="dl">Trạng thái</span>
            <span class="status-badge" :class="selectedTx.statusClass">
              <span class="status-dot"></span>{{ selectedTx.status }}
            </span>
          </div>
          <div class="detail-row" v-if="selectedTx.promotion_code">
            <span class="dl">Mã KM</span><span class="dv promo-tag">{{ selectedTx.promotion_code }}</span>
          </div>
          <div class="detail-row" v-if="selectedTx.note">
            <span class="dl">Ghi chú</span><span class="dv note-text">{{ selectedTx.note }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Refund Modal ===== -->
    <div class="modal-overlay" v-if="showRefund" @click.self="showRefund = false">
      <div class="detail-modal">
        <div class="modal-header">
          <h3>Hoàn tiền {{ selectedTx?.txId }}</h3>
          <button class="modal-close" @click="showRefund = false"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
          <p class="refund-amount">Số tiền hoàn: <strong>{{ formatVND(selectedTx?.amount) }} đ</strong></p>
          <label class="field-label">Lý do hoàn tiền *</label>
          <textarea v-model="refundReason" class="refund-textarea" placeholder="Nhập lý do hoàn tiền..." rows="3"></textarea>
          <div class="modal-actions">
            <button class="btn-cancel-modal" @click="showRefund = false">Hủy</button>
            <button class="btn-refund-confirm" @click="submitRefund" :disabled="actionLoading">
              <i class="fas fa-undo"></i> Xác nhận hoàn tiền
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Toast Notification ===== -->
    <div class="toast" :class="[toastType, { show: showToast }]">
      <i :class="toastType === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'"></i>
      {{ toastMsg }}
    </div>

  </div>
</template>

<script>
import { paymentApi, formatVND } from '@/services/paymentApi.js'

export default {
  name: 'ThuTien',

  data() {
    return {
      // State
      activeTab: 'all',
      currentPage: 1,
      perPage: 10,
      searchQuery: '',
      searchTimer: null,

      // Loading
      statsLoading: true,
      tableLoading: true,
      actionLoading: false,

      // Stats
      todayRevenue: 0,
      revenueChange: 0,
      completedCount: 0,
      avgTicket: 0,
      refundedCount: 0,
      paymentMethods: [],

      // Table
      transactions: [],
      totalRecords: 0,
      lastPage: 1,

      // Tabs
      tabs: [
        { key: 'all',      label: 'Tất cả' },
        { key: 'paid',     label: 'Hoàn thành' },
        { key: 'pending',  label: 'Đang chờ' },
        { key: 'refunded', label: 'Hoàn tiền' },
      ],

      // Modals
      showDetail: false,
      showRefund: false,
      selectedTx: null,
      refundReason: '',

      // Toast
      showToast: false,
      toastMsg: '',
      toastType: 'success',
    }
  },

  computed: {
    totalPages() {
      return Math.max(1, this.lastPage)
    },
    visiblePages() {
      const pages = []
      const start = Math.max(1, this.currentPage - 1)
      const end   = Math.min(this.totalPages, start + 2)
      for (let i = start; i <= end; i++) pages.push(i)
      return pages
    },
    pageFrom() {
      return this.totalRecords === 0 ? 0 : (this.currentPage - 1) * this.perPage + 1
    },
    pageTo() {
      return Math.min(this.currentPage * this.perPage, this.totalRecords)
    },
  },

  mounted() {
    this.loadStats()
    this.loadTransactions()
  },

  methods: {
    // ── Utilities ──────────────────────────────────────────────
    formatVND(amount) {
      return Number(amount || 0).toLocaleString('vi-VN')
    },
    formatVNDShort(amount) {
      if (amount >= 1_000_000) return (amount / 1_000_000).toFixed(1) + 'M'
      if (amount >= 1_000)    return (amount / 1_000).toFixed(0) + 'K'
      return amount
    },

    showToastMsg(msg, type = 'success') {
      this.toastMsg  = msg
      this.toastType = type
      this.showToast = true
      setTimeout(() => { this.showToast = false }, 3000)
    },

    // ── Data Loading ────────────────────────────────────────────
    async loadStats() {
      this.statsLoading = true
      try {
        const { data } = await paymentApi.getStats()
        this.todayRevenue     = data.today_revenue         ?? 0
        this.revenueChange    = data.today_revenue_change  ?? 0
        this.completedCount   = data.completed_count       ?? 0
        this.avgTicket        = data.avg_ticket            ?? 0
        this.refundedCount    = data.refunded_count        ?? 0
        this.paymentMethods   = data.payment_methods       ?? []
      } catch (err) {
        console.error('Stats error:', err)
        // Khi lỗi: set null để template hiển thị '--' thay vì '0 VND' gây hiểu nhầm
        this.todayRevenue   = null
        this.completedCount = null
        this.avgTicket      = null
        this.refundedCount  = null
        this.paymentMethods = [
          { key: 'card',          label: 'Thẻ TD',       pct: 0, color: '#22c55e' },
          { key: 'bank_transfer', label: 'Chuyển khoản', pct: 0, color: '#16a34a' },
          { key: 'cash',          label: 'Tiền mặt',     pct: 0, color: '#86efac' },
        ]
      } finally {
        this.statsLoading = false
      }
    },

    async loadTransactions() {
      this.tableLoading = true
      try {
        const params = {
          page:     this.currentPage,
          per_page: this.perPage,
        }
        if (this.activeTab === 'pending') {
          params.payment_confirmed = 1
        }
        if (this.activeTab !== 'all' && this.activeTab !== 'pending') {
          params.status = this.activeTab
        }
        if (this.searchQuery.trim())  params.search = this.searchQuery.trim()

        const { data } = await paymentApi.getAll(params)

        this.transactions  = data.data        ?? []
        this.totalRecords  = data.total       ?? 0
        this.lastPage      = data.last_page   ?? 1
      } catch (err) {
        console.error('Transactions error:', err)
        this.showToastMsg('Không thể tải danh sách giao dịch', 'error')
      } finally {
        this.tableLoading = false
      }
    },

    // ── Actions ─────────────────────────────────────────────────
    setTab(key) {
      this.activeTab   = key
      this.currentPage = 1
      this.loadTransactions()
    },

    changePage(page) {
      if (page < 1 || page > this.totalPages) return
      this.currentPage = page
      this.loadTransactions()
    },

    onSearchInput() {
      clearTimeout(this.searchTimer)
      this.searchTimer = setTimeout(() => {
        this.currentPage = 1
        this.loadTransactions()
      }, 400)
    },

    goToPayment() {
      this.$router.push('/nhanvien/xuly_thanh_toan')
    },

    viewDetail(tx) {
      this.selectedTx = tx
      this.showDetail = true
    },

    async confirmPayment(tx) {
      if (!confirm(`Xác nhận thanh toán ${tx.txId}?`)) return
      this.actionLoading = true
      try {
        await paymentApi.confirm(tx.id)
        this.showToastMsg(`Đã xác nhận thanh toán ${tx.txId}`)
        await this.loadTransactions()
        await this.loadStats()
      } catch (err) {
        this.showToastMsg(err.response?.data?.message || 'Lỗi xác nhận', 'error')
      } finally {
        this.actionLoading = false
      }
    },

    openRefundModal(tx) {
      this.selectedTx   = tx
      this.refundReason = ''
      this.showRefund   = true
    },

    async submitRefund() {
      if (!this.refundReason.trim() || this.refundReason.trim().length < 5) {
        this.showToastMsg('Vui lòng nhập lý do hoàn tiền (ít nhất 5 ký tự)', 'error')
        return
      }
      this.actionLoading = true
      try {
        await paymentApi.refund(this.selectedTx.id, this.refundReason)
        this.showToastMsg(`Hoàn tiền ${this.selectedTx.txId} thành công`)
        this.showRefund = false
        await this.loadTransactions()
        await this.loadStats()
      } catch (err) {
        this.showToastMsg(err.response?.data?.message || 'Lỗi hoàn tiền', 'error')
      } finally {
        this.actionLoading = false
      }
    },

    async deletePayment(tx) {
      if (!confirm(`Xóa giao dịch ${tx.txId}? Thao tác này không thể hoàn tác.`)) return
      this.actionLoading = true
      try {
        await paymentApi.remove(tx.id)
        this.showToastMsg(`Đã xóa giao dịch ${tx.txId}`)
        await this.loadTransactions()
        await this.loadStats()
      } catch (err) {
        this.showToastMsg(err.response?.data?.message || 'Lỗi xóa giao dịch', 'error')
      } finally {
        this.actionLoading = false
      }
    },

    exportCSV() {
      const headers = ['Mã GD', 'Ngày', 'Hội viên', 'Gói tập', 'Số tiền', 'Phương thức', 'Trạng thái']
      const rows    = this.transactions.map(t => [
        t.txId, t.date, t.memberName, t.package, t.amount, t.method, t.status,
      ])
      const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n')
      const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = `giao-dich-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)
    },
  },
}
</script>

<style scoped>

/* ===== BASE ===== */
.tt-page {
  font-family: 'Inter', 'Segoe UI', sans-serif;
  padding: 28px 28px 40px;
}

/* ===== PAGE HEADER ===== */
.page-header { margin-bottom: 22px; }
.page-title {
  font-size: 1.55rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 6px;
  letter-spacing: -0.3px;
}
.page-subtitle {
  font-size: 0.82rem;
  color: #94a3b8;
  margin: 0;
}

/* ===== STATS ROW ===== */
.stats-row {
  display: flex;
  gap: 18px;
  margin-bottom: 20px;
  align-items: stretch;
}

/* Revenue card (dark green) */
.revenue-card {
  flex: 1;
  background: linear-gradient(145deg, #1a4d24 0%, #1c5e2e 60%, #14532d 100%);
  border-radius: 16px;
  padding: 24px 28px 22px;
  color: #fff;
  box-shadow: 0 4px 20px rgba(26, 77, 36, 0.35);
}
.live-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 20px;
  padding: 4px 12px;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 1px;
  color: #a7f3b8;
  margin-bottom: 12px;
}
.live-dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #4ade80;
  box-shadow: 0 0 6px #4ade80;
  animation: pulse 1.5s infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
}
.revenue-label {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.65);
  margin-bottom: 6px;
}
.revenue-amount {
  font-size: 2.2rem;
  font-weight: 800;
  color: #fff;
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 22px;
  flex-wrap: wrap;
}
.revenue-unit {
  font-size: 1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
}
.revenue-change {
  font-size: 0.78rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
}
.revenue-change.positive {
  background: rgba(74, 222, 128, 0.2);
  border: 1px solid rgba(74, 222, 128, 0.35);
  color: #4ade80;
}
.revenue-change.negative {
  background: rgba(248, 113, 113, 0.2);
  border: 1px solid rgba(248, 113, 113, 0.35);
  color: #fca5a5;
}
.revenue-stats {
  display: flex;
  align-items: center;
  gap: 0;
}
.rev-stat { flex: 1; }
.rev-divider {
  width: 1px;
  height: 36px;
  background: rgba(255, 255, 255, 0.15);
  margin: 0 20px;
}
.rev-stat-label {
  font-size: 0.62rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.8px;
  text-transform: uppercase;
  margin-bottom: 4px;
}
.rev-stat-val {
  font-size: 1.3rem;
  font-weight: 800;
  color: #fff;
}
.rev-stat-sub {
  font-size: 0.72rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.55);
  margin-left: 3px;
}

/* Skeleton */
.skeleton-text {
  display: inline-block;
  background: rgba(255,255,255,0.15);
  border-radius: 4px;
  min-width: 60px;
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  0%   { opacity: 0.6; }
  50%  { opacity: 1; }
  100% { opacity: 0.6; }
}

/* Breakdown card */
.breakdown-card {
  width: 240px;
  flex-shrink: 0;
  background: #fff;
  border-radius: 16px;
  padding: 20px 20px 16px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
}
.breakdown-title {
  font-size: 0.82rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 16px;
}
.breakdown-list { flex: 1; display: flex; flex-direction: column; gap: 14px; }
.breakdown-skeleton {
  height: 36px;
  background: #f1f5f9;
  border-radius: 8px;
  animation: shimmer 1.5s infinite;
}
.breakdown-top {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 5px;
}
.breakdown-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.breakdown-label {
  font-size: 0.78rem;
  color: #334155;
  flex: 1;
}
.breakdown-pct {
  font-size: 0.78rem;
  font-weight: 700;
  color: #0f172a;
}
.breakdown-bar-bg {
  height: 5px;
  background: #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
}
.breakdown-bar-fill {
  height: 100%;
  border-radius: 10px;
  transition: width 0.6s;
}
.btn-detailed {
  margin-top: 16px;
  background: none;
  border: none;
  color: #16a34a;
  font-size: 0.78rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  text-align: left;
  padding: 0;
  transition: color 0.15s;
}
.btn-detailed:hover { color: #14532d; }

/* ===== TABLE CARD ===== */
.table-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  position: relative;
}
.table-head-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-bottom: 1px solid #f1f5f9;
  flex-wrap: wrap;
  gap: 10px;
}

/* Tabs */
.table-tabs { display: flex; gap: 2px; }
.tab-btn {
  padding: 7px 16px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: #64748b;
  font-size: 0.82rem;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.18s;
}
.tab-btn:hover  { background: #f1f5f9; color: #334155; }
.tab-btn.active { background: #1a4d24; color: #fff; font-weight: 700; }

/* Actions */
.table-head-actions { display: flex; gap: 8px; align-items: center; }

/* Search */
.search-wrap {
  display: flex;
  align-items: center;
  gap: 7px;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  padding: 6px 10px;
  transition: border-color 0.2s;
}
.search-wrap:focus-within { border-color: #2d7a3a; }
.search-ico { color: #94a3b8; font-size: 0.75rem; }
.search-input {
  border: none;
  outline: none;
  background: transparent;
  font-size: 0.82rem;
  color: #334155;
  font-family: inherit;
  width: 130px;
}
.search-input::placeholder { color: #94a3b8; }

.btn-export {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.18s;
  background: #fff;
  border: 1.5px solid #e2e8f0;
  color: #475569;
}
.btn-export:hover { border-color: #2d7a3a; color: #2d7a3a; background: #f0fdf4; }

/* Loading overlay */
.loading-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 48px;
  color: #64748b;
  font-size: 0.88rem;
}
.loading-spinner {
  width: 22px;
  height: 22px;
  border: 2px solid #e2e8f0;
  border-top-color: #2d7a3a;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Table */
.tt-table-wrap { overflow-x: auto; }
.tt-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.84rem;
}
.tt-table th {
  padding: 10px 14px;
  text-align: left;
  font-size: 0.65rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.7px;
  border-bottom: 1px solid #f1f5f9;
  white-space: nowrap;
  background: #fff;
}
.tt-table td {
  padding: 13px 14px;
  border-bottom: 1px solid #f8fafc;
  vertical-align: middle;
}
.tt-table tr:last-child td { border-bottom: none; }
.tt-table tbody tr:hover td { background: #fafcfa; }

.tx-id {
  font-family: 'Courier New', monospace;
  font-size: 0.78rem;
  font-weight: 700;
  color: #334155;
}
.tx-date {
  font-size: 0.78rem;
  color: #64748b;
  white-space: nowrap;
}
.member-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}
.member-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}
.member-name { font-size: 0.84rem; font-weight: 500; color: #0f172a; }

/* Package badges */
.pkg-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.4px;
  white-space: nowrap;
  text-align: center;
}
.pkg-elite   { background: #0f172a; color: #fbbf24; }
.pkg-monthly { background: #dbeafe; color: #1d4ed8; }
.pkg-pt      { background: #dcfce7; color: #16a34a; }

.tx-amount {
  font-size: 0.84rem;
  font-weight: 700;
  color: #0f172a;
}
.tx-amount-sub { font-size: 0.68rem; color: #94a3b8; }
.method-cell {
  display: flex;
  align-items: center;
  gap: 6px;
}
.method-icon { color: #64748b; font-size: 0.78rem; }
.method-label { font-size: 0.8rem; color: #475569; font-weight: 500; }

/* Status badge */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.74rem;
  font-weight: 600;
}
.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}
.st-completed { background: #f0fdf4; color: #16a34a; }
.st-completed .status-dot { background: #16a34a; }
.st-pending   { background: #fffbeb; color: #d97706; }
.st-pending   .status-dot { background: #f59e0b; }
.st-refunded  { background: #fff1f2; color: #e11d48; }
.st-refunded  .status-dot { background: #e11d48; }

/* Actions */
.action-btns { display: flex; gap: 5px; }
.action-btn {
  width: 28px;
  height: 28px;
  border: 1.5px solid #e2e8f0;
  border-radius: 7px;
  background: #fff;
  color: #475569;
  font-size: 0.7rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}
.action-btn:hover         { background: #f0fdf4; border-color: #2d7a3a; color: #2d7a3a; }
.action-btn.danger:hover  { background: #fee2e2; border-color: #fca5a5; color: #dc2626; }
.action-btn.confirm:hover { background: #f0fdf4; border-color: #16a34a; color: #16a34a; }
.action-btn.refund:hover  { background: #fef9c3; border-color: #f59e0b; color: #d97706; }

/* Pay button */
.btn-pay {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 15px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.18s;
  background: #2d7a3a;
  border: 1.5px solid #2d7a3a;
  color: #fff;
}
.btn-pay:hover { background: #245f2e; border-color: #245f2e; transform: translateY(-1px); box-shadow: 0 3px 10px rgba(45,122,58,0.3); }

.empty-row {
  text-align: center;
  padding: 40px !important;
  color: #94a3b8;
  font-size: 0.875rem;
}
.empty-row i { margin-right: 8px; }

/* Pagination */
.pagination-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-top: 1px solid #f1f5f9;
  flex-wrap: wrap;
  gap: 8px;
}
.pagination-info { font-size: 0.78rem; color: #64748b; }
.pagination-controls { display: flex; gap: 4px; }
.page-btn {
  min-width: 30px;
  height: 30px;
  padding: 0 5px;
  border: 1.5px solid #e2e8f0;
  border-radius: 7px;
  background: #fff;
  color: #475569;
  font-size: 0.8rem;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.18s;
}
.page-btn:hover:not(:disabled) { border-color: #2d7a3a; color: #2d7a3a; background: #f0fdf4; }
.page-btn.active { background: #2d7a3a; border-color: #2d7a3a; color: #fff; font-weight: 700; }
.page-btn:disabled { opacity: 0.35; cursor: not-allowed; }

/* ===== MODAL ===== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  animation: fadeIn 0.2s ease;
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.detail-modal {
  background: #fff;
  border-radius: 16px;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.18);
  animation: slideUp 0.22s ease;
  overflow: hidden;
}
@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
}
.modal-header h3 {
  font-size: 0.95rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}
.modal-close {
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 1rem;
  cursor: pointer;
  transition: color 0.15s;
}
.modal-close:hover { color: #334155; }
.modal-body { padding: 18px 20px; }
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f8fafc;
  gap: 12px;
}
.detail-row:last-child { border-bottom: none; }
.dl { font-size: 0.78rem; color: #64748b; flex-shrink: 0; }
.dv { font-size: 0.82rem; font-weight: 600; color: #0f172a; text-align: right; }
.promo-tag {
  background: #dcfce7;
  color: #16a34a;
  padding: 2px 8px;
  border-radius: 12px;
  font-family: monospace;
  font-size: 0.78rem;
}
.note-text { color: #64748b; font-weight: 400; font-style: italic; }

/* Refund modal */
.refund-amount {
  font-size: 0.88rem;
  color: #334155;
  margin: 0 0 14px;
}
.refund-amount strong { color: #dc2626; }
.field-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 8px;
  display: block;
}
.refund-textarea {
  width: 100%;
  border: 1.5px solid #e2e8f0;
  border-radius: 9px;
  padding: 10px 12px;
  font-size: 0.83rem;
  color: #334155;
  font-family: inherit;
  resize: none;
  outline: none;
  background: #f8fafc;
  box-sizing: border-box;
  transition: border-color 0.2s;
}
.refund-textarea:focus { border-color: #2d7a3a; background: #fff; }
.modal-actions {
  display: flex;
  gap: 10px;
  margin-top: 16px;
  justify-content: flex-end;
}
.btn-cancel-modal {
  padding: 9px 18px;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  color: #64748b;
  font-size: 0.82rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-cancel-modal:hover { border-color: #94a3b8; color: #334155; }
.btn-refund-confirm {
  padding: 9px 18px;
  border: none;
  border-radius: 8px;
  background: #dc2626;
  color: #fff;
  font-size: 0.82rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.15s;
}
.btn-refund-confirm:hover:not(:disabled) { background: #b91c1c; }
.btn-refund-confirm:disabled { opacity: 0.5; cursor: not-allowed; }

/* ===== TOAST ===== */
.toast {
  position: fixed;
  bottom: 28px;
  right: 28px;
  padding: 12px 18px;
  border-radius: 10px;
  font-size: 0.84rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  transform: translateY(20px);
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 200;
  pointer-events: none;
}
.toast.show { transform: translateY(0); opacity: 1; }
.toast.success { background: #1a4d24; color: #fff; }
.toast.error   { background: #dc2626; color: #fff; }

/* ===== RESPONSIVE ===== */
@media (max-width: 900px) {
  .tt-page   { padding: 16px; }
  .stats-row { flex-direction: column; }
  .breakdown-card { width: 100%; }
  .table-head-row { flex-direction: column; align-items: flex-start; }
}

</style>
