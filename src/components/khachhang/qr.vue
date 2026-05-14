<template>
  <div class="qr-page">

    <!-- ===== HEADER ===== -->
    <div class="qr-header">
      <div>
        <h1 class="qr-title"><i class="fas fa-qrcode"></i> QR Check-in</h1>
        <p class="qr-sub">Quét mã QR để check-in tại quầy lễ tân</p>
      </div>
      <div class="header-status" :class="statusClass">
        <span class="status-dot"></span>
        {{ statusLabel }}
      </div>
    </div>

    <!-- ===== LOADING ===== -->
    <div v-if="loading" class="loading-wrap">
      <div class="spinner"></div>
      <p>Đang tải thông tin...</p>
    </div>

    <template v-else>
      <!-- ===== MAIN BODY ===== -->
      <div class="qr-body">

        <!-- LEFT: QR Card -->
        <div class="qr-card">
          <div class="qr-card-top">
            <div class="member-avatar-lg" :style="{ background: avatarColor }">{{ initials }}</div>
            <div class="member-info-center">
              <div class="member-name-lg">{{ profile.full_name || profile.name || '---' }}</div>
              <div class="member-id-lg">{{ profile.card_number || `ID-${profile.id}` }}</div>
              <span class="member-badge" :class="subStatus">
                {{ subStatusLabel }}
              </span>
            </div>
          </div>

          <!-- QR code image -->
          <div class="qr-image-wrap">
            <img
              v-if="qrDataUrl"
              :src="qrDataUrl"
              alt="QR Code check-in"
              class="qr-img"
            />
            <div v-else class="qr-placeholder">
              <i class="fas fa-qrcode"></i>
            </div>
          </div>

          <p class="qr-instruction">Đưa mã này cho nhân viên hoặc đặt trước đầu đọc QR</p>

          <!-- Expiry info -->
          <div class="qr-expiry" v-if="activeSub">
            <i class="fas fa-calendar-alt"></i>
            Gói <strong>{{ activeSub.plan_name }}</strong> · Còn đến
            <strong>{{ fmtDate(activeSub.end_date) }}</strong>
          </div>
          <div class="qr-expiry expired" v-else>
            <i class="fas fa-exclamation-circle"></i>
            Chưa có gói tập đang hoạt động
          </div>

          <!-- Active session banner -->
          <transition name="fade-slide">
            <div v-if="activeCheckin" class="active-session-banner">
              <div class="asb-left">
                <span class="asb-dot"></span>
                <div>
                  <div class="asb-title">Đang trong phòng tập</div>
                  <div class="asb-elapsed">{{ elapsedLabel }}</div>
                </div>
              </div>
              <button
                class="btn-checkout"
                :disabled="checkoutLoading"
                @click="doCheckout"
              >
                <i class="fas fa-sign-out-alt" v-if="!checkoutLoading"></i>
                <i class="fas fa-spinner fa-spin" v-else></i>
                {{ checkoutLoading ? 'Đang xử lý...' : 'Check-out' }}
              </button>
            </div>
          </transition>

          <!-- Self check-in button (ẩn khi đang trong phòng) -->
          <button
            v-if="!activeCheckin"
            class="btn-self-checkin"
            :disabled="checkinLoading || subStatus !== 'active'"
            @click="doSelfCheckin"
          >
            <i class="fas fa-sign-in-alt" v-if="!checkinLoading"></i>
            <i class="fas fa-spinner fa-spin" v-else></i>
            {{ checkinLoading ? 'Đang xử lý...' : 'Tự Check-in ngay' }}
          </button>

          <!-- Success / Error toast inline -->
          <transition name="fade-slide">
            <div v-if="checkinMsg" class="checkin-toast" :class="checkinMsgType">
              <i :class="checkinMsgType === 'success' ? 'fas fa-check-circle' : 'fas fa-times-circle'"></i>
              {{ checkinMsg }}
            </div>
          </transition>
        </div>

        <!-- RIGHT: History -->
        <div class="history-panel">
          <div class="history-header">
            <div class="history-title"><i class="fas fa-history"></i> Lịch sử Check-in</div>
            <div class="history-sub">{{ todayCount }} lượt hôm nay</div>
          </div>

          <div v-if="historyLoading" class="history-empty">
            <div class="spinner small"></div>
          </div>

          <div v-else-if="history.length === 0" class="history-empty">
            <i class="fas fa-door-open"></i>
            <p>Chưa có lần check-in nào</p>
          </div>

          <div v-else class="history-list">
            <div
              v-for="item in history"
              :key="item.id"
              class="history-row"
              :class="{ 'row-new': item.isNew }"
            >
              <div class="hr-time">
                <div class="hr-time-main">{{ fmtTime(item.check_in_at) }}</div>
                <div class="hr-time-date">{{ fmtDate(item.check_in_at) }}</div>
              </div>
              <div class="hr-info">
                <div class="hr-method">{{ methodLabel(item.method) }}</div>
                <div class="hr-branch">{{ item.branch?.name || 'Chi nhánh chính' }}</div>
              </div>
              <div class="hr-status">
                <span class="hr-badge" :class="item.check_out_at ? 'badge-out' : 'badge-in'">
                  {{ item.check_out_at ? 'Đã ra' : 'Trong phòng' }}
                </span>
                <div class="hr-duration" v-if="item.check_out_at">
                  <i class="fas fa-clock"></i> {{ calcDuration(item.check_in_at, item.check_out_at) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination hint -->
          <div class="history-more" v-if="history.length >= 10">
            <button class="btn-load-more" @click="loadMore">
              Xem thêm <i class="fas fa-chevron-down"></i>
            </button>
          </div>
        </div>

      </div>

      <!-- ===== STATS ROW ===== -->
      <div class="stats-row">
        <div class="stat-chip">
          <i class="fas fa-fire stat-ico orange"></i>
          <div>
            <div class="stat-val">{{ weekCount }}</div>
            <div class="stat-key">Lượt tuần này</div>
          </div>
        </div>
        <div class="stat-chip">
          <i class="fas fa-calendar-check stat-ico green"></i>
          <div>
            <div class="stat-val">{{ monthCount }}</div>
            <div class="stat-key">Lượt tháng này</div>
          </div>
        </div>
        <div class="stat-chip">
          <i class="fas fa-trophy stat-ico gold"></i>
          <div>
            <div class="stat-val">{{ totalCount }}</div>
            <div class="stat-key">Tổng lượt</div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import axios from 'axios'

const COLORS = ['#2d7a3a','#0d47a1','#b71c1c','#4e342e','#00838f','#6a1b9a','#e65100']

export default {
  name: 'QrCheckin',

  data() {
    return {
      loading: true,
      historyLoading: false,
      checkinLoading: false,
      checkoutLoading: false,
      profile: {},
      activeSub: null,
      activeCheckin: null,
      history: [],
      qrDataUrl: '',
      checkinMsg: '',
      checkinMsgType: 'success',
      page: 1,
      todayCount: 0,
      weekCount: 0,
      monthCount: 0,
      totalCount: 0,
      elapsedLabel: '',
      _elapsedTimer: null,
    }
  },

  computed: {
    initials() {
      const name = this.profile.full_name || this.profile.name || '?'
      const p = name.trim().split(' ')
      return (p.length >= 2 ? p[0][0] + p[p.length-1][0] : name.slice(0,2)).toUpperCase()
    },
    avatarColor() {
      return COLORS[(this.profile.id || 0) % COLORS.length]
    },
    subStatus() {
      if (!this.activeSub) return 'expired'
      const end = new Date(this.activeSub.end_date)
      return end >= new Date() ? 'active' : 'expired'
    },
    subStatusLabel() {
      return this.subStatus === 'active' ? 'Đang hoạt động' : 'Hết hạn'
    },
    statusClass() {
      return this.subStatus === 'active' ? 'status-active' : 'status-expired'
    },
    statusLabel() {
      return this.subStatus === 'active' ? 'Hội viên Active' : 'Chưa có gói'
    },
  },

  async mounted() {
    await this.init()
  },

  beforeUnmount() {
    clearInterval(this._elapsedTimer)
  },

  methods: {
    async init() {
      this.loading = true
      try {
        await Promise.all([this.fetchProfile(), this.fetchHistory()])
        this.buildQR()
      } finally {
        this.loading = false
      }
    },

    async fetchProfile() {
      try {
        const res = await axios.get('/api/customer/profile')
        const data = res.data.data ?? res.data
        this.profile = data

        // Lấy gói đang active
        try {
          const svc = await axios.get('/api/services/my-active')
          this.activeSub = svc.data.active_plan || null
        } catch {}
      } catch (e) {
        console.error('fetchProfile:', e)
      }
    },

    /* Tìm bản ghi đang "Trong phòng" (chưa checkout) */
    _detectActiveCheckin() {
      const active = this.history.find(r => !r.check_out_at)
      this.activeCheckin = active || null
      clearInterval(this._elapsedTimer)
      if (active) {
        const tick = () => {
          const mins = Math.round((Date.now() - new Date(active.check_in_at)) / 60000)
          this.elapsedLabel = mins < 60
            ? `${mins} phút`
            : `${Math.floor(mins/60)}h${mins%60 ? (mins%60)+'m' : ''}`
        }
        tick()
        this._elapsedTimer = setInterval(tick, 30000)
      }
    },

    async fetchHistory() {
      this.historyLoading = true
      try {
        const res = await axios.get('/api/checkins/my', { params: { per_page: 30 } })
        this.history = res.data.checkins?.data ?? []
        this.todayCount = res.data.today_count ?? 0
        this.weekCount  = res.data.week_count  ?? 0
        this.monthCount = res.data.month_count ?? 0
        this.totalCount = res.data.total_count ?? 0
        this._detectActiveCheckin()
      } catch (e) {
        // Fallback: lấy qua user_id nếu endpoint my chưa có
        try {
          const res2 = await axios.get('/api/checkins', {
            params: { user_id: this.profile.id, per_page: 30 }
          })
          const rows = res2.data.data ?? res2.data ?? []
          this.history = rows
          const now = new Date()
          const todayStr = now.toISOString().slice(0,10)
          const weekAgo = new Date(now); weekAgo.setDate(weekAgo.getDate() - 7)
          const monthAgo = new Date(now); monthAgo.setDate(1)
          this.todayCount = rows.filter(r => r.check_in_at?.startsWith(todayStr)).length
          this.weekCount  = rows.filter(r => new Date(r.check_in_at) >= weekAgo).length
          this.monthCount = rows.filter(r => new Date(r.check_in_at) >= monthAgo).length
          this.totalCount = res2.data.total ?? rows.length
          this._detectActiveCheckin()
        } catch {}
        console.error('fetchHistory:', e)
      } finally {
        this.historyLoading = false
      }
    },

    buildQR() {
      const uid = this.profile.id
      const card = this.profile.card_number || `UID-${uid}`
      const payload = encodeURIComponent(`CHECKIN:${card}:${uid}`)
      this.qrDataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${payload}&ecc=M&margin=10`
    },

    async doSelfCheckin() {
      if (this.checkinLoading || this.subStatus !== 'active') return
      this.checkinLoading = true
      this.checkinMsg = ''
      try {
        const now = new Date()
        const res = await axios.post('/api/checkins', {
          user_id: this.profile.id,
          branch_id: this.profile.branch_id || null,
          check_in_at: now.toISOString().slice(0,19).replace('T',' '),
          method: 'qr',
          notes: 'Tự check-in qua QR',
        })
        this.checkinMsg = 'Check-in thành công! Chúc bạn tập luyện hiệu quả 💪'
        this.checkinMsgType = 'success'
        this.todayCount++
        this.weekCount++
        this.monthCount++
        this.totalCount++
        const newRow = {
          id: res.data.id || Date.now(),
          check_in_at: now.toISOString(),
          check_out_at: null,
          method: 'qr',
          branch: null,
          isNew: true,
        }
        this.history.unshift(newRow)
        this._detectActiveCheckin()
        setTimeout(() => { if(this.history[0]) this.history[0].isNew = false }, 2000)
      } catch (e) {
        const msg = e.response?.data?.message || e.response?.data?.error || 'Check-in thất bại'
        this.checkinMsg = msg
        this.checkinMsgType = 'error'
      } finally {
        this.checkinLoading = false
        setTimeout(() => { this.checkinMsg = '' }, 4000)
      }
    },

    async doCheckout() {
      if (!this.activeCheckin || this.checkoutLoading) return
      this.checkoutLoading = true
      this.checkinMsg = ''
      try {
        const now = new Date()
        const outStr = now.toISOString().slice(0,19).replace('T',' ')
        const mins = Math.round((now - new Date(this.activeCheckin.check_in_at)) / 60000)
        await axios.put(`/api/checkins/${this.activeCheckin.id}`, {
          check_out_at: outStr,
          duration: mins,
        })
        // Cập nhật row trong history
        const idx = this.history.findIndex(r => r.id === this.activeCheckin.id)
        if (idx !== -1) {
          this.history[idx].check_out_at = now.toISOString()
          this.history[idx].duration = mins
        }
        this.activeCheckin = null
        clearInterval(this._elapsedTimer)
        this.checkinMsg = `Check-out thành công! Bạn đã tập ${mins < 60 ? mins + ' phút' : Math.floor(mins/60) + 'h' + (mins%60 ? (mins%60)+'m' : '')} hôm nay 🎉`
        this.checkinMsgType = 'success'
      } catch (e) {
        const msg = e.response?.data?.message || e.response?.data?.error || 'Check-out thất bại'
        this.checkinMsg = msg
        this.checkinMsgType = 'error'
      } finally {
        this.checkoutLoading = false
        setTimeout(() => { this.checkinMsg = '' }, 5000)
      }
    },

    async loadMore() {
      this.page++
      try {
        const res = await axios.get('/api/checkins', {
          params: { user_id: this.profile.id, per_page: 30, page: this.page }
        })
        const more = res.data.data ?? []
        this.history.push(...more)
      } catch {}
    },

    fmtTime(iso) {
      if (!iso) return '--'
      const d = new Date(iso)
      const z = n => String(n).padStart(2,'0')
      return `${z(d.getHours())}:${z(d.getMinutes())}`
    },
    fmtDate(iso) {
      if (!iso) return '--'
      const d = new Date(iso)
      return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`
    },
    methodLabel(m) {
      if (m === 'qr') return 'QR Code'
      if (m === 'manual') return 'Thủ công'
      if (m === 'face') return 'Nhận diện khuôn mặt'
      return 'Tự phục vụ'
    },
    calcDuration(inAt, outAt) {
      if (!inAt || !outAt) return ''
      const mins = Math.round((new Date(outAt) - new Date(inAt)) / 60000)
      if (mins < 60) return `${mins} phút`
      return `${Math.floor(mins/60)}h${mins%60 ? (mins%60)+'m' : ''}`
    },
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.qr-page {
  padding: 24px 28px;
  min-height: 100%;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  background: #f2f6f3;
  box-sizing: border-box;
}

/* HEADER */
.qr-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 22px;
  flex-wrap: wrap;
  gap: 10px;
}
.qr-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1a2e22;
  margin: 0 0 5px;
  letter-spacing: -0.4px;
}
.qr-title i { color: #2d7a3a; margin-right: 8px; }
.qr-sub { font-size: 0.8rem; color: #78909c; margin: 0; }

.header-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}
.status-active { background: #dcfce7; color: #15803d; }
.status-expired { background: #fee2e2; color: #dc2626; }
.status-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: currentColor;
  animation: pulse 1.6s ease-in-out infinite;
}
@keyframes pulse {
  0%,100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* LOADING */
.loading-wrap {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  min-height: 300px; gap: 16px; color: #78909c; font-size: 0.9rem;
}
.spinner {
  width: 36px; height: 36px;
  border: 3px solid #e6ede9;
  border-top-color: #2d7a3a;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
.spinner.small { width: 22px; height: 22px; border-width: 2px; }
@keyframes spin { to { transform: rotate(360deg); } }

/* BODY */
.qr-body {
  display: flex;
  gap: 18px;
  align-items: flex-start;
  margin-bottom: 18px;
}

/* QR CARD */
.qr-card {
  width: 300px;
  flex-shrink: 0;
  background: #fff;
  border-radius: 20px;
  padding: 22px;
  border: 1px solid #e6ede9;
  box-shadow: 0 2px 14px rgba(0,0,0,0.07);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}
.qr-card-top {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
  text-align: center;
}
.member-avatar-lg {
  width: 60px; height: 60px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.2rem; font-weight: 800; color: #fff;
  box-shadow: 0 4px 14px rgba(0,0,0,0.18);
}
.member-name-lg {
  font-size: 1.05rem; font-weight: 700; color: #1a2e22;
  margin-bottom: 2px;
}
.member-id-lg { font-size: 0.72rem; color: #78909c; margin-bottom: 6px; }
.member-badge {
  font-size: 0.65rem; font-weight: 700; padding: 3px 12px;
  border-radius: 20px; text-transform: uppercase; letter-spacing: 0.06em;
}
.member-badge.active { background: #dcfce7; color: #15803d; }
.member-badge.expired { background: #fee2e2; color: #dc2626; }

.qr-image-wrap {
  width: 220px; height: 220px;
  border-radius: 16px;
  background: #f8fafc;
  border: 2px solid #e6ede9;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
  margin-bottom: 14px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.06);
}
.qr-img { width: 100%; height: 100%; object-fit: contain; }
.qr-placeholder { font-size: 5rem; color: #c8d5cc; }

.qr-instruction {
  font-size: 0.72rem; color: #78909c;
  text-align: center; margin: 0 0 12px;
  line-height: 1.5;
}
.qr-expiry {
  font-size: 0.74rem; color: #2d7a3a;
  background: #e8f5e9;
  border-radius: 8px;
  padding: 8px 12px;
  text-align: center;
  margin-bottom: 14px;
  width: 100%;
  box-sizing: border-box;
  line-height: 1.5;
}
.qr-expiry.expired { background: #fee2e2; color: #dc2626; }

.btn-self-checkin {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #2d7a3a, #1c5e2e);
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 700;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  gap: 8px;
  transition: all 0.18s;
  box-shadow: 0 4px 14px rgba(45,122,58,0.28);
  margin-bottom: 10px;
}
.btn-self-checkin:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 7px 20px rgba(45,122,58,0.38);
}
.btn-self-checkin:disabled {
  background: #c8d5cc; box-shadow: none; cursor: not-allowed;
}

/* ACTIVE SESSION BANNER */
.active-session-banner {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 12px 14px;
  background: linear-gradient(135deg, #fff7ed, #ffedd5);
  border: 1.5px solid #fed7aa;
  border-radius: 12px;
  margin-bottom: 10px;
  box-sizing: border-box;
}
.asb-left {
  display: flex;
  align-items: center;
  gap: 10px;
}
.asb-dot {
  width: 10px; height: 10px;
  border-radius: 50%;
  background: #f97316;
  flex-shrink: 0;
  box-shadow: 0 0 0 3px rgba(249,115,22,0.22);
  animation: pulse-orange 1.4s ease-in-out infinite;
}
@keyframes pulse-orange {
  0%,100% { box-shadow: 0 0 0 3px rgba(249,115,22,0.22); }
  50%      { box-shadow: 0 0 0 6px rgba(249,115,22,0.06); }
}
.asb-title {
  font-size: 0.78rem;
  font-weight: 700;
  color: #c2410c;
  line-height: 1.2;
}
.asb-elapsed {
  font-size: 0.68rem;
  color: #ea580c;
  margin-top: 2px;
}
.btn-checkout {
  flex-shrink: 0;
  padding: 8px 14px;
  background: linear-gradient(135deg, #ea580c, #c2410c);
  color: #fff;
  border: none;
  border-radius: 9px;
  font-size: 0.8rem;
  font-weight: 700;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  display: flex; align-items: center;
  gap: 6px;
  transition: all 0.18s;
  box-shadow: 0 3px 10px rgba(234,88,12,0.32);
  white-space: nowrap;
}
.btn-checkout:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(234,88,12,0.42);
}
.btn-checkout:disabled {
  background: #fed7aa; box-shadow: none; cursor: not-allowed; color: #c2410c;
}

.checkin-toast {
  width: 100%;
  display: flex; align-items: flex-start; gap: 8px;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 0.76rem; font-weight: 600;
  line-height: 1.4;
  box-sizing: border-box;
}
.checkin-toast.success { background: #dcfce7; color: #15803d; border: 1px solid #86efac; }
.checkin-toast.error { background: #fee2e2; color: #dc2626; border: 1px solid #fca5a5; }


/* FADE SLIDE */
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.25s ease; }
.fade-slide-enter-from { opacity: 0; transform: translateY(-6px); }
.fade-slide-leave-to { opacity: 0; transform: translateY(-6px); }

/* HISTORY PANEL */
.history-panel {
  flex: 1; min-width: 0;
  background: #fff;
  border-radius: 20px;
  border: 1px solid #e6ede9;
  box-shadow: 0 2px 14px rgba(0,0,0,0.07);
  overflow: hidden;
  display: flex; flex-direction: column;
}
.history-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 20px 14px;
  border-bottom: 1px solid #eef3ef;
}
.history-title {
  font-size: 0.9rem; font-weight: 700; color: #1a2e22;
  display: flex; align-items: center; gap: 7px;
}
.history-title i { color: #2d7a3a; }
.history-sub { font-size: 0.72rem; color: #78909c; font-weight: 600; }

.history-empty {
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 48px 20px;
  gap: 12px; color: #b0bec5; font-size: 0.84rem; text-align: center;
}
.history-empty i { font-size: 2rem; }
.history-empty p { margin: 0; }

.history-list { display: flex; flex-direction: column; }
.history-row {
  display: flex; align-items: center; gap: 14px;
  padding: 14px 20px;
  border-bottom: 1px solid #f5f8f5;
  transition: background 0.15s;
}
.history-row:last-child { border-bottom: none; }
.history-row:hover { background: #f9fbf9; }
.history-row.row-new {
  background: #f0fdf4;
  animation: rowIn 0.35s ease;
}
@keyframes rowIn {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}

.hr-time { min-width: 60px; text-align: center; flex-shrink: 0; }
.hr-time-main { font-size: 1.1rem; font-weight: 700; color: #1a2e22; letter-spacing: -0.5px; }
.hr-time-date { font-size: 0.62rem; color: #94a3b8; margin-top: 2px; }

.hr-info { flex: 1; min-width: 0; }
.hr-method { font-size: 0.82rem; font-weight: 600; color: #1a2e22; }
.hr-branch { font-size: 0.68rem; color: #94a3b8; margin-top: 2px; }

.hr-status { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; flex-shrink: 0; }
.hr-badge {
  font-size: 0.62rem; font-weight: 700; padding: 3px 10px;
  border-radius: 20px; text-transform: uppercase; letter-spacing: 0.03em;
}
.badge-in { background: #dcfce7; color: #15803d; }
.badge-out { background: #f1f5f9; color: #64748b; border: 1px solid #e2e8f0; }
.hr-duration { font-size: 0.62rem; color: #94a3b8; display: flex; align-items: center; gap: 3px; }

.history-more {
  padding: 12px 20px;
  border-top: 1px solid #eef3ef;
  text-align: center;
}
.btn-load-more {
  background: none; border: 1px solid #dde5df;
  border-radius: 8px; padding: 7px 20px;
  font-size: 0.78rem; font-weight: 600; color: #2d7a3a;
  cursor: pointer; font-family: 'Inter', sans-serif;
  transition: all 0.18s; display: inline-flex; align-items: center; gap: 6px;
}
.btn-load-more:hover { background: #e8f5e9; border-color: #b2dfdb; }

/* STATS ROW */
.stats-row {
  display: flex; gap: 14px; flex-wrap: wrap;
}
.stat-chip {
  flex: 1; min-width: 140px;
  background: #fff;
  border-radius: 14px;
  padding: 16px 18px;
  display: flex; align-items: center; gap: 14px;
  border: 1px solid #e6ede9;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.stat-ico { font-size: 1.3rem; }
.stat-ico.orange { color: #f57c00; }
.stat-ico.green  { color: #2d7a3a; }
.stat-ico.gold   { color: #b45309; }
.stat-val { font-size: 1.5rem; font-weight: 800; color: #1a2e22; line-height: 1; }
.stat-key { font-size: 0.65rem; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; margin-top: 3px; }

/* RESPONSIVE */
@media (max-width: 780px) {
  .qr-body { flex-direction: column; }
  .qr-card { width: 100%; }
}
</style>
