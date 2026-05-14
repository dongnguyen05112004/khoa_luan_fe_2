<template>
  <div class="ci-page">

    <!-- ===== TOP TITLE ROW ===== -->
    <div class="ci-title-row">
      <div>
        <h1 class="ci-title">Giám sát Check-in thời gian thực</h1>
        <p class="ci-sub">
          <span class="live-dot"></span>
          Đang hoạt động: {{ activeCount }} lội viên đang tại phòng tập
        </p>
      </div>
      <button class="btn-admin-alert">
        ADMIN ALERT&nbsp;<i class="fas fa-volume-up"></i>
      </button>
    </div>

    <!-- ===== BODY: LEFT + RIGHT ===== -->
    <div class="ci-body">

      <!-- ========== LEFT PANEL ========== -->
      <div class="feed-panel">

        <!-- Panel header -->
        <div class="feed-panel-header">
          <div class="feed-panel-title">
            <i class="fas fa-arrows-alt-v feed-arrow-ico"></i>
            Lượng dữ liệu trực tiếp
          </div>
          <div class="feed-panel-meta">
            GIỜ NHẬN &nbsp;|&nbsp; DỪNG TẠI ĐÂY
          </div>
        </div>

        <!-- Feed rows -->
        <div class="feed-rows">
          <div
            v-for="item in liveFeed"
            :key="item.id"
            class="feed-row"
            :class="{ 'feed-row-new': item.isNew }"
          >
            <!-- Avatar -->
            <div class="f-avatar" :style="{ background: item.color }">{{ item.initials }}</div>

            <!-- Name + ID -->
            <div class="f-info">
              <div class="f-name">{{ item.name }}</div>
              <div class="f-id">{{ item.memberId }}</div>
            </div>

            <!-- Time -->
            <div class="f-time">{{ item.time }}</div>

            <!-- Badge + note + Checkout -->
            <div class="f-badge-col">
              <span class="f-badge" :class="'fbadge-' + item.statusType">{{ item.status }}</span>
              <span v-if="item.note" class="f-note">{{ item.note }}</span>
              <button
                v-if="item.statusType === 'in'"
                class="btn-feed-checkout"
                :disabled="item._coLoading"
                @click="checkoutRow(item)"
                title="Check-out hội viên này"
              >
                <i class="fas fa-spinner fa-spin" v-if="item._coLoading"></i>
                <i class="fas fa-sign-out-alt" v-else></i>
                {{ item._coLoading ? '...' : 'Check-out' }}
              </button>
            </div>
          </div>
        </div>

      </div>

      <!-- ========== RIGHT COLUMN ========== -->
      <div class="ci-right">

        <!-- Card 1: Check-in thủ công -->
        <div class="manual-card">

          <!-- Card title row -->
          <div class="mc-header">
            <div class="mc-icon"><i class="fas fa-fingerprint"></i></div>
            <div>
              <div class="mc-title">Check-in thủ công</div>
              <div class="mc-sub">cộng</div>
            </div>
          </div>

          <!-- Label + input -->
          <div class="mc-field-label">SỐ ĐIỆN THOẠI HOẶC MÃ HỘI</div>
          <div class="mc-search-wrap">
            <i class="fas fa-search mc-search-ico"></i>
            <input
              v-model="searchPhone"
              type="text"
              class="mc-input"
              placeholder="Office search..."
              @input="onSearch"
            />
          </div>

          <!-- Found member box -->
          <div v-if="foundMember" class="mc-found">
            <div class="mc-found-avatar" :style="{ background: foundMember.color }">
              {{ foundMember.initials }}
            </div>
            <div class="mc-found-info">
              <div class="mc-found-name">{{ foundMember.name }}</div>
              <div class="mc-found-sub">{{ foundMember.label }}</div>
              <div class="mc-found-expire">{{ foundMember.expire }}</div>
            </div>
          </div>

          <!-- Confirm button -->
          <button
            class="mc-btn-confirm"
            :disabled="!foundMember"
            @click="confirmCheckin"
          >
            <i class="fas fa-check-circle"></i>
            Xác nhận Check-in
          </button>

          <!-- Below button hint -->
          <p class="mc-hint">
            Hoặc bạn có thể check-in bằng không...
            <a href="#" class="mc-hint-link">Xcoose</a>
          </p>

          <!-- Success message -->
          <div v-if="checkinSuccess" class="mc-success">
            <i class="fas fa-check"></i>
            Check-in thành công cho {{ checkinSuccessName }}!
          </div>
        </div>

        <!-- Card 2: Phân tích nhanh -->
        <div class="analytics-card">
          <div class="ac-label">PHÂN TÍCH NHANH</div>

          <div class="ac-body">
            <div class="ac-left">
              <div class="ac-percent">{{ analyticsRate }}%</div>
              <div class="ac-sub-title">Tỷ lệ tham dự</div>
              <div class="ac-desc">
                Hội viên đã Check-in so với<br/>
                tổng số hội viên đăng ký.<br/>
                Đang tốt!
              </div>

              <div class="ac-stats-row">
                <div class="ac-stat">
                  <div class="ac-stat-val">{{ avgPerHour }}</div>
                  <div class="ac-stat-key">người/giờ</div>
                </div>
                <div class="ac-stat-div"></div>
                <div class="ac-stat">
                  <div class="ac-stat-val">{{ todayTotal }}</div>
                  <div class="ac-stat-key">Lượt</div>
                </div>
              </div>
            </div>

            <div class="ac-deco">K</div>
          </div>
        </div>

      </div><!-- /ci-right -->
    </div><!-- /ci-body -->

  </div>
</template>

<script>
import axios from 'axios'

const COLORS = ['#2d7a3a','#0d47a1','#b71c1c','#4e342e','#00838f','#6a1b9a','#e65100']

export default {
  name: 'Checkin',
  data() {
    return {
      activeCount: 0,
      analyticsRate: 0,
      avgPerHour: 0,
      todayTotal: 0,
      searchPhone: '',
      foundMember: null,
      checkinSuccess: false,
      checkinSuccessName: '',
      searchLoading: false,
      liveFeed: [],
      _searchTimer: null,
      _pollTimer: null,
      currentUser: null,
    }
  },

  async mounted() {
    try { this.currentUser = JSON.parse(localStorage.getItem('user')) } catch {}
    await Promise.all([this.loadFeed(), this.loadStats()])
    this._pollTimer = setInterval(() => this.loadFeed(), 30000)
  },

  beforeUnmount() {
    clearInterval(this._pollTimer)
    clearTimeout(this._searchTimer)
  },

  methods: {
    /* ─── helpers ─── */
    _initials(name) {
      const p = (name || '').trim().split(' ')
      return (p.length >= 2 ? p[0][0] + p[p.length-1][0] : (name||'??').slice(0,2)).toUpperCase()
    },
    _color(id) { return COLORS[(id || 0) % COLORS.length] },
    _fmtTime(isoStr) {
      const d = new Date(isoStr), z = n => String(n).padStart(2,'0')
      return `${z(d.getHours())}:${z(d.getMinutes())}:${z(d.getSeconds())}`
    },
    _mapRow(c) {
      const name = c.user?.full_name || c.user?.name || '---'
      return {
        id:          c.id,
        name,
        memberId:    c.user?.card_number || `ID-${c.user_id}`,
        initials:    this._initials(name),
        color:       this._color(c.user_id),
        time:        this._fmtTime(c.check_in_at),
        status:      c.check_out_at ? 'Đã Ra' : 'Trong Phòng',
        statusType:  c.check_out_at ? 'success' : 'in',
        note:        c.notes || '',
        isNew:       false,
        _checkinAt:  c.check_in_at,
        _coLoading:  false,
      }
    },

    /* ─── load live feed ─── */
    async loadFeed() {
      try {
        const today = new Date().toISOString().slice(0,10)
        const res = await axios.get(`/api/checkins?date=${today}&per_page=15`)
        const rows = res.data.data ?? res.data ?? []
        this.liveFeed = rows.map(c => this._mapRow(c))
        this.activeCount = this.liveFeed.filter(r => r.statusType === 'in').length
      } catch (e) { console.error('loadFeed:', e) }
    },

    /* ─── analytics ─── */
    async loadStats() {
      try {
        const today = new Date().toISOString().slice(0,10)
        const [sRes, cRes] = await Promise.all([
          axios.get('/api/members/stats'),
          axios.get(`/api/checkins?date=${today}&per_page=1`),
        ])
        const active = sRes.data.total_active || 0
        this.todayTotal = cRes.data.total ?? cRes.data.meta?.total ?? 0
        this.analyticsRate = active > 0 ? Math.round((this.todayTotal / active) * 100) : 0
        const hr = new Date().getHours() || 1
        this.avgPerHour = +(this.todayTotal / hr).toFixed(1)
      } catch (e) { console.error('loadStats:', e) }
    },

    /* ─── tìm kiếm hội viên (debounce 400ms) ─── */
    onSearch() {
      clearTimeout(this._searchTimer)
      const q = this.searchPhone.trim()
      if (q.length < 3) { this.foundMember = null; return }
      this._searchTimer = setTimeout(() => this._doSearch(q), 400)
    },
    async _doSearch(q) {
      this.searchLoading = true
      try {
        const res = await axios.get('/api/members/search', { params: { q, limit: 5 } })
        const list = res.data || []
        if (!list.length) { this.foundMember = null; return }
        const m = list[0]
        const name = m.full_name || m.name || '---'
        this.foundMember = {
          id:         m.id,
          name,
          initials:   this._initials(name),
          color:      this._color(m.id),
          label:      m.status === 'active'  ? 'Hội viên đang hoạt động'
                    : m.status === 'expired' ? 'Hội viên đã hết hạn'
                    : 'Hội viên tạm khóa',
          expire:     m.card_number || m.phone || '',
          statusType: m.status,
          branch_id:  m.branch_id ?? null,
        }
      } catch (e) {
        console.error('search:', e)
        this.foundMember = null
      } finally { this.searchLoading = false }
    },

    /* ─── xác nhận check-in ─── */
    async confirmCheckin() {
      if (!this.foundMember) return
      const m = { ...this.foundMember }
      const now = new Date()
      const z = n => String(n).padStart(2,'0')
      const timeStr = `${z(now.getHours())}:${z(now.getMinutes())}:${z(now.getSeconds())}`
      try {
        const res = await axios.post('/api/checkins', {
          user_id:      m.id,
          branch_id:    m.branch_id || null,
          check_in_at:  now.toISOString().slice(0,19).replace('T',' '),
          method:       'manual',
          notes:        `Thủ công – ${this.currentUser?.full_name || this.currentUser?.name || 'NV'}`,
        })
        /* push lên đầu feed */
        const newRow = this._mapRow({
          ...res.data,
          user: { full_name: m.name, card_number: m.expire, id: m.id },
        })
        newRow.isNew = true
        newRow.time  = timeStr
        this.liveFeed.unshift(newRow)
        if (this.liveFeed.length > 15) this.liveFeed.pop()

        this.checkinSuccessName = m.name
        this.checkinSuccess     = true
        this.activeCount++
        this.todayTotal++
        this.searchPhone  = ''
        this.foundMember  = null

        setTimeout(() => { this.checkinSuccess = false }, 3000)
        setTimeout(() => { if (this.liveFeed[0]) this.liveFeed[0].isNew = false }, 1500)
      } catch (e) {
        console.error('confirmCheckin:', e)
        const msg = e.response?.data?.message || e.response?.data?.error || e.message
        alert('Check-in thất bại: ' + msg)
      }
    },
    /* ─── check-out hội viên từ feed ─── */
    async checkoutRow(item) {
      if (item._coLoading) return
      item._coLoading = true
      try {
        const now = new Date()
        const outStr = now.toISOString().slice(0,19).replace('T',' ')
        const mins = Math.round((now - new Date(item._checkinAt || now)) / 60000)
        await axios.put(`/api/checkins/${item.id}`, {
          check_out_at: outStr,
          duration: mins,
        })
        item.status     = 'Đã Ra'
        item.statusType = 'success'
        item.note       = `Ra lúc ${this._fmtTime(now.toISOString())} (${mins < 60 ? mins + ' phút' : Math.floor(mins/60) + 'h' + (mins%60 ? (mins%60)+'m' : '')})`
        this.activeCount = Math.max(0, this.activeCount - 1)
      } catch (e) {
        const msg = e.response?.data?.message || e.response?.data?.error || 'Check-out thất bại'
        alert(msg)
      } finally {
        item._coLoading = false
      }
    },
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.ci-page {
  padding: 24px 28px;
  min-height: 100%;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  background: #f2f6f3;
  box-sizing: border-box;
}

/* ===== TITLE ROW ===== */
.ci-title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}
.ci-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1a2e22;
  margin: 0 0 7px;
  letter-spacing: -0.4px;
}
.ci-sub {
  font-size: 0.78rem;
  color: #78909c;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}
.live-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #22c55e;
  flex-shrink: 0;
  box-shadow: 0 0 0 3px rgba(34,197,94,0.22);
  animation: dot-pulse 1.6s ease-in-out infinite;
}
@keyframes dot-pulse {
  0%,100% { box-shadow: 0 0 0 3px rgba(34,197,94,0.22); }
  50%      { box-shadow: 0 0 0 6px rgba(34,197,94,0.08); }
}

/* ADMIN ALERT button */
.btn-admin-alert {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 15px;
  background: #fff;
  border: 1px solid #dde5df;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #4a5568;
  letter-spacing: 0.04em;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  transition: all 0.18s;
  white-space: nowrap;
}
.btn-admin-alert:hover {
  background: #f4f7f5;
  border-color: #b8ccc0;
}

/* ===== BODY ===== */
.ci-body {
  display: flex;
  gap: 18px;
  align-items: flex-start;
}

/* ========== LEFT FEED PANEL ========== */
.feed-panel {
  flex: 1;
  min-width: 0;
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e6ede9;
  box-shadow: 0 2px 10px rgba(0,0,0,0.055);
  overflow: hidden;
}

/* Panel header */
.feed-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px 12px;
  border-bottom: 1px solid #eef3ef;
}
.feed-panel-title {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 0.84rem;
  font-weight: 700;
  color: #1a2e22;
}
.feed-arrow-ico {
  color: #2d7a3a;
  font-size: 0.78rem;
}
.feed-panel-meta {
  font-size: 0.68rem;
  font-weight: 600;
  color: #94a3b8;
  letter-spacing: 0.04em;
}

/* Feed rows */
.feed-rows {
  display: flex;
  flex-direction: column;
}
.feed-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 15px 20px;
  border-bottom: 1px solid #f5f8f5;
  transition: background 0.18s;
  position: relative;
}
.feed-row:last-child { border-bottom: none; }
.feed-row:hover { background: #f9fbf9; }
.feed-row-new {
  background: #f0fdf4;
  animation: row-in 0.35s ease;
}
@keyframes row-in {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Avatar */
.f-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.82rem;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}

/* Name + ID */
.f-info { flex: 1; min-width: 0; }
.f-name {
  font-size: 0.87rem;
  font-weight: 600;
  color: #1a2e22;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.f-id {
  font-size: 0.68rem;
  color: #94a3b8;
  margin-top: 2px;
}

/* Time */
.f-time {
  font-size: 1.18rem;
  font-weight: 700;
  color: #1a2e22;
  letter-spacing: -0.5px;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  flex-shrink: 0;
}

/* Badge column */
.f-badge-col {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  flex-shrink: 0;
  min-width: 90px;
}

.btn-feed-checkout {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  background: linear-gradient(135deg, #ea580c, #c2410c);
  color: #fff;
  border: none;
  border-radius: 7px;
  font-size: 0.62rem;
  font-weight: 700;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: all 0.16s;
  white-space: nowrap;
  letter-spacing: 0.02em;
  box-shadow: 0 2px 6px rgba(234,88,12,0.28);
}
.btn-feed-checkout:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(234,88,12,0.4);
}
.btn-feed-checkout:disabled {
  background: #fed7aa; color: #c2410c; cursor: not-allowed; box-shadow: none;
}
.f-badge {
  font-size: 0.66rem;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 20px;
  letter-spacing: 0.03em;
  white-space: nowrap;
  text-transform: uppercase;
}
/* Badge colors matching design */
.fbadge-in      { background: #dcfce7; color: #15803d; }
.fbadge-fail    { background: #fee2e2; color: #dc2626; }
.fbadge-checkin { background: #dbeafe; color: #1d4ed8; }
.fbadge-success { background: #f1f5f9; color: #64748b; border: 1px solid #e2e8f0; }

.f-note {
  font-size: 0.62rem;
  color: #94a3b8;
  white-space: nowrap;
}

/* ========== RIGHT COLUMN ========== */
.ci-right {
  width: 270px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* ---- Manual Card ---- */
.manual-card {
  background: #fff;
  border-radius: 16px;
  padding: 18px;
  border: 1px solid #e6ede9;
  box-shadow: 0 2px 10px rgba(0,0,0,0.055);
}

/* Card header */
.mc-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}
.mc-icon {
  width: 40px;
  height: 40px;
  border-radius: 11px;
  background: linear-gradient(135deg, #2d7a3a 0%, #174d25 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1rem;
  flex-shrink: 0;
  box-shadow: 0 3px 10px rgba(45,122,58,0.28);
}
.mc-title {
  font-size: 0.88rem;
  font-weight: 700;
  color: #1a2e22;
  line-height: 1.2;
}
.mc-sub {
  font-size: 0.68rem;
  color: #94a3b8;
  margin-top: 2px;
}

/* Field label */
.mc-field-label {
  font-size: 0.65rem;
  font-weight: 700;
  color: #64748b;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  margin-bottom: 7px;
}

/* Search input */
.mc-search-wrap { position: relative; margin-bottom: 12px; }
.mc-search-ico {
  position: absolute;
  left: 11px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 0.76rem;
}
.mc-input {
  width: 100%;
  padding: 9px 12px 9px 32px;
  border: 1px solid #dde5df;
  border-radius: 9px;
  background: #f4f7f5;
  font-size: 0.82rem;
  color: #334155;
  font-family: 'Inter', sans-serif;
  outline: none;
  transition: all 0.18s;
  box-sizing: border-box;
}
.mc-input::placeholder { color: #adb5bd; }
.mc-input:focus {
  border-color: #2d7a3a;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(45,122,58,0.08);
}

/* Found member box */
.mc-found {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 12px;
  background: #e0f7f4;
  border-radius: 11px;
  margin-bottom: 12px;
  border: 1px solid #b2dfdb;
}
.mc-found-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.76rem;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}
.mc-found-info { flex: 1; min-width: 0; }
.mc-found-name {
  font-size: 0.82rem;
  font-weight: 600;
  color: #1a2e22;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.mc-found-sub {
  font-size: 0.66rem;
  color: #00695c;
  margin-top: 1px;
}
.mc-found-expire {
  font-size: 0.62rem;
  color: #78909c;
  margin-top: 1px;
}

/* Confirm button */
.mc-btn-confirm {
  width: 100%;
  padding: 11px;
  background: linear-gradient(135deg, #2d7a3a, #1c5e2e);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 0.86rem;
  font-weight: 700;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.18s;
  box-shadow: 0 4px 12px rgba(45,122,58,0.28);
  margin-bottom: 10px;
}
.mc-btn-confirm:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 7px 18px rgba(45,122,58,0.38);
}
.mc-btn-confirm:disabled {
  background: #c8d5cc;
  box-shadow: none;
  cursor: not-allowed;
}

/* hint below button */
.mc-hint {
  font-size: 0.67rem;
  color: #94a3b8;
  text-align: center;
  margin: 0;
  line-height: 1.5;
}
.mc-hint-link {
  color: #2d7a3a;
  text-decoration: none;
  font-weight: 600;
}
.mc-hint-link:hover { text-decoration: underline; }

/* Success notice */
.mc-success {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 9px 12px;
  background: #dcfce7;
  border-radius: 9px;
  border: 1px solid #86efac;
  color: #15803d;
  font-size: 0.76rem;
  font-weight: 600;
  animation: suc-in 0.25s ease;
}
@keyframes suc-in {
  from { opacity: 0; transform: scale(0.97); }
  to   { opacity: 1; transform: scale(1); }
}

/* ---- Analytics Card ---- */
.analytics-card {
  background: linear-gradient(145deg, #1b3a22 0%, #0e2817 100%);
  border-radius: 16px;
  padding: 18px 18px 16px;
  box-shadow: 0 4px 18px rgba(14,40,23,0.32);
  overflow: hidden;
  position: relative;
}
.ac-label {
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  color: rgba(255,255,255,0.55);
  text-transform: uppercase;
  margin-bottom: 10px;
}
.ac-body {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}
.ac-left { flex: 1; }

/* Big percent */
.ac-percent {
  font-size: 2.6rem;
  font-weight: 800;
  color: #fff;
  line-height: 1;
  margin-bottom: 4px;
  letter-spacing: -1px;
}
.ac-sub-title {
  font-size: 0.72rem;
  font-weight: 600;
  color: rgba(255,255,255,0.75);
  margin-bottom: 4px;
}
.ac-desc {
  font-size: 0.63rem;
  color: rgba(255,255,255,0.45);
  line-height: 1.55;
  margin-bottom: 14px;
}

/* Stats row */
.ac-stats-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ac-stat-val {
  font-size: 0.95rem;
  font-weight: 800;
  color: #fff;
  line-height: 1;
}
.ac-stat-key {
  font-size: 0.6rem;
  color: rgba(255,255,255,0.45);
  margin-top: 2px;
}
.ac-stat-div {
  width: 1px;
  height: 24px;
  background: rgba(255,255,255,0.18);
}

/* Decorative K */
.ac-deco {
  font-size: 5rem;
  font-weight: 900;
  color: rgba(255,255,255,0.06);
  line-height: 1;
  margin-bottom: -6px;
  letter-spacing: -4px;
  user-select: none;
}

/* Responsive */
@media (max-width: 860px) {
  .ci-body { flex-direction: column; }
  .ci-right { width: 100%; }
}
</style>
