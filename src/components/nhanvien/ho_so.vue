<template>
  <div class="hd-page">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Quản lý Hợp đồng &amp; Gia hạn</h1>
        <p class="page-subtitle">Optimize membership lifecycle with precision tracking and seamless renewal workflows.</p>
      </div>
    </div>

    <!-- Main Grid -->
    <div class="hd-grid">
      <!-- LEFT COLUMN -->
      <div class="col-left">

        <!-- Current Contract Card -->
        <div class="contract-current-card">
          <div class="cc-header">
            <span class="cc-title">Hợp đồng hiện tại</span>
            <span class="status-badge" :class="currentContract.statusClass">{{ currentContract.status }}</span>
          </div>

          <div class="cc-info-grid">
            <div class="cc-info-item">
              <div class="cc-info-label">MEMBER NAME</div>
              <div class="cc-info-val">{{ currentContract.memberName }}</div>
            </div>
            <div class="cc-info-item">
              <div class="cc-info-label">PACKAGE</div>
              <div class="cc-info-val">{{ currentContract.package }}</div>
            </div>
            <div class="cc-info-item">
              <div class="cc-info-label">START DATE</div>
              <div class="cc-info-val">{{ currentContract.startDate }}</div>
            </div>
            <div class="cc-info-item">
              <div class="cc-info-label">END DATE</div>
              <div class="cc-info-val" :class="{ 'val-warn': currentContract.expiringSoon }">
                {{ currentContract.endDate }}
              </div>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="lifecycle-wrap">
            <div class="lifecycle-header">
              <span class="lifecycle-label">Contract Lifecycle</span>
              <span class="lifecycle-pct">{{ currentContract.progress }}% Complete</span>
            </div>
            <div class="lifecycle-bar">
              <div
                class="lifecycle-fill"
                :style="{ width: currentContract.progress + '%' }"
                :class="currentContract.progress > 80 ? 'fill-warn' : 'fill-ok'"
              ></div>
            </div>
          </div>

          <!-- Alert note -->
          <div class="contract-alert" v-if="currentContract.expiringSoon">
            <i class="fas fa-exclamation-circle"></i>
            Contract expires in <strong>{{ currentContract.daysLeft }} days</strong>. Recommend immediate renewal protocol.
          </div>
        </div>

        <!-- Contract List -->
        <div class="contract-list-card">
          <div class="list-header">
            <span class="list-title">Danh sách hợp đồng</span>
            <div class="list-actions">
              <button class="btn-filter" @click="showFilter = !showFilter">
                <i class="fas fa-sliders-h"></i> Filter
              </button>
              <button class="btn-export">
                <i class="fas fa-download"></i> Export
              </button>
            </div>
          </div>

          <!-- Filter row -->
          <transition name="fade">
            <div class="filter-row" v-if="showFilter">
              <div class="filter-search">
                <i class="fas fa-search"></i>
                <input v-model="searchQ" type="text" placeholder="Tìm theo tên, ID, SĐT..." @input="currentPage = 1" />
              </div>
              <div class="filter-status">
                <button
                  v-for="f in statusFilters"
                  :key="f.key"
                  class="fsb"
                  :class="{ active: activeFilter === f.key, [f.cls]: true }"
                  @click="activeFilter = f.key; currentPage = 1"
                >{{ f.label }}</button>
              </div>
            </div>
          </transition>

          <!-- Table -->
          <div class="table-wrap">
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
                <tr v-for="c in paginatedContracts" :key="c.id" @click="selectContract(c)" :class="{ 'row-selected': selectedId === c.id }">
                  <td><span class="contract-id">#{{ c.code }}</span></td>
                  <td>
                    <div class="member-cell">
                      <div class="member-avatar" :style="{ background: c.color }">{{ c.initials }}</div>
                      <span class="member-name">{{ c.name }}</span>
                    </div>
                  </td>
                  <td><span class="pkg-text">{{ c.package }}</span></td>
                  <td>
                    <span class="st-badge" :class="c.statusClass">{{ c.status }}</span>
                  </td>
                  <td :class="{ 'expired-date': c.statusClass === 'st-expired' }">{{ c.expiry }}</td>
                  <td>
                    <div class="row-actions">
                      <button class="ract-btn" title="Xem chi tiết" @click.stop="selectContract(c)"><i class="fas fa-eye"></i></button>
                      <button class="ract-btn renew" title="Gia hạn" @click.stop="renewContract(c)"><i class="fas fa-redo"></i></button>
                    </div>
                  </td>
                </tr>
                <tr v-if="paginatedContracts.length === 0">
                  <td colspan="6" class="empty-row">Không tìm thấy hợp đồng phù hợp.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="table-footer">
            <span class="showing-text">Showing {{ pageStart }} of {{ filteredContracts.length }} entries</span>
            <div class="pagination">
              <button class="pg-btn" :disabled="currentPage === 1" @click="currentPage--">
                <i class="fas fa-chevron-left"></i>
              </button>
              <button
                v-for="p in totalPages"
                :key="p"
                class="pg-btn"
                :class="{ active: currentPage === p }"
                @click="currentPage = p"
              >{{ p }}</button>
              <button class="pg-btn" :disabled="currentPage === totalPages" @click="currentPage++">
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN -->
      <div class="col-right">

        <!-- Gia hạn Hợp đồng -->
        <div class="panel-card renew-card">
          <div class="panel-header">
            <div class="panel-icon green"><i class="fas fa-sync-alt"></i></div>
            <span class="panel-title">Gia hạn Hợp đồng</span>
          </div>

          <label class="field-label">NEW PACKAGE SELECTION</label>
          <select v-model="renewal.package" class="field-select">
            <option value="platinum_12">Platinum Performance (12m) - $1,200</option>
            <option value="gold_6">Gold Performance (6m) - $700</option>
            <option value="silver_3">Silver Standard (3m) - $380</option>
            <option value="basic_1">Basic Access (1m) - $150</option>
          </select>

          <label class="field-label mt-field">NEW START DATE</label>
          <input v-model="renewal.startDate" type="date" class="field-input" />

          <button class="btn-renew" @click="confirmRenew">
            Gia hạn hợp đồng
          </button>
        </div>

        <!-- Hủy hợp đồng -->
        <div class="panel-card cancel-card">
          <div class="panel-header">
            <div class="panel-icon red"><i class="fas fa-times-circle"></i></div>
            <span class="panel-title">Hủy hợp đồng</span>
          </div>

          <label class="field-label">REASON FOR CANCELLATION (REQUIRED)</label>
          <textarea
            v-model="cancelReason"
            class="field-textarea"
            placeholder="Describe member reason for termination..."
            rows="4"
          ></textarea>

          <button class="btn-cancel-contract" :disabled="!cancelReason.trim()" @click="confirmCancel">
            Hủy hợp đồng
          </button>
        </div>

        <!-- Billing Support -->
        <div class="billing-card">
          <div class="billing-left">
            <div class="billing-icon"><i class="fas fa-headset"></i></div>
            <div>
              <div class="billing-title">Billing Support</div>
              <div class="billing-sub">Request manual override</div>
            </div>
          </div>
          <i class="fas fa-chevron-right billing-arrow"></i>
        </div>
      </div>
    </div>

    <!-- Renew Success Toast -->
    <transition name="toast-slide">
      <div class="toast toast-success" v-if="toastMsg">
        <i class="fas fa-check-circle"></i>
        <div>
          <strong>{{ toastMsg }}</strong>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'QuanLyHopDong',
  data() {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStr = tomorrow.toISOString().split('T')[0]

    return {
      showFilter: true,
      searchQ: '',
      activeFilter: 'all',
      currentPage: 1,
      perPage: 5,
      selectedId: null,
      cancelReason: '',
      toastMsg: '',
      renewal: {
        package: 'platinum_12',
        startDate: tomorrowStr,
      },
      statusFilters: [
        { key: 'all',     label: 'Tất cả', cls: 'fsb-all'     },
        { key: 'active',  label: 'Active',  cls: 'fsb-active'  },
        { key: 'expired', label: 'Expired', cls: 'fsb-expired' },
        { key: 'pending', label: 'Pending', cls: 'fsb-pending' },
      ],
      currentContract: {
        memberName: 'Trần Hoàng Nam',
        package: 'Platinum Performance (12m)',
        startDate: '15 Jan 2023',
        endDate: '15 Jan 2024',
        status: 'ACTIVE',
        statusClass: 'st-active',
        progress: 85,
        expiringSoon: true,
        daysLeft: 22,
      },
      contracts: [
        { id:1,  code:'CN-2542', name:'Lina Sterling',   initials:'LS', color:'#f59e0b', package:'Flex Standard 1M',       status:'EXPIRED', statusClass:'st-expired', expiry:'Oct 28, 2023', checked:false },
        { id:2,  code:'CN-2599', name:'Robert Wade',     initials:'RW', color:'#16a34a', package:'Elite Performance 12M',  status:'ACTIVE',  statusClass:'st-active',  expiry:'Dec 01, 2024', checked:false },
        { id:3,  code:'CN-2601', name:'Trần Hoàng Nam',  initials:'TN', color:'#6366f1', package:'Platinum Performance 12M',status:'ACTIVE',  statusClass:'st-active',  expiry:'15 Jan 2024',  checked:false },
        { id:4,  code:'CN-2614', name:'Lê Thu Thảo',     initials:'LT', color:'#ec4899', package:'Standard Plus 3M',       status:'PENDING', statusClass:'st-pending', expiry:'30 Jan 2024',  checked:false },
        { id:5,  code:'CN-2620', name:'Nguyễn Minh Anh', initials:'NA', color:'#14b8a6', package:'Elite Platinum 12M',     status:'ACTIVE',  statusClass:'st-active',  expiry:'15 Dec 2024',  checked:false },
        { id:6,  code:'CN-2633', name:'Phạm Quốc Hùng',  initials:'PH', color:'#8b5cf6', package:'Personal Training 6M',  status:'ACTIVE',  statusClass:'st-active',  expiry:'02 Jul 2025',  checked:false },
        { id:7,  code:'CN-2648', name:'Hoàng Thị Lan',   initials:'HL', color:'#f97316', package:'Basic Access 1M',        status:'EXPIRED', statusClass:'st-expired', expiry:'10 Sep 2023',  checked:false },
        { id:8,  code:'CN-2659', name:'Vũ Đức Minh',     initials:'VM', color:'#0ea5e9', package:'Gold Performance 6M',   status:'PENDING', statusClass:'st-pending', expiry:'30 Jun 2024',  checked:false },
        { id:9,  code:'CN-2671', name:'Bùi Thúy Nga',    initials:'BN', color:'#d97706', package:'Elite Platinum 12M',    status:'ACTIVE',  statusClass:'st-active',  expiry:'20 Nov 2025',  checked:false },
        { id:10, code:'CN-2685', name:'Đinh Công Sơn',   initials:'DS', color:'#a855f7', package:'Standard Plus 3M',      status:'EXPIRED', statusClass:'st-expired', expiry:'14 Feb 2023',  checked:false },
      ],
    }
  },
  computed: {
    filteredContracts() {
      let list = this.contracts
      const q = this.searchQ.trim().toLowerCase()
      if (q) {
        list = list.filter(c =>
          c.name.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q)
        )
      }
      if (this.activeFilter !== 'all') {
        const map = { active: 'ACTIVE', expired: 'EXPIRED', pending: 'PENDING' }
        list = list.filter(c => c.status === map[this.activeFilter])
      }
      return list
    },
    totalPages() { return Math.max(1, Math.ceil(this.filteredContracts.length / this.perPage)) },
    paginatedContracts() {
      const start = (this.currentPage - 1) * this.perPage
      return this.filteredContracts.slice(start, start + this.perPage)
    },
    pageStart() {
      return this.filteredContracts.length === 0 ? 0 : (this.currentPage - 1) * this.perPage + 1
    },
  },
  methods: {
    selectContract(c) {
      this.selectedId = c.id
      this.currentContract = {
        memberName: c.name,
        package: c.package,
        startDate: '15 Jan 2023',
        endDate: c.expiry,
        status: c.status,
        statusClass: c.statusClass,
        progress: c.status === 'EXPIRED' ? 100 : c.status === 'PENDING' ? 30 : 85,
        expiringSoon: c.status === 'ACTIVE',
        daysLeft: 22,
      }
    },
    renewContract(c) {
      this.selectContract(c)
      this.showToast(`Đã chọn hợp đồng #${c.code} để gia hạn.`)
    },
    confirmRenew() {
      this.showToast('Gia hạn hợp đồng thành công!')
    },
    confirmCancel() {
      if (!this.cancelReason.trim()) return
      this.showToast('Hợp đồng đã được hủy.')
      this.cancelReason = ''
    },
    showToast(msg) {
      this.toastMsg = msg
      setTimeout(() => { this.toastMsg = '' }, 3500)
    },
  },
  watch: {
    activeFilter() { this.currentPage = 1 },
    searchQ()      { this.currentPage = 1 },
  },
}
</script>

<style scoped>
/* ===== BASE ===== */
.hd-page {
  font-family: 'Inter', 'Segoe UI', sans-serif;
  position: relative;
}

/* ===== HEADER ===== */
.page-header {
  margin-bottom: 24px;
}
.page-title {
  font-size: 1.55rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 6px;
}
.page-subtitle {
  font-size: 0.85rem;
  color: #64748b;
  margin: 0;
}

/* ===== GRID ===== */
.hd-grid {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 20px;
  align-items: start;
}

/* ===== CURRENT CONTRACT ===== */
.contract-current-card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  margin-bottom: 16px;
}
.cc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.cc-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #0f172a;
}

/* Status badge */
.status-badge, .st-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}
.st-active  { background: #dcfce7; color: #16a34a; }
.st-expired { background: #fee2e2; color: #dc2626; }
.st-pending { background: #fef3c7; color: #b45309; }

.cc-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}
.cc-info-label {
  font-size: 0.65rem;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  margin-bottom: 4px;
}
.cc-info-val {
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.3;
}
.val-warn { color: #dc2626; }

/* Lifecycle */
.lifecycle-wrap {
  margin-bottom: 14px;
}
.lifecycle-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.lifecycle-label { font-size: 0.8rem; color: #475569; font-weight: 500; }
.lifecycle-pct   { font-size: 0.8rem; color: #16a34a; font-weight: 700; }
.lifecycle-bar {
  height: 8px;
  background: #f1f5f9;
  border-radius: 8px;
  overflow: hidden;
}
.lifecycle-fill {
  height: 100%;
  border-radius: 8px;
  transition: width 0.6s ease;
}
.fill-ok   { background: linear-gradient(90deg, #56b865, #2d7a3a); }
.fill-warn { background: linear-gradient(90deg, #fbbf24, #f59e0b); }

/* Alert */
.contract-alert {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: #fef3c7;
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 0.82rem;
  color: #92400e;
  line-height: 1.5;
}
.contract-alert i { color: #f59e0b; margin-top: 2px; flex-shrink: 0; }
.contract-alert strong { font-weight: 700; }

/* ===== CONTRACT LIST ===== */
.contract-list-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  overflow: hidden;
}
.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px 14px;
  border-bottom: 1px solid #f1f5f9;
}
.list-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #0f172a;
}
.list-actions { display: flex; gap: 8px; }
.btn-filter, .btn-export {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 13px;
  border: 1.5px solid #e2e8f0;
  border-radius: 9px;
  background: #fff;
  color: #475569;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.18s;
}
.btn-filter:hover, .btn-export:hover { background: #f8fafc; border-color: #cbd5e1; }

/* Filter row */
.filter-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 20px;
  background: #f8fafc;
  border-bottom: 1px solid #f1f5f9;
  flex-wrap: wrap;
}
.filter-search {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  padding: 7px 12px;
  flex: 1;
  min-width: 200px;
}
.filter-search i { color: #94a3b8; font-size: 0.8rem; }
.filter-search input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 0.82rem;
  color: #334155;
  width: 100%;
  font-family: inherit;
}
.filter-search input::placeholder { color: #94a3b8; }
.filter-status { display: flex; gap: 5px; flex-wrap: wrap; }
.fsb {
  padding: 5px 12px;
  border-radius: 20px;
  border: 1.5px solid #e2e8f0;
  background: #fff;
  font-size: 0.76rem;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.18s;
}
.fsb-all.active     { background: #2d7a3a; border-color: #2d7a3a; color: #fff; }
.fsb-active.active  { background: #dcfce7; border-color: #16a34a; color: #16a34a; }
.fsb-expired.active { background: #fee2e2; border-color: #ef4444; color: #dc2626; }
.fsb-pending.active { background: #fef3c7; border-color: #f59e0b; color: #b45309; }

/* Table */
.table-wrap { overflow-x: auto; }
.hd-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.845rem;
}
.hd-table th {
  padding: 10px 16px;
  text-align: left;
  font-size: 0.7rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  white-space: nowrap;
}
.hd-table td {
  padding: 13px 16px;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}
.hd-table tr:last-child td { border-bottom: none; }
.hd-table tbody tr { cursor: pointer; transition: background 0.15s; }
.hd-table tbody tr:hover td { background: #f8fafc; }
.hd-table tr.row-selected td { background: #f0fdf4; }

.contract-id {
  font-size: 0.82rem;
  font-family: 'Courier New', monospace;
  color: #475569;
  font-weight: 600;
  background: #f1f5f9;
  padding: 2px 8px;
  border-radius: 6px;
}
.member-cell { display: flex; align-items: center; gap: 9px; }
.member-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.member-name { font-size: 0.855rem; font-weight: 600; color: #0f172a; }
.pkg-text { font-size: 0.8rem; color: #475569; }
.expired-date { color: #dc2626; font-weight: 600; }

.row-actions { display: flex; gap: 5px; }
.ract-btn {
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
.ract-btn:hover { background: #f0fdf4; border-color: #2d7a3a; color: #2d7a3a; }
.ract-btn.renew:hover { background: #ede9fe; border-color: #7c3aed; color: #7c3aed; }

.empty-row {
  text-align: center;
  padding: 40px !important;
  color: #94a3b8;
  font-size: 0.875rem;
}

/* Table footer / pagination */
.table-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-top: 1px solid #f1f5f9;
  flex-wrap: wrap;
  gap: 8px;
}
.showing-text { font-size: 0.78rem; color: #64748b; }
.pagination { display: flex; gap: 4px; }
.pg-btn {
  width: 32px;
  height: 32px;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  color: #475569;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.18s;
}
.pg-btn:hover:not(:disabled) { border-color: #2d7a3a; color: #2d7a3a; background: #f0fdf4; }
.pg-btn.active { background: #2d7a3a; border-color: #2d7a3a; color: #fff; font-weight: 700; }
.pg-btn:disabled { opacity: 0.35; cursor: not-allowed; }

/* ===== RIGHT PANEL CARDS ===== */
.panel-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  margin-bottom: 14px;
}
.panel-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}
.panel-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
  flex-shrink: 0;
}
.panel-icon.green { background: #dcfce7; color: #16a34a; }
.panel-icon.red   { background: #fee2e2; color: #dc2626; }
.panel-title { font-size: 0.95rem; font-weight: 700; color: #0f172a; }

.field-label {
  display: block;
  font-size: 0.65rem;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  margin-bottom: 7px;
}
.mt-field { margin-top: 14px; }

.field-select, .field-input {
  width: 100%;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 0.855rem;
  color: #334155;
  outline: none;
  font-family: inherit;
  box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.field-select:focus, .field-input:focus {
  border-color: #2d7a3a;
  box-shadow: 0 0 0 3px rgba(45,122,58,0.1);
  background: #fff;
}
.field-select {
  appearance: none;
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394a3b8' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 28px;
}

.btn-renew {
  width: 100%;
  margin-top: 16px;
  background: linear-gradient(135deg, #2d7a3a, #3a9b4a);
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 12px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 3px 12px rgba(45,122,58,0.3);
  font-family: inherit;
}
.btn-renew:hover {
  background: linear-gradient(135deg, #245f2e, #2d7a3a);
  transform: translateY(-1px);
}

/* Cancel card */
.cancel-card { border: 1.5px solid #fecaca; }
.field-textarea {
  width: 100%;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 0.855rem;
  color: #334155;
  outline: none;
  resize: vertical;
  font-family: inherit;
  box-sizing: border-box;
  transition: border-color 0.2s;
  line-height: 1.5;
}
.field-textarea:focus { border-color: #f87171; box-shadow: 0 0 0 3px rgba(248,113,113,0.1); background: #fff; }
.field-textarea::placeholder { color: #94a3b8; }

.btn-cancel-contract {
  width: 100%;
  margin-top: 12px;
  background: #fff;
  color: #dc2626;
  border: 1.5px solid #fca5a5;
  border-radius: 10px;
  padding: 11px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}
.btn-cancel-contract:hover:not(:disabled) { background: #fee2e2; border-color: #ef4444; }
.btn-cancel-contract:disabled { opacity: 0.4; cursor: not-allowed; }

/* Billing Support */
.billing-card {
  background: linear-gradient(135deg, #f0fdf4, #dcfce7);
  border: 1.5px solid #bbf7d0;
  border-radius: 16px;
  padding: 16px 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s;
}
.billing-card:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(45,122,58,0.15); }
.billing-left { display: flex; align-items: center; gap: 12px; flex: 1; }
.billing-icon {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #fff;
  color: #2d7a3a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  box-shadow: 0 2px 8px rgba(45,122,58,0.15);
  flex-shrink: 0;
}
.billing-title { font-size: 0.875rem; font-weight: 700; color: #0f172a; }
.billing-sub   { font-size: 0.75rem; color: #16a34a; }
.billing-arrow { color: #16a34a; font-size: 0.85rem; }

/* ===== TOAST ===== */
.toast {
  position: fixed;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  border-radius: 12px;
  padding: 14px 22px;
  box-shadow: 0 8px 28px rgba(0,0,0,0.14);
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 999;
  min-width: 280px;
  font-family: inherit;
}
.toast-success { border-left: 4px solid #16a34a; }
.toast-success i { color: #16a34a; font-size: 1.2rem; }
.toast strong { font-size: 0.875rem; color: #0f172a; }

.toast-slide-enter-active, .toast-slide-leave-active {
  transition: all 0.3s cubic-bezier(.4,0,.2,1);
}
.toast-slide-enter-from, .toast-slide-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s, transform 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-6px); }

/* ===== RESPONSIVE ===== */
@media (max-width: 900px) {
  .hd-grid { grid-template-columns: 1fr; }
  .cc-info-grid { grid-template-columns: 1fr 1fr; }
}
</style>
