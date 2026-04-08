<template>
  <div class="tt-page">

    <!-- ===== Page Header ===== -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Quản Lý Thanh Toán</h1>
        <p class="page-subtitle">Review and manage elite membership transactions.</p>
      </div>
    </div>

    <!-- ===== Top Stats Row ===== -->
    <div class="stats-row">

      <!-- Revenue card (dark green) -->
      <div class="revenue-card">
        <div class="live-badge">
          <span class="live-dot"></span> LIVE METRICS
        </div>
        <div class="revenue-label">Today's Total Revenue</div>
        <div class="revenue-amount">
          {{ todayRevenue.toLocaleString('vi-VN') }}
          <span class="revenue-unit">VND</span>
          <span class="revenue-change">↑ +14.2%</span>
        </div>
        <div class="revenue-stats">
          <div class="rev-stat">
            <div class="rev-stat-label">COMPLETED</div>
            <div class="rev-stat-val">{{ completedCount }} <span class="rev-stat-sub">deals</span></div>
          </div>
          <div class="rev-divider"></div>
          <div class="rev-stat">
            <div class="rev-stat-label">AVG TICKET</div>
            <div class="rev-stat-val">{{ avgTicket }} <span class="rev-stat-sub">VND</span></div>
          </div>
          <div class="rev-divider"></div>
          <div class="rev-stat">
            <div class="rev-stat-label">REFUNDED</div>
            <div class="rev-stat-val">{{ refundedCount }} <span class="rev-stat-sub">txns</span></div>
          </div>
        </div>
      </div>

      <!-- Payment method breakdown -->
      <div class="breakdown-card">
        <div class="breakdown-title">Payment Method Breakdown</div>
        <div class="breakdown-list">
          <div class="breakdown-item" v-for="m in paymentMethods" :key="m.label">
            <div class="breakdown-top">
              <span class="breakdown-dot" :style="{ background: m.color }"></span>
              <span class="breakdown-label">{{ m.label }}</span>
              <span class="breakdown-pct">{{ m.pct }}%</span>
            </div>
            <div class="breakdown-bar-bg">
              <div class="breakdown-bar-fill" :style="{ width: m.pct + '%', background: m.color }"></div>
            </div>
          </div>
        </div>
        <button class="btn-detailed">Detailed Analytics →</button>
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
          <button class="btn-export"><i class="fas fa-download"></i> Export CSV</button>
          <button class="btn-manual"><i class="fas fa-plus"></i> Manual Entry</button>
          <button class="btn-pay" @click="goToPayment"><i class="fas fa-cash-register"></i> Thanh toán</button>
        </div>
      </div>

      <!-- Table -->
      <div class="tt-table-wrap">
        <table class="tt-table">
          <thead>
            <tr>
              <th>TRANSACTION ID</th>
              <th>DATE</th>
              <th>MEMBER NAME</th>
              <th>PACKAGE</th>
              <th>AMOUNT</th>
              <th>METHOD</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tx in paginatedTx" :key="tx.id">
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
                <div class="tx-amount">{{ tx.amount.toLocaleString('vi-VN') }}</div>
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
                  <button class="action-btn" title="Xem"><i class="fas fa-eye"></i></button>
                  <button class="action-btn" title="Sửa"><i class="fas fa-pen"></i></button>
                  <button class="action-btn danger" title="Xoá"><i class="fas fa-trash-alt"></i></button>
                </div>
              </td>
            </tr>
            <tr v-if="paginatedTx.length === 0">
              <td colspan="8" class="empty-row">
                <i class="fas fa-receipt"></i> Không tìm thấy giao dịch.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination-bar">
        <span class="pagination-info">Showing {{ pageStart }}-{{ pageEnd }} of {{ filteredTx.length }} transactions</span>
        <div class="pagination-controls">
          <button class="page-btn" :disabled="currentPage === 1" @click="currentPage--">
            <i class="fas fa-chevron-left"></i>
          </button>
          <button
            v-for="p in visiblePages"
            :key="p"
            class="page-btn"
            :class="{ active: currentPage === p }"
            @click="currentPage = p"
          >{{ p }}</button>
          <button class="page-btn" :disabled="currentPage === totalPages" @click="currentPage++">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
export default {
  name: 'ThuTien',
  data() {
    return {
      activeTab: 'all',
      currentPage: 1,
      perPage: 6,
      todayRevenue: 42850000,
      completedCount: 38,
      avgTicket: '1.1M',
      refundedCount: 3,
      paymentMethods: [
        { label: 'Credit Card',   pct: 65, color: '#22c55e' },
        { label: 'Bank Transfer', pct: 25, color: '#16a34a' },
        { label: 'Cash / Other',  pct: 10, color: '#86efac' },
      ],
      tabs: [
        { key: 'all',       label: 'All Transactions' },
        { key: 'completed', label: 'Completed' },
        { key: 'pending',   label: 'Pending' },
        { key: 'refunded',  label: 'Refunded' },
      ],
      transactions: [
        {
          id: 1, txId: '#TRX-8291', date: 'Oct 24, 2023',
          memberName: 'Felix Nguyen',   avatarBg: 'f59e0b',
          package: 'ELITE ANNUAL',  pkgClass: 'pkg-elite',
          amount: 12500000, method: 'VISA',  methodIcon: 'fas fa-credit-card',
          status: 'Completed', statusClass: 'st-completed',
        },
        {
          id: 2, txId: '#TRX-8288', date: 'Oct 23, 2023',
          memberName: 'Luna Tran',     avatarBg: '6366f1',
          package: 'MONTHLY PASS', pkgClass: 'pkg-monthly',
          amount: 1200000,  method: 'Bank', methodIcon: 'fas fa-university',
          status: 'Pending',   statusClass: 'st-pending',
        },
        {
          id: 3, txId: '#TRX-8285', date: 'Oct 22, 2023',
          memberName: 'Marco Pham',    avatarBg: 'ec4899',
          package: 'PT SESSIONS',  pkgClass: 'pkg-pt',
          amount: 5000000,  method: 'Cash', methodIcon: 'fas fa-money-bill-wave',
          status: 'Refunded',  statusClass: 'st-refunded',
        },
        {
          id: 4, txId: '#TRX-8280', date: 'Oct 21, 2023',
          memberName: 'Elara Nguyen',  avatarBg: '14b8a6',
          package: 'ELITE ANNUAL',  pkgClass: 'pkg-elite',
          amount: 12500000, method: 'AMEX', methodIcon: 'fas fa-credit-card',
          status: 'Completed', statusClass: 'st-completed',
        },
        {
          id: 5, txId: '#TRX-8276', date: 'Oct 20, 2023',
          memberName: 'Hoàng Thị Lan', avatarBg: '8b5cf6',
          package: 'MONTHLY PASS', pkgClass: 'pkg-monthly',
          amount: 1200000,  method: 'VISA', methodIcon: 'fas fa-credit-card',
          status: 'Completed', statusClass: 'st-completed',
        },
        {
          id: 6, txId: '#TRX-8271', date: 'Oct 19, 2023',
          memberName: 'Bình Công Sơn', avatarBg: '0ea5e9',
          package: 'PT SESSIONS',  pkgClass: 'pkg-pt',
          amount: 5000000,  method: 'Bank', methodIcon: 'fas fa-university',
          status: 'Pending',   statusClass: 'st-pending',
        },
        {
          id: 7, txId: '#TRX-8265', date: 'Oct 18, 2023',
          memberName: 'Nguyễn Minh Anh', avatarBg: 'd97706',
          package: 'ELITE ANNUAL',  pkgClass: 'pkg-elite',
          amount: 12500000, method: 'VISA', methodIcon: 'fas fa-credit-card',
          status: 'Completed', statusClass: 'st-completed',
        },
        {
          id: 8, txId: '#TRX-8258', date: 'Oct 17, 2023',
          memberName: 'Trần Hoàng Nam', avatarBg: '16a34a',
          package: 'MONTHLY PASS', pkgClass: 'pkg-monthly',
          amount: 1200000,  method: 'Cash', methodIcon: 'fas fa-money-bill-wave',
          status: 'Refunded',  statusClass: 'st-refunded',
        },
        {
          id: 9, txId: '#TRX-8250', date: 'Oct 16, 2023',
          memberName: 'Phạm Quốc Hùng', avatarBg: 'a855f7',
          package: 'PT SESSIONS',  pkgClass: 'pkg-pt',
          amount: 5000000,  method: 'Bank', methodIcon: 'fas fa-university',
          status: 'Completed', statusClass: 'st-completed',
        },
        {
          id: 10, txId: '#TRX-8244', date: 'Oct 15, 2023',
          memberName: 'Lê Thu Thảo',   avatarBg: 'f43f5e',
          package: 'ELITE ANNUAL',  pkgClass: 'pkg-elite',
          amount: 12500000, method: 'AMEX', methodIcon: 'fas fa-credit-card',
          status: 'Pending',   statusClass: 'st-pending',
        },
      ],
    }
  },
  computed: {
    filteredTx() {
      if (this.activeTab === 'all') return this.transactions
      const map = { completed: 'Completed', pending: 'Pending', refunded: 'Refunded' }
      return this.transactions.filter(t => t.status === map[this.activeTab])
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.filteredTx.length / this.perPage))
    },
    paginatedTx() {
      const start = (this.currentPage - 1) * this.perPage
      return this.filteredTx.slice(start, start + this.perPage)
    },
    pageStart() {
      return this.filteredTx.length === 0 ? 0 : (this.currentPage - 1) * this.perPage + 1
    },
    pageEnd() {
      return Math.min(this.currentPage * this.perPage, this.filteredTx.length)
    },
    visiblePages() {
      const pages = []
      for (let i = 1; i <= Math.min(this.totalPages, 3); i++) pages.push(i)
      return pages
    },
  },
  methods: {
    setTab(key) {
      this.activeTab = key
      this.currentPage = 1
    },
    goToPayment() {
      this.$router.push('/nhanvien/xuly_thanh_toan')
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
  background: rgba(74, 222, 128, 0.2);
  border: 1px solid rgba(74, 222, 128, 0.35);
  color: #4ade80;
  padding: 3px 10px;
  border-radius: 20px;
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

/* Breakdown card */
.breakdown-card {
  width: 220px;
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
.breakdown-item {}
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
.table-head-actions { display: flex; gap: 8px; }
.btn-export,
.btn-manual {
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
}
.btn-export {
  background: #fff;
  border: 1.5px solid #e2e8f0;
  color: #475569;
}
.btn-export:hover { border-color: #2d7a3a; color: #2d7a3a; background: #f0fdf4; }
.btn-manual {
  background: #1a4d24;
  border: 1.5px solid #1a4d24;
  color: #fff;
}
.btn-manual:hover { background: #133a1b; }

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
.action-btn:hover        { background: #f0fdf4; border-color: #2d7a3a; color: #2d7a3a; }
.action-btn.danger:hover { background: #fee2e2; border-color: #fca5a5; color: #dc2626; }

/* Pay button in toolbar */
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

/* ===== RESPONSIVE ===== */
@media (max-width: 900px) {
  .tt-page   { padding: 16px; }
  .stats-row { flex-direction: column; }
  .breakdown-card { width: 100%; }
  .table-head-row { flex-direction: column; align-items: flex-start; }
}

</style>
