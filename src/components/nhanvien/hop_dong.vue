<template>
  <div class="hd-page">

    <!-- ===== Page Header ===== -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Quản lý Hợp đồng &amp; Gia hạn</h1>
        <p class="page-subtitle">Optimize membership lifecycle with precision tracking and seamless renewal workflows.</p>
      </div>
    </div>

    <!-- ===== Two-Column Layout ===== -->
    <div class="hd-layout">

      <!-- ========== LEFT COL ========== -->
      <div class="hd-main">

        <!-- Current Contract Card -->
        <div class="contract-card">
          <div class="contract-card-head">
            <span class="cc-title">Hợp đồng hiện tại</span>
            <span class="badge-active">ACTIVE</span>
          </div>
          <div class="cc-grid">
            <div class="cc-field">
              <div class="cc-label">MEMBER NAME</div>
              <div class="cc-value">{{ currentContract.memberName }}</div>
            </div>
            <div class="cc-field">
              <div class="cc-label">PACKAGE</div>
              <div class="cc-value">{{ currentContract.package }}</div>
            </div>
            <div class="cc-field">
              <div class="cc-label">START DATE</div>
              <div class="cc-value">{{ currentContract.startDate }}</div>
            </div>
            <div class="cc-field">
              <div class="cc-label">END DATE</div>
              <div class="cc-value cc-red">{{ currentContract.endDate }}</div>
            </div>
          </div>
          <div class="lifecycle-row">
            <span class="lifecycle-label">Contract Lifecycle</span>
            <span class="lifecycle-pct">{{ currentContract.progress }}% Complete</span>
          </div>
          <div class="lifecycle-bar">
            <div class="lifecycle-fill" :style="{ width: currentContract.progress + '%' }"></div>
          </div>
          <div class="cc-warning" v-if="currentContract.warningMsg">
            <i class="fas fa-circle warning-dot"></i>
            {{ currentContract.warningMsg }}
          </div>
        </div>

        <!-- Contract List -->
        <div class="list-card">
          <div class="list-head">
            <span class="list-title">Danh sách hợp đồng</span>
            <div class="list-actions">
              <button class="btn-filter"><i class="fas fa-filter"></i> Filter</button>
              <button class="btn-export"><i class="fas fa-file-export"></i> Export</button>
            </div>
          </div>

          <!-- Search + Status tabs -->
          <div class="list-toolbar">
            <div class="list-search">
              <i class="fas fa-search"></i>
              <input
                v-model="searchQ"
                type="text"
                placeholder="Tìm theo tên, ID, SĐT..."
                class="list-search-input"
              />
            </div>
            <div class="list-tabs">
              <button
                v-for="t in tabs"
                :key="t.key"
                class="tab-btn"
                :class="{ active: activeTab === t.key, [t.cls]: true }"
                @click="setTab(t.key)"
              >{{ t.label }}</button>
            </div>
          </div>

          <!-- Table -->
          <div class="hd-table-wrap">
            <table class="hd-table">
              <thead>
                <tr>
                  <th>CONTRACT ID</th>
                  <th>MEMBER NAME</th>
                  <th>PACKAGE</th>
                  <th>STATUS</th>
                  <th>EXPIRY DATE</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="c in paginatedContracts" :key="c.id">
                  <td>
                    <span class="contract-id">{{ c.contractId }}</span>
                  </td>
                  <td>
                    <div class="member-cell">
                      <img
                        :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(c.memberName)}&background=${c.avatarBg}&color=fff&bold=true&size=60`"
                        class="member-avatar"
                        :alt="c.memberName"
                      />
                      <span class="member-name">{{ c.memberName }}</span>
                    </div>
                  </td>
                  <td>
                    <div class="pkg-name">{{ c.package }}</div>
                  </td>
                  <td>
                    <span class="status-badge" :class="c.statusClass">{{ c.status }}</span>
                  </td>
                  <td>
                    <div class="expiry-date" :class="{ 'expiry-red': c.statusClass === 'st-expired' }">
                      {{ c.expiryDate }}
                    </div>
                  </td>
                  <td>
                    <div class="action-btns">
                      <button class="action-btn" title="Xem chi tiết"><i class="fas fa-eye"></i></button>
                      <button class="action-btn" title="Chỉnh sửa"><i class="fas fa-pen"></i></button>
                    </div>
                  </td>
                </tr>
                <tr v-if="paginatedContracts.length === 0">
                  <td colspan="6" class="empty-row">
                    <i class="fas fa-file-contract"></i> Không tìm thấy hợp đồng phù hợp.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="pagination-bar">
            <span class="pagination-info">Showing 1 to {{ paginatedContracts.length }} of {{ filteredContracts.length }} entries</span>
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

      <!-- ========== RIGHT COL ========== -->
      <div class="hd-sidebar">

        <!-- Gia hạn -->
        <div class="side-card renew-card">
          <div class="side-card-title">
            <i class="fas fa-sync-alt"></i> Gia hạn Hợp đồng
          </div>
          <div class="side-field">
            <div class="side-label">NEW PACKAGE SELECTION</div>
            <select class="side-select" v-model="renewPackage">
              <option v-for="pkg in packages" :key="pkg" :value="pkg">{{ pkg }}</option>
            </select>
          </div>
          <div class="side-field">
            <div class="side-label">NEW START DATE</div>
            <div class="date-input-wrap">
              <input type="date" class="side-date" v-model="renewDate" />
            </div>
          </div>
          <button class="btn-renew" @click="doRenew">Gia hạn hợp đồng</button>
        </div>

        <!-- Hủy hợp đồng -->
        <div class="side-card cancel-card">
          <div class="side-card-title cancel-title">
            <i class="fas fa-times-circle"></i> Hủy hợp đồng
          </div>
          <div class="side-label cancel-label">REASON FOR CANCELLATION (REQUIRED)</div>
          <textarea
            v-model="cancelReason"
            class="cancel-textarea"
            placeholder="Describe member reason for termination..."
            rows="4"
          ></textarea>
          <button class="btn-cancel-link" @click="doCancel">Hủy hợp đồng</button>
        </div>

        <!-- Billing Support -->
        <div class="side-card billing-card">
          <div class="billing-row">
            <div class="billing-icon"><i class="fas fa-headset"></i></div>
            <div class="billing-info">
              <div class="billing-title">Billing Support</div>
              <div class="billing-sub">Request manual override</div>
            </div>
            <i class="fas fa-chevron-right billing-arrow"></i>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'HopDong',
  data() {
    return {
      searchQ: '',
      activeTab: 'all',
      currentPage: 1,
      perPage: 5,
      renewPackage: 'Platinum Performance (12m)',
      renewDate: '2026-04-03',
      cancelReason: '',
      packages: [
        'Platinum Performance (12m)',
        'Elite Performance 12M',
        'Standard Plus 3M',
        'Flex Standard 1M',
      ],
      currentContract: {
        memberName: 'Trần Hoàng Nam',
        package: 'Platinum Performance (12m)',
        startDate: '15 Jan 2023',
        endDate: '15 Jan 2024',
        progress: 85,
        warningMsg: 'Contract expires in 22 days . Recommend immediate renewal protocol.',
      },
      tabs: [
        { key: 'all',     label: 'Tất cả', cls: 'tab-all'     },
        { key: 'active',  label: 'Active',  cls: 'tab-active'  },
        { key: 'expired', label: 'Expired', cls: 'tab-expired' },
        { key: 'pending', label: 'Pending', cls: 'tab-pending' },
      ],
      contracts: [
        {
          id: 1, contractId: '#CN-2542', memberName: 'Lina Sterling', avatarBg: 'f59e0b',
          package: 'Flex Standard 1M', status: 'EXPIRED', statusClass: 'st-expired',
          expiryDate: 'Oct 26, 2023',
        },
        {
          id: 2, contractId: '#CN-2599', memberName: 'Robert Wade', avatarBg: '16a34a',
          package: 'Elite Performance 12M', status: 'ACTIVE', statusClass: 'st-active',
          expiryDate: 'Dec 01, 2024',
        },
        {
          id: 3, contractId: '#CN-2601', memberName: 'Trần Hoàng Nam', avatarBg: '14b8a6',
          package: 'Platinum Performance 12M', status: 'ACTIVE', statusClass: 'st-active',
          expiryDate: '15 Jan 2024',
        },
        {
          id: 4, contractId: '#CN-2614', memberName: 'Lê Thu Thảo', avatarBg: 'ec4899',
          package: 'Standard Plus 3M', status: 'PENDING', statusClass: 'st-pending',
          expiryDate: '30 Jan 2024',
        },
        {
          id: 5, contractId: '#CN-2620', memberName: 'Nguyễn Minh Anh', avatarBg: 'f59e0b',
          package: 'Elite Platinum 12M', status: 'ACTIVE', statusClass: 'st-active',
          expiryDate: '15 Dec 2024',
        },
        {
          id: 6, contractId: '#CN-2635', memberName: 'Phạm Quốc Hùng', avatarBg: '6366f1',
          package: 'Standard Plus 3M', status: 'EXPIRED', statusClass: 'st-expired',
          expiryDate: '01 Sep 2023',
        },
        {
          id: 7, contractId: '#CN-2650', memberName: 'Hoàng Thị Lan', avatarBg: '8b5cf6',
          package: 'Elite Performance 12M', status: 'ACTIVE', statusClass: 'st-active',
          expiryDate: '10 Mar 2025',
        },
        {
          id: 8, contractId: '#CN-2667', memberName: 'Vũ Đức Minh', avatarBg: '0ea5e9',
          package: 'Flex Standard 1M', status: 'PENDING', statusClass: 'st-pending',
          expiryDate: '05 Feb 2024',
        },
        {
          id: 9, contractId: '#CN-2680', memberName: 'Bùi Thúy Nga', avatarBg: 'd97706',
          package: 'Platinum Performance 12M', status: 'ACTIVE', statusClass: 'st-active',
          expiryDate: '20 Nov 2025',
        },
        {
          id: 10, contractId: '#CN-2701', memberName: 'Đinh Công Sơn', avatarBg: 'a855f7',
          package: 'Standard Plus 3M', status: 'EXPIRED', statusClass: 'st-expired',
          expiryDate: '14 Feb 2024',
        },
      ],
    }
  },
  computed: {
    filteredContracts() {
      let list = this.contracts
      const q = this.searchQ.trim().toLowerCase()
      if (q) {
        list = list.filter(c =>
          c.memberName.toLowerCase().includes(q) ||
          c.contractId.toLowerCase().includes(q)
        )
      }
      if (this.activeTab !== 'all') {
        const map = { active: 'ACTIVE', expired: 'EXPIRED', pending: 'PENDING' }
        list = list.filter(c => c.status === map[this.activeTab])
      }
      return list
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.filteredContracts.length / this.perPage))
    },
    paginatedContracts() {
      const start = (this.currentPage - 1) * this.perPage
      return this.filteredContracts.slice(start, start + this.perPage)
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
    doRenew() {
      alert(`Gia hạn thành công!\nGói: ${this.renewPackage}\nNgày bắt đầu: ${this.renewDate}`)
    },
    doCancel() {
      if (!this.cancelReason.trim()) {
        alert('Vui lòng nhập lý do hủy hợp đồng.')
        return
      }
      alert(`Đã gửi yêu cầu hủy hợp đồng.\nLý do: ${this.cancelReason}`)
      this.cancelReason = ''
    },
  },
  watch: {
    searchQ() { this.currentPage = 1 },
  },
}
</script>

<style scoped>

/* ===== BASE ===== */
.hd-page {
  font-family: 'Inter', 'Segoe UI', sans-serif;
  padding: 28px 28px 40px;
}

/* ===== PAGE HEADER ===== */
.page-header {
  margin-bottom: 22px;
}
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

/* ===== TWO-COLUMN LAYOUT ===== */
.hd-layout {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}
.hd-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.hd-sidebar {
  width: 240px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* ===== CURRENT CONTRACT CARD ===== */
.contract-card {
  background: #fff;
  border-radius: 14px;
  padding: 20px 22px 18px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.06);
}
.contract-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.cc-title {
  font-size: 0.88rem;
  font-weight: 600;
  color: #334155;
}
.badge-active {
  background: #dcfce7;
  color: #16a34a;
  font-size: 0.68rem;
  font-weight: 800;
  padding: 4px 12px;
  border-radius: 20px;
  letter-spacing: 0.5px;
}
.cc-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px 20px;
  margin-bottom: 18px;
}
.cc-label {
  font-size: 0.62rem;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  margin-bottom: 4px;
}
.cc-value {
  font-size: 0.96rem;
  font-weight: 600;
  color: #0f172a;
}
.cc-red { color: #ef4444; }

.lifecycle-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 7px;
}
.lifecycle-label { font-size: 0.77rem; color: #64748b; }
.lifecycle-pct   { font-size: 0.77rem; color: #16a34a; font-weight: 600; }

.lifecycle-bar {
  height: 8px;
  background: #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 14px;
}
.lifecycle-fill {
  height: 100%;
  background: linear-gradient(90deg, #f59e0b, #f97316);
  border-radius: 10px;
  transition: width 0.4s;
}

.cc-warning {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 0.8rem;
  color: #92400e;
}
.warning-dot {
  color: #f59e0b;
  font-size: 0.5rem;
  margin-top: 1px;
}

/* ===== CONTRACT LIST CARD ===== */
.list-card {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}
.list-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px 12px;
  border-bottom: 1px solid #f1f5f9;
}
.list-title {
  font-size: 0.92rem;
  font-weight: 700;
  color: #0f172a;
}
.list-actions { display: flex; gap: 8px; }
.btn-filter,
.btn-export {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  color: #475569;
  font-size: 0.78rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.18s;
}
.btn-filter:hover,
.btn-export:hover { border-color: #2d7a3a; color: #2d7a3a; background: #f0fdf4; }

/* Search + Tabs toolbar */
.list-toolbar {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 20px;
  flex-wrap: wrap;
}
.list-search {
  position: relative;
  flex: 1;
  min-width: 160px;
}
.list-search i {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 0.8rem;
}
.list-search-input {
  width: 100%;
  padding: 7px 12px 7px 30px;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
  font-size: 0.83rem;
  color: #334155;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
}
.list-search-input:focus { border-color: #2d7a3a; background: #fff; }

.list-tabs {
  display: flex;
  gap: 4px;
}
.tab-btn {
  padding: 6px 14px;
  border-radius: 20px;
  border: 1.5px solid #e2e8f0;
  background: #fff;
  color: #64748b;
  font-size: 0.78rem;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.18s;
}
.tab-btn:hover { border-color: #cbd5e1; background: #f8fafc; }
.tab-btn.tab-all.active     { background: #2d7a3a; border-color: #2d7a3a; color: #fff; }
.tab-btn.tab-active.active  { background: #dcfce7; border-color: #16a34a; color: #16a34a; }
.tab-btn.tab-expired.active { background: #fee2e2; border-color: #ef4444; color: #dc2626; }
.tab-btn.tab-pending.active { background: #fef3c7; border-color: #f59e0b; color: #b45309; }

/* Table */
.hd-table-wrap { overflow-x: auto; }
.hd-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.84rem;
}
.hd-table th {
  padding: 10px 16px;
  text-align: left;
  font-size: 0.66rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  background: #f8fafc;
  border-bottom: 1px solid #f1f5f9;
  white-space: nowrap;
}
.hd-table td {
  padding: 13px 16px;
  border-bottom: 1px solid #f8fafc;
  vertical-align: middle;
}
.hd-table tr:last-child td { border-bottom: none; }
.hd-table tbody tr:hover td { background: #fafbfc; }

.contract-id {
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  font-weight: 700;
  color: #334155;
}
.member-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}
.member-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}
.member-name { font-size: 0.84rem; font-weight: 500; color: #0f172a; }

.pkg-name { font-size: 0.82rem; color: #334155; }

.status-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 0.67rem;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}
.st-active  { background: #dcfce7; color: #16a34a; }
.st-expired { background: #fee2e2; color: #dc2626; }
.st-pending { background: #fef3c7; color: #b45309; }

.expiry-date { font-size: 0.82rem; color: #334155; font-weight: 500; }
.expiry-red  { color: #dc2626; }

.action-btns { display: flex; gap: 5px; }
.action-btn {
  width: 28px;
  height: 28px;
  border: 1.5px solid #e2e8f0;
  border-radius: 7px;
  background: #fff;
  color: #475569;
  font-size: 0.72rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}
.action-btn:hover { background: #f0fdf4; border-color: #2d7a3a; color: #2d7a3a; }

.empty-row {
  text-align: center;
  padding: 36px !important;
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

/* ===== SIDEBAR CARDS ===== */
.side-card {
  background: #fff;
  border-radius: 13px;
  padding: 16px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
}
.side-card-title {
  font-size: 0.87rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 7px;
}
.side-card-title i { color: #16a34a; }

.side-field { margin-bottom: 12px; }
.side-label {
  font-size: 0.6rem;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 6px;
}
.side-select {
  width: 100%;
  padding: 8px 10px;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.82rem;
  color: #334155;
  font-family: inherit;
  outline: none;
  background: #f8fafc;
  cursor: pointer;
  transition: border-color 0.2s;
}
.side-select:focus { border-color: #2d7a3a; }

.date-input-wrap { position: relative; }
.side-date {
  width: 100%;
  padding: 8px 10px;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.82rem;
  color: #334155;
  font-family: inherit;
  outline: none;
  background: #f8fafc;
  transition: border-color 0.2s;
}
.side-date:focus { border-color: #2d7a3a; }

.btn-renew {
  width: 100%;
  padding: 11px;
  background: #1a4d24;
  color: #fff;
  border: none;
  border-radius: 9px;
  font-size: 0.87rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 4px;
}
.btn-renew:hover { background: #133a1b; transform: translateY(-1px); }

/* Cancel card */
.cancel-card { border: 1.5px solid #fecaca; }
.cancel-title { color: #dc2626 !important; }
.cancel-title i { color: #dc2626 !important; }
.cancel-label { margin-bottom: 8px; }
.cancel-textarea {
  width: 100%;
  padding: 9px 10px;
  border: 1.5px solid #fecaca;
  border-radius: 8px;
  font-size: 0.81rem;
  color: #334155;
  font-family: inherit;
  outline: none;
  resize: none;
  background: #fff5f5;
  transition: border-color 0.2s;
  box-sizing: border-box;
}
.cancel-textarea:focus { border-color: #ef4444; }
.btn-cancel-link {
  display: block;
  width: 100%;
  text-align: right;
  background: none;
  border: none;
  color: #dc2626;
  font-size: 0.82rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  margin-top: 8px;
  padding: 0;
  transition: color 0.15s;
}
.btn-cancel-link:hover { color: #991b1b; }

/* Billing card */
.billing-card { cursor: pointer; transition: box-shadow 0.2s; }
.billing-card:hover { box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1); }
.billing-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.billing-icon {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #f0fdf4;
  border: 1.5px solid #bbf7d0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #16a34a;
  font-size: 0.85rem;
  flex-shrink: 0;
}
.billing-title { font-size: 0.85rem; font-weight: 700; color: #0f172a; }
.billing-sub   { font-size: 0.73rem; color: #16a34a; margin-top: 1px; }
.billing-arrow { color: #16a34a; font-size: 0.78rem; margin-left: auto; }

/* ===== RESPONSIVE ===== */
@media (max-width: 900px) {
  .hd-page   { padding: 16px; }
  .hd-layout { flex-direction: column; }
  .hd-sidebar { width: 100%; }
}

</style>
