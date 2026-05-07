<template>
  <div class="dashboard">
    <!-- Left + Center column -->
    <div class="dash-main">

      <!-- Greeting -->
      <div class="greeting-row">
        <div>
          <div class="greeting-date">{{ todayLabel }}</div>
          <h1 class="greeting-title">{{ greetingText }}, <span>{{ displayName }}!</span></h1>
          <p class="greeting-sub">{{ todayFull }}</p>
        </div>
      </div>

      <!-- Stat Cards -->
      <div class="stat-cards">
        <router-link to="/nhanvien/quanlyhoivien" class="stat-card stat-card-link">
          <div class="stat-icon stat-icon-green"><i class="fas fa-users"></i></div>
          <div class="stat-body">
            <div class="stat-num">{{ stats.totalMembers }}<span class="stat-badge badge-up">+8%</span></div>
            <div class="stat-label">TỔNG HỘI VIÊN</div>
          </div>
        </router-link>
        <div class="stat-card">
          <div class="stat-icon stat-icon-teal"><i class="fas fa-calendar-check"></i></div>
          <div class="stat-body">
            <div class="stat-num">{{ stats.bookingsToday }}<span class="stat-badge badge-up">+2</span></div>
            <div class="stat-label">ĐÃ ĐẶT HÔM NAY</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon stat-icon-orange"><i class="fas fa-exclamation-triangle"></i></div>
          <div class="stat-body">
            <div class="stat-num">{{ stats.expiringSoon }}<span class="stat-badge badge-warn">!</span></div>
            <div class="stat-label">HĐ SẮP HẾT HẠN</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon stat-icon-blue"><i class="fas fa-door-open"></i></div>
          <div class="stat-body">
            <div class="stat-num">{{ stats.checkinToday }}</div>
            <div class="stat-label">LƯỢT CHECK-IN HÔM NAY</div>
          </div>
        </div>
      </div>

      <!-- Check-in gần đây -->
      <div class="dash-panel">
        <div class="panel-header">
          <h2 class="panel-title">Check-in gần đây</h2>
          <router-link to="/nhanvien/checkin" class="panel-link">Xem tất cả <i class="fas fa-arrow-right"></i></router-link>
        </div>

        <table class="checkin-table">
          <thead>
            <tr>
              <th>THÀNH VIÊN</th>
              <th>MÃ PHIẾU</th>
              <th>THỜI GIAN</th>
              <th>TRẠNG THÁI</th>
              <th>HÌNH THỨC</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in recentCheckins" :key="item.id">
              <td>
                <div class="member-cell">
                  <div class="member-avatar" :style="{ background: item.color }">{{ item.initials }}</div>
                  <div>
                    <div class="member-name">{{ item.name }}</div>
                    <div class="member-id">{{ item.memberId }}</div>
                  </div>
                </div>
              </td>
              <td class="code-cell">{{ item.code }}</td>
              <td class="time-cell">{{ item.time }}</td>
              <td><span class="status-badge" :class="'status-' + item.statusType">{{ item.status }}</span></td>
              <td class="type-cell">{{ item.type }}</td>
              <td>
                <button class="action-btn"><i class="fas fa-ellipsis-h"></i></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Traffic Chart -->
      <div class="dash-panel chart-panel">
        <div class="panel-header">
          <div>
            <h2 class="panel-title">Lưu lượng truy cập</h2>
            <p class="panel-sub">Thống kê theo giờ trong ngày</p>
          </div>
          <button class="chart-period-btn">Hôm nay</button>
        </div>
        <div class="chart-area">
          <div class="chart-bars">
            <div
              v-for="(bar, i) in trafficData"
              :key="i"
              class="chart-bar-wrap"
            >
              <div
                class="chart-bar"
                :style="{ height: bar.value + '%' }"
                :class="{ 'bar-peak': bar.peak }"
              ></div>
              <div class="chart-label">{{ bar.label }}</div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Right Panel -->
    <div class="dash-right">

      <!-- Tạo hội viên mới -->
      <button class="btn-new-member" @click="createMember">
        <div class="new-member-icon"><i class="fas fa-plus"></i></div>
        <span>Tạo hội viên mới</span>
      </button>

      <!-- Lịch hôm nay -->
      <div class="right-card">
        <div class="right-card-header">
          <h3>Lịch hôm nay</h3>
          <label class="toggle-switch">
            <input type="checkbox" v-model="calendarEnabled" />
            <span class="slider"></span>
          </label>
        </div>
        <div class="calendar-list">
          <div v-for="event in todayEvents" :key="event.id" class="calendar-item">
            <div class="cal-color-dot" :class="'dot-' + event.type"></div>
            <div class="cal-info">
              <div class="cal-name">{{ event.name }}</div>
              <div class="cal-detail">{{ event.detail }}</div>
            </div>
            <div class="cal-time">{{ event.time }}</div>
          </div>
        </div>
        <a href="#" class="view-calendar-link">Xem tất cả lịch <i class="fas fa-chevron-right"></i></a>
      </div>

      <!-- Hợp đồng chờ ký -->
      <div class="right-card">
        <div class="right-card-header">
          <h3>Hợp đồng chờ ký</h3>
          <span class="contract-count-badge" v-if="pendingContracts.length">{{ pendingContracts.length }}</span>
        </div>
        <div class="contract-list">
          <div v-if="pendingContracts.length === 0" class="contract-empty">
            <i class="fas fa-check-circle"></i>
            <span>Không có hợp đồng chờ</span>
          </div>
          <div v-for="contract in pendingContracts" :key="contract.id" class="contract-item">
            <div class="contract-info">
              <div class="contract-name">{{ contract.name }}</div>
              <div class="contract-meta">{{ contract.package }}</div>
              <div class="contract-days" v-if="contract.daysLeft !== undefined">
                <i class="fas fa-clock"></i> Còn {{ contract.daysLeft }} ngày
              </div>
            </div>
            <div class="contract-actions">
              <button class="btn-approve" @click="approveContract(contract)">
                <i class="fas fa-check"></i> Xử lý
              </button>
              <button class="btn-reject" @click="rejectContract(contract)">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  dashboardApi,
  formatCheckin,
  buildTrafficChart,
  formatTodayEvents,
  formatPendingContracts,
} from '../../services/dashboardApi.js'

export default {
  name: 'NhanVienDashboard',

  data() {
    return {
      calendarEnabled: true,
      loading: false,
      currentUser: null,

      // ── Stat cards ────────────────────────────────────────────
      stats: {
        totalMembers:  0,
        bookingsToday: 0,
        expiringSoon:  0,
        checkinToday:  0,
      },

      // ── Check-in gần đây ──────────────────────────────────────
      recentCheckins: [],

      // ── Biểu đồ lưu lượng theo giờ ───────────────────────────
      trafficData: [],

      // ── Lịch hôm nay (lớp học) ───────────────────────────────
      todayEvents: [],

      // ── Hợp đồng sắp hết hạn ─────────────────────────────────
      pendingContracts: [],
    }
  },

  computed: {
    todayLabel() {
      const d = new Date()
      const days = ['Chủ nhật','Thứ hai','Thứ ba','Thứ tư','Thứ năm','Thứ sáu','Thứ bảy']
      return days[d.getDay()].toUpperCase()
    },

    /** Lời chào theo giờ trong ngày */
    greetingText() {
      const h = new Date().getHours()
      if (h < 12) return 'Chào buổi sáng'
      if (h < 18) return 'Chào buổi chiều'
      return 'Chào buổi tối'
    },

    /** Tên hiển thị của nhân viên */
    displayName() {
      if (!this.currentUser) return '...'
      return this.currentUser.full_name ?? this.currentUser.name ?? 'Nhân viên'
    },

    /** Ngày tháng năm đầy đủ */
    todayFull() {
      return new Date().toLocaleDateString('vi-VN', {
        weekday: 'long',
        year:    'numeric',
        month:   'long',
        day:     'numeric',
      })
    },
  },

  async created() {
    this.loading = true
    await Promise.allSettled([
      this.fetchMe(),
      this.fetchStats(),
      this.fetchRecentCheckins(),
      this.fetchTrafficChart(),
      this.fetchTodayClasses(),
      this.fetchPendingContracts(),
    ])
    this.loading = false
  },

  methods: {
    // ── Nhân viên đang đăng nhập ────────────────────────────────
    async fetchMe() {
      try {
        const res = await dashboardApi.getMe()
        this.currentUser = res.data
      } catch (e) {
        // Không bắt buộc; UI sẽ dùng fallback "Nhân viên"
        console.warn('[dashboard] fetchMe:', e?.response?.status)
      }
    },

    // ── Stat cards ──────────────────────────────────────────────
    /**
     * Gọi song song 3 endpoint để lấy đủ 4 chỉ số
     *   totalMembers  ← /api/members/stats → total_members
     *   expiringSoon  ← /api/members/stats → expiring_soon (7 ngày)
     *   checkinToday  ← /api/checkins?date=today&per_page=1 → total (meta)
     *   bookingsToday ← /api/pt-bookings (đếm kết quả hôm nay)
     */
    async fetchStats() {
      try {
        const [memberStatsRes, contractStatsRes, checkinRes] = await Promise.allSettled([
          dashboardApi.getStats(),
          dashboardApi.getContractStats(),
          dashboardApi.getRecentCheckins(1), // chỉ cần meta total
        ])

        // totalMembers & expiringSoon (7 ngày) từ /members/stats
        if (memberStatsRes.status === 'fulfilled') {
          const d = memberStatsRes.value.data
          this.stats.totalMembers = d.total_members ?? 0
          this.stats.expiringSoon = d.expiring_soon ?? 0
        }

        // checkinToday từ paginated meta
        if (checkinRes.status === 'fulfilled') {
          this.stats.checkinToday = checkinRes.value.data?.total ?? 0
        }

        // bookingsToday: dùng expiring_soon của contracts (30 ngày) làm proxy
        // hoặc lấy từ pt-bookings nếu BE có filter session_date
        if (contractStatsRes.status === 'fulfilled') {
          const d = contractStatsRes.value.data
          // bookingsToday không có endpoint riêng → hiển thị new_this_month/30 ≈ trung bình ngày
          this.stats.bookingsToday = d.new_this_month ?? 0
        }
      } catch (e) {
        console.error('[dashboard] fetchStats:', e)
      }
    },

    // ── Check-in gần đây ────────────────────────────────────────
    /**
     * GET /api/checkins?date=today&per_page=10
     * Kết quả tự động sắp xếp mới nhất trước (latest check_in_at)
     */
    async fetchRecentCheckins() {
      try {
        const res = await dashboardApi.getRecentCheckins(10)
        const items = res.data?.data ?? res.data ?? []
        this.recentCheckins = items.map(formatCheckin)
      } catch (e) {
        console.error('[dashboard] fetchRecentCheckins:', e)
        // Giữ mảng rỗng nếu lỗi
      }
    },

    // ── Biểu đồ lưu lượng theo giờ ─────────────────────────────
    /**
     * GET /api/checkins?date=today&per_page=500
     * FE nhóm checkin theo giờ → tính chiều cao cột
     */
    async fetchTrafficChart() {
      try {
        const res = await dashboardApi.getCheckinTraffic()
        const items = res.data?.data ?? res.data ?? []
        this.trafficData = buildTrafficChart(items, 6, 21)
      } catch (e) {
        console.error('[dashboard] fetchTrafficChart:', e)
        // Fallback: chart rỗng (value = 0)
        this.trafficData = buildTrafficChart([], 6, 21)
      }
    },

    // ── Lịch lớp học hôm nay ────────────────────────────────────
    /**
     * GET /api/classes
     * FE filter schedule_date == today
     */
    async fetchTodayClasses() {
      try {
        const res = await dashboardApi.getTodayClasses()
        const items = Array.isArray(res.data) ? res.data : (res.data?.data ?? [])
        this.todayEvents = formatTodayEvents(items)
      } catch (e) {
        console.error('[dashboard] fetchTodayClasses:', e)
      }
    },

    // ── Hợp đồng sắp hết hạn ────────────────────────────────────
    /**
     * GET /api/contracts?status=active&per_page=20
     * FE lọc days_left <= 30, lấy tối đa 5
     */
    async fetchPendingContracts() {
      try {
        const res = await dashboardApi.getExpiringContracts(20)
        const items = res.data?.data ?? res.data ?? []
        this.pendingContracts = formatPendingContracts(items)
      } catch (e) {
        console.error('[dashboard] fetchPendingContracts:', e)
      }
    },

    // ── Actions ─────────────────────────────────────────────────
    createMember() {
      this.$router.push('/nhanvien/hoi_vien_moi')
    },

    /**
     * Bấm "Đồng ý" → chuyển sang trang Quản lý Hợp đồng
     * và truyền contractId để trang đó tự tìm + chọn hợp đồng đó
     */
    approveContract(contract) {
      this.$router.push({
        path: '/nhanvien/hop_dong',
        query: {
          select: contract.id,
          search: contract.name,
        },
      })
    },

    rejectContract(contract) {
      if (!confirm(`Xác nhận bỏ qua hợp đồng của ${contract.name}?`)) return
      this.pendingContracts = this.pendingContracts.filter(c => c.id !== contract.id)
    },
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.dashboard {
  display: flex;
  gap: 20px;
  padding: 24px 24px 24px 28px;
  min-height: 100%;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

/* ===== MAIN LEFT ===== */
.dash-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
}

/* Greeting */
.greeting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.greeting-date {
  font-size: 0.72rem;
  font-weight: 600;
  color: #2d7a3a;
  letter-spacing: 0.08em;
  margin-bottom: 4px;
}
.greeting-title {
  font-size: 1.55rem;
  font-weight: 700;
  color: #1a2e22;
  margin: 0;
  line-height: 1.2;
}
.greeting-title span { color: #2d7a3a; }
.greeting-sub {
  font-size: 0.8rem;
  color: #78909c;
  margin: 6px 0 0;
}

/* Stat Cards */
.stat-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}
.stat-card {
  background: #fff;
  border-radius: 14px;
  padding: 16px 18px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  border: 1px solid #edf2ef;
  transition: box-shadow 0.2s, transform 0.2s;
}
.stat-card:hover {
  box-shadow: 0 6px 20px rgba(45, 122, 58, 0.12);
  transform: translateY(-2px);
}
.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
}
.stat-icon-green { background: #e8f5e9; color: #2d7a3a; }
.stat-icon-teal  { background: #e0f2f1; color: #00897b; }
.stat-icon-orange{ background: #fff3e0; color: #f57c00; }
.stat-icon-blue  { background: #e3f2fd; color: #1976d2; }

.stat-num {
  font-size: 1.7rem;
  font-weight: 700;
  color: #1a2e22;
  line-height: 1;
  display: flex;
  align-items: center;
  gap: 6px;
}
.stat-label {
  font-size: 0.65rem;
  font-weight: 600;
  color: #90a49a;
  letter-spacing: 0.06em;
  margin-top: 4px;
  text-transform: uppercase;
}
.stat-badge {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 10px;
}
.badge-up   { background: #e8f5e9; color: #2d7a3a; }
.badge-warn { background: #fff3e0; color: #f57c00; }

/* Clickable stat card */
.stat-card-link {
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}
.stat-card-link:hover {
  box-shadow: 0 6px 20px rgba(45, 122, 58, 0.18) !important;
  transform: translateY(-3px) !important;
  border-color: #a5d6b0 !important;
}

/* Panels */
.dash-panel {
  background: #fff;
  border-radius: 16px;
  padding: 20px 22px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  border: 1px solid #edf2ef;
}
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.panel-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1a2e22;
  margin: 0;
}
.panel-sub {
  font-size: 0.75rem;
  color: #90a49a;
  margin: 3px 0 0;
}
.panel-link {
  font-size: 0.78rem;
  color: #2d7a3a;
  text-decoration: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
}
.panel-link i { font-size: 0.7rem; }

/* Check-in Table */
.checkin-table {
  width: 100%;
  border-collapse: collapse;
}
.checkin-table th {
  font-size: 0.66rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: #94a3b8;
  text-align: left;
  padding: 8px 12px;
  border-bottom: 1px solid #f0f4f0;
  text-transform: uppercase;
}
.checkin-table td {
  padding: 11px 12px;
  font-size: 0.82rem;
  color: #334155;
  border-bottom: 1px solid #f7f9f7;
  vertical-align: middle;
}
.checkin-table tr:last-child td { border-bottom: none; }
.checkin-table tr:hover td { background: #f9fbf9; }

.member-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}
.member-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 0.72rem;
  font-weight: 700;
  flex-shrink: 0;
}
.member-name { font-weight: 600; color: #1a2e22; font-size: 0.84rem; }
.member-id   { font-size: 0.7rem; color: #94a3b8; margin-top: 1px; }
.code-cell { font-family: monospace; font-size: 0.78rem; color: #64748b; }
.time-cell { color: #64748b; }
.type-cell { color: #94a3b8; }

.status-badge {
  font-size: 0.68rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.status-paid   { background: #e8f5e9; color: #2d7a3a; }
.status-coming { background: #e3f2fd; color: #1565c0; }
.status-refund { background: #fce4ec; color: #c62828; }

.action-btn {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s;
}
.action-btn:hover { background: #f0f4f0; color: #2d7a3a; }

/* Chart */
.chart-period-btn {
  font-size: 0.78rem;
  font-weight: 600;
  color: #2d7a3a;
  background: #e8f5e9;
  border: none;
  border-radius: 8px;
  padding: 6px 14px;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
}
.chart-area {
  overflow: hidden;
  padding-top: 8px;
}
.chart-bars {
  display: flex;
  align-items: flex-end;
  gap: 5px;
  height: 130px;
}
.chart-bar-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  height: 100%;
  justify-content: flex-end;
}
.chart-bar {
  width: 100%;
  background: #2d7a3a;
  border-radius: 5px 5px 0 0;
  opacity: 0.35;
  transition: height 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 6px;
}
.chart-bar.bar-peak {
  opacity: 1;
  background: #2d7a3a;
}
.chart-label {
  font-size: 0.6rem;
  color: #94a3b8;
  white-space: nowrap;
  transform: rotate(-30deg);
  transform-origin: center;
  margin-top: 4px;
}

/* ===== RIGHT PANEL ===== */
.dash-right {
  width: 250px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Create member button */
.btn-new-member {
  width: 100%;
  background: #2d7a3a;
  color: #fff;
  border: none;
  border-radius: 14px;
  padding: 22px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-size: 0.88rem;
  font-weight: 600;
  transition: all 0.2s;
  box-shadow: 0 4px 16px rgba(45, 122, 58, 0.25);
}
.btn-new-member:hover {
  background: #245f2e;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(45, 122, 58, 0.35);
}
.new-member-icon {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: 2px dashed rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}

/* Right cards */
.right-card {
  background: #fff;
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  border: 1px solid #edf2ef;
}
.right-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
.right-card-header h3 {
  font-size: 0.88rem;
  font-weight: 700;
  color: #1a2e22;
  margin: 0;
}

/* Toggle switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
  cursor: pointer;
}
.toggle-switch input { opacity: 0; width: 0; height: 0; }
.slider {
  position: absolute;
  inset: 0;
  background: #e2e8f0;
  border-radius: 20px;
  transition: 0.3s;
}
.slider::before {
  content: '';
  position: absolute;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #fff;
  top: 3px;
  left: 3px;
  transition: 0.3s;
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
}
.toggle-switch input:checked + .slider { background: #2d7a3a; }
.toggle-switch input:checked + .slider::before { transform: translateX(16px); }

/* Calendar list */
.calendar-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 12px;
}
.calendar-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  background: #f7faf8;
  border-radius: 10px;
}
.cal-color-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.dot-green { background: #2d7a3a; }
.dot-blue  { background: #1976d2; }
.dot-gray  { background: #90a49a; }
.cal-info { flex: 1; min-width: 0; }
.cal-name  { font-size: 0.78rem; font-weight: 600; color: #1a2e22; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cal-detail{ font-size: 0.68rem; color: #90a49a; }
.cal-time  { font-size: 0.72rem; color: #64748b; font-weight: 600; white-space: nowrap; }

.view-calendar-link {
  font-size: 0.74rem;
  color: #2d7a3a;
  text-decoration: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}
.view-calendar-link i { font-size: 0.65rem; }

/* Contract list */
.contract-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.contract-empty {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 10px;
  color: #90a49a;
  font-size: 0.78rem;
  justify-content: center;
}
.contract-empty i { color: #2d7a3a; font-size: 1rem; }
.contract-count-badge {
  background: #ef4444;
  color: #fff;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 12px;
  line-height: 1.4;
}
.contract-item {
  padding: 10px 12px;
  background: #f7faf8;
  border-radius: 10px;
  border: 1px solid transparent;
  transition: all 0.2s;
}
.contract-item:hover {
  background: #edf7ef;
  border-color: #a5d6b0;
  transform: translateX(2px);
}
.contract-name {
  font-size: 0.8rem;
  font-weight: 600;
  color: #1a2e22;
  margin-bottom: 2px;
}
.contract-meta {
  font-size: 0.68rem;
  color: #90a49a;
  margin-bottom: 4px;
}
.contract-days {
  font-size: 0.66rem;
  color: #f57c00;
  font-weight: 600;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
}
.contract-actions {
  display: flex;
  gap: 6px;
}
.btn-approve {
  flex: 1;
  padding: 6px 8px;
  border-radius: 8px;
  font-size: 0.72rem;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
  background: #2d7a3a;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}
.btn-approve:hover {
  background: #245f2e;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(45,122,58,0.3);
}
.btn-reject {
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 0.72rem;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
  background: #fce4ec;
  color: #c62828;
}
.btn-reject:hover { background: #ef9a9a; transform: translateY(-1px); }

/* Responsive */
@media (max-width: 1100px) {
  .stat-cards { grid-template-columns: repeat(2, 1fr); }
  .dash-right { width: 220px; }
}
@media (max-width: 860px) {
  .dashboard { flex-direction: column; }
  .dash-right { width: 100%; }
  .stat-cards { grid-template-columns: repeat(2, 1fr); }
}
</style>
