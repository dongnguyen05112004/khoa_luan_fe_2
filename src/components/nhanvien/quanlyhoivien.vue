<template>
  <div class="qlhv-page">

    <!-- ===== Page Header ===== -->
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-title">Quản lý hội viên</h1>
        <div class="header-badges">
          <span class="badge-members">
            <i class="fas fa-plus"></i> {{ totalMembers.toLocaleString() }} Active Members
          </span>
          <span class="badge-ai">
            <i class="fas fa-robot"></i> AI INSIGHT: Retention up 12%
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
          <button class="btn-search" @click="doSearch">Search</button>
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
        <div class="new-today-val">+{{ newToday }}</div>
        <div class="new-today-sub">
          <i class="fas fa-arrow-up"></i> Higher than last Monday
        </div>
      </div>

    </div>

    <!-- ===== Table ===== -->
    <div class="table-card">
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
          <tr v-for="m in paginatedMembers" :key="m.id">
            <td>
              <div class="member-cell">
                <img
                  :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=${m.avatarBg}&color=fff&bold=true&size=80`"
                  class="member-avatar"
                  :alt="m.name"
                />
                <div class="member-info">
                  <div class="member-name">{{ m.name }}</div>
                  <div class="member-email">{{ m.email }}</div>
                </div>
              </div>
            </td>
            <td>
              <div class="member-id">#{{ m.code }}</div>
              <div class="member-phone">{{ m.phone }}</div>
            </td>
            <td>
              <span class="pkg-badge" :class="m.pkgClass">{{ m.package }}</span>
            </td>
            <td>
              <div class="expiry-date" :class="{ 'expiry-red': m.expirySubClass === 'sub-expired' }">{{ m.expiry }}</div>
              <div class="expiry-sub" :class="m.expirySubClass">{{ m.expirySub }}</div>
            </td>
            <td>
              <div class="checkin-time">{{ m.lastCheckin }}</div>
              <div class="checkin-loc">{{ m.location }}</div>
            </td>
            <td>
              <span class="status-badge" :class="m.statusClass">{{ m.status }}</span>
            </td>
            <td>
              <div class="action-btns">
                <button class="action-btn" title="Xem hồ sơ"><i class="fas fa-eye"></i></button>
                <button class="action-btn" title="Chỉnh sửa"><i class="fas fa-pen"></i></button>
                <button class="action-btn danger" title="Khoá tài khoản"><i class="fas fa-ban"></i></button>
              </div>
            </td>
          </tr>
          <tr v-if="paginatedMembers.length === 0">
            <td colspan="7" class="empty-row">
              <i class="fas fa-search"></i> Không tìm thấy hội viên phù hợp.
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination inside card -->
      <div class="pagination-bar">
        <span class="pagination-info">
          Showing {{ pageStart }} to {{ pageEnd }} of {{ filteredMembers.length.toLocaleString() }} members
        </span>
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
  name: 'QuanLyHoiVien',
  data() {
    return {
      searchQ: '',
      activeStatus: 'all',
      currentPage: 1,
      perPage: 8,
      newToday: 14,
      totalMembers: 1284,
      statusFilters: [
        { key: 'all',     label: 'All',     cls: 'sf-all'     },
        { key: 'active',  label: 'Active',  cls: 'sf-active'  },
        { key: 'expired', label: 'Expired', cls: 'sf-expired' },
        { key: 'onhold',  label: 'On-hold', cls: 'sf-onhold'  },
      ],
      members: [
        {
          id: 1, name: 'Nguyễn Minh Anh', avatarBg: 'e67e22',
          phone: '090 123 4567', email: 'minhanh.ng@gmail.com', code: 'PC-9021',
          package: 'Elite Platinum', pkgClass: 'pkg-elite',
          expiry: 'Dec 15, 2024', expirySub: '6 months left', expirySubClass: 'sub-ok',
          lastCheckin: 'Today, 08:45 AM', location: 'District 1 Center',
          status: 'ACTIVE', statusClass: 'st-active',
        },
        {
          id: 2, name: 'Trần Hoàng Long', avatarBg: '6366f1',
          phone: '098 765 4321', email: 'long.th@gmail.com', code: 'PC-8842',
          package: 'Personal Training', pkgClass: 'pkg-personal',
          expiry: 'Oct 28, 2023', expirySub: 'Expired', expirySubClass: 'sub-expired',
          lastCheckin: '2 weeks ago', location: 'District 3 Center',
          status: 'EXPIRED', statusClass: 'st-expired',
        },
        {
          id: 3, name: 'Lê Thu Thảo', avatarBg: 'ec4899',
          phone: '081 565 1122', email: 'thao.le@gmail.com', code: 'PC-7721',
          package: 'Standard Plus', pkgClass: 'pkg-standard',
          expiry: 'Jan 30, 2024', expirySub: 'Membership Frozen', expirySubClass: 'sub-frozen',
          lastCheckin: '1 month ago', location: 'Online App',
          status: 'ON-HOLD', statusClass: 'st-onhold',
        },
        {
          id: 4, name: 'Phạm Quốc Hùng', avatarBg: '14b8a6',
          phone: '032 999 8808', email: 'hung.pg@gmail.com', code: 'PC-4412',
          package: 'Elite Platinum', pkgClass: 'pkg-elite',
          expiry: 'Jul 02, 2025', expirySub: '1 year+ left', expirySubClass: 'sub-ok',
          lastCheckin: 'Yesterday, 06:12 PM', location: 'District 1 Center',
          status: 'ACTIVE', statusClass: 'st-active',
        },
        {
          id: 5, name: 'Hoàng Thị Lan', avatarBg: '8b5cf6',
          phone: '097 333 4455', email: 'lan.ht@gmail.com', code: 'PC-5531',
          package: 'Standard Plus', pkgClass: 'pkg-standard',
          expiry: 'Mar 10, 2025', expirySub: '5 months left', expirySubClass: 'sub-ok',
          lastCheckin: 'Today, 07:20 AM', location: 'District 7 Center',
          status: 'ACTIVE', statusClass: 'st-active',
        },
        {
          id: 6, name: 'Vũ Đức Minh', avatarBg: '0ea5e9',
          phone: '090 112 2334', email: 'minh.vd@gmail.com', code: 'PC-3308',
          package: 'Personal Training', pkgClass: 'pkg-personal',
          expiry: 'Sep 01, 2023', expirySub: 'Expired', expirySubClass: 'sub-expired',
          lastCheckin: '1 month ago', location: 'District 3 Center',
          status: 'EXPIRED', statusClass: 'st-expired',
        },
        {
          id: 7, name: 'Bùi Thúy Nga', avatarBg: 'd97706',
          phone: '093 445 5667', email: 'nga.bt@gmail.com', code: 'PC-6612',
          package: 'Elite Platinum', pkgClass: 'pkg-elite',
          expiry: 'Nov 20, 2025', expirySub: '1 year+ left', expirySubClass: 'sub-ok',
          lastCheckin: 'Today, 09:55 AM', location: 'District 1 Center',
          status: 'ACTIVE', statusClass: 'st-active',
        },
        {
          id: 8, name: 'Đinh Công Sơn', avatarBg: '16a34a',
          phone: '096 778 9900', email: 'son.dc@gmail.com', code: 'PC-2201',
          package: 'Standard Plus', pkgClass: 'pkg-standard',
          expiry: 'Feb 14, 2024', expirySub: 'Expires soon', expirySubClass: 'sub-warn',
          lastCheckin: 'Yesterday, 05:30 PM', location: 'Online App',
          status: 'ON-HOLD', statusClass: 'st-onhold',
        },
        {
          id: 9, name: 'Ngô Anh Khoa', avatarBg: 'f43f5e',
          phone: '091 234 5678', email: 'khoa.na@gmail.com', code: 'PC-1190',
          package: 'Elite Platinum', pkgClass: 'pkg-elite',
          expiry: 'Aug 05, 2025', expirySub: '10 months left', expirySubClass: 'sub-ok',
          lastCheckin: 'Today, 06:00 AM', location: 'District 7 Center',
          status: 'ACTIVE', statusClass: 'st-active',
        },
        {
          id: 10, name: 'Trương Thị Mai', avatarBg: 'a855f7',
          phone: '099 876 5432', email: 'mai.tt@gmail.com', code: 'PC-0088',
          package: 'Personal Training', pkgClass: 'pkg-personal',
          expiry: 'Jun 30, 2025', expirySub: '9 months left', expirySubClass: 'sub-ok',
          lastCheckin: 'Yesterday, 08:00 AM', location: 'District 1 Center',
          status: 'ACTIVE', statusClass: 'st-active',
        },
        {
          id: 11, name: 'Đặng Văn Tú', avatarBg: '0284c7',
          phone: '089 111 2233', email: 'tu.dv@gmail.com', code: 'PC-0055',
          package: 'Standard Plus', pkgClass: 'pkg-standard',
          expiry: 'Apr 20, 2025', expirySub: '4 months left', expirySubClass: 'sub-ok',
          lastCheckin: 'Today, 10:30 AM', location: 'District 1 Center',
          status: 'ACTIVE', statusClass: 'st-active',
        },
        {
          id: 12, name: 'Phùng Thị Hoa', avatarBg: 'db2777',
          phone: '077 345 6789', email: 'hoa.pt@gmail.com', code: 'PC-0022',
          package: 'Personal Training', pkgClass: 'pkg-personal',
          expiry: 'May 15, 2024', expirySub: 'Expired', expirySubClass: 'sub-expired',
          lastCheckin: '3 weeks ago', location: 'Online App',
          status: 'EXPIRED', statusClass: 'st-expired',
        },
      ],
    }
  },
  computed: {
    filteredMembers() {
      let list = this.members
      const q = this.searchQ.trim().toLowerCase()
      if (q) {
        list = list.filter(m =>
          m.name.toLowerCase().includes(q) ||
          m.code.toLowerCase().includes(q) ||
          m.phone.replace(/\s/g, '').includes(q.replace(/\s/g, ''))
        )
      }
      if (this.activeStatus !== 'all') {
        const map = { active: 'ACTIVE', expired: 'EXPIRED', onhold: 'ON-HOLD' }
        list = list.filter(m => m.status === map[this.activeStatus])
      }
      return list
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.filteredMembers.length / this.perPage))
    },
    paginatedMembers() {
      const start = (this.currentPage - 1) * this.perPage
      return this.filteredMembers.slice(start, start + this.perPage)
    },
    pageStart() {
      return this.filteredMembers.length === 0 ? 0 : (this.currentPage - 1) * this.perPage + 1
    },
    pageEnd() {
      return Math.min(this.currentPage * this.perPage, this.filteredMembers.length)
    },
    visiblePages() {
      const pages = []
      for (let i = 1; i <= Math.min(this.totalPages, 3); i++) {
        pages.push(i)
      }
      return pages
    },
  },
  methods: {
    doSearch() {
      this.currentPage = 1
    },
    setStatus(key) {
      this.activeStatus = key
      this.currentPage = 1
    },
  },
  watch: {
    searchQ() { this.currentPage = 1 },
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
  min-width: 145px;
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
  color: #16a34a;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}

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
.checkin-loc    { font-size: 0.72rem; color: #94a3b8; }

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
.action-btn:hover        { background: #f0fdf4; border-color: #2d7a3a; color: #2d7a3a; }
.action-btn.danger:hover { background: #fee2e2; border-color: #fca5a5; color: #dc2626; }

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

/* ===== RESPONSIVE ===== */
@media (max-width: 900px) {
  .qlhv-page      { padding: 16px; }
  .toolbar        { flex-direction: column; align-items: stretch; }
  .new-today-card { margin-left: 0; }
  .hv-table       { font-size: 0.78rem; }
}

</style>
